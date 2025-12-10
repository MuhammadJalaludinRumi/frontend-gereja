// composables/useFormulirs.ts
import { ref } from 'vue'
import { useApiUrl } from './useApiUrl'
import { useCookie, useRuntimeConfig } from '#app'

export const useFormulirs = () => {
  const apiBase = useApiUrl()
  const formulirs = ref<any[]>([])
  const formulir = ref<any>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const config = useRuntimeConfig()
  const isProd = config.public.sessionSecureCookie === 'true'

  // Ambil token
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
      const res = await $fetch('/formulirs', {
        baseURL: apiBase,
        headers: getHeaders(),
        credentials: 'include'
      })
      formulirs.value = res as any[]
    } catch (err) {
      console.error(err)
      error.value = 'Gagal memuat data formulir'
    } finally {
      loading.value = false
    }
  }

  // GET BY ID
  const fetchById = async (id: number) => {
    loading.value = true
    error.value = null
    try {
      const res = await $fetch(`/formulirs/${id}`, {
        baseURL: apiBase,
        headers: getHeaders(),
        credentials: 'include'
      })
      formulir.value = res
    } catch (err) {
      console.error(err)
      error.value = 'Gagal memuat detail formulir'
    } finally {
      loading.value = false
    }
  }

  // CREATE - Tidak perlu auth untuk request dari login page
  const create = async (payload: { email_pengguna: string; pesan: string }) => {
    try {
      return await $fetch('/formulirs', {
        baseURL: apiBase,
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: payload,
        credentials: 'include'
      })
    } catch (err: any) {
      console.error('Create formulir error:', err)
      throw new Error(err?.data?.message || 'Gagal membuat formulir')
    }
  }

  // UPDATE
  const update = async (
    id: number,
    payload: { email_pengguna: string; pesan: string }
  ) => {
    try {
      return await $fetch(`/formulirs/${id}`, {
        baseURL: apiBase,
        method: 'PUT',
        headers: getHeaders(),
        credentials: 'include',
        body: payload
      })
    } catch (err: any) {
      console.error(err)
      throw new Error(err?.data?.message || 'Gagal memperbarui formulir')
    }
  }

  // DELETE
  const remove = async (id: number) => {
    try {
      await $fetch(`/formulirs/${id}`, {
        baseURL: apiBase,
        method: 'DELETE',
        headers: getHeaders(),
        credentials: 'include'
      })
    } catch (err: any) {
      console.error(err)
      throw new Error(err?.data?.message || 'Gagal menghapus formulir')
    }
  }

  return {
    formulirs,
    formulir,
    fetchAll,
    fetchById,
    create,
    update,
    remove,
    loading,
    error
  }
}
