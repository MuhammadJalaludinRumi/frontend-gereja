export default defineNuxtRouteMiddleware
  (async (to) => {
    console.log('[auth.global] jalan di route:', to.path)

    if (to.path === '/login') { return }
    const { fetchUser, isLoggedIn, token } = useAuth()

    if (!token.value) {
      console.log('[auth.global] tidak ada token, redirect ke login')
      return navigateTo('/login')
    }

    if (!isLoggedIn.value) {
      console.log('[auth.global] fetch user...')
      const user = await fetchUser()

      if (!user) {
        console.log('[auth.global] user tidak valid, redirect ke login')
        return navigateTo('/login')
      }

      if (!user.is_active) {
        console.log('[auth.global] user tidak aktif')
        return navigateTo('/login')
      }
    }
    console.log('[auth.global] user authenticated, role_id:', useAuth().user.value?.role_id)
  })
