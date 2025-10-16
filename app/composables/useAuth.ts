import { ref, readonly, computed } from 'vue'
import { useCookie } from '#app'
import { useApiUrl } from './useApiUrl'
import { navigateTo } from '#app'

export const useAuth = () => {
  const apiBase = useApiUrl()
  const isProd = process.env.NODE_ENV === 'production'
  const user = ref<any>(null)
  const token = useCookie('token', { secure: false, sameSite: 'lax', maxAge: 60*60*24*7 }) // hanya dev

  const login = async (username: string, password: string) => {
    if (isProd) {
      // fetch csrf cookie
      await $fetch('/sanctum/csrf-cookie', { baseURL: apiBase, credentials: 'include' })

      const response = await $fetch('/login', {
        baseURL: apiBase,
        method: 'POST',
        credentials: 'include',
        body: { username, password }
      })
      user.value = response.user
      return response
    } else {
      const response = await $fetch('/login', {
        baseURL: apiBase,
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: { username, password }
      })
      token.value = response.token
      user.value = response.user
      return response
    }
  }

  const fetchUser = async () => {
    try {
      const headers: Record<string,string> = { Accept: 'application/json' }
      if (!isProd && token.value) headers['Authorization'] = `Bearer ${token.value}`

      const userData = await $fetch('/me', {
        baseURL: apiBase,
        headers,
        credentials: isProd ? 'include' : undefined
      })
      user.value = userData.user || userData
      return user.value
    } catch (err) {
      token.value = null
      user.value = null
      return null
    }
  }

  const logout = async () => {
    try {
      await $fetch('/logout', {
        baseURL: apiBase,
        method: 'POST',
        credentials: isProd ? 'include' : undefined,
        headers: !isProd && token.value ? { 'Authorization': `Bearer ${token.value}` } : undefined
      })
    } catch {}
    token.value = null
    user.value = null
    return navigateTo('/login')
  }

  const isLoggedIn = computed(() => !!user.value && user.value?.is_active)
  return { user: readonly(user), token: readonly(token), isLoggedIn, login, fetchUser, logout }
}
