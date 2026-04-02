export const objectToFormData = (obj: Record<string, any>) => {
  const formData = new FormData()

  Object.entries(obj).forEach(([key, value]) => {
    if (value === null || value === undefined) return

    if (value instanceof Blob || value instanceof File) {
      formData.append(key, value)
    } else {
      formData.append(key, String(value))
    }
  })

  return formData
}