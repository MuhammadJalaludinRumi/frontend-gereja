// composables/useProvinces.ts
import { ref } from 'vue'
import { useApiUrl } from './useApiUrl'
import { useCookie, useRuntimeConfig } from '#app'

export const useProvinces = () => {
  const apiBase = useApiUrl()
  const provinces = ref<any[]>([])
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

    if (isProd && xsrfToken) {
      headers['X-XSRF-TOKEN'] = xsrfToken
    }

    if (!isProd && token) {
      headers['Authorization'] = `Bearer ${token}`
    }

    return headers
  }

  // GET ALL
  const fetchAll = async () => {
    loading.value = true
    error.value = null
    try {
      const res = await $fetch('/province', {
        baseURL: apiBase,
        headers: getHeaders(),
        credentials: 'include'
      })
      provinces.value = res
    } catch (err) {
      error.value = 'Gagal memuat data Province'
      console.error(err)
    } finally {
      loading.value = false
    }
  }

  // CREATE
  const create = async (payload: any) => {
    return await $fetch('/province', {
      method: 'POST',
      baseURL: apiBase,
      headers: getHeaders(),
      credentials: 'include',
      body: payload
    })
  }

  // UPDATE
  const update = async (id: number, payload: any) => {
    return await $fetch(`/province/${id}`, {
      method: 'PUT',
      baseURL: apiBase,
      headers: getHeaders(),
      credentials: 'include',
      body: payload
    })
  }

  // DELETE
  const remove = async (id: number) => {
    return await $fetch(`/province/${id}`, {
      method: 'DELETE',
      baseURL: apiBase,
      headers: getHeaders(),
      credentials: 'include'
    })
  }

  return {
    provinces,
    fetchAll,
    create,
    update,
    remove,
    loading,
    error
  }
}
