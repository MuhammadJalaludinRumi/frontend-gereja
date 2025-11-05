import { ref } from 'vue'
import { useApiUrl } from './useApiUrl'
import { useCookie, useRuntimeConfig } from '#app'

interface User {
  id?: number
  username: string
  password?: string
  name: string
  is_active: boolean
  role_id: number
}

export const useUsers = () => {
  const apiBase = useApiUrl()
  const users = ref<User[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const config = useRuntimeConfig()
  const isProd = config.public.sessionSecureCookie === 'true'

  // ambil token & xsrf
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

  // GET semua user
  const fetchUsers = async () => {
    loading.value = true
    error.value = null
    try {
      const res = await $fetch<User[]>('/users', {
        baseURL: apiBase,
        headers: getHeaders(),
        credentials: 'include'
      })
      users.value = Array.isArray(res) ? res : []
    } catch (err) {
      console.error('Gagal fetch users:', err)
      error.value = 'Gagal memuat data users'
    } finally {
      loading.value = false
    }
  }

  // POST create user baru
  const createUser = async (payload: User) => {
    try {
      await $fetch('/users', {
        baseURL: apiBase,
        method: 'POST',
        headers: getHeaders(),
        credentials: 'include',
        body: payload
      })
      await fetchUsers()
    } catch (err) {
      console.error('Gagal create user:', err)
      throw new Error('Gagal membuat user baru')
    }
  }

  // PUT update user
  const updateUser = async (id: number, payload: Partial<User>) => {
    try {
      await $fetch(`/users/${id}`, {
        baseURL: apiBase,
        method: 'PUT',
        headers: getHeaders(),
        credentials: 'include',
        body: payload
      })
      await fetchUsers()
    } catch (err) {
      console.error('Gagal update user:', err)
      throw new Error('Gagal memperbarui user')
    }
  }

  // DELETE user
  const deleteUser = async (id: number) => {
    try {
      await $fetch(`/users/${id}`, {
        baseURL: apiBase,
        method: 'DELETE',
        headers: getHeaders(),
        credentials: 'include'
      })
      await fetchUsers()
    } catch (err) {
      console.error('Gagal hapus user:', err)
      throw new Error('Gagal menghapus user')
    }
  }

  return { users, fetchUsers, createUser, updateUser, deleteUser, loading, error }
}
