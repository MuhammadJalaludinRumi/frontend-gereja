<script setup lang="ts">
definePageMeta({
  middleware: ['role'],
  roles: [1, 4]
})

const { acl, fetchById, update, saving, loading, error } = useAcls()
const route = useRoute()
const router = useRouter()
const form = ref<AclForm>({ name: '' })

onMounted( async () => {
  await fetchById(Number(route.params.id))
  form.value.name = acl.value?.name || ''
})

const submit = async () => {
  await update(Number(route.params.id), form.value)
  router.push('/acls')
}

const cancel = () => {
  router.push('/acls')
}
</script>

<template>
  <DefaultForm title="Edit ACL" :loading="loading">
    <FormAcl 
      v-model="form"
      :saving="saving"
      :error="error"
      @submit="submit"
      @cancel="cancel"
    />
  </DefaultForm>
</template>
