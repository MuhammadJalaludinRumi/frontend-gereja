// composables/useEducations.ts
import { ref } from 'vue'
import { useApiUrl } from './useApiUrl'
import { useCookie, useRuntimeConfig } from '#app'

export interface Education {
  id: number
  member: number
  level: string
  institution: string
  major: string
  year_graduate: number
  member_data: Member
}

export const useEducations = () => {
  const apiBase = useApiUrl()
  const educations = ref<Education[]>([])
  const education = ref<Education | null >(null)
  const meta = ref({
    total: 0,
    per_page: 10,
    current_page: 1,
    last_page: 1
  })
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

  const fetchAll = async (params?: {
    page?: number
    per_page?: number
    search?: string
  }) => {
    loading.value = true
    error.value = null
    try {
      const res: any = await $fetch('/educations', {
        baseURL: apiBase,
        headers: getHeaders(),
        credentials: 'include',
        params
      })
      educations.value = res.data
      meta.value = {
        total: res.total,
        per_page: res.per_page,
        current_page: res.current_page,
        last_page: res.last_page
      }
    } catch (err) {
      error.value = 'Gagal mengambil data pendidikan'
    } finally {
      loading.value = false
    }
  }

  const fetchById = async (id: number) => {
    loading.value = true
    error.value = null
    try {
      const res: any = await $fetch(`/educations/${id}`, {
        baseURL: apiBase,
        headers: getHeaders(),
        credentials: 'include'
      })
      education.value = res
    } catch (err) {
      error.value = 'Gagal mengambil detail pendidikan'
    } finally {
      loading.value = false
    }
  }

  const create = async (payload: any) => {
    return await $fetch('/educations', {
      baseURL: apiBase,
      method: 'POST',
      headers: getHeaders(),
      credentials: 'include',
      body: payload
    })
  }

  const update = async (id: number, payload: any) => {
    return await $fetch(`/educations/${id}`, {
      baseURL: apiBase,
      method: 'PUT',
      headers: getHeaders(),
      credentials: 'include',
      body: payload
    })
  }

  const remove = async (id: number) => {
    await $fetch(`/educations/${id}`, {
      baseURL: apiBase,
      method: 'DELETE',
      headers: getHeaders(),
      credentials: 'include'
    })
  }

  return { 
    educations, 
    education, 
    meta,
    fetchAll, 
    fetchById, 
    create, 
    update, 
    remove, 
    loading, 
    error 
  }
}
