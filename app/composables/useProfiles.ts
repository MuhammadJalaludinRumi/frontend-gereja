// composables/useProfiles.ts
import { ref } from 'vue'
import { useApiUrl } from './useApiUrl'
import { useCookie, useRuntimeConfig } from '#app'

interface Profile {
  id?: number
  name: string
  username: string
  password?: string
}

export const useProfiles = () => {
  const apiBase = useApiUrl()
  const profile = ref<Profile | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  const successMsg = ref<string | null>(null)

  const config = useRuntimeConfig()
  const isProd = config.public.sessionSecureCookie === 'true'

  const xsrfToken = useCookie('XSRF-TOKEN').value
  const token = useCookie('token').value

  const getHeaders = (): Record<string, string> => {
    const headers: Record<string, string> = {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    }

    if (isProd && xsrfToken) headers['X-XSRF-TOKEN'] = xsrfToken
    if (!isProd && token) headers['Authorization'] = `Bearer ${token}`

    return headers
  }

  // ✅ GET profile user login
  const fetchProfile = async () => {
    loading.value = true
    error.value = null
    try {
      const res = await $fetch<Profile>('/user/profile', {
        baseURL: apiBase,
        method: 'GET',
        headers: getHeaders(),
        credentials: 'include'
      })
      profile.value = res
    } catch (err) {
      console.error('Gagal fetch profile:', err)
      error.value = 'Gagal memuat profil user'
    } finally {
      loading.value = false
    }
  }

  // ✅ PUT update profile
  const updateProfile = async (payload: Partial<Profile>) => {
    loading.value = true
    error.value = null
    successMsg.value = null

    try {
      await $fetch('/user/profile', {
        baseURL: apiBase,
        method: 'PUT',
        headers: getHeaders(),
        credentials: 'include',
        body: payload
      })
      await fetchProfile()
      successMsg.value = 'Profil berhasil diperbarui 🎉'
    } catch (err: any) {
      console.error('Gagal update profile:', err)
      error.value = err?.data?.message || 'Gagal memperbarui profil 😭'
    } finally {
      loading.value = false
    }
  }

  return {
    profile,
    loading,
    error,
    successMsg,
    fetchProfile,
    updateProfile
  }
}
