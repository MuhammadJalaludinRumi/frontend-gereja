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
  const familyMembers = ref<Member[]>([])
  const member = ref<Member | null>(null)

  const loading = ref(false)
  const error = ref<string | null>(null)

  const config = useRuntimeConfig()
  const isProd = config.public.sessionSecureCookie === 'true'

  // cookies
  const xsrfToken = useCookie('XSRF-TOKEN').value
  const token = useCookie('token').value

  const toFormData = (obj: any) => {
    const fd = new FormData()
    Object.keys(obj).forEach(key => {
      if (obj[key] !== null && obj[key] !== undefined) {
        fd.append(key, obj[key])
      }
    })
    return fd
  }


  // ======================
  // GET HEADERS (1:1 with ACLS)
  // ======================
  const getHeaders = (isFormData = false): Record<string, string> => {
    const headers: Record<string, string> = {
      Accept: 'application/json'
    }

    if (!isFormData) {
      headers['Content-Type'] = 'application/json'
    }

    // PRODUCTION (sanctum)
    if (isProd) {
      if (xsrfToken) {
        headers['X-XSRF-TOKEN'] = xsrfToken
      }
    }

    // LOCAL (Bearer token)
    if (!isProd) {
      if (token) {
        headers['Authorization'] = `Bearer ${token}`
      }
    }

    return headers
  }

  // ===========================
  // GET ALL MEMBERS
  // ===========================
  const fetchAll = async () => {
    loading.value = true
    error.value = null

    try {
      const res = await $fetch('/members', {
        baseURL: apiBase,
        headers: getHeaders(),
        credentials: 'include'
      })

      members.value = res?.data ?? res
    } catch (err) {
      error.value = 'Gagal memuat data member'
      console.error(err)
    } finally {
      loading.value = false
    }
  }

  // ===========================
  // GET MEMBER BY ID
  // ===========================
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

  // ===========================
  // GET BY KK (family_id)
  // ===========================
  const fetchByKK = async (kk: string) => {
    if (!kk) {
      familyMembers.value = []
      return
    }

    loading.value = true
    error.value = null

    try {
      const res = await $fetch(`/members/by-kk/${kk}`, {
        baseURL: apiBase,
        headers: getHeaders(),
        credentials: 'include'
      })

      familyMembers.value = res?.data ?? res
    } catch (err) {
      console.error('KK ERROR:', err)
      error.value = "Gagal memuat data anggota keluarga"
    } finally {
      loading.value = false
    }
  }


  // ===========================
  // NORMALIZE PAYLOAD
  // ===========================
  const normalizePayload = (payload: any) => {
    if (payload.city && typeof payload.city === 'object') {
      payload.city = payload.city.id
    }
    return payload
  }

  // ===========================
  // CREATE MEMBER
  // ===========================
  const create = async (payload: any) => {
    try {
      let isFormData = payload instanceof FormData

      if (!isFormData) {
        payload = normalizePayload(payload)
      }

      // 🚀 kalau ada file → paksa jadi FormData
      if (payload.photo instanceof File) {
        payload = toFormData(payload)
        isFormData = true
      }

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
      console.error('CREATE ERROR:', err)
      throw new Error(err?.data?.message || 'Gagal membuat member')
    }
  }

  // ===========================
  // UPDATE MEMBER
  // ===========================
  const update = async (id: number | string, payload: FormData | Record<string, any>) => {
    try {
      const isFormData = payload instanceof FormData

      if (isFormData && !payload.has('_method')) {
        payload.append('_method', 'PUT')
      } else if (!isFormData) {
        payload = normalizePayload(payload)
      }

      const res = await $fetch(`/members/${id}`, {
        baseURL: apiBase,
        method: isFormData ? 'POST' : 'PUT',
        headers: getHeaders(isFormData),
        credentials: 'include',
        body: payload
      })

      const updated = res?.data ?? res

      const idx = members.value.findIndex(m => m.id === Number(id))
      if (idx !== -1) {
        members.value[idx] = updated
      }

      return updated
    } catch (err) {
      console.error('UPDATE ERROR:', err)
      throw new Error('Gagal update member')
    }
  }

  // ===========================
  // DELETE MEMBER
  // ===========================
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
    familyMembers,
    fetchAll,
    fetchById,
    fetchByKK,
    create,
    update,
    remove,
    loading,
    error
  }
}
