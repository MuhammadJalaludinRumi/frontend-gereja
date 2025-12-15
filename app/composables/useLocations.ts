// composables/useLocations.ts
import { ref } from 'vue'
import { useApiUrl } from './useApiUrl'
import { useCookie, useRuntimeConfig } from '#app'

export interface LocationData {
  id?: number
  parent_id?: number | null
  name: string
  description?: string
}

export const useLocations = () => {
  const apiBase = useApiUrl()

  const locations = ref<LocationData[]>([])
  const location = ref<LocationData | null>(null)

  const loading = ref(false)
  const error = ref<string | null>(null)

  const config = useRuntimeConfig()
  const isProd = config.public.sessionSecureCookie === 'true'

  const xsrfToken = useCookie('XSRF-TOKEN').value
  const token = useCookie('token').value

  const getHeaders = (isFormData = false): Record<string, string> => {
    const headers: Record<string, string> = {
      Accept: 'application/json',
    }
    if (!isFormData) headers['Content-Type'] = 'application/json'
    if (isProd && xsrfToken) headers['X-XSRF-TOKEN'] = xsrfToken
    if (!isProd && token) headers['Authorization'] = `Bearer ${token}`
    return headers
  }

  // 🔹 Fetch All
  const fetchAll = async () => {
    loading.value = true
    error.value = null

    try {
      const res = await $fetch('/locations', {
        baseURL: apiBase,
        headers: getHeaders(),
        credentials: 'include',
      })
      locations.value = res?.data ?? res
    } catch (err) {
      error.value = 'Gagal memuat lokasi'
      console.error(err)
    } finally {
      loading.value = false
    }
  }

  // 🔹 Fetch By ID
  const fetchById = async (id: number | string) => {
    loading.value = true
    error.value = null

    try {
      const res = await $fetch(`/locations/${id}`, {
        baseURL: apiBase,
        headers: getHeaders(),
        credentials: 'include',
      })
      location.value = res?.data ?? res
    } catch (err) {
      error.value = 'Gagal memuat detail lokasi'
      location.value = null
    } finally {
      loading.value = false
    }
  }

  // 🔹 Create
  const create = async (payload: Record<string, any>) => {
    try {
      const res = await $fetch('/locations', {
        baseURL: apiBase,
        method: 'POST',
        headers: getHeaders(),
        credentials: 'include',
        body: payload,
      })

      const newLoc = res?.data ?? res
      locations.value.push(newLoc)
      return newLoc
    } catch (err: any) {
      throw new Error(err.response?._data?.message || 'Gagal membuat lokasi')
    }
  }

  // 🔹 Update
  const update = async (id: number | string, payload: Record<string, any>) => {
    try {
      const res = await $fetch(`/locations/${id}`, {
        baseURL: apiBase,
        method: 'PUT',
        headers: getHeaders(),
        credentials: 'include',
        body: payload,
      })

      const updated = res?.data ?? res
      const idx = locations.value.findIndex(l => l.id === Number(id))
      if (idx !== -1) locations.value[idx] = updated

      return updated
    } catch (err: any) {
      throw new Error(err.response?._data?.message || 'Gagal memperbarui lokasi')
    }
  }

  // 🔹 Delete
  const remove = async (id: number | string) => {
    try {
      await $fetch(`/locations/${id}`, {
        baseURL: apiBase,
        method: 'DELETE',
        headers: getHeaders(),
        credentials: 'include',
      })

      locations.value = locations.value.filter(l => l.id !== Number(id))
      return true
    } catch (err) {
      throw new Error('Gagal menghapus lokasi')
    }
  }

  return {
    locations,
    location,

    fetchAll,
    fetchById,
    create,
    update,
    remove,

    loading,
    error,
  }
}
