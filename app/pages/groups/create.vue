<script setup lang="ts">
definePageMeta({
  middleware: ['role'],
  roles: [1]
})

const router = useRouter()
const { create, saving, error } = useGroups()

const form = reactive<GroupForm>({
  name: '',
  address: '',
  city: 0,
  phone: '',
  email: '',
  website: '',
  founded: '',
  legal: '',
})

const submit = async () => {
  await create(objectToFormData(form))
  router.push("/groups")
}

const cancel = () => {
  router.push("/groups")
}
</script>

<template>
  <DefaultForm title="Tambah Group">
    <FormGroup 
      v-model="form"
      :saving="saving"
      :error="error"
      @submit="submit"
      @cancel="cancel"
    />
  </DefaultForm>
</template>