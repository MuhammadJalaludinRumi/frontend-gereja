<script setup lang="ts">
definePageMeta({
  middleware: ['role'],
  roles: [1, 4]
})

const route = useRoute()
const router = useRouter()

const { role, fetchById, update, error, saving, loading } = useRoles()

const form = ref<RoleForm>({
  name: '',
  organization_id: 0,
})

onMounted(async () => {
  const id = Number(route.params.id)
  if (id) await fetchById(id)
})

watch(role, (role) => {
  if (!role) return

  form.value = {
    name: role.name,
    organization_id: role.organization_id
  }
})

const submit = async () => {
  await update(Number(route.params.id), form.value)

  router.push('/roles')
}

const cancel = () => {
  router.push('/roles')
}
</script>

<template>
  <DefaultForm title="Edit User" :loading="loading">
    <FormRole 
      v-model="form"
      :saving="saving"
      :error="error"
      @submit="submit"
      @cancel="cancel"
    />

    <div class="w-full text-end mt-4">
      <span class="text-sm">
        Note: Perubahan pada role akan langsung berlaku pada sistem setelah disimpan.
      </span>
    </div>
  </DefaultForm>
</template>
