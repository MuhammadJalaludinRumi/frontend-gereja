// composables/useAssetCategories.ts
import { ref } from 'vue'
import { useApiUrl } from './useApiUrl'
import { useCookie, useRuntimeConfig } from '#app'

export interface AssetCategory {
  id?: number
  name: string
  description?: string
}

export const useAssetCategories = () => {
  const apiBase = useApiUrl()
  const categories = ref<AssetCategory[]>([])
  const category = ref<AssetCategory | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const config = useRuntimeConfig()
  const isProd = config.public.sessionSecureCookie === 'true'

  // Tokens
  const xsrfToken = useCookie('XSRF-TOKEN').value
  const token = useCookie('token').value

  // 🔹 Header builder
  const getHeaders = (isFormData = false): Record<string, string> => {
    const headers: Record<string, string> = {
      Accept: 'application/json',
    }
    if (!isFormData) headers['Content-Type'] = 'application/json'
    if (isProd && xsrfToken) headers['X-XSRF-TOKEN'] = xsrfToken
    if (!isProd && token) headers['Authorization'] = `Bearer ${token}`
    return headers
  }

  // 🔹 Fetch All
  const fetchAll = async () => {
    loading.value = true
    error.value = null

    try {
      const res = await $fetch('/asset-categories', {
        baseURL: apiBase,
        headers: getHeaders(),
        credentials: 'include',
      })
      categories.value = res?.data ?? res
    } catch (err) {
      error.value = 'Gagal memuat kategori aset'
      console.error(err)
    } finally {
      loading.value = false
    }
  }

  // 🔹 Fetch By ID
  const fetchById = async (id: number | string) => {
    loading.value = true
    error.value = null

    try {
      const res = await $fetch(`/asset-categories/${id}`, {
        baseURL: apiBase,
        headers: getHeaders(),
        credentials: 'include',
      })
      category.value = res?.data ?? res
    } catch (err) {
      error.value = 'Gagal memuat detail kategori'
      category.value = null
      console.error(err)
    } finally {
      loading.value = false
    }
  }

  // 🔹 Create
  const create = async (payload: Record<string, any>) => {
    try {
      const res = await $fetch('/asset-categories', {
        baseURL: apiBase,
        method: 'POST',
        headers: getHeaders(),
        credentials: 'include',
        body: payload,
      })

      const newCategory = res?.data ?? res
      categories.value.push(newCategory)
      return newCategory
    } catch (err: any) {
      console.error('CREATE ERROR:', err)

      let errorMessage = 'Gagal membuat kategori aset'
      if (err.response?._data?.message) {
        errorMessage = err.response._data.message
      }
      throw new Error(errorMessage)
    }
  }

  // 🔹 Update
  const update = async (id: number | string, payload: Record<string, any>) => {
    try {
      const res = await $fetch(`/asset-categories/${id}`, {
        baseURL: apiBase,
        method: 'PUT',
        headers: getHeaders(),
        credentials: 'include',
        body: payload,
      })

      const updated = res?.data ?? res
      const idx = categories.value.findIndex(c => c.id === Number(id))
      if (idx !== -1) categories.value[idx] = updated

      return updated
    } catch (err: any) {
      console.error('UPDATE ERROR:', err)
      throw new Error(err.response?._data?.message || 'Gagal memperbarui kategori')
    }
  }

  // 🔹 Delete
  const remove = async (id: number | string) => {
    try {
      await $fetch(`/asset-categories/${id}`, {
        baseURL: apiBase,
        method: 'DELETE',
        headers: getHeaders(),
        credentials: 'include',
      })

      categories.value = categories.value.filter(c => c.id !== Number(id))
      return true
    } catch (err) {
      console.error(err)
      throw new Error('Gagal menghapus kategori aset')
    }
  }

  return {
    categories,
    category,
    fetchAll,
    fetchById,
    create,
    update,
    remove,
    loading,
    error,
  }
}
