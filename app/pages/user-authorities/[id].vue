<script setup lang="ts">
definePageMeta({
  middleware: ['role'],
  roles: [1]
})

const route = useRoute()
const router = useRouter()

const { userAuthority, fetchById, update, saving, loading, error } = useUserAuthorities()

const form = reactive<UserAuthorityForm>({
  user_id: 0,
  role_id: 0,
})

onMounted(async () => {
  const id = Number(route.params.id)
  if (id) await fetchById(id)
})

watch(userAuthority, (ua) => {
  if (!ua) return

  form.user_id = ua.user_id
  form.role_id = ua.role_id
})

const submit = async () => {
  await update(Number(route.params.id), form)
  router.push("/user-authorities")
}

const cancel = () => {
  router.push("/user-authorities")
}
</script>

<template>
  <DefaultForm title="Edit Otoritas Pengguna" :loading="loading">
    <FormUserAuthority 
      v-model="form"
      :saving="saving"
      :error="error"
      @submit="submit"
      @cancel="cancel"
      :data="userAuthority"
      is-edit
    />
  </DefaultForm>
</template>
