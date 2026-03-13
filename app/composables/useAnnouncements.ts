import { ref } from 'vue'
import { useApiUrl } from './useApiUrl'
import { useCookie, useRuntimeConfig } from '#app'

export interface Announcement {
  id: number
  date_post: string
  title: string
  content: string
  status: number
}

export const useAnnouncements = () => {
  const apiBase = useApiUrl()
  const config = useRuntimeConfig()

  const announcements = ref<Announcement[]>([])
  const currentAnnouncement = ref<Announcement | null>(null)

  const meta = ref({
    total: 0,
    per_page: 10,
    current_page: 1,
    last_page: 1
  })

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

  const fetchAll = async (params?: {
    page?: number
    per_page?: number
    search?: string
  }) => {
    loading.value = true

    try {
      const res: any = await $fetch<Announcement[]>(`${apiBase}/announcements`, {
        headers: getHeaders(false),
        credentials: 'include',
        params
      })

      announcements.value = res.data
      meta.value = {
        total: res.total,
        per_page: res.per_page,
        current_page: res.current_page,
        last_page: res.last_page
      }
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
      currentAnnouncement.value = await $fetch<Announcement>(`${apiBase}/announcements/${id}`, {
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

  const create = async (payload: Announcement) => {
    return await $fetch(`${apiBase}/announcements`, {
      method: 'POST',
      headers: getHeaders(),
      credentials: 'include',
      body: payload
    });
  }

  const update = async (id: number, payload: Partial<Announcement>) => {
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
    meta,
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