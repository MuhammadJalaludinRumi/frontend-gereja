<script setup lang="ts">
definePageMeta({
  middleware: ["role"],
  roles: [1],
});

import { ref, onMounted } from "vue";
import { useRoute, useRouter, useRuntimeConfig } from "#app";
import { useNews, type News } from "~/composables/useNews";

const route = useRoute();
const router = useRouter();
// const config = useRuntimeConfig()
const { fetchById, currentNews, loading, error, updateNews } = useNews();

const form = ref<Partial<News>>({
  id: undefined,
  date_post: "",
  title: "",
  content: "",
  thumbnail: "",
  image: "",
  status: 1,
});

// const loading = ref(true)
const errorMessage = ref<string | null>(null);

function formatDateForInput(dateString: string | null | undefined) {
  if (!dateString) return "";
  return dateString.replace(" ", "T").slice(0, 16);
}

// const fetchNews = async () => {
//   try {
//     const { data, error } = await useFetch(`${config.public.apiBase}/news/${route.params.id}`, {
//       headers: { Accept: 'application/json' }
//     })

//     if (error.value) throw error.value
//     if (!data.value) throw new Error('Data berita tidak ditemukan.')

//     console.log('🟩 DATA DARI API:', data.value) // 🔍 debug sini bro

//     // --- test ambil struktur ---
//     const possibleData = (data.value as any).data ?? data.value
//     console.log('🟨 DATA PARSED:', possibleData)

//     const news = possibleData

//     form.value = {
//       id: news.id,
//       date_post: formatDateForInput(news.date_post),
//       title: news.title || '',
//       content: news.content || '',
//       thumbnail: news.thumbnail || '',
//       image: news.image || '',
//       status: news.status ?? 1
//     }

//     console.log('✅ FORM TERISI:', form.value)
//   } catch (err) {
//     console.error('❌ Gagal memuat berita:', err)
//     errorMessage.value = 'Gagal memuat berita.'
//   } finally {
//     loading.value = false
//   }
// }

onMounted(() => {
  const id = Number(route.params.id);
  if (id) fetchById(id);
});

watch(currentNews, (news) => {
  if (!news) return;

  form.value = {
    id: news.id,
    date_post: formatDateForInput(news.date_post),
    title: news.title ?? "",
    content: news.content ?? "",
    thumbnail: news.thumbnail ?? "",
    image: news.image ?? "",
    status: news.status ?? 1,
  };
});

const submit = async () => {
  try {
    loading.value = true;
    errorMessage.value = null;

    await updateNews(Number(route.params.id), {
      ...form.value,
      date_post: form.value.date_post?.replace("T", " ") || "",
    });

    router.push("/news");
  } catch (err) {
    console.error("❌ Gagal update berita:", err);
    errorMessage.value = "Gagal memperbarui berita.";
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="p-6 mx-auto">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold" style="color: var(--ui-text-highlighted);">Edit Berita #{{ route.params.id }}</h1>
      <UButton to="/news" icon="i-heroicons-arrow-left" color="gray" variant="soft" label="Back" />
    </div>
    <UCard
      class="rounded-2xl shadow-sm bg-[var(--ui-bg)] text-[var(--ui-text)]"
    >
      <div v-if="loading" class="py-8 text-center text-gray-500">
        Memuat data...
      </div>

      <div v-else>
        <form @submit.prevent="submit" class="space-y-4 flex flex-col gap-3">
          <div class="w-full">
            <label class="block mb-2 text-sm font-semibold">Judul Berita</label>
            <UInput
              class="w-full"
              v-model="form.title"
              label="Judul Berita"
              placeholder="Masukkan judul berita"
              required
            />
          </div>
          <div>
            <label class="block mb-2 text-sm font-semibold"
              >Tanggal Posting</label
            >
            <UInput
              class="w-full"
              v-model="form.date_post"
              label="Tanggal Posting"
              type="datetime-local"
              required
            />
          </div>
          <div>
            <label class="block mb-2 text-sm font-semibold">Konten</label>
            <UTextarea
              class="w-full"
              v-model="form.content"
              label="Konten"
              placeholder="Isi berita..."
              :rows="6"
            />
          </div>
          <div>
            <label class="block mb-2 text-sm font-semibold"
              >URL Thumbnail</label
            >
            <UInput
              class="w-full"
              v-model="form.thumbnail"
              label="URL Thumbnail"
              placeholder="https://..."
            />
          </div>
          <div>
            <label class="block mb-2 text-sm font-semibold"
              >URL Gambar Utama</label
            >
            <UInput
              class="w-full"
              v-model="form.image"
              label="URL Gambar Utama"
              placeholder="https://..."
            />
          </div>

          <div>
            <label class="block mb-2 text-sm font-semibold">Status</label>
            <USelect
              v-model="form.status"
              label="Status"
              :options="[
                { label: 'Aktif', value: 1 },
                { label: 'Nonaktif', value: 0 },
              ]"
            />
          </div>

          <div class="flex justify-end gap-2 pt-4">
            <UButton color="gray" variant="soft" @click="router.push('/news')">
              Batal
            </UButton>
            <UButton type="submit" color="primary" :loading="loading">
              Perbarui
            </UButton>
          </div>

          <p v-if="errorMessage" class="text-red-500 text-sm mt-2">
            {{ errorMessage }}
          </p>
        </form>
      </div>
    </UCard>
  </div>
</template>
