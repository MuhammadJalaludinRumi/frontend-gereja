// composables/useOrganizations.ts
import { ref } from 'vue'
import { useApiUrl } from './useApiUrl'
import { useCookie, useRuntimeConfig } from '#app'

export interface Organization {
  id?: number
  name: string
  abbreviation?: string
  address?: string
  city?: string | number
  latitude?: number
  longitude?: number
  phone?: string
  email?: string
  group_id?: string | number
  website?: string
  logo?: string
  founded?: string
  legal?: string
}

export const useOrganizations = () => {
  const apiBase = useApiUrl()
  const organizations = ref<Organization[]>([])
  const organization = ref<Organization | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const config = useRuntimeConfig()
  const isProd = config.public.sessionSecureCookie === 'true'

  const xsrfToken = useCookie('XSRF-TOKEN').value
  const token = useCookie('token').value

  const getHeaders = (isFormData = false): Record<string, string> => {
    const headers: Record<string, string> = { Accept: 'application/json' }
    if (!isFormData) headers['Content-Type'] = 'application/json'
    if (xsrfToken) headers['X-XSRF-TOKEN'] = xsrfToken
    if (!isProd && token) headers['Authorization'] = `Bearer ${token}`
    return headers
  }

  // 🔹 Ambil semua organizations
  const fetchAll = async () => {
    loading.value = true
    error.value = null
    try {
      const res = await $fetch('/organizations', {
        baseURL: apiBase,
        headers: getHeaders(),
        credentials: 'include',
      })
      // cek kalau ada wrapper data
      organizations.value = res?.data ?? res
    } catch (err) {
      console.error(err)
      error.value = 'Gagal memuat data organizations'
    } finally {
      loading.value = false
    }
  }

  // 🔹 Ambil per ID
  const fetchById = async (id: number | string) => {
    loading.value = true
    error.value = null
    try {
      const res = await $fetch(`/organizations/${id}`, {
        baseURL: apiBase,
        headers: getHeaders(),
        credentials: 'include',
      })
      // Laravel Resource biasanya bungkus data
      organization.value = res?.data ?? res
      return organization.value
    } catch (err) {
      console.error(err)
      error.value = 'Gagal memuat organization'
      organization.value = null
      return null
    } finally {
      loading.value = false
    }
  }

  // 🔹 Create
  const create = async (payload: FormData | Record<string, any>) => {
    loading.value = true
    try {
      const isFormData = payload instanceof FormData
      const res = await $fetch('/organizations', {
        baseURL: apiBase,
        method: 'POST',
        headers: getHeaders(isFormData),
        credentials: 'include',
        body: payload,
      })
      organizations.value.push(res?.data ?? res)
      return res?.data ?? res
    } catch (err) {
      console.error(err)
      throw new Error('Gagal membuat organization')
    } finally {
      loading.value = false
    }
  }

  // 🔹 Update
  const update = async (id: number | string, payload: FormData | Record<string, any>) => {
    loading.value = true
    try {
      const isFormData = payload instanceof FormData
      if (isFormData && !payload.has('_method')) payload.append('_method', 'PUT') // pastiin PUT
      const res = await $fetch(`/organizations/${id}`, {
        baseURL: apiBase,
        method: isFormData ? 'POST' : 'PUT',
        headers: getHeaders(isFormData),
        credentials: 'include',
        body: payload,
      })
      // update di local array
      const updated = res?.data ?? res
      const index = organizations.value.findIndex(o => o.id === Number(id))
      if (index !== -1) organizations.value[index] = updated
      // update reactive single organization
      organization.value = updated
      return updated
    } catch (err) {
      console.error(err)
      throw new Error('Gagal memperbarui organization')
    } finally {
      loading.value = false
    }
  }

  // 🔹 Delete
  const remove = async (id: number | string) => {
    loading.value = true
    try {
      await $fetch(`/organizations/${id}`, {
        baseURL: apiBase,
        method: 'DELETE',
        headers: getHeaders(),
        credentials: 'include',
      })
      organizations.value = organizations.value.filter(o => o.id !== Number(id))
      if (organization.value?.id === Number(id)) organization.value = null
    } catch (err) {
      console.error(err)
      throw new Error('Gagal menghapus organization')
    } finally {
      loading.value = false
    }
  }

  return {
    organizations,
    organization,
    fetchAll,
    fetchById,
    create,
    update,
    remove,
    loading,
    error
  }
}
