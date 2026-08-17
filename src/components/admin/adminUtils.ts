// Shared admin status utilities — single source of truth
// Previously duplicated in AdminDashboard.tsx and AdminPlayerDetail.tsx

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
