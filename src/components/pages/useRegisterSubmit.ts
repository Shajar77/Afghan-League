import { useState } from 'react'
import { API_BASE_URL, buildApiUrl, publicFetch, normalizeMediaUrl } from '../../config/api'
import { compressImageFile } from '../../utils/imageCompression'
import type { FormData } from '../registration/types'

const AVAILABILITY_SHORT_MAP: Record<string, string> = {
  'full': 'Full Season',
  'selected': 'Selected Dates',
  'national': 'National Commitment',
  'release': 'Club Release',
  'available for full season': 'Full Season',
  'available for selected dates': 'Selected Dates',
  'subject to national-team commitments': 'National Commitment',
  'subject to club or franchise release': 'Club Release',
  'available_for_full_season': 'Full Season',
  'available_for_selected_dates': 'Selected Dates',
  'subject_to_national_team_commitments': 'National Commitment',
  'subject_to_club_or_franchise_release': 'Club Release',
  'subject_to_national_team_commitmen': 'National Commitment',
}

function formatAvailabilityString(avail: string | string[]): string {
  const list = Array.isArray(avail) ? avail : [avail]
  const formatted = list
    .filter(Boolean)
    .map(item => {
      const str = String(item).trim()
      return AVAILABILITY_SHORT_MAP[str.toLowerCase()] || str
    })
    .filter((val, idx, self) => self.indexOf(val) === idx)
    .join(', ')
  return formatted.length > 50 ? formatted.slice(0, 47) + '...' : formatted || 'Full Season'
}

function formatErrorObj(obj: unknown): string {
  if (!obj) return ''
  if (typeof obj === 'string') return obj
  if (typeof obj === 'number' || typeof obj === 'boolean') return String(obj)
  if (Array.isArray(obj)) {
    return obj.map(item => formatErrorObj(item)).filter(Boolean).join(', ')
  }
  if (typeof obj === 'object') {
    const rec = obj as Record<string, unknown>
    if (rec.field && (rec.message || rec.error)) {
      return `${String(rec.field).replace(/_/g, ' ').toUpperCase()}: ${rec.message || rec.error}`
    }
    return Object.entries(rec)
      .map(([key, val]) => {
        const formattedVal = formatErrorObj(val)
        return formattedVal ? `${key.replace(/_/g, ' ').toUpperCase()}: ${formattedVal}` : ''
      })
      .filter(Boolean)
      .join(' | ')
  }
  return String(obj)
}

export function useRegisterSubmit() {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const submit = async (formData: FormData): Promise<string> => {
    setIsSubmitting(true)
    setSubmitError(null)

    try {
      // 1. Upload player images in bulk (with client-side compression)
      const [compressedScan, compressedAction, compressedPhoto, compressedRight, compressedLeft] =
        await Promise.all([
          formData.passportScan ? compressImageFile(formData.passportScan) : null,
          formData.actionShot ? compressImageFile(formData.actionShot) : null,
          formData.passportPhoto ? compressImageFile(formData.passportPhoto) : null,
          formData.rightProfilePhoto ? compressImageFile(formData.rightProfilePhoto) : null,
          formData.leftProfilePhoto ? compressImageFile(formData.leftProfilePhoto) : null,
        ])

      const uploadForm = new FormData()
      if (compressedScan) uploadForm.append('passport', compressedScan)
      if (compressedAction) uploadForm.append('action_shot', compressedAction)
      if (compressedPhoto) uploadForm.append('photo', compressedPhoto)
      if (compressedRight) uploadForm.append('right_profile', compressedRight)
      if (compressedLeft) uploadForm.append('left_profile', compressedLeft)

      const uploadRes = await publicFetch(buildApiUrl('/uploads/player-images'), {
        method: 'POST',
        body: uploadForm,
      })

      if (!uploadRes.ok) {
        const errJson = await uploadRes.json().catch(() => ({}))
        const errorMsg =
          errJson.message ||
          (errJson.error && typeof errJson.error === 'string' ? errJson.error : errJson.error?.message) ||
          'Image upload failed. Please verify the image file formats and sizes, then try again.'
        throw new Error(errorMsg)
      }

      const uploadJson = await uploadRes.json()
      const urls = uploadJson.data || uploadJson

      const normalizeUrl = (val: string, fallback: string): string => {
        if (!val || typeof val !== 'string') return fallback
        return normalizeMediaUrl(val) || fallback
      }

      const defaultBase = API_BASE_URL.replace(/\/api\/v\d+.*$/, '')
      const photoUrl = normalizeUrl(
        urls.photo || urls.photo_url || '',
        `${defaultBase}/uploads/images/headshot_sample.jpg`
      )
      const passportUrl = normalizeUrl(
        urls.passport || urls.passport_url || '',
        `${defaultBase}/uploads/images/passport_sample.jpg`
      )
      const actionShotUrl = normalizeUrl(
        urls.action_shot || urls.action_shot_url || '',
        `${defaultBase}/uploads/images/action_sample.jpg`
      )
      const leftProfileUrl = formData.leftProfilePhoto
        ? normalizeUrl(urls.left_profile || urls.left_profile_url || '', '')
        : null
      const rightProfileUrl = formData.rightProfilePhoto
        ? normalizeUrl(urls.right_profile || urls.right_profile_url || '', '')
        : null

      // Build registration payload
      const rawProfileLink = formData.profileLink.trim()
      const formattedProfileLink = rawProfileLink
        ? /^https?:\/\//i.test(rawProfileLink)
          ? rawProfileLink
          : `https://${rawProfileLink}`
        : ''

      const relegationInfo =
        formData.acceptRelegation === 'yes'
          ? `Accept Relegation: Yes (Till ${formData.relegationLimit || 'Any'})`
          : 'Accept Relegation: No'
      const iconInfo = formData.considerIconPlayer
        ? ` Icon Nomination: ${formData.considerIconPlayer.toUpperCase()}.`
        : ''
      const customAvailDetails = formData.availabilityDetails
        ? `Notes: ${formData.availabilityDetails}. `
        : ''
      const fullAvailabilityDetails =
        `${customAvailDetails}${relegationInfo}.${iconInfo}`.slice(0, 250)

      const expRepCountry = formData.representingCountry
        ? ` Representing: ${formData.representingCountry}.`
        : ''
      const fullPlayingExperience =
        `Current Club: ${formData.currentClub || 'None'}. Previous Teams: ${formData.prevTeams || 'None'}.${expRepCountry}`.slice(
          0,
          250
        )

      const regPayload = {
        full_name: formData.fullName,
        dob: formData.dob,
        city: formData.city,
        phone: formData.phone,
        email: formData.email,
        batting_hand: formData.battingHand,
        bowling_arm: formData.bowlingStyle || 'Right-arm',
        playing_experience: fullPlayingExperience,
        previous_teams: (formData.prevTeams || 'None').slice(0, 250),
        passport_number: formData.passportNumber,
        availability_details: fullAvailabilityDetails,
        passport_url: passportUrl,
        action_shot_url: actionShotUrl,
        photo_url: photoUrl,
        ...(rightProfileUrl ? { right_profile_url: rightProfileUrl } : {}),
        ...(leftProfileUrl ? { left_profile_url: leftProfileUrl } : {}),
        nationality: formData.nationality,
        country_of_residence: formData.countryResidence,
        player_availability: formatAvailabilityString(formData.availability),
        player_category: formData.category,
        playing_role: formData.playingRole,
        bowling_type: formData.spinType || formData.bowlingSubtype || formData.bowlerType || 'None',
        bowler_category:
          formData.bowlerType && formData.spinType
            ? `${formData.bowlerType} - ${formData.spinType}`
            : formData.bowlerType || 'None',
        spin_type: formData.spinType || '',
        player_status: formData.playerStatus,
        twtenty_matches_count: formData.totalMatches ? parseInt(formData.totalMatches, 10) : 0,
        submission_category: formData.regType === 'player' ? 'Player' : 'Agent',
        ...(formattedProfileLink ? { profile_link: formattedProfileLink } : {}),
        agent_full_name: formData.regType === 'agent' ? formData.agentName : '',
        agent_company_name: formData.regType === 'agent' ? formData.agentAgency : '',
        agent_phone_number: formData.regType === 'agent' ? formData.agentPhone : '',
        agent_email_address: formData.regType === 'agent' ? formData.agentEmail : '',
        icon_player_nomination: formData.considerIconPlayer === 'yes',
        accept_relegation: formData.acceptRelegation === 'yes',
        relegation_category:
          formData.acceptRelegation === 'yes' ? formData.relegationLimit || '' : '',
      }

      // 2. Submit player registration
      const regRes = await publicFetch(buildApiUrl('/player-registrations'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(regPayload),
      })

      if (!regRes.ok) {
        const errJson = await regRes.json().catch(() => ({}))
        let details = ''
        if (errJson.details) details = formatErrorObj(errJson.details)
        else if (errJson.errors) details = formatErrorObj(errJson.errors)
        else if (errJson.error) details = formatErrorObj(errJson.error)
        else if (errJson.message && errJson.message !== 'Validation failed') details = errJson.message
        else details = formatErrorObj(errJson)
        throw new Error(details || 'Validation failed. Please check your inputs and try again.')
      }

      const regJson = await regRes.json()
      const regData = regJson.data || regJson

      // Return the registration code from backend, or generate a fallback
      return regData.registration_code || regData.code || `APL-2026-${Date.now().toString().slice(-5)}`
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : 'An error occurred during submission. Please try again.'
      setSubmitError(msg)
      throw err
    } finally {
      setIsSubmitting(false)
    }
  }

  return { isSubmitting, submitError, setSubmitError, submit }
}
