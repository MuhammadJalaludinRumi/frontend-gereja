// composables/useCities.ts
import { ref } from 'vue'
import { useApiUrl } from './useApiUrl'
import { useCookie, useRuntimeConfig } from '#app'

export const useCities = () => {
  const apiBase = useApiUrl()
  const cities = ref<any[]>([])
  const city = ref<any>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const config = useRuntimeConfig()
  const isProd = config.public.sessionSecureCookie === 'true'

  // Ambil token dan csrf (sama seperti useAcls)
  const xsrfToken = useCookie('XSRF-TOKEN').value
  const token = useCookie('token').value

  const getHeaders = (): Record<string, string> => {
    const headers: Record<string, string> = {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    }

    if (isProd && xsrfToken) {
      headers['X-XSRF-TOKEN'] = xsrfToken
    }

    if (!isProd && token) {
      headers['Authorization'] = `Bearer ${token}`
    }

    return headers
  }

  const fetchAll = async () => {
    loading.value = true
    error.value = null
    try {
      const res = await $fetch('/city', {
        baseURL: apiBase,
        headers: getHeaders(),
        credentials: 'include'
      })
      cities.value = res
    } catch (err) {
      error.value = 'Gagal memuat data City'
      console.error(err)
    } finally {
      loading.value = false
    }
  }

  const fetchById = async (id: number) => {
    loading.value = true
    error.value = null
    try {
      const res = await $fetch(`/city/${id}`, {
        baseURL: apiBase,
        headers: getHeaders(),
        credentials: 'include'
      })
      city.value = res
    } catch (err) {
      error.value = 'Gagal memuat data City'
      console.error(err)
    } finally {
      loading.value = false
    }
  }

  const create = async (payload: { name: string, province: string }) => {
    try {
      const res = await $fetch('/city', {
        baseURL: apiBase,
        method: 'POST',
        headers: getHeaders(),
        credentials: 'include',
        body: payload
      })
      return res
    } catch (err) {
      console.error(err)
      throw new Error('Gagal membuat City')
    }
  }

  const update = async (id: number, payload: any) => {
    try {
      const res = await $fetch(`/city/${id}`, {
        baseURL: apiBase,
        method: 'PUT',
        headers: getHeaders(),
        credentials: 'include',
        body: payload
      })
      return res
    } catch (err) {
      console.error(err)
      throw new Error('Gagal memperbarui City')
    }
  }

  const remove = async (id: number) => {
    try {
      await $fetch(`/city/${id}`, {
        baseURL: apiBase,
        method: 'DELETE',
        headers: getHeaders(),
        credentials: 'include'
      })
    } catch (err) {
      console.error(err)
      throw new Error('Gagal menghapus City')
    }
  }

  return { cities, city, fetchAll, fetchById, create, update, remove, loading, error }
}
