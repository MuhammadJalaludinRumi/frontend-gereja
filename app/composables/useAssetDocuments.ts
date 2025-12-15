// composables/useAssetDocuments.ts
import { ref } from 'vue'
import { useApiUrl } from './useApiUrl'
import { useCookie, useRuntimeConfig } from '#app'

export interface AssetDocument {
  id?: number
  asset_id: number
  type: 'invoice' | 'warranty' | 'photo' | 'other'
  file_path?: string | null
  description?: string | null
  created_at?: string
}

export const useAssetDocuments = () => {
  const apiBase = useApiUrl()
  const documents = ref<AssetDocument[]>([])
  const document = ref<AssetDocument | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const token = useCookie('token').value

  // FIX: selalu kirim Authorization kalo token ada
  const getHeaders = (isFormData = false): Record<string, string> => {
    const headers: Record<string, string> = {
      Accept: 'application/json',
    }

    if (!isFormData) headers['Content-Type'] = 'application/json'
    if (token) headers['Authorization'] = `Bearer ${token}`

    return headers
  }

  // Fetch All
  const fetchAll = async () => {
    loading.value = true
    error.value = null
    try {
      const res = await $fetch('/asset-documents', {
        baseURL: apiBase,
        headers: getHeaders(),
        credentials: 'include',
      })
      documents.value = res?.data ?? res
    } catch (err) {
      console.error(err)
      error.value = 'Gagal memuat data asset documents'
    } finally {
      loading.value = false
    }
  }

  // Fetch by ID
  const fetchById = async (id: number | string) => {
    loading.value = true
    error.value = null
    try {
      const res = await $fetch(`/asset-documents/${id}`, {
        baseURL: apiBase,
        headers: getHeaders(),
        credentials: 'include',
      })
      document.value = res?.data ?? res
      return document.value
    } catch (err) {
      console.error(err)
      error.value = 'Gagal memuat detail document'
      document.value = null
      return null
    } finally {
      loading.value = false
    }
  }

  // Create
  const create = async (payload: FormData | Record<string, any>) => {
    try {
      const isFormData = payload instanceof FormData

      const res = await $fetch('/asset-documents', {
        baseURL: apiBase,
        method: 'POST',
        headers: getHeaders(isFormData),
        credentials: 'include',
        body: payload,
      })

      const newDoc = res?.data ?? res
      documents.value.push(newDoc)
      return newDoc
    } catch (err: any) {
      console.error('❌ CREATE ERROR:', err)
      throw new Error(err.data?.message || 'Gagal membuat document')
    }
  }

  // Update
  const update = async (id: number | string, payload: FormData | Record<string, any>) => {
    try {
      const isFormData = payload instanceof FormData
      if (isFormData && !payload.has('_method')) payload.append('_method', 'PUT')

      const res = await $fetch(`/asset-documents/${id}`, {
        baseURL: apiBase,
        method: isFormData ? 'POST' : 'PUT',
        headers: getHeaders(isFormData),
        credentials: 'include',
        body: payload,
      })

      const updated = res?.data ?? res
      const idx = documents.value.findIndex(d => d.id === Number(id))
      if (idx !== -1) documents.value[idx] = updated
      return updated
    } catch (err: any) {
      console.error('❌ UPDATE ERROR:', err)
      throw new Error(err.data?.message || 'Gagal memperbarui document')
    }
  }

  // Delete
  const remove = async (id: number | string) => {
    try {
      await $fetch(`/asset-documents/${id}`, {
        baseURL: apiBase,
        method: 'DELETE',
        headers: getHeaders(),
        credentials: 'include',
      })
      documents.value = documents.value.filter(d => d.id !== Number(id))
      return true
    } catch (err) {
      console.error(err)
      throw new Error('Gagal menghapus document')
    }
  }

  return {
    documents,
    document,
    fetchAll,
    fetchById,
    create,
    update,
    remove,
    loading,
    error,
  }
}
