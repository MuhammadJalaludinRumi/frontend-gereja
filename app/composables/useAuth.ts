// composables/useAuth.ts
import { ref, readonly, computed } from 'vue'
import { useCookie } from '#app'
import { useApiUrl } from './useApiUrl'

export const useAuth = () => {
  const apiBase = useApiUrl()
  const isProd = process.env.NODE_ENV === 'production'

  const user = ref<any>(null)
  const token = useCookie('token', {
    secure: isProd ? import.meta.env.SESSION_SECURE_COOKIE === 'true' : false,
    sameSite: import.meta.env.SESSION_SAME_SITE || (isProd ? 'lax' : 'lax'),
    maxAge: 60 * 60 * 24 * 7
  })

  const login = async (username: string, password: string) => {
    try {
      const response = await $fetch<{ token: string; user: any }>('/login', {
        baseURL: apiBase,
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: { username, password },
        credentials: 'include'
      })
      token.value = response.token
      user.value = response.user
      return response
    } catch (error: any) {
      console.error('Login error:', error)
      throw new Error(error?.data?.message || 'Login failed')
    }
  }

  const fetchUser = async () => {
    if (!token.value) return null
    try {
      const userData = await $fetch('/me', {
        baseURL: apiBase,
        headers: {
          Authorization: `Bearer ${token.value}`,
          Accept: 'application/json'
        },
        credentials: 'include'
      })
      user.value = userData.user || userData
      return user.value
    } catch (error) {
      console.error('Fetch user error:', error)
      token.value = null
      user.value = null
      return null
    }
  }

  const logout = async () => {
    try {
      await $fetch('/logout', { baseURL: apiBase, method: 'POST', credentials: 'include' })
    } catch (err) {
      console.warn('Logout API error, tetap clear token')
    }
    token.value = null
    user.value = null
    return navigateTo('/login')
  }

  const isLoggedIn = computed(() => !!token.value && !!user.value && user.value?.is_active)
  const isSuperAdmin = computed(() => user.value?.role_id === 1)
  const isActive = computed(() => user.value?.is_active === 1)

  return {
    user: readonly(user),
    token: readonly(token),
    isLoggedIn,
    isSuperAdmin,
    isActive,
    login,
    fetchUser,
    logout
  }
}
