import { ref } from 'vue'
import { useApiUrl } from './useApiUrl'
import { useCookie, useRuntimeConfig } from '#app'

export interface Member {
  id: number
  name: string
}

export interface Organization {
  id: number
  name: string
}

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
      events.value = await $fetch<Event[]>(`${apiBase}/events`, {
        headers: getHeaders(false),
        credentials: 'include'
      })
    } catch (e) {
      console.error('❌ fetchAll:', e)
      error.value = 'Gagal memuat agenda'
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
      error.value = 'Gagal memuat agenda'
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
    loading,
    error,

    fetchAll,
    fetchById,
    create,
    update,
    remove,
  }
}