import { ref } from 'vue'
import { useApiUrl } from './useApiUrl'
import { useCookie, useRuntimeConfig } from '#app'
import { useRouter } from 'vue-router'

export const useGroups = () => {
  const apiBase = useApiUrl()
  const groups = ref<any[]>([])
  const group = ref<any>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  const config = useRuntimeConfig()
  const isProd = config.public.sessionSecureCookie === 'true'
  const xsrfToken = useCookie('XSRF-TOKEN').value
  const token = useCookie('token').value
  const router = useRouter()

  const getHeaders = (): Record<string, string> => {
    const headers: Record<string, string> = {
      Accept: 'application/json'
    }
    if (isProd && xsrfToken) headers['X-XSRF-TOKEN'] = xsrfToken
    if (!isProd && token) headers['Authorization'] = `Bearer ${token}`
    return headers
  }

  const fetchAll = async () => {
    loading.value = true
    error.value = null
    try {
      if (!token && !xsrfToken) throw new Error('Unauthenticated')
      const res = await $fetch('/groups', {
        baseURL: apiBase,
        headers: getHeaders(),
        credentials: 'include'
      })
      groups.value = res as any[]
      return { data: groups.value, error: null }
    } catch (err: any) {
      console.error(err)
      error.value = err.message || 'Gagal memuat data Group'
      if (err.message === 'Unauthenticated') router.push('/login')
      return { data: null, error: err }
    } finally {
      loading.value = false
    }
  }

  const fetchById = async (id: number) => {
    loading.value = true
    error.value = null
    try {
      const res = await $fetch(`/groups/${id}`, {
        baseURL: apiBase,
        headers: getHeaders(),
        credentials: 'include'
      })
      group.value = res
      return { data: group.value, error: null }
    } catch (err: any) {
      console.error(err)
      error.value = 'Gagal memuat data Group'
      return { data: null, error: err }
    } finally {
      loading.value = false
    }
  }

  const create = async (payload: FormData) => {
    try {
      const res = await $fetch('/groups', {
        baseURL: apiBase,
        method: 'POST',
        body: payload,
        headers: getHeaders(),
        credentials: 'include'
      })
      return res
    } catch (err: any) {
      console.error(err)
      throw new Error(err.data?.message || 'Gagal membuat Group')
    }
  }

  const update = async (id: number, payload: FormData) => {
    try {
      // Pastikan _method sudah ada di payload sebelum dikirim
      if (!payload.has('_method')) {
        payload.append('_method', 'PUT')
      }

      const res = await $fetch(`/groups/${id}`, {
        baseURL: apiBase,
        method: 'POST',
        body: payload,
        headers: getHeaders(),
        credentials: 'include'
      })
      return res
    } catch (err: any) {
      console.error(err)
      throw new Error(err.data?.message || 'Gagal memperbarui Group')
    }
  }

  const remove = async (id: number) => {
    try {
      await $fetch(`/groups/${id}`, {
        baseURL: apiBase,
        method: 'DELETE',
        headers: getHeaders(),
        credentials: 'include'
      })
    } catch (err) {
      console.error(err)
      throw new Error('Gagal menghapus Group')
    }
  }

  // Alias supaya component tetap jalan
  const getGroups = fetchAll
  const getGroup = fetchById
  const createGroup = create
  const updateGroup = update
  const deleteGroup = remove

  return {
    groups,
    group,
    fetchAll,
    fetchById,
    create,
    update,
    remove,
    loading,
    error,
    getGroups,
    getGroup,
    createGroup,
    updateGroup,
    deleteGroup
  }
}
