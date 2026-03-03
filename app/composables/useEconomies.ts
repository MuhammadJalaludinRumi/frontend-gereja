import { ref, computed } from 'vue'
import { useApiUrl } from './useApiUrl'
import { useCookie, useRuntimeConfig } from '#app'

export interface Economy {
  id: number
  member: Member
  update: string | Date
  class: string
}

export const useEconomies = () => {
  const apiBase = useApiUrl()
  const economies = ref<Economy[]>([])
  const economy = ref<Economy | null >(null)
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
      const res: any = await $fetch('/economies', {
        baseURL: apiBase,
        headers: getHeaders(),
        credentials: 'include',
        params
      })
      economies.value = res.data
      meta.value = {
        total: res.total,
        per_page: res.per_page,
        current_page: res.current_page,
        last_page: res.last_page
      }
    } catch (err) {
      error.value = 'Gagal memuat data Economy'
      console.error(err)
    } finally {
      loading.value = false
    }
  }

  const fetchById = async (id: number) => {
    loading.value = true
    error.value = null
    try {
      const res: any = await $fetch(`/economies/${id}`, {
        baseURL: apiBase,
        headers: getHeaders(),
        credentials: 'include'
      })
      economy.value = res
    } catch (err) {
      error.value = 'Gagal memuat data Economy'
      console.error(err)
    } finally {
      loading.value = false
    }
  }

  const create = async (payload: { member: number; update: string; class: string }) => {
    try {
      const res = await $fetch('/economies', {
        baseURL: apiBase,
        method: 'POST',
        headers: getHeaders(),
        credentials: 'include',
        body: payload
      })
      return res
    } catch (err) {
      console.error(err)
      throw new Error('Gagal membuat Economy')
    }
  }

  const update = async (id: number, payload: { member: number; update: string; class: string }) => {
    try {
      const res = await $fetch(`/economies/${id}`, {
        baseURL: apiBase,
        method: 'PUT',
        headers: getHeaders(),
        credentials: 'include',
        body: payload
      })
      return res
    } catch (err) {
      console.error(err)
      throw new Error('Gagal memperbarui Economy')
    }
  }

  const remove = async (id: number) => {
    try {
      await $fetch(`/economies/${id}`, {
        baseURL: apiBase,
        method: 'DELETE',
        headers: getHeaders(),
        credentials: 'include'
      })
    } catch (err) {
      console.error(err)
      throw new Error('Gagal menghapus Economy')
    }
  }

  return { 
    economies, 
    economy,
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
