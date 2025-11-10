import { ref } from 'vue'
import { useApiUrl } from './useApiUrl'
import { useCookie, useRuntimeConfig } from '#app'

export interface City {
  id: number
  name: string
}

export interface Member {
  id?: number
  name: string
  photo?: string
  city?: City | number | null
  phone?: string
  email?: string
  address?: string
  [key: string]: any
}

export const useMembers = () => {
  const apiBase = useApiUrl()
  const members = ref<Member[]>([])
  const member = ref<Member | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const config = useRuntimeConfig()
  const isProd = config.public.sessionSecureCookie === 'true'

  const xsrfToken = useCookie('XSRF-TOKEN').value
  const token = useCookie('token').value

  const getHeaders = (isFormData = false): Record<string, string> => {
    const headers: Record<string, string> = { Accept: 'application/json' }
    if (!isFormData) headers['Content-Type'] = 'application/json'
    if (isProd && xsrfToken) headers['X-XSRF-TOKEN'] = xsrfToken
    if (!isProd && token) headers['Authorization'] = `Bearer ${token}`
    return headers
  }

  // GET ALL
  const fetchAll = async () => {
    loading.value = true
    error.value = null
    try {
      const res = await $fetch('/members', {
        baseURL: apiBase,
        headers: getHeaders(),
        credentials: 'include'
      })
      members.value = res.data ?? res
    } catch (err) {
      error.value = 'Gagal memuat data member'
      console.error(err)
    } finally {
      loading.value = false
    }
  }

  // GET DETAIL
  const fetchById = async (id: number | string) => {
    loading.value = true
    error.value = null
    try {
      const res = await $fetch(`/members/${id}`, {
        baseURL: apiBase,
        headers: getHeaders(),
        credentials: 'include'
      })
      member.value = res
    } catch (err) {
      error.value = 'Gagal memuat detail member'
      member.value = null
      console.error(err)
    } finally {
      loading.value = false
    }
  }

  // Helper buat rapihin city sebelum POST/PUT
  const normalizePayload = (payload: any) => {
    if (payload.city && typeof payload.city === 'object') {
      payload.city = payload.city.id // yang disimpan cuma id
    }
    return payload
  }

  // CREATE
  const create = async (payload: FormData | Record<string, any>) => {
    try {
      const isFormData = payload instanceof FormData

      if (!isFormData) payload = normalizePayload(payload)

      const res = await $fetch('/members', {
        baseURL: apiBase,
        method: 'POST',
        headers: getHeaders(isFormData),
        body: payload,
        credentials: 'include'
      })

      const newMember = res?.data ?? res
      members.value.push(newMember)
      return newMember
    } catch (err: any) {
      console.error('❌ CREATE ERROR:', err)
      throw new Error(err?.data?.message || 'Gagal membuat member cuy')
    }
  }

  // UPDATE
  const update = async (id: number | string, payload: FormData | Record<string, any>) => {
    try {
      const isFormData = payload instanceof FormData

      if (isFormData) {
        if (!payload.has('_method')) payload.append('_method', 'PUT')
      } else {
        payload = normalizePayload(payload)
      }

      const res = await $fetch(`/members/${id}`, {
        baseURL: apiBase,
        method: isFormData ? 'POST' : 'PUT',
        headers: getHeaders(isFormData),
        body: payload,
        credentials: 'include'
      })

      const updated = res?.data ?? res
      const idx = members.value.findIndex(m => m.id === Number(id))
      if (idx !== -1) members.value[idx] = updated

      return updated
    } catch (err) {
      console.error('❌ UPDATE ERROR:', err)
      throw new Error('Gagal update member cuy')
    }
  }

  // DELETE
  const remove = async (id: number | string) => {
    try {
      await $fetch(`/members/${id}`, {
        baseURL: apiBase,
        method: 'DELETE',
        headers: getHeaders(),
        credentials: 'include'
      })
      members.value = members.value.filter(m => m.id !== Number(id))
      return true
    } catch (err) {
      console.error(err)
      throw new Error('Gagal menghapus member')
    }
  }

  return {
    members,
    member,
    fetchAll,
    fetchById,
    create,
    update,
    remove,
    loading,
    error
  }
}
