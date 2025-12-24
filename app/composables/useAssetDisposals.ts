import { ref } from 'vue'
import { useApiUrl } from './useApiUrl'
import { useCookie, useRuntimeConfig } from '#app'

export interface AssetDisposal {
  id?: number
  asset_id: number
  disposal_date: string
  disposal_type: 'dijual' | 'rusak' | 'hilang'
  value: number
  notes?: string | null
}

export const useAssetDisposals = () => {
  const apiBase = useApiUrl()

  const disposals = ref<AssetDisposal[]>([])
  const disposal = ref<AssetDisposal | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const config = useRuntimeConfig()
  const isProd = config.public.sessionSecureCookie === 'true'

  const xsrfToken = useCookie('XSRF-TOKEN').value
  const token = useCookie('token').value

  const getHeaders = (isFormData = false): Record<string, string> => {
    const headers: Record<string, string> = {
      Accept: 'application/json',
    }

    if (!isFormData) headers['Content-Type'] = 'application/json'
    if (isProd && xsrfToken) headers['X-XSRF-TOKEN'] = xsrfToken
    if (!isProd && token) headers['Authorization'] = `Bearer ${token}`

    return headers
  }

  // ==========================
  // GET ALL
  // ==========================
  const fetchAll = async () => {
    loading.value = true
    error.value = null

    try {
      const res: any = await $fetch('/asset-disposals', {
        baseURL: apiBase,
        headers: getHeaders(),
        credentials: 'include',
      })

      disposals.value = Array.isArray(res?.data)
        ? res.data
        : Array.isArray(res)
        ? res
        : []
    } catch (err) {
      console.error(err)
      error.value = 'Gagal memuat data disposal'
    } finally {
      loading.value = false
    }
  }

  // ==========================
  // GET ONE
  // ==========================
  const getOne = async (id: number | string) => {
    loading.value = true
    error.value = null

    try {
      const res: any = await $fetch(`/asset-disposals/${id}`, {
        baseURL: apiBase,
        headers: getHeaders(),
        credentials: 'include',
      })

      const data = res?.data ?? res ?? null
      disposal.value = data
      return data
    } catch (err) {
      console.error(err)
      error.value = 'Gagal memuat detail disposal'
      disposal.value = null
      return null
    } finally {
      loading.value = false
    }
  }

  // ==========================
  // CREATE
  // ==========================
  const create = async (payload: Record<string, any>) => {
    try {
      const res: any = await $fetch('/asset-disposals', {
        baseURL: apiBase,
        method: 'POST',
        headers: getHeaders(),
        credentials: 'include',
        body: payload,
      })

      const newData = res?.data ?? res
      if (newData) disposals.value.push(newData)

      return newData
    } catch (err: any) {
      console.error('CREATE ERROR:', err)
      throw new Error(
        err?.response?._data?.message || 'Gagal membuat disposal'
      )
    }
  }

  // ==========================
  // UPDATE
  // ==========================
  const update = async (id: number | string, payload: Record<string, any>) => {
    try {
      const res: any = await $fetch(`/asset-disposals/${id}`, {
        baseURL: apiBase,
        method: 'PUT',
        headers: getHeaders(),
        credentials: 'include',
        body: payload,
      })

      const updated = res?.data ?? res
      const idx = disposals.value.findIndex(d => d.id === Number(id))
      if (idx !== -1 && updated) {
        disposals.value[idx] = updated
      }

      return updated
    } catch (err: any) {
      console.error('UPDATE ERROR:', err)
      throw new Error(
        err?.response?._data?.message || 'Gagal update disposal'
      )
    }
  }

  // ==========================
  // DELETE
  // ==========================
  const remove = async (id: number | string) => {
    try {
      await $fetch(`/asset-disposals/${id}`, {
        baseURL: apiBase,
        method: 'DELETE',
        headers: getHeaders(),
        credentials: 'include',
      })

      disposals.value = disposals.value.filter(d => d.id !== Number(id))
      return true
    } catch (err) {
      console.error(err)
      throw new Error('Gagal hapus disposal')
    }
  }

  return {
    disposals,
    disposal,
    fetchAll,
    getOne,
    create,
    update,
    remove,
    loading,
    error,
  }
}
