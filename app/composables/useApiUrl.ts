export const useApiUrl = () => {
  return import.meta.env.NUXT_PUBLIC_API_BASE || 'http://localhost:8000/api'
}

export const useSanctumUrl = () => {
  return import.meta.env.NUXT_PUBLIC_API_BASE || 'http://localhost:8000'
}


