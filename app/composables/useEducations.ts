// composables/useEducations.ts
import { ref } from 'vue'
import { useApiUrl } from './useApiUrl'
import { useCookie, useRuntimeConfig } from '#app'

export const useEducations = () => {
  const apiBase = useApiUrl()
  const educations = ref<any[]>([])
  const education = ref<any>(null)
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
      const res = await $fetch('/educations', {
        baseURL: apiBase,
        headers: getHeaders(),
        credentials: 'include'
      })
      educations.value = res
    } catch (err) {
      error.value = 'Gagal memuat data Education'
    } finally {
      loading.value = false
    }
  }

  const fetchById = async (id: number) => {
    loading.value = true
    error.value = null
    try {
      const res = await $fetch(`/educations/${id}`, {
        baseURL: apiBase,
        headers: getHeaders(),
        credentials: 'include'
      })
      education.value = res
    } catch (err) {
      error.value = 'Gagal memuat detail Education'
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

  return { educations, education, fetchAll, fetchById, create, update, remove, loading, error }
}
