<script setup lang="ts">
definePageMeta({
  middleware: ['role'],
  roles: [1]
})

const router = useRouter()
const { create, saving } = useNews()

const form = ref<NewsForm>({
  date_post: new Date().toISOString().split('T')[0] ?? '',
  title: '',
  content: '',
  thumbnail: '',
  image: '',
  status: 1
})

const submit = async () => {
  try {
    await create(form.value as Reflection)
    router.push("/reflection")
  } catch (err) {
    console.error("❌ gagal create reflection", err)
  } 
}

const cancel = () => {
  router.push("/reflection")
}

</script>

<template>
  <DefaultForm title="Tambah Berita">
    <FormNews
      v-model="form"
      :saving="saving"
      @submit="submit"
      @cancel="cancel"
    />
  </DefaultForm>
</template>
