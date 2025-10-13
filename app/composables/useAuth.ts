// composables/useAuth.ts
import { ref, readonly, computed, watch } from 'vue'
import { useCookie } from '#app'
import { useApiUrl } from './useApiUrl'

export const useAuth = () => {
  const apiBase = useApiUrl() // ambil baseURL dari config
  const isProd = process.env.NODE_ENV === 'production'

  const user = ref<any>(null)

  // cookie dev-friendly
  const tokenCookie = useCookie('token', {
    secure: false, // dev-safe
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7
  })

  // fallback ke localStorage kalau cookie kosong
  const token = ref<string>(tokenCookie.value || localStorage.getItem('token') || '')

  // sync token ke cookie & localStorage setiap berubah
  watch(token, (t) => {
    tokenCookie.value = t || null
    if (t) localStorage.setItem('token', t)
    else localStorage.removeItem('token')
  })

  const setToken = (t: string | null) => {
    token.value = t || ''
  }

  const login = async (username: string, password: string) => {
    try {
      const response = await $fetch<{ token: string; user: any }>('/login', {
        baseURL: apiBase,
        method: 'POST',
        headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
        body: { username, password },
        credentials: 'include'
      })

      setToken(response.token)
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
        headers: { Authorization: `Bearer ${token.value}`, Accept: 'application/json' },
        credentials: 'include'
      })
      user.value = userData.user || userData
      return user.value
    } catch (error) {
      console.error('Fetch user error:', error)
      setToken(null)
      user.value = null
      return null
    }
  }

  const logout = () => {
    setToken(null)
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
