import { ref } from 'vue'
import { useApiUrl } from './useApiUrl'
import { useCookie, useRuntimeConfig } from '#app'

export interface Marriage {
  id?: number
  bride?: number | null
  bride_name: string
  groom?: number | null
  groom_name: string
  date: string
  venue?: string | null
  priest?: number | null
  priest_name: string
  is_active?: number | boolean
}

export const useMarriages = () => {
  const apiBase = useApiUrl()
  const marriages = ref<Marriage[]>([])
  const marriage = ref<Marriage | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const config = useRuntimeConfig()
  const isProd = config.public.sessionSecureCookie === 'true'

  // Token
  const xsrfToken = useCookie('XSRF-TOKEN').value
  const token = useCookie('token').value

  // Header builder
  const getHeaders = (): Record<string, string> => {
    const headers: Record<string, string> = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    }
    if (isProd && xsrfToken) headers['X-XSRF-TOKEN'] = xsrfToken
    if (!isProd && token) headers['Authorization'] = `Bearer ${token}`
    return headers
  }

  // Fetch All
  const fetchAll = async () => {
    loading.value = true
    error.value = null
    try {
      const res = await $fetch('/marriages', {
        baseURL: apiBase,
        headers: getHeaders(),
        credentials: 'include',
      })
      marriages.value = res?.data ?? res
    } catch (err) {
      console.error(err)
      error.value = 'Gagal ngambil data pernikahan'
    } finally {
      loading.value = false
    }
  }

  // Fetch By ID
  const fetchById = async (id: number | string) => {
    loading.value = true
    error.value = null
    try {
      const res = await $fetch(`/marriages/${id}`, {
        baseURL: apiBase,
        headers: getHeaders(),
        credentials: 'include',
      })
      marriage.value = res?.data ?? res
    } catch (err) {
      console.error(err)
      error.value = 'Gagal ngambil detail pernikahan'
      marriage.value = null
    } finally {
      loading.value = false
    }
  }

  // Create
  const create = async (payload: Record<string, any>) => {
    try {
      const res = await $fetch('/marriages', {
        baseURL: apiBase,
        method: 'POST',
        headers: getHeaders(),
        credentials: 'include',
        body: JSON.stringify(payload),
      })

      const newData = res?.data ?? res
      marriages.value.push(newData)

      return newData
    } catch (err: any) {
      console.error('CREATE ERROR:', err)
      throw new Error(err?.response?._data?.message || 'Gagal menambah pernikahan')
    }
  }

  // Update
  const update = async (id: number | string, payload: Record<string, any>) => {
    try {
      const res = await $fetch(`/marriages/${id}`, {
        baseURL: apiBase,
        method: 'PUT',
        headers: getHeaders(),
        credentials: 'include',
        body: JSON.stringify(payload),
      })

      const updated = res?.data ?? res
      const idx = marriages.value.findIndex(m => m.id === Number(id))
      if (idx !== -1) marriages.value[idx] = updated

      return updated
    } catch (err: any) {
      console.error('UPDATE ERROR:', err)
      throw new Error(err?.response?._data?.message || 'Gagal update pernikahan')
    }
  }

  // Delete
  const remove = async (id: number | string) => {
    try {
      await $fetch(`/marriages/${id}`, {
        baseURL: apiBase,
        method: 'DELETE',
        headers: getHeaders(),
        credentials: 'include',
      })

      marriages.value = marriages.value.filter(m => m.id !== Number(id))
      return true
    } catch (err) {
      console.error(err)
      throw new Error('Gagal hapus pernikahan')
    }
  }

  return {
    marriages,
    marriage,
    fetchAll,
    fetchById,
    create,
    update,
    remove,
    loading,
    error,
  }
}
