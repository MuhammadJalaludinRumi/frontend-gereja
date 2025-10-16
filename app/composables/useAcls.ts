// composables/useAcls.ts
import { ref } from 'vue'
import { useApiUrl } from './useApiUrl'
import { useCookie, useRuntimeConfig } from '#app'

export const useAcls = () => {
  const apiBase = useApiUrl()  // ambil dari env
  const acls = ref<any[]>([])
  const acl = ref<any>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const config = useRuntimeConfig()
  const isProd = config.public.sessionSecureCookie === 'true'

  // Ambil csrf token & token auth
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

  const fetchAll = async () => {
    loading.value = true
    error.value = null
    try {
      const res = await $fetch('/acls', {
        baseURL: apiBase,
        headers: getHeaders(),
        credentials: 'include'
      })
      acls.value = res
    } catch (err) {
      error.value = 'Gagal memuat data ACL'
      console.error(err)
    } finally {
      loading.value = false
    }
  }

  const fetchById = async (id: number) => {
    loading.value = true
    error.value = null
    try {
      const res = await $fetch(`/acls/${id}`, {
        baseURL: apiBase,
        headers: getHeaders(),
        credentials: 'include'
      })
      acl.value = res
    } catch (err) {
      error.value = 'Gagal memuat data ACL'
      console.error(err)
    } finally {
      loading.value = false
    }
  }

  const create = async (payload: { name: string }) => {
    try {
      const res = await $fetch('/acls', {
        baseURL: apiBase,
        method: 'POST',
        headers: getHeaders(),
        credentials: 'include',
        body: payload
      })
      return res
    } catch (err) {
      console.error(err)
      throw new Error('Gagal membuat ACL')
    }
  }

  const update = async (id: number, payload: { name: string }) => {
    try {
      const res = await $fetch(`/acls/${id}`, {
        baseURL: apiBase,
        method: 'PUT',
        headers: getHeaders(),
        credentials: 'include',
        body: payload
      })
      return res
    } catch (err) {
      console.error(err)
      throw new Error('Gagal memperbarui ACL')
    }
  }

  const remove = async (id: number) => {
    try {
      await $fetch(`/acls/${id}`, {
        baseURL: apiBase,
        method: 'DELETE',
        headers: getHeaders(),
        credentials: 'include'
      })
    } catch (err) {
      console.error(err)
      throw new Error('Gagal menghapus ACL')
    }
  }

  return { acls, acl, fetchAll, fetchById, create, update, remove, loading, error }
}
//
