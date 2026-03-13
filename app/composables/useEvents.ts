import { ref } from 'vue'
import { useApiUrl } from './useApiUrl'
import { useCookie, useRuntimeConfig } from '#app'

export interface Event {
  id: number

  service_type: string
  service_date: string
  service_time: string

  service_ministry: Member
  organization: Organization

  scripture_reading: string
  sermon_text: string
  sermon_theme: string

  coordinator: Member | null
  liturgist: Member | null
  pf_assistant: Member | null

  musician: Member[]
  worship_leader: Member[]
  offering_officer: Member[]
  choir: Member[]

  male_attendance: number
  female_attendance: number
  total_attendance: number

  red_envelope: number
  blue_envelope: number
  other_envelope: number
  total_envelope: number

  note: string | null
}

export const useEvent = () => {
  const apiBase = useApiUrl()
  const config = useRuntimeConfig()

  const events = ref<Event[]>([])
  const currentEvent = ref<Event | null>(null)
  
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
      const res: any = await $fetch<Event[]>(`${apiBase}/events`, {
        headers: getHeaders(false),
        credentials: 'include',
        params
      })

      events.value = res.data
      meta.value = {
        total: res.total,
        per_page: res.per_page,
        current_page: res.current_page,
        last_page: res.last_page
      }
    } catch (e) {
      console.error('❌ fetchAll:', e)
      error.value = 'Gagal mengambil data agenda'
    } finally {
      loading.value = false
    }
  }

  const fetchById = async (id: number) => {
    loading.value = true

    try {
      currentEvent.value = await $fetch<Event>(`${apiBase}/events/${id}`, {
        headers: getHeaders(false),
        credentials: 'include'
      })
    } catch (e) {
      console.error('❌ fetchById:', e)
      error.value = 'Gagal mengambil data agenda'
    } finally {
      loading.value = false
    }
  }

  const create = async ( payload: Event ) => {
    return await $fetch(`${apiBase}/events`, {
      method: 'POST',
      headers: getHeaders(),
      credentials: 'include',
      body: payload
    })
  }

  const update = async (id: number, payload: Event) => {
    return await $fetch(`${apiBase}/events/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      credentials: 'include',
      body: payload
    })
  }

  const remove = async (id: number) => {
    return await $fetch(`${apiBase}/events/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
      credentials: 'include'
    })
  }

  return {
    events,
    currentEvent,
    meta,
    loading,
    error,

    fetchAll,
    fetchById,
    create,
    update,
    remove,
  }
}