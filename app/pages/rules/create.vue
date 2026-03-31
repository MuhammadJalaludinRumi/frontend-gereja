<script setup lang="ts">
definePageMeta({
  middleware: ['role'],
  roles: [1, 4]
})

const router = useRouter()
const { create, saving } = useRules()

const form = ref<RuleForm>({
  role_id: 0,
  acl_id: 0,
  permission: true
})

const submit = async () => {
  await create(form.value)
  router.push("/rules")
}

const cancel = () => {
  router.push("/rules")
}

</script>

<template>
  <DefaultForm title="Tambah Rule">
    <FormRule 
      v-model="form"
      :saving="saving"
      @submit="submit"
      @cancel="cancel"
    />
  </DefaultForm>
</template>
