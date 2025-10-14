export default defineNuxtRouteMiddleware(async (to) => {
  console.log('[auth.global] jalan di route:', to.path)

  if (to.path === '/login') return

  const auth = useAuth() // ✅ Satu instance aja bro!
  const { fetchUser, isLoggedIn, user } = auth

  if (!isLoggedIn.value) {
    console.log('[auth.global] fetch user...')
    const fetched = await fetchUser()

    if (!fetched) {
      console.log('[auth.global] user tidak valid, redirect ke login')
      return navigateTo('/login')
    }

    if (!fetched.is_active) {
      console.log('[auth.global] user tidak aktif')
      return navigateTo('/login')
    }
  }

  console.log('[auth.global] user authenticated, role_id:', user.value?.role_id)
})
