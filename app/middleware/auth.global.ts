// middleware/auth.global.ts
export default defineNuxtRouteMiddleware(async (to) => {
  console.log('[auth.global] jalan di route:', to.path)

  if (to.path === '/login') return

  const { fetchUser, isLoggedIn, token } = useAuth()
  const isProd = process.env.NODE_ENV === 'production'

  // Kalau ga ada token di dev, langsung redirect
  if (!isProd && !token.value) {
    console.log('[auth.global] tidak ada Bearer token di dev, redirect ke login')
    return navigateTo('/login')
  }

  try {
    if (!isLoggedIn.value) {
      console.log('[auth.global] fetch user...')
      const user = await fetchUser()

      if (!user || !user.is_active) {
        console.log('[auth.global] user tidak valid atau tidak aktif, redirect ke login')
        return navigateTo('/login')
      }
    }

    console.log('[auth.global] user authenticated, role_id:', useAuth().user.value?.role_id)
  } catch (err: any) {
    console.log('[auth.global] error fetch user, redirect ke login', err)
    return navigateTo('/login')
  }
})
//
