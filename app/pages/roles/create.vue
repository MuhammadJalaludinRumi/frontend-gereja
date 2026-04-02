<script setup lang="ts">
definePageMeta({
  middleware: ['role'],
  roles: [1, 4]
})

const router = useRouter()
const { create, saving } = useRoles()

const form = ref({
  organization_id: 0,
  name: ''
})

const submit = async () => {
  await create(form.value)
  router.push("/roles")
}

const cancel = () => {
  router.push("/roles")
}
</script>

<template>
  <DefaultForm title="Tambah Role">
    <FormRole 
      v-model="form"
      :saving="saving"
      @submit="submit"
      @cancel="cancel"
    />
  </DefaultForm>
</template>
