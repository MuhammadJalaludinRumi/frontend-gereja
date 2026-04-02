<script setup lang="ts">
definePageMeta({
  middleware: ['role'],
  roles: [1, 4]
})

const route = useRoute()
const router = useRouter()

const { rule, fetchById, update, saving, loading, error } = useRules()

const form = ref<RuleForm>({
  role_id: 0,
  acl_id: 0,
  permission: true,
})

onMounted(async () => {
  const id = Number(route.params.id)
  if (id) await fetchById(id)
})

watch(rule, (rule) => {
  if (!rule) return

  form.value = {
    role_id: rule.role_id,
    acl_id: rule.acl_id,
    permission: rule.permission ? true : false
  }
})

const submit = async () => {
  await update(Number(route.params.id), form.value)

  router.push('/rules')
}

const cancel = () => {
  router.push('/rules')
}

</script>

<template>
  <DefaultForm title="Edit User" :loading="loading">
    <FormRule 
      v-model="form"
      :saving="saving"
      :error="error"
      @submit="submit"
      @cancel="cancel"
    />

    <div class="w-full text-end mt-4">
      <span class="text-sm">
        Note: Perubahan pada rule akan langsung berlaku pada sistem setelah disimpan.
      </span>
    </div>
  </DefaultForm>
</template>
