export interface FormData {
  // Step 1: Personal
  regType: 'player' | 'agent'
  agentName: string
  agentAgency: string
  agentPhone: string
  agentEmail: string
  fullName: string
  dob: string
  nationality: string
  passportNumber: string
  countryResidence: string
  city: string
  phone: string
  email: string
  availability: string[]
  availabilityDetails: string

  // Step 2: Cricket
  playingRole: string
  battingHand: string
  bowlerType: string
  bowlingStyle: string
  bowlingSubtype: string
  spinType: string
  currentClub: string
  prevTeams: string
  playerStatus: string
  representingCountry: string
  totalMatches: string
  profileLink: string

  // Step 3: Category
  category: string
  basePrice: string
  acceptRelegation: 'yes' | 'no' | 'emerging' | ''
  relegationLimit: 'Diamond' | 'Gold' | 'Silver' | ''
  considerIconPlayer: 'yes' | 'no' | ''

  // Step 4: Uploads
  passportPhoto: File | null
  passportScan: File | null
  actionShot: File | null
  rightProfilePhoto: File | null
  leftProfilePhoto: File | null
}

export interface FileMeta {
  name: string
  size: number
}

export interface ApiCategory {
  id: string
  label: string
  desc: string
  price: string
}

export interface ApiAvailability {
  key: string
  label: string
}

export const initialFormData: FormData = {
  regType: 'player',
  agentName: '',
  agentAgency: '',
  agentPhone: '',
  agentEmail: '',
  fullName: '',
  dob: '',
  nationality: '',
  passportNumber: '',
  countryResidence: '',
  city: '',
  phone: '',
  email: '',
  availability: ['full'],
  availabilityDetails: '',
  playingRole: '',
  battingHand: '',
  bowlerType: '',
  bowlingStyle: '',
  bowlingSubtype: '',
  spinType: '',
  currentClub: '',
  prevTeams: '',
  playerStatus: 'Afghanistan (Domestic)',
  representingCountry: '',
  totalMatches: '',
  profileLink: '',
  category: 'Gold Player',
  basePrice: '$20,000',
  acceptRelegation: 'no',
  relegationLimit: '',
  considerIconPlayer: '',
  passportPhoto: null,
  passportScan: null,
  actionShot: null,
  rightProfilePhoto: null,
  leftProfilePhoto: null,
}

export const categoriesList: ApiCategory[] = [
  { id: 'Platinum Player', label: 'Platinum Player', desc: 'Top-tier performers', price: '$50,000' },
  { id: 'Diamond Player', label: 'Diamond Player', desc: 'Established talent', price: '$35,000' },
  { id: 'Gold Player', label: 'Gold Player', desc: 'Strong domestic record', price: '$20,000' },
  { id: 'Silver Player', label: 'Silver Player', desc: 'Rising performers', price: '$10,000' },
  { id: 'Emerging Under-23', label: 'Emerging Under-23', desc: 'Afghan National Players Emerging Talent', price: '$5,000' }
]

const MIME_MAP: Record<string, string[]> = {
  jpg: ['image/jpeg'],
  jpeg: ['image/jpeg'],
  png: ['image/png'],
  webp: ['image/webp'],
  pdf: ['application/pdf']
}

export const validateFile = (file: File, allowedTypes: string[], maxSizeMB: number): string | null => {
  const fileExtension = file.name.split('.').pop()?.toLowerCase() || ''

  // Explicit check for HEIC/HEIF (common on Apple devices)
  if (
    fileExtension === 'heic' ||
    fileExtension === 'heif' ||
    file.type === 'image/heic' ||
    file.type === 'image/heif'
  ) {
    return 'HEIC/HEIF image format is not supported. Please convert your photo to JPG or PNG before uploading.'
  }

  if (!allowedTypes.includes(fileExtension)) {
    return `Invalid format. Allowed formats: ${allowedTypes.join(', ').toUpperCase()}`
  }

  // Validate MIME type if available from browser
  if (file.type) {
    const validMimes = allowedTypes.flatMap(ext => MIME_MAP[ext] || [])
    if (validMimes.length > 0 && !validMimes.includes(file.type.toLowerCase())) {
      return `Invalid file type (${file.type}). Expected ${allowedTypes.join(', ').toUpperCase()}`
    }
  }

  if (file.size > maxSizeMB * 1024 * 1024) {
    return `File size exceeds the ${maxSizeMB} MB limit.`
  }
  return null
}
