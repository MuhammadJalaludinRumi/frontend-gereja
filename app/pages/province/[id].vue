<script setup lang="ts">
definePageMeta({
  middleware: ['role'],
  roles: [1]
})

const route = useRoute()
const router = useRouter()

const { province, fetchById, update, saving, loading, error } = useProvinces()

const form = ref<ProvinceForm>({
  name: ''
})

onMounted(async () => {
  const id = Number(route.params.id)
  if (id) {
    await fetchById(id)
  }
})

watch(province, (province) => {
  if (!province) return

  form.value = {
    name: province.name
  }
})

const submit = async () => {
  await update(Number(route.params.id), form.value)

  router.push('/province')
}

const cancel = () => {
  router.push('/province')
}
</script>

<template>
  <DefaultForm title="Edit Provinsi" :loading="loading">
    <FormProvince 
      v-model="form"
      :saving="saving"
      :error="error"
      @submit="submit"
      @cancel="cancel"
    />
  </DefaultForm>
</template>