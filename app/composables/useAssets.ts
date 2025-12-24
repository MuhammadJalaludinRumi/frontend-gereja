import { ref } from 'vue'
import { useApiUrl } from './useApiUrl'
import { useCookie, useRuntimeConfig } from '#app'

/* =======================
 * TYPES
 * ======================= */

export interface AssetDisposal {
  id: number
  disposal_date: string
  disposal_type: 'dijual' | 'rusak' | 'hilang'
  value?: number
  notes?: string
}

export interface Asset {
  id?: number
  asset_code: string
  name: string
  category_id: number | string
  location_id: number | string
  purchase_date?: string
  purchase_price?: number
  condition: string
  vendor?: string
  notes?: string
  image?: File | string | null
  disposal?: AssetDisposal | null
}

/* =======================
 * COMPOSABLE
 * ======================= */

export const useAssets = () => {
  const apiBase = useApiUrl()

  const assets = ref<Asset[]>([])
  const asset = ref<Asset | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const config = useRuntimeConfig()
  const isProd = config.public.sessionSecureCookie === 'true'

  const xsrfToken = useCookie('XSRF-TOKEN').value
  const token = useCookie('token').value

  /* =======================
   * HEADERS
   * ======================= */

  const getHeaders = (isFormData = false): Record<string, string> => {
    const headers: Record<string, string> = {
      Accept: 'application/json',
    }

    // ❗ jangan set Content-Type kalau FormData
    if (!isFormData) {
      headers['Content-Type'] = 'application/json'
    }

    if (isProd && xsrfToken) headers['X-XSRF-TOKEN'] = xsrfToken
    if (!isProd && token) headers['Authorization'] = `Bearer ${token}`

    return headers
  }

  /* =======================
   * HELPERS
   * ======================= */

  const toFormData = (payload: Record<string, any>) => {
    const fd = new FormData()

    Object.entries(payload).forEach(([key, value]) => {
      if (value === null || value === undefined || value === '') return

      if (value instanceof File) {
        fd.append(key, value)
      } else {
        fd.append(key, String(value))
      }
    })

    return fd
  }

  /* =======================
   * FETCH
   * ======================= */

  const fetchAll = async () => {
    loading.value = true
    try {
      const res = await $fetch('/assets', {
        baseURL: apiBase,
        headers: getHeaders(),
        credentials: 'include',
      })
      assets.value = res?.data ?? res
    } finally {
      loading.value = false
    }
  }

  const fetchById = async (id: number | string) => {
    loading.value = true
    try {
      const res = await $fetch(`/assets/${id}`, {
        baseURL: apiBase,
        headers: getHeaders(),
        credentials: 'include',
      })
      asset.value = res?.data ?? res
    } finally {
      loading.value = false
    }
  }

  /* =======================
   * CREATE
   * ======================= */

  const create = async (payload: Omit<Asset, 'id' | 'disposal'>) => {
    try {
      const formData = toFormData(payload)

      const res = await $fetch('/assets', {
        baseURL: apiBase,
        method: 'POST',
        headers: getHeaders(true),
        credentials: 'include',
        body: formData,
      })

      const newData = res?.data ?? res
      assets.value.push(newData)
      return newData
    } catch (err: any) {
      throw new Error(
        err.response?._data?.message || 'Gagal membuat asset'
      )
    }
  }

  /* =======================
   * UPDATE
   * ======================= */

  const update = async (
    id: number | string,
    payload: Partial<Omit<Asset, 'id' | 'disposal'>>
  ) => {
    try {
      const formData = toFormData(payload)
      formData.append('_method', 'PUT')

      const res = await $fetch(`/assets/${id}`, {
        baseURL: apiBase,
        method: 'POST', // Laravel upload friendly
        headers: getHeaders(true),
        credentials: 'include',
        body: formData,
      })

      const updated = res?.data ?? res
      const idx = assets.value.findIndex(a => a.id === Number(id))
      if (idx !== -1) assets.value[idx] = updated

      return updated
    } catch (err: any) {
      throw new Error(
        err.response?._data?.message || 'Gagal update asset'
      )
    }
  }

  /* =======================
   * DELETE
   * ======================= */

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
    } catch (err: any) {
      throw new Error(
        err.response?._data?.message ||
        'Asset tidak bisa dihapus karena punya riwayat'
      )
    }
  }

  return {
    assets,
    asset,
    loading,
    error,
    fetchAll,
    fetchById,
    create,
    update,
    remove,
  }
}
