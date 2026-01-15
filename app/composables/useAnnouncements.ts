import { ref } from 'vue'
import { useApiUrl } from './useApiUrl'
import { useCookie, useRuntimeConfig } from '#app'

export interface Announcements {
  id?: number
  date_post: string
  title: string
  content: string
  status: number
}

export const useAnnouncements = () => {
  const apiBase = useApiUrl()
  const config = useRuntimeConfig()

  const announcements = ref<Announcements[]>([])
  const currentAnnouncement = ref<Announcements | null>(null)

  const loading = ref(false)
  const error = ref<string | null>(null)

  const isProd = config.public.sessionSecureCookie === 'true'
  const xsrfToken = useCookie('XSRF-TOKEN').value
  const token = useCookie('token').value

  // Headers generator
  const getHeaders = (publicMode = false): Record<string, string> => {
    const headers: Record<string, string> = {
      Accept: 'application/json'
    }

    if (publicMode) return headers // login page mode

    headers['Content-Type'] = 'application/json'
    if (isProd && xsrfToken) headers['X-XSRF-TOKEN'] = xsrfToken
    if (!isProd && token) headers['Authorization'] = `Bearer ${token}`

    return headers
  }

  const fetchAll = async () => {
    loading.value = true

    try {
      announcements.value = await $fetch<Announcements[]>(`${apiBase}/announcements`, {
        headers: getHeaders(false),
        credentials: 'include'
      })
    } catch (e) {
      console.error('❌ fetchAll:', e)
      error.value = 'Gagal memuat pengumuman'
    } finally {
      loading.value = false
    }
  }

  const fetchById = async (id: number) => {
    loading.value = true

    try {
      currentAnnouncement.value = await $fetch<Announcements>(`${apiBase}/announcements/${id}`, {
        headers: getHeaders(),
        credentials: 'include'
      })
    } catch (e) {
      console.error('❌ fetchById:', e)
      error.value = 'Gagal memuat detail pengumuman'
    } finally {
      loading.value = false
    }
  }

  const create = async (payload: Announcements) => {
    return await $fetch(`${apiBase}/announcements`, {
      method: 'POST',
      headers: getHeaders(),
      credentials: 'include',
      body: payload
    });
  }

  const update = async (id: number, payload: Partial<Announcements>) => {
    return await $fetch(`${apiBase}/announcements/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      credentials: 'include',
      body: payload
    })
  }

  const remove = async (id: number) => {
    return await $fetch(`${apiBase}/announcements/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
      credentials: 'include'
    })
  }

  return {
    // state
    announcements,
    currentAnnouncement,
    loading,
    error,

    // protected
    fetchAll,
    fetchById,
    create,
    update,
    remove,

    // aliases
    fetchAnnouncements: fetchAll,
  }
}