<script setup lang="ts">
definePageMeta({
  middleware: ['role'],
  roles: [1]
})

const route = useRoute()
const router = useRouter()

// composables
const { 
  currentUser, 
  fetchById,
  update, 
  loading,
  error, 
  saving,
} = useUsers()

// form
const form = ref<UserForm>({
  id: 0,
  username: '',
  password: '',
  name: '',
  is_active: true,
  role_id: 0
})

onMounted(async () => {
  const id = Number(route.params.id)
  if (id) await fetchById(id)
})

watch(currentUser, (user) => {
  if (!user) return

  form.value = {
    id: user.id,
    username: user.username,
    name: user.name,
    is_active: user.is_active,
    role_id: user.role_id
  }
})

const submit = async () => {
  await update(Number(route.params.id), form.value)

  router.push('/users')
}

const cancel = () => {
  router.push('/users')
}
</script>

<template>
  <DefaultForm title="Edit User" :loading="loading">
    <FormUser 
      v-model="form"
      :saving="saving"
      :error="error"
      @submit="submit"
      @cancel="cancel"
      is-edit
    />

    <div class="w-full text-end mt-4">
      <span class="text-sm">
        Note: Perubahan pada user akan langsung berlaku pada sistem setelah disimpan.
      </span>
    </div>
  </DefaultForm>
</template>
