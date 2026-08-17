// Shared admin status utilities — single source of truth

export function formatStatus(status?: string): string {
  if (!status) return 'Pending'
  return status.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
}

export function statusClass(status?: string): string {
  const s = (status || '').toLowerCase()
  if (s === 'approved') return 'status-approved'
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
