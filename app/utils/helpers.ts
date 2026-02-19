export function $formatDate(date: string) {
  if (!date) return "-"
  
  try {
    return new Date(date).toLocaleDateString("id-ID", {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  } catch {
    return date.split("T")[0];
  }
}

export function $formatDateForInput(dateString?: string | null) {
  if (!dateString) return ''
  return dateString.slice(0, 10)
}

export function $age(dob: string) {
  if (!dob) return "-"
  const today = new Date()
  const birthDate = new Date(dob)
  let age = today.getFullYear() - birthDate.getFullYear()
  const monthDiff = today.getMonth() - birthDate.getMonth()
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--
  }
  return age
}

// Helper untuk mencari opsi berdasarkan array of ids 
export function $findOptions(
  options: { label: string; value: number }[],
  ids?: number[] | null
) {
  if (!ids || !ids.length) return []
  return options.filter(opt => ids.includes(opt.value))
}