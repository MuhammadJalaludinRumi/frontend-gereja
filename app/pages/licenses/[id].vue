<script setup lang="ts">
definePageMeta({
  middleware: ['role'],
  roles: [1]
})

const router = useRouter()
const route = useRoute()
const { license, fetchById, update, loading, saving, error } = useLicenses()

const form = ref<LicenseForm>({
  name: '',
  price: 0
})

watch(
  license, 
  (newVal) => {
    if (newVal) {
      form.value = {
        name: newVal.name,
        price: Number(newVal.price)
      }
    }
  }, 
  { immediate: true }
)

const submit = async () => {
  if (!license.value) return

  await update(license.value.id, form.value)
  await router.push('/licenses')
}

onMounted(async () => {
  const id = Number(route.params.id)
  await fetchById(id)
})
</script>

<template>
  <DefaultForm title="Edit Lisensi" :loading="loading">
    <FormLicense
      v-model="form"
      :saving="saving"
      :error="error"
      @submit="submit"
      @cancel="router.push('/licenses')"
    />
  </DefaultForm>
</template>