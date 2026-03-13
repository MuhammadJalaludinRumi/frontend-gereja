<script setup lang="ts">
definePageMeta({
  middleware: ["role"],
  roles: [1],
});

const route = useRoute();
const router = useRouter();

const { 
  fetchById, 
  currentNews, 
  loading, 
  saving,
  error, 
  updateNews 
} = useNews();

const form = ref<NewsForm>({
  id: undefined,
  date_post: "",
  title: "",
  content: "",
  thumbnail: "",
  image: "",
  status: 1,
});

onMounted(() => {
  const id = Number(route.params.id)
  if (id) fetchById(id)
})

watch(currentNews, (news) => {
  if (!news) return;

  form.value = {
    id: news.id,
    date_post: $formatDateForInput(news.date_post),
    title: news.title ?? "",
    content: news.content ?? "",
    thumbnail: news.thumbnail ?? "",
    image: news.image ?? "",
    status: news.status ?? 1,
  };
});

const submit = async () => {
  await updateNews(Number(route.params.id), {
    ...form.value,
    date_post: form.value.date_post?.replace("T", " ") || "",
  })

  router.push("/news")
}

const cancel = () => {
  router.push("/news")
}
</script>

<template>
  <DefaultForm title="Edit Berita" :loading="loading"> 
    <FormNews
      v-model="form"
      :saving="saving"
      :error="error"
      @submit="submit"
      @cancel="cancel"
    />
  </DefaultForm>
</template>
