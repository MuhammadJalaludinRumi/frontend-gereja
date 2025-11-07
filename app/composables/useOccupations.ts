import { ref, computed } from 'vue'
import { useApiUrl } from './useApiUrl'
import { useCookie, useRuntimeConfig } from '#app'

export const useOccupations = () => {
  const apiBase = useApiUrl()
  const occupations = ref<any[]>([])
  const occupation = ref<any>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const config = useRuntimeConfig()
  const isProd = config.public.sessionSecureCookie === 'true'

  const xsrfToken = useCookie('XSRF-TOKEN').value
  const token = useCookie('token').value

  const getHeaders = (): Record<string, string> => {
    const headers: Record<string, string> = {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    }
    if (isProd && xsrfToken) headers['X-XSRF-TOKEN'] = xsrfToken
    if (!isProd && token) headers['Authorization'] = `Bearer ${token}`
    return headers
  }

  const fetchAll = async () => {
    loading.value = true
    error.value = null
    try {
      const res = await $fetch('/occupations', {
        baseURL: apiBase,
        headers: getHeaders(),
        credentials: 'include'
      })
      occupations.value = res
    } catch (err) {
      console.error(err)
      error.value = 'Gagal memuat data Occupations'
    } finally {
      loading.value = false
    }
  }

  const fetchById = async (id: number) => {
    loading.value = true
    error.value = null
    try {
      const res = await $fetch(`/occupations/${id}`, {
        baseURL: apiBase,
        headers: getHeaders(),
        credentials: 'include'
      })
      occupation.value = res
    } catch (err) {
      console.error(err)
      error.value = 'Gagal memuat data Occupation'
    } finally {
      loading.value = false
    }
  }

  const create = async (payload: any) => {
    try {
      const res = await $fetch('/occupations', {
        baseURL: apiBase,
        method: 'POST',
        headers: getHeaders(),
        credentials: 'include',
        body: payload
      })
      return res
    } catch (err) {
      console.error(err)
      throw new Error('Gagal membuat Occupation')
    }
  }

  const update = async (id: number, payload: any) => {
    try {
      const res = await $fetch(`/occupations/${id}`, {
        baseURL: apiBase,
        method: 'PUT',
        headers: getHeaders(),
        credentials: 'include',
        body: payload
      })
      return res
    } catch (err) {
      console.error(err)
      throw new Error('Gagal memperbarui Occupation')
    }
  }

  const remove = async (id: number) => {
    try {
      await $fetch(`/occupations/${id}`, {
        baseURL: apiBase,
        method: 'DELETE',
        headers: getHeaders(),
        credentials: 'include'
      })
    } catch (err) {
      console.error(err)
      throw new Error('Gagal menghapus Occupation')
    }
  }

  return { occupations, occupation, fetchAll, fetchById, create, update, remove, loading, error }
}
