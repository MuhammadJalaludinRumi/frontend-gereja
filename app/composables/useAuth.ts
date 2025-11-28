import { ref, readonly, computed } from 'vue'
import { useCookie } from '#app'
import { useApiUrl } from './useApiUrl'
import { navigateTo } from '#app'

export const useAuth = () => {
  const apiBase = useApiUrl()
  const isProd = process.env.NODE_ENV === 'production'
  const token = useCookie('token', { secure: false, sameSite: 'lax', maxAge: 60 * 60 * 24 * 7 })
  const user = useState<any>('auth_user', () => null)
  const sanctumBase = useSanctumUrl()

  const login = async (username: string, password: string) => {
    if (isProd) {
      await $fetch('/sanctum/csrf-cookie', { baseURL: sanctumBase, credentials: 'include' })

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
      const headers: Record<string, string> = { Accept: 'application/json' }
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

  // ==========================
  // 1. REQUEST OTP (send email)
  // ==========================
  const requestPasswordReset = async (email: string) => {
    return await $fetch('/users/send-otp', {
      baseURL: apiBase,
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: { email }
    })
  }

  // ==========================
  // 2. VERIFY OTP
  // ==========================
  const verifyOtp = async (tokenValue: string, otp: string) => {
    return await $fetch('/users/verify-otp', {
      baseURL: apiBase,
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: { token: tokenValue, otp }
    })
  }

  // ==========================
  // 3. RESET PASSWORD
  // ==========================
  const resetPassword = async (tokenValue: string, otp: string, password: string) => {
    return await $fetch('/users/reset-password', {
      baseURL: apiBase,
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: { token: tokenValue, otp, password }
    })
  }

  const logout = async () => {
    try {
      await $fetch('/logout', {
        baseURL: apiBase,
        method: 'POST',
        credentials: isProd ? 'include' : undefined,
        headers: !isProd && token.value ? { 'Authorization': `Bearer ${token.value}` } : undefined
      })
    } catch { }

    token.value = null
    user.value = null
    return navigateTo('/login')
  }

  const isLoggedIn = computed(() => !!user.value && user.value?.is_active)

  return {
    user: readonly(user),
    token: readonly(token),
    isLoggedIn,

    login,
    fetchUser,

    // reset password flow
    requestPasswordReset,
    verifyOtp,
    resetPassword,

    logout
  }
}
