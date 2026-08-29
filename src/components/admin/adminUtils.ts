// Shared admin status utilities — single source of truth

// Cache-clearing registry: component modules register their cleanup callbacks here.
// This avoids exporting non-component functions from component files (which breaks React Fast Refresh).
const _cacheClearers: (() => void)[] = []

// Global in-memory cache for admin data across view navigation
let _registrationsCache: any[] | null = null
let _statusCountsCache: { pending: number; approved: number; underReview: number; rejected: number; total: number } | null = null
let _statusMapCache: Record<string, string> = {}

export function getAdminRegistrationsCache(): any[] | null {
  return _registrationsCache
}

export function setAdminRegistrationsCache(data: any[] | null) {
  _registrationsCache = data
}

export function getAdminStatusCountsCache(): { pending: number; approved: number; underReview: number; rejected: number; total: number } | null {
  return _statusCountsCache
}

export function setAdminStatusCountsCache(counts: { pending: number; approved: number; underReview: number; rejected: number; total: number } | null) {
  _statusCountsCache = counts
}

export function getAdminStatusMapCache(): Record<string, string> {
  return _statusMapCache
}

export function setAdminStatusMapCache(map: Record<string, string>) {
  _statusMapCache = map
}

/**
 * Optimistically updates a player's status across all in-memory caches.
 * Ensures that returning from PlayerDetail to Dashboard instantly reflects the new status.
 */
export function updateCachedPlayerStatus(
  identifier: { id?: string | number; code?: string; email?: string },
  newStatus: string
) {
  const codeKey = identifier.code ? String(identifier.code).trim() : ''
  const idKey = identifier.id !== undefined && identifier.id !== null ? String(identifier.id) : ''
  const emailKey = identifier.email ? String(identifier.email).toLowerCase().trim() : ''

  // 1. Update statusMap cache
  if (codeKey) _statusMapCache[codeKey] = newStatus
  if (idKey) _statusMapCache[idKey] = newStatus
  if (emailKey) _statusMapCache[emailKey] = newStatus

  // 2. Update registrationsCache list
  if (_registrationsCache && Array.isArray(_registrationsCache)) {
    _registrationsCache = _registrationsCache.map(r => {
      const rCode = String(r.registration_code || r.code || '').trim()
      const rId = r.id !== undefined && r.id !== null ? String(r.id) : ''
      const rEmail = r.email ? String(r.email).toLowerCase().trim() : ''

      const isMatch =
        (codeKey && rCode === codeKey) ||
        (idKey && rId === idKey) ||
        (emailKey && rEmail === emailKey)

      if (isMatch) {
        return {
          ...r,
          status: newStatus
        }
      }
      return r
    })
  }

  // 3. Recalculate statusCounts cache if present
  if (_registrationsCache && Array.isArray(_registrationsCache)) {
    let pending = 0
    let approved = 0
    let underReview = 0
    let rejected = 0

    _registrationsCache.forEach(r => {
      const code = String(r.registration_code || r.code || '').trim()
      const idK = r.id !== undefined && r.id !== null ? String(r.id) : ''
      const em = r.email ? String(r.email).toLowerCase().trim() : ''
      const s = (r.status || _statusMapCache[code] || _statusMapCache[idK] || _statusMapCache[em] || 'pending').toLowerCase()

      if (s === 'approved_draft' || s === 'approved' || s === 'shortlisted' || s === 'selected') approved++
      else if (s === 'under_review') underReview++
      else if (s === 'rejected') rejected++
      else pending++
    })

    _statusCountsCache = {
      pending,
      approved,
      underReview,
      rejected,
      total: _registrationsCache.length
    }
  }
}

/** Called by component modules to register their cache-clearing logic. */
export function registerAdminCacheClearer(fn: () => void) {
  _cacheClearers.push(fn)
}

/** Clears all registered module-level caches — ONLY called on explicit logout. */
export function clearAdminCaches() {
  _registrationsCache = null
  _statusCountsCache = null
  _statusMapCache = {}
  _cacheClearers.forEach(fn => fn())
}

export function formatStatus(status?: string): string {
  const s = (status || '').toLowerCase().trim()
  if (!s || s === 'pending') return 'Pending Decision'
  if (s === 'approved_draft' || s === 'approved' || s === 'shortlisted' || s === 'selected') return 'Approved for Drafts'
  if (s === 'under_review') return 'Registration Under Review'
  if (s === 'rejected') return 'Registration Rejected'
  return status!.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
}

export function statusClass(status?: string): string {
  const s = (status || '').toLowerCase().trim()
  if (!s || s === 'pending') return 'status-pending'
  if (s === 'approved_draft' || s === 'approved' || s === 'shortlisted' || s === 'selected') return 'status-approved'
  if (s === 'rejected') return 'status-rejected'
  if (s === 'under_review') return 'status-review'
  return 'status-pending'
}

/**
 * Format exact registration timestamp.
 * If registered today, shows exact time (e.g., "Today, 2:38 PM").
 * If registered on other dates, shows date (e.g., "Jul 15, 2026").
 * If timestamp is missing from DB record, returns "—".
 */
export function formatRegistrationDate(reg: any): string {
  if (!reg) return '—'

  // 1. Direct explicit property inspection across common API schemas
  const rawDate =
    reg.created_at ||
    reg.createdAt ||
    reg.created ||
    reg.date_created ||
    reg.created_date ||
    reg.create_time ||
    reg.registration_date ||
    reg.registrationDate ||
    reg.registered_at ||
    reg.registered_on ||
    reg.submitted_at ||
    reg.submittedAt ||
    reg.date ||
    reg.time ||
    reg.timestamp ||
    reg.updated_at ||
    reg.updatedAt ||
    reg.meta?.created_at ||
    reg.meta?.createdAt

  if (rawDate) {
    try {
      const d = new Date(rawDate)
      if (!isNaN(d.getTime())) {
        const today = new Date()
        const isToday = d.toDateString() === today.toDateString()

        if (isToday) {
          return `Today, ${d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}`
        }

        return d.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        })
      }
    } catch {
      // Fallthrough
    }
  }

  // 2. Extract creation timestamp from 24-character MongoDB ObjectId (_id or id)
  const idStr = reg._id || reg.id
  if (typeof idStr === 'string' && idStr.length === 24 && /^[0-9a-fA-F]{24}$/.test(idStr)) {
    try {
      const timestamp = parseInt(idStr.substring(0, 8), 16) * 1000
      const d = new Date(timestamp)
      if (!isNaN(d.getTime())) {
        const today = new Date()
        const isToday = d.toDateString() === today.toDateString()

        if (isToday) {
          return `Today, ${d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}`
        }

        return d.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        })
      }
    } catch {
      // Fallthrough
    }
  }

  // 3. Dynamic key search: scan all keys for any date/time/created string property
  for (const key of Object.keys(reg)) {
    const lkey = key.toLowerCase()
    if (
      (lkey.includes('date') || lkey.includes('time') || lkey.includes('created') || lkey.includes('submitted')) &&
      !lkey.includes('dob') && !lkey.includes('birth')
    ) {
      const val = reg[key]
      if (val && typeof val === 'string' && val.length >= 6) {
        try {
          const d = new Date(val)
          if (!isNaN(d.getTime()) && d.getFullYear() >= 2020 && d.getFullYear() <= 2030) {
            const today = new Date()
            const isToday = d.toDateString() === today.toDateString()

            if (isToday) {
              return `Today, ${d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}`
            }

            return d.toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric'
            })
          }
        } catch {
          // Continue scanning
        }
      }
    }
  }

  return '—'
}

/**
 * Helper to determine whether a player registration was submitted by an Agent or directly by the Player.
 * Robustly inspects explicit submission categories, flags (is_agent), and agent detail fields across all backend formats.
 */
export function isAgentRegistration(reg: any): boolean {
  if (!reg || typeof reg !== 'object') return false

  const isValidString = (val: any): boolean => {
    if (typeof val !== 'string') return false
    const trimmed = val.trim().toLowerCase()
    return (
      trimmed.length > 0 &&
      !['null', 'undefined', 'none', 'n/a', 'na', '-', '--', 'nil', 'false', '0', 'no', 'n / a', 'not applicable', 'unspecified', 'direct', 'self', 'player'].includes(trimmed)
    )
  }

  const playerName = typeof reg.full_name === 'string' ? reg.full_name.trim().toLowerCase() : (typeof reg.name === 'string' ? reg.name.trim().toLowerCase() : '')
  const playerEmail = typeof reg.email === 'string' ? reg.email.trim().toLowerCase() : ''
  const playerPhone = typeof reg.phone === 'string' ? reg.phone.replace(/\D/g, '') : ''

  // 1. Check explicit Direct Player indicators
  const subCategory = (reg.submission_category || reg.submissionCategory || reg.submission_type || reg.submissionType || reg.submitted_by || reg.submittedBy || reg.submitter || reg.submitter_type || reg.submitterType || reg.reg_type || reg.regType || reg.registration_type || reg.registrationType || '')
  const subCategoryLower = typeof subCategory === 'string' ? subCategory.trim().toLowerCase() : ''

  const isAgentFlag = reg.is_agent ?? reg.isAgent ?? reg.has_agent ?? reg.hasAgent ?? reg.by_agent ?? reg.byAgent

  // Explicit boolean false / 0
  if (isAgentFlag === false || isAgentFlag === 0 || isAgentFlag === 'false' || isAgentFlag === '0' || isAgentFlag === 'no') {
    if (!subCategoryLower.includes('agent') && !subCategoryLower.includes('agency')) {
      return false
    }
  }

  // Explicit category saying player / direct / self
  if (subCategoryLower === 'player' || subCategoryLower === 'direct' || subCategoryLower === 'self' || subCategoryLower === 'direct player' || subCategoryLower === 'player registration') {
    const agentName = reg.agent_full_name || reg.agent_name || reg.agentName || reg.agentFullName || reg.agent?.full_name || reg.agent?.name
    if (!isValidString(agentName) || (playerName && agentName.trim().toLowerCase() === playerName)) {
      return false
    }
  }

  // 2. Explicit Agent flags (boolean true, 1, 'true', 'yes')
  if (isAgentFlag === true || isAgentFlag === 1 || isAgentFlag === 'true' || isAgentFlag === '1' || isAgentFlag === 'yes') {
    return true
  }

  // 3. Explicit Agent category strings
  if (
    subCategoryLower === 'agent' ||
    subCategoryLower.includes('agent') ||
    subCategoryLower.includes('agency') ||
    subCategoryLower.includes('representative')
  ) {
    return true
  }

  // 4. Agent Full Name check (must be valid and distinct from player name)
  const agentName =
    reg.agent_full_name ||
    reg.agent_name ||
    reg.agentName ||
    reg.agentFullName ||
    reg.agent?.full_name ||
    reg.agent?.name

  if (isValidString(agentName)) {
    const agentNameLower = typeof agentName === 'string' ? agentName.trim().toLowerCase() : ''
    if (!playerName || agentNameLower !== playerName) {
      return true
    }
  }

  // 5. Agent Company / Agency Name check
  const agentAgency =
    reg.agent_company_name ||
    reg.agent_company ||
    reg.agentCompany ||
    reg.agent_agency ||
    reg.agentAgency ||
    reg.agent?.company ||
    reg.agent?.agency
  if (isValidString(agentAgency)) {
    return true
  }

  // 6. Agent Email check (must be valid email and distinct from player email)
  const agentEmail =
    reg.agent_email_address ||
    reg.agent_email ||
    reg.agentEmail ||
    reg.agent?.email ||
    reg.agent?.agent_email
  if (isValidString(agentEmail) && agentEmail.includes('@')) {
    const agentEmailLower = agentEmail.trim().toLowerCase()
    if (!playerEmail || agentEmailLower !== playerEmail) {
      return true
    }
  }

  // 7. Agent Phone check (must be distinct from player phone)
  const agentPhone =
    reg.agent_phone_number ||
    reg.agent_phone ||
    reg.agentPhone ||
    reg.agent?.phone ||
    reg.agent?.agent_phone
  if (isValidString(agentPhone)) {
    const agentPhoneDigits = agentPhone.replace(/\D/g, '')
    if (agentPhoneDigits.length >= 6 && (!playerPhone || agentPhoneDigits !== playerPhone)) {
      return true
    }
  }

  return false
}
