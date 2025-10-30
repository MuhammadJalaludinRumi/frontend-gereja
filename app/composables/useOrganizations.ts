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

  // Token
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
      const res = await $fetch('/organizations', {
        baseURL: apiBase,
        headers: getHeaders(),
        credentials: 'include',
      })
      organizations.value = res?.data ?? res
    } catch (err) {
      error.value = 'Gagal memuat data organisasi'
      console.error(err)
    } finally {
      loading.value = false
    }
  }

  // 🔹 Fetch By ID - ✅ FIX: template literal syntax error
  const fetchById = async (id: number | string) => {
    loading.value = true
    error.value = null
    try {
      const res = await $fetch(`/organizations/${id}`, { // ✅ FIX: pakai (), bukan backtick
        baseURL: apiBase,
        headers: getHeaders(),
        credentials: 'include',
      })
      organization.value = res?.data ?? res
    } catch (err) {
      error.value = 'Gagal memuat data organisasi'
      organization.value = null
      console.error(err)
    } finally {
      loading.value = false
    }
  }

  // 🔹 Create - ✅ FIX: better error handling
  const create = async (payload: FormData | Record<string, any>) => {
    try {
      const isFormData = payload instanceof FormData

      // 🔍 Debug: log payload
      if (isFormData) {
        console.log('📤 Sending FormData:')
        for (let [key, value] of (payload as FormData).entries()) {
          console.log(`  ${key}:`, value)
        }
      }

      const res = await $fetch('/organizations', {
        baseURL: apiBase,
        method: 'POST',
        headers: getHeaders(isFormData),
        credentials: 'include',
        body: payload,
      })

      const newOrg = res?.data ?? res
      organizations.value.push(newOrg)
      return newOrg
    } catch (err: any) {
      console.error('❌ CREATE ERROR:', err)

      // Extract detailed error message
      let errorMessage = 'Gagal membuat organisasi'

      if (err.response?._data) {
        const data = err.response._data
        console.error('Backend response:', data)

        if (data.message) {
          errorMessage = data.message
        } else if (data.errors) {
          // Laravel validation errors
          const errors = Object.entries(data.errors)
            .map(([field, msgs]: [string, any]) => `${field}: ${Array.isArray(msgs) ? msgs.join(', ') : msgs}`)
            .join('\n')
          errorMessage = `Validation Error:\n${errors}`
        }
      } else if (err.data?.message) {
        errorMessage = err.data.message
      }

      throw new Error(errorMessage)
    }
  }

  // 🔹 Update - ✅ FIX: template literal syntax
  const update = async (id: number | string, payload: FormData | Record<string, any>) => {
    try {
      const isFormData = payload instanceof FormData
      if (isFormData && !payload.has('_method')) payload.append('_method', 'PUT')

      const res = await $fetch(`/organizations/${id}`, { // ✅ FIX
        baseURL: apiBase,
        method: isFormData ? 'POST' : 'PUT',
        headers: getHeaders(isFormData),
        credentials: 'include',
        body: payload,
      })

      const updated = res?.data ?? res
      const idx = organizations.value.findIndex(o => o.id === Number(id))
      if (idx !== -1) organizations.value[idx] = updated

      return updated
    } catch (err: any) {
      console.error('❌ UPDATE ERROR:', err)

      let errorMessage = 'Gagal memperbarui organisasi'
      if (err.response?._data?.message) {
        errorMessage = err.response._data.message
      }

      throw new Error(errorMessage)
    }
  }

  // 🔹 Delete - ✅ FIX: template literal syntax
  const remove = async (id: number | string) => {
    try {
      await $fetch(`/organizations/${id}`, { // ✅ FIX
        baseURL: apiBase,
        method: 'DELETE',
        headers: getHeaders(),
        credentials: 'include',
      })

      organizations.value = organizations.value.filter(o => o.id !== Number(id))
      return true
    } catch (err) {
      console.error(err)
      throw new Error('Gagal menghapus organisasi')
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
    error,
  }
}
