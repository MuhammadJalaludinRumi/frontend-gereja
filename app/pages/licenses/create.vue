<script setup lang="ts">
definePageMeta({
  middleware: ['role'],
  roles: [1]
})

const router = useRouter()
const { create, saving, error } = useLicenses() 

const form = ref<LicenseForm>({
  name: '',
  price: 0
})

const submit = async () => {
  await create(form.value)
  await router.push('/licenses')
}

const cancel = () => {
  router.push('/licenses')
}
</script>

<template>
  <DefaultForm title="Tambah Lisensi">
    <FormLicense
      v-model="form"
      :saving="saving"
      :error="error"
      @submit="submit"
      @cancel="cancel"
    />
  </DefaultForm>
</template>
