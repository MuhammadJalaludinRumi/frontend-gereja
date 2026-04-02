<script setup lang="ts">
definePageMeta({
  middleware: ['role'],
  roles: [1]
})

const router = useRouter()
const { create, saving } = useProvinces()

const form = ref({
  name: ''
})

const submit = async () => {
  await create(form.value)
  router.push("/province")
}

const cancel = () => {
  router.push("/province")
}
</script>

<template>
  <DefaultForm title="Tambah Provinsi">
    <FormProvince 
      v-model="form"
      :saving="saving"
      @submit="submit"
      @cancel="cancel"
    />
  </DefaultForm>
</template>