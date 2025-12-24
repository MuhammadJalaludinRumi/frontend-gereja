// composables/useAssetMovements.ts
import { ref } from 'vue'
import { useApiUrl } from './useApiUrl'
import { useCookie, useRuntimeConfig } from '#app'

export interface AssetMovement {
  id?: number
  asset_id: number
  from_location_id: number
  to_location_id: number
  moved_by: number
  moved_at: string
  notes?: string | null
}

export const useAssetMovements = () => {
  const apiBase = useApiUrl()

  const movements = ref<AssetMovement[]>([])
  const movement = ref<AssetMovement | null>(null)
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

    if (!isFormData) {
      headers['Content-Type'] = 'application/json'
    }

    if (isProd && xsrfToken) {
      headers['X-XSRF-TOKEN'] = xsrfToken
    }

    if (!isProd && token) {
      headers['Authorization'] = `Bearer ${token}`
    }

    return headers
  }

  // =====================
  // GET ALL
  // =====================
  const fetchAll = async () => {
    loading.value = true
    error.value = null

    try {
      const res: any = await $fetch('/asset-movements', {
        baseURL: apiBase,
        headers: getHeaders(),
        credentials: 'include',
      })

      movements.value = Array.isArray(res?.data)
        ? res.data
        : Array.isArray(res)
        ? res
        : []
    } catch (err) {
      console.error(err)
      error.value = 'Gagal memuat data perpindahan aset'
    } finally {
      loading.value = false
    }
  }

  // =====================
  // GET ONE
  // =====================
  const fetchById = async (id: number | string) => {
    loading.value = true
    error.value = null

    try {
      const res: any = await $fetch(`/asset-movements/${id}`, {
        baseURL: apiBase,
        headers: getHeaders(),
        credentials: 'include',
      })

      movement.value = res?.data ?? res ?? null
    } catch (err) {
      console.error(err)
      error.value = 'Gagal memuat detail perpindahan'
      movement.value = null
    } finally {
      loading.value = false
    }
  }

  // =====================
  // CREATE
  // =====================
  const create = async (payload: Record<string, any>) => {
    try {
      const res: any = await $fetch('/asset-movements', {
        baseURL: apiBase,
        method: 'POST',
        headers: getHeaders(),
        credentials: 'include',
        body: payload,
      })

      const newData = res?.data ?? res
      if (newData) movements.value.push(newData)

      return newData
    } catch (err: any) {
      console.error('CREATE ERROR:', err)
      throw new Error(
        err?.response?._data?.message || 'Gagal membuat data asset movement'
      )
    }
  }

  // =====================
  // UPDATE
  // =====================
  const update = async (id: number | string, payload: Record<string, any>) => {
    try {
      const res: any = await $fetch(`/asset-movements/${id}`, {
        baseURL: apiBase,
        method: 'PUT',
        headers: getHeaders(),
        credentials: 'include',
        body: payload,
      })

      const updated = res?.data ?? res

      const idx = movements.value.findIndex(m => m.id === Number(id))
      if (idx !== -1 && updated) {
        movements.value[idx] = updated
      }

      return updated
    } catch (err: any) {
      console.error('UPDATE ERROR:', err)
      throw new Error(
        err?.response?._data?.message || 'Gagal mengupdate movement'
      )
    }
  }

  // =====================
  // DELETE
  // =====================
  const remove = async (id: number | string) => {
    try {
      await $fetch(`/asset-movements/${id}`, {
        baseURL: apiBase,
        method: 'DELETE',
        headers: getHeaders(),
        credentials: 'include',
      })

      movements.value = movements.value.filter(m => m.id !== Number(id))
      return true
    } catch (err) {
      console.error(err)
      throw new Error('Gagal menghapus asset movement')
    }
  }

  return {
    movements,
    movement,
    fetchAll,
    fetchById,
    create,
    update,
    remove,
    loading,
    error,
  }
}
