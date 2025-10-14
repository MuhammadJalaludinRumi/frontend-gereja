import { ref, readonly, computed } from 'vue'
import { useApiUrl, useSanctumUrl } from './useApiUrl'
import { navigateTo } from '#app'

export const useAuth = () => {
  const apiBase = useApiUrl()        // http://localhost:8000/api
  const sanctumBase = useSanctumUrl() // http://localhost:8000
  const user = ref<any>(null)

  const getCsrfCookie = async () => {
    await $fetch('/sanctum/csrf-cookie', {
      baseURL: sanctumBase,
      credentials: 'include'
    })
  }

  const login = async (username: string, password: string) => {
    await getCsrfCookie()

    const res = await $fetch('/login', {
      baseURL: apiBase,   // /api/login ✅
      method: 'POST',
      credentials: 'include',
      body: { username, password }
    })

    user.value = res.user
    return res
  }

  const fetchUser = async () => {
    try {
      const res = await $fetch('/me', {
        baseURL: apiBase,   // /api/me ✅
        credentials: 'include'
      })
      user.value = res.user || res
      return user.value
    } catch {
      user.value = null
      return null
    }
  }

  const logout = async () => {
    try {
      await $fetch('/logout', {
        baseURL: apiBase,   // /api/logout ✅
        method: 'POST',
        credentials: 'include'
      })
    } catch {}

    user.value = null
    return navigateTo('/login')
  }

  const isLoggedIn = computed(() => !!user.value)
  const isSuperAdmin = computed(() => user.value?.role_id === 1)
  const isActive = computed(() => user.value?.is_active === 1)

  return {
    user: readonly(user),
    isLoggedIn,
    isSuperAdmin,
    isActive,
    login,
    fetchUser,
    logout
  }
}
