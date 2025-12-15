import { ref } from 'vue'
import { useApiUrl } from './useApiUrl'
import { useRuntimeConfig, useCookie } from '#app'

export interface AssetImage {
  id?: number
  asset_id: number | string
  file_url: string
  description?: string
}

export const useAssetImages = () => {
  const apiBase = useApiUrl()

  const images = ref<AssetImage[]>([])
  const image = ref<AssetImage | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  // AUTH
  const config = useRuntimeConfig()
  const isProd = config.public.sessionSecureCookie === 'true'
  const xsrfToken = useCookie('XSRF-TOKEN').value
  const token = useCookie('token').value

  const getHeaders = (): Record<string, string> => {
    const h: Record<string, string> = {}
    if (isProd && xsrfToken) h['X-XSRF-TOKEN'] = xsrfToken
    if (!isProd && token) h['Authorization'] = `Bearer ${token}`
    return h
  }

  const fetchAll = async () => {
    loading.value = true
    try {
      const res = await $fetch('/asset-images', {
        baseURL: apiBase,
        credentials: 'include',
        headers: getHeaders(),
      })
      images.value = res?.data ?? res
    } catch (err) {
      console.error(err)
      error.value = 'Gagal memuat data gambar'
    } finally {
      loading.value = false
    }
  }

  // GET ALL IMAGES BY ASSET
  const fetchByAsset = async (assetId: number | string) => {
    loading.value = true
    try {
      const res = await $fetch(`/asset-images/${assetId}`, {
        baseURL: apiBase,
        credentials: 'include',
        headers: getHeaders(),
      })
      images.value = res?.data ?? res
    } catch (err) {
      console.error(err)
      error.value = 'Gagal memuat gambar aset'
    } finally {
      loading.value = false
    }
  }

  // CREATE
  const create = async (payload: FormData) => {
    try {
      const res = await $fetch('/asset-images', {
        baseURL: apiBase,
        method: 'POST',
        headers: getHeaders(), // jangan pakai content-type, biar FormData auto set
        body: payload,
        credentials: 'include',
      })
      const data = res?.data ?? res
      images.value.push(data)
      return data
    } catch (err: any) {
      throw new Error(err.response?._data?.message || 'Gagal menambah gambar')
    }
  }

  // UPDATE (description atau relasi)
  const update = async (id: number | string, payload: Partial<AssetImage>) => {
    try {
      const res = await $fetch(`/asset-images/${id}`, {
        baseURL: apiBase,
        method: 'PUT',
        headers: { ...getHeaders(), 'Content-Type': 'application/json' },
        body: payload,
        credentials: 'include',
      })
      const updated = res?.data ?? res
      const idx = images.value.findIndex(i => i.id === Number(id))
      if (idx !== -1) images.value[idx] = updated
      return updated
    } catch (err: any) {
      throw new Error(err.response?._data?.message || 'Gagal update gambar')
    }
  }

  // DELETE
  const remove = async (id: number | string) => {
    try {
      await $fetch(`/asset-images/${id}`, {
        baseURL: apiBase,
        method: 'DELETE',
        headers: getHeaders(),
        credentials: 'include',
      })
      images.value = images.value.filter(i => i.id !== Number(id))
    } catch {
      throw new Error('Gagal menghapus gambar')
    }
  }

  return {
    images,
    image,
    fetchByAsset,
    fetchAll,
    create,
    update,
    remove,
    loading,
    error
  }
}
