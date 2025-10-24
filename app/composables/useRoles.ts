// composables/useRoles.ts
import { ref } from 'vue'
import { useApiUrl } from './useApiUrl'
import { useCookie, useRuntimeConfig } from '#app'

export const useRoles = () => {
  const apiBase = useApiUrl()
  const roles = ref<any[]>([])
  const role = ref<any>(null)
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
      const res = await $fetch('/roles', {
        baseURL: apiBase,
        headers: getHeaders(),
        credentials: 'include'
      })
      roles.value = res
    } catch (err) {
      error.value = 'Gagal memuat data roles'
      console.error(err)
    } finally {
      loading.value = false
    }
  }

  const fetchById = async (id: number) => {
    loading.value = true
    error.value = null
    try {
      const res = await $fetch(`/roles/${id}`, {
        baseURL: apiBase,
        headers: getHeaders(),
        credentials: 'include'
      })
      role.value = res
    } catch (err) {
      error.value = 'Gagal memuat role'
      console.error(err)
    } finally {
      loading.value = false
    }
  }

  const create = async (payload: any) => {
    try {
      await $fetch('/roles', {
        baseURL: apiBase,
        method: 'POST',
        headers: getHeaders(),
        credentials: 'include',
        body: payload
      })
      await fetchAll()
    } catch (err) {
      console.error(err)
      throw new Error('Gagal membuat role')
    }
  }

  const update = async (id: number, payload: any) => {
    try {
      await $fetch(`/roles/${id}`, {
        baseURL: apiBase,
        method: 'PUT',
        headers: getHeaders(),
        credentials: 'include',
        body: payload
      })
      await fetchAll()
    } catch (err) {
      console.error(err)
      throw new Error('Gagal memperbarui role')
    }
  }

  const remove = async (id: number) => {
    try {
      await $fetch(`/roles/${id}`, {
        baseURL: apiBase,
        method: 'DELETE',
        headers: getHeaders(),
        credentials: 'include'
      })
      await fetchAll()
    } catch (err) {
      console.error(err)
      throw new Error('Gagal menghapus role')
    }
  }

  return { roles, role, fetchAll, fetchById, create, update, remove, loading, error }
}
