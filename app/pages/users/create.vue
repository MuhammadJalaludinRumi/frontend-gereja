<script setup lang="ts">
definePageMeta({
  middleware: ['role'],
  roles: [1]
})

const router = useRouter()
const { create, saving } = useUsers()

const form = ref<UserForm>({
  username: '',
  password: '',
  name: '',
  is_active: true,
  role_id: 0
})

const submit = async () => {
  await create(form.value as User)
  router.push("/users")
}

const cancel = () => {
  router.push("/users")
}
</script>

<template>
  <DefaultForm title="Tambah User">
    <FormUser 
      v-model="form"
      :saving="saving"
      @submit="submit"
      @cancel="cancel"
    />
  </DefaultForm>
</template>
