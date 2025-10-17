// useApiUrl.ts
export const useApiUrl = () => {
<<<<<<< Updated upstream
  const config = useRuntimeConfig()
=======
>>>>>>> Stashed changes
  return config.public.apiBase || 'http://localhost:8000/api'
}

export const useSanctumUrl = () => {
  const config = useRuntimeConfig()
  const apiBase = config.public.apiBase || 'http://localhost:8000'
  // Buang '/api' di akhir kalau ada
  return apiBase.replace(/\/api$/, '')
}
//perbaikan token

