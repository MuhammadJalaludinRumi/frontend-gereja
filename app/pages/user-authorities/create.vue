<script setup lang="ts">
definePageMeta({
  middleware: ['role'],
  roles: [1]
})

const router = useRouter()
const { create, saving, error } = useUserAuthorities()

const form = reactive<UserAuthorityForm>({
  user_id: 0,
  role_id: 0
})

const submit = async () => {
  await create(form)
  router.push("/user-authorities")
}

const cancel = () => {
  router.push("/user-authorities")
}
</script>

<template>
  <DefaultForm title="Tambah Otoritas Pengguna">
    <FormUserAuthority 
      v-model="form"
      :saving="saving"
      :error="error"
      @submit="submit"
      @cancel="cancel"
    />
  </DefaultForm>
</template>
