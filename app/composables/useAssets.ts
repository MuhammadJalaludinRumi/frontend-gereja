import { ref } from 'vue'
import { useApiUrl } from './useApiUrl'
import { useCookie, useRuntimeConfig } from '#app'

export interface Asset {
  id?: number
  asset_code: string
  name: string
  category_id: number | string
  location_id: number | string
  purchase_date?: string
  purchase_price?: number
  condition: string
  status: string
  vendor?: string
  notes?: string
}

export const useAssets = () => {
  const apiBase = useApiUrl()
  const assets = ref<Asset[]>([])
  const asset = ref<Asset | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Runtime config
  const config = useRuntimeConfig()
  const isProd = config.public.sessionSecureCookie === 'true'

  // Token
  const xsrfToken = useCookie('XSRF-TOKEN').value
  const token = useCookie('token').value

  const getHeaders = (isFormData = false): Record<string, string> => {
    const headers: Record<string, string> = {
      Accept: 'application/json'
    }
    if (!isFormData) headers['Content-Type'] = 'application/json'
    if (isProd && xsrfToken) headers['X-XSRF-TOKEN'] = xsrfToken
    if (!isProd && token) headers['Authorization'] = `Bearer ${token}`
    return headers
  }

  // Fetch ALL
  const fetchAll = async () => {
    loading.value = true
    error.value = null
    try {
      const res = await $fetch('/assets', {
        baseURL: apiBase,
        headers: getHeaders(),
        credentials: 'include',
      })
      assets.value = res?.data ?? res
    } catch (err) {
      error.value = 'Gagal memuat data asset'
      console.error(err)
    } finally {
      loading.value = false
    }
  }

  // Fetch by ID
  const fetchById = async (id: number | string) => {
    loading.value = true
    error.value = null
    try {
      const res = await $fetch(`/assets/${id}`, {
        baseURL: apiBase,
        headers: getHeaders(),
        credentials: 'include',
      })
      asset.value = res?.data ?? res
    } catch (err) {
      error.value = 'Gagal memuat data asset'
      asset.value = null
      console.error(err)
    } finally {
      loading.value = false
    }
  }

  // Create
  const create = async (payload: Record<string, any>) => {
    try {
      const res = await $fetch('/assets', {
        baseURL: apiBase,
        method: 'POST',
        headers: getHeaders(),
        credentials: 'include',
        body: payload,
      })

      const newData = res?.data ?? res
      assets.value.push(newData)
      return newData
    } catch (err: any) {
      console.error('❌ CREATE ASSET ERROR:', err)
      throw new Error(err.response?._data?.message || 'Gagal membuat asset')
    }
  }

  // Update
  const update = async (id: number | string, payload: Record<string, any>) => {
    try {
      const res = await $fetch(`/assets/${id}`, {
        baseURL: apiBase,
        method: 'PUT',
        headers: getHeaders(),
        credentials: 'include',
        body: payload,
      })

      const updated = res?.data ?? res
      const idx = assets.value.findIndex(a => a.id === Number(id))
      if (idx !== -1) assets.value[idx] = updated
      return updated
    } catch (err: any) {
      console.error('❌ UPDATE ASSET ERROR:', err)
      throw new Error(err.response?._data?.message || 'Gagal memperbarui asset')
    }
  }

  // Delete
  const remove = async (id: number | string) => {
    try {
      await $fetch(`/assets/${id}`, {
        baseURL: apiBase,
        method: 'DELETE',
        headers: getHeaders(),
        credentials: 'include',
      })

      assets.value = assets.value.filter(a => a.id !== Number(id))
      return true
    } catch (err) {
      console.error(err)
      throw new Error('Gagal menghapus asset')
    }
  }

  return {
    assets,
    asset,
    fetchAll,
    fetchById,
    create,
    update,
    remove,
    loading,
    error
  }
}
