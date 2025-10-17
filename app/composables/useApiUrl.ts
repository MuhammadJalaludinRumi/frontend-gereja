// useApiUrl.ts
export const useApiUrl = () => {
  const config = useRuntimeConfig()
  let baseUrl = config.public.apiBase || 'http://localhost:8000'
  // Pastikan selalu pakai /api
  if (!baseUrl.endsWith('/api')) {
    baseUrl = `${baseUrl.replace(/\/$/, '')}/api`
  }
  return baseUrl
}

export const useSanctumUrl = () => {
  const config = useRuntimeConfig()
  const apiBase = config.public.apiBase || 'http://localhost:8000'
  // Buang '/api' di akhir kalau ada
  return apiBase.replace(/\/api$/, '')
}
//perbaikan token

