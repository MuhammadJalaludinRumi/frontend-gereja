// composables/useOrganizationLicenses.ts
import { ref } from 'vue'
import { useApiUrl } from './useApiUrl'
import { useCookie, useRuntimeConfig } from '#app'

export interface OrganizationLicense {
  id?: number
  organization_id?: number
  license_id?: number
  max_member?: number
  is_active?: boolean
  expiry?: string
  organization_name?: string
  license_name?: string
}

export const useOrganizationLicenses = () => {
  const apiBase = useApiUrl()
  const orgLicenses = ref<OrganizationLicense[]>([])
  const orgLicense = ref<OrganizationLicense | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const config = useRuntimeConfig()
  const isProd = config.public.sessionSecureCookie === 'true'

  const xsrfToken = useCookie('XSRF-TOKEN').value
  const token = useCookie('token').value

  const getHeaders = (): Record<string, string> => {
    const headers: Record<string, string> = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    }
    if (isProd && xsrfToken) headers['X-XSRF-TOKEN'] = xsrfToken
    if (!isProd && token) headers['Authorization'] = `Bearer ${token}`
    return headers
  }

  // 🔹 Ambil semua organization licenses
  const fetchAll = async (): Promise<OrganizationLicense[]> => {
    loading.value = true
    error.value = null
    try {
      const res = await $fetch('/organization-licenses', {
        baseURL: apiBase,
        headers: getHeaders(),
        credentials: 'include',
      })
      orgLicenses.value = res
      return res
    } catch (err) {
      error.value = 'Gagal memuat data organization licenses'
      console.error(err)
      orgLicenses.value = []
      return []
    } finally {
      loading.value = false
    }
  }

  // 🔹 Ambil per ID
  const fetchById = async (id: number): Promise<OrganizationLicense | null> => {
    loading.value = true
    error.value = null
    try {
      const res = await $fetch(`/organization-licenses/${id}`, {
        baseURL: apiBase,
        headers: getHeaders(),
        credentials: 'include',
      })
      orgLicense.value = res
      return res
    } catch (err) {
      error.value = 'Gagal memuat data organization license'
      console.error(err)
      orgLicense.value = null
      return null
    } finally {
      loading.value = false
    }
  }

  // 🔹 Create
  const create = async (payload: any): Promise<OrganizationLicense> => {
    loading.value = true
    try {
      const res = await $fetch('/organization-licenses', {
        baseURL: apiBase,
        method: 'POST',
        headers: getHeaders(),
        credentials: 'include',
        body: payload,
      })
      orgLicenses.value.push(res)
      return res
    } catch (err) {
      console.error(err)
      throw new Error('Gagal membuat organization license')
    } finally {
      loading.value = false
    }
  }

  // 🔹 Update
  const update = async (id: number, payload: any): Promise<OrganizationLicense> => {
    loading.value = true
    try {
      const res = await $fetch(`/organization-licenses/${id}`, {
        baseURL: apiBase,
        method: 'PUT',
        headers: getHeaders(),
        credentials: 'include',
        body: payload,
      })
      const index = orgLicenses.value.findIndex(l => l.id === id)
      if (index !== -1) orgLicenses.value[index] = res
      return res
    } catch (err) {
      console.error(err)
      throw new Error('Gagal memperbarui organization license')
    } finally {
      loading.value = false
    }
  }

  // 🔹 Delete
  const remove = async (id: number): Promise<void> => {
    loading.value = true
    try {
      await $fetch(`/organization-licenses/${id}`, {
        baseURL: apiBase,
        method: 'DELETE',
        headers: getHeaders(),
        credentials: 'include',
      })
      orgLicenses.value = orgLicenses.value.filter(l => l.id !== id)
    } catch (err) {
      console.error(err)
      throw new Error('Gagal menghapus organization license')
    } finally {
      loading.value = false
    }
  }

  return {
    orgLicenses,
    orgLicense,
    fetchAll,
    fetchById,
    create,
    update,
    remove,
    loading,
    error,
  }
}
