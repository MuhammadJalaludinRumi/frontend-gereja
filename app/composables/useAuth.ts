// composables/useAuth.ts
export const useAuth = () => {
  const isProd = process.env.NODE_ENV === 'production'
  const user = ref(null)
  const token = useCookie('token', {
    secure: isProd,
    sameSite: isProd ? 'none' : 'lax',
    maxAge: 60 * 60 * 24 * 7
  })

  const login = async (username: string, password: string) => {
    try {
      const response = await $fetch<{ token: string, user: any }>('/api/login', {
        method: 'POST',
        baseURL: 'http://gkpawiligar.org',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: { username, password },
        credentials: 'include' // ganti email jadi username
      })

      // Save token
      token.value = response.token
      user.value = response.user

      return response
    } catch (error: any) {
      console.error('Login error:', error)
      throw new Error(error?.data?.message || 'Login failed')
    }
  }

  const logout = () => {
    token.value = null
    user.value = null
    return navigateTo('/login')
  }

  const fetchUser = async () => {
    if (!token.value) return null

    try {
      const userData = await $fetch('/api/me', {
        baseURL: 'http://localhost:8000',
        headers: {
          'Authorization': `Bearer ${token.value}`,
          'Accept': 'application/json'
        }
      })

      user.value = userData.user || userData
      return user.value
    } catch (error) {
      console.error('Fetch user error:', error)
      // Clear invalid token
      token.value = null
      user.value = null
      return null
    }
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
    logout,
    fetchUser
  }
}
