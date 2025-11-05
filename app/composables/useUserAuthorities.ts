import { ref } from 'vue'
import { useApiUrl } from './useApiUrl'
import { useCookie, useRuntimeConfig } from '#app'

export const useUserAuthorities = () => {
  const apiBase = useApiUrl()
  const userAuthorities = ref<any[]>([])
  const userAuthority = ref<any>(null)
  const users = ref<any[]>([])
  const roles = ref<any[]>([])
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

  // 🧠 Ambil semua user authorities
  const fetchAll = async () => {
    loading.value = true
    error.value = null
    try {
      const res = await $fetch('/user-authorities', {
        baseURL: apiBase,
        headers: getHeaders(),
        credentials: 'include'
      })
      userAuthorities.value = Array.isArray(res) ? res : []
    } catch (err) {
      console.error('fetchAll error:', err)
      error.value = 'Gagal memuat data User Authorities'
    } finally {
      loading.value = false
    }
  }

  // 🧠 Ambil detail authority (udah include relasi user & role dari backend)
  const fetchById = async (id: number) => {
    loading.value = true
    error.value = null
    try {
      const authority = await $fetch(`/user-authorities/${id}`, {
        baseURL: apiBase,
        headers: getHeaders(),
        credentials: 'include'
      })

      userAuthority.value = authority
      return authority
    } catch (err) {
      console.error('fetchById error:', err)
      error.value = 'Gagal memuat detail User Authority'
      return null
    } finally {
      loading.value = false
    }
  }

  // 🧠 Ambil semua user buat combo box
  const fetchUsers = async () => {
    try {
      const res = await $fetch('/users', {
        baseURL: apiBase,
        headers: getHeaders(),
        credentials: 'include'
      })
      users.value = Array.isArray(res)
        ? res.sort((a, b) => a.username.localeCompare(b.username))
        : []
    } catch (err) {
      console.error('fetchUsers error:', err)
    }
  }

  // 🧠 Ambil semua role buat combo box
  const fetchRoles = async () => {
    try {
      const res = await $fetch('/roles', {
        baseURL: apiBase,
        headers: getHeaders(),
        credentials: 'include'
      })
      roles.value = Array.isArray(res)
        ? res.sort((a, b) => a.name.localeCompare(b.name))
        : []
    } catch (err) {
      console.error('fetchRoles error:', err)
    }
  }

  // 🧠 Create baru
  const create = async (payload: { user_id: number; role_id: number }) => {
    try {
      const res = await $fetch('/user-authorities', {
        baseURL: apiBase,
        method: 'POST',
        headers: getHeaders(),
        credentials: 'include',
        body: payload
      })
      return res
    } catch (err) {
      console.error('create error:', err)
      throw new Error('Gagal membuat User Authority')
    }
  }

  // 🧠 Update
  const update = async (id: number, payload: { user_id: number; role_id: number }) => {
    try {
      const res = await $fetch(`/user-authorities/${id}`, {
        baseURL: apiBase,
        method: 'PUT',
        headers: getHeaders(),
        credentials: 'include',
        body: payload
      })
      return res
    } catch (err) {
      console.error('update error:', err)
      throw new Error('Gagal memperbarui User Authority')
    }
  }

  // 🧠 Delete
  const remove = async (id: number) => {
    try {
      await $fetch(`/user-authorities/${id}`, {
        baseURL: apiBase,
        method: 'DELETE',
        headers: getHeaders(),
        credentials: 'include'
      })
    } catch (err) {
      console.error('delete error:', err)
      throw new Error('Gagal menghapus User Authority')
    }
  }

  return {
    userAuthorities,
    userAuthority,
    users,
    roles,
    fetchAll,
    fetchById,
    fetchUsers,
    fetchRoles,
    create,
    update,
    remove,
    loading,
    error
  }
}
