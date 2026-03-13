<script setup lang="ts">
definePageMeta({
  middleware: ["role"],
  roles: [1, 4],
});

const route = useRoute();
const router = useRouter();

const { 
  fetchById, 
  currentReflection, 
  update, 
  loading, 
  error, 
  saving 
} = useReflections();

const form = ref<ReflectionForm>({
  id: 0,
  date_post: "",
  title: "",
  content: "",
  image: "",
  status: 1,
})

onMounted(async () => {
  const id = Number(route.params.id);
  if (id) fetchById(id);
});

watch(currentReflection, (reflection) => {
  if (!reflection) return;

  form.value = {
    id: reflection.id,
    date_post: $formatDateForInput(reflection.date_post),
    title: reflection.title ?? "",
    content: reflection.content ?? "",
    image: reflection.image ?? "",
    status: reflection.status ?? 1,
  };
});

const submit = async () => {
  await update(Number(route.params.id), {
    ...form.value,
    date_post: form.value.date_post?.replace("T", " ") || "",
  })

  router.push("/reflection")
}

const cancel = () => {
  router.push("/reflection")
}
</script>

<template>
  <DefaultForm title="Edit Renungan" :loading="loading"> 
    <FormReflection
      v-model="form"
      :saving="saving"
      :error="error"
      @submit="submit"
      @cancel="cancel"
    />
  </DefaultForm>
</template>
