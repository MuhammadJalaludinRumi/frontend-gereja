import { ref } from 'vue'
import { useApiUrl } from './useApiUrl'
import { useCookie, useRuntimeConfig } from '#app'

export interface AssetMaintenance {
  id?: number
  asset_id: number
  maintenance_date: string
  description?: string | null
  cost: number
  performed_by: string
  next_maintenance_date?: string | null
  created_by?: number
}

export const useAssetMaintenances = () => {
  const apiBase = useApiUrl()

  const maintenances = ref<AssetMaintenance[]>([])
  const maintenance = ref<AssetMaintenance | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const config = useRuntimeConfig()
  const isProd = config.public.sessionSecureCookie === 'true'

  const xsrfToken = useCookie('XSRF-TOKEN').value
  const token = useCookie('token').value

  // ⬇️ user login (biasanya diset saat login)
  const user = useCookie<any>('user').value

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

  // =========================
  // GET ALL
  // =========================
  const fetchAll = async () => {
    loading.value = true
    error.value = null

    try {
      const res = await $fetch('/asset-maintenance', {
        baseURL: apiBase,
        headers: getHeaders(),
        credentials: 'include'
      })

      maintenances.value = res
    } catch (err) {
      console.error(err)
      error.value = 'Gagal memuat data maintenance'
    } finally {
      loading.value = false
    }
  }

  // =========================
  // GET ONE
  // =========================
  const fetchById = async (id: number | string) => {
    loading.value = true
    error.value = null

    try {
      const res = await $fetch(`/asset-maintenance/${id}`, {
        baseURL: apiBase,
        headers: getHeaders(),
        credentials: 'include'
      })

      maintenance.value = res
    } catch (err) {
      console.error(err)
      maintenance.value = null
      error.value = 'Gagal memuat detail maintenance'
    } finally {
      loading.value = false
    }
  }

  // =========================
  // CREATE
  // =========================
  const create = async (payload: Record<string, any>) => {
    try {
      const body = {
      asset_id: Number(payload.asset_id),
      maintenance_date: payload.maintenance_date,
      description: payload.description || null,
      cost: Number(payload.cost),
      performed_by: String(payload.performed_by),
      next_maintenance_date: payload.next_maintenance_date || null,
      created_by: Number(payload.created_by), // 🔥 INI PENTING
    }

      const res = await $fetch('/asset-maintenance', {
        baseURL: apiBase,
        method: 'POST',
        headers: getHeaders(),
        credentials: 'include',
        body
      })

      maintenances.value.unshift(res)
      return res
    } catch (err: any) {
      console.error('CREATE ERROR:', err)
      throw new Error(
        err.response?._data?.message ||
        JSON.stringify(err.response?._data?.errors) ||
        'Gagal membuat data maintenance'
      )
    }
  }

  // =========================
  // UPDATE
  // =========================
  const update = async (id: number | string, payload: Record<string, any>) => {
    try {
      const body: Record<string, any> = {}

      if (payload.asset_id !== undefined)
        body.asset_id = Number(payload.asset_id)

      if (payload.maintenance_date)
        body.maintenance_date = payload.maintenance_date

      if ('description' in payload)
        body.description = payload.description || null

      if (payload.cost !== undefined)
        body.cost = Number(payload.cost)

      if (payload.performed_by !== undefined)
        body.performed_by = String(payload.performed_by)

      if ('next_maintenance_date' in payload)
        body.next_maintenance_date = payload.next_maintenance_date || null

      const res = await $fetch(`/asset-maintenance/${id}`, {
        baseURL: apiBase,
        method: 'PUT',
        headers: getHeaders(),
        credentials: 'include',
        body
      })

      const idx = maintenances.value.findIndex(m => m.id === Number(id))
      if (idx !== -1) maintenances.value[idx] = res

      return res
    } catch (err: any) {
      console.error('UPDATE ERROR:', err)
      throw new Error(
        err.response?._data?.message ||
        JSON.stringify(err.response?._data?.errors) ||
        'Gagal update maintenance'
      )
    }
  }

  // =========================
  // DELETE
  // =========================
  const remove = async (id: number | string) => {
    try {
      await $fetch(`/asset-maintenance/${id}`, {
        baseURL: apiBase,
        method: 'DELETE',
        headers: getHeaders(),
        credentials: 'include'
      })

      maintenances.value = maintenances.value.filter(
        m => m.id !== Number(id)
      )
      return true
    } catch (err) {
      console.error(err)
      throw new Error('Gagal menghapus maintenance')
    }
  }

  return {
    maintenances,
    maintenance,
    fetchAll,
    fetchById,
    create,
    update,
    remove,
    loading,
    error
  }
}
