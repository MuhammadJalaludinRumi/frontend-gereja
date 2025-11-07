export default defineNuxtRouteMiddleware((to) => {
  const { user } = useAuth()

  const allowedRoles = to.meta.roles as number[]
  if (!allowedRoles) return

  // pastikan role_id yang dipakai adalah number
  const userRole = Number(user.value?.role_id)
  console.log('user role:', user.value?.role_id, 'allowed:', allowedRoles)

  if (!allowedRoles.includes(userRole)) {
    return navigateTo('/no-access')
  }
})
