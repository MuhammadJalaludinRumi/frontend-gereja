<script setup lang="ts">
definePageMeta({
  middleware: ["role"],
  roles: [1],
})

import { ref, onMounted, watch } from "vue";
import { useRoute, useRouter } from "#app";
import { useAnnouncements, type Announcements } from "~/composables/useAnnouncements";

const route = useRoute()
const router = useRouter()

const { fetchById, currentAnnouncement, update, loading, error } = useAnnouncements() 

const form = ref<Partial<Announcements>>({
  id: undefined,
  date_post: "",
  title: "",
  content: "",
  status: 1,
})

function formatDateForInput(dateString: string | null | undefined) {
  if (!dateString) return "";
  return dateString.replace(" ", "T").slice(0, 16);
}

onMounted(async () => {
  const id = Number(route.params.id)
  if (id) fetchById(id)
})

watch(currentAnnouncement, (announcement) => {
  if (!announcement) return
  
  form.value = {
    id: announcement.id,
    date_post: formatDateForInput(announcement.date_post),
    title: announcement.title ?? "",
    content: announcement.content ?? "",
    status: announcement.status ?? 1,
  }
})

const submit = async () => {
  try {
    loading.value = true
    error.value = null

    await update(Number(route.params.id), {
      ...form.value,
      date_post: form.value.date_post?.replace("T", " ") || ""
    });

    router.push('/announcement')
  } catch (err) {
    console.error("❌ Gagal update pengumuman:", err);
    error.value = "Gagal memperbarui pengumuman.";
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="p-6 mx-auto">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold" style="color: var(--ui-text-highlighted);">Edit Pengumuman #{{ route.params.id }}</h1>
      <UButton to="/announcement" icon="i-heroicons-arrow-left" color="neutral" variant="soft" label="Back" />
    </div>
    <UCard>
      <div v-if="loading" class="py-8 text-center text-gray-500">
        Memuat data...
      </div>

      <div v-else>
        <form @submit.prevent="submit" class="space-y-4 flex flex-col gap-3">
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
            <label class="block mb-2 text-sm font-semibold">Status</label>
            <USelect
              v-model="form.status"
              label="Status"
              :items="[
                { label: 'Aktif', value: 1 },
                { label: 'Nonaktif', value: 0 },
              ]"
            />
          </div>

          <div class="flex justify-end gap-2 pt-4">
            <UButton color="neutral" variant="soft" @click="router.push('/announcement')">
              Batal
            </UButton>
            <UButton type="submit" color="primary" :loading="loading">
              Perbarui
            </UButton>
          </div>

          <p v-if="error" class="text-red-500 text-sm mt-2">
            {{ error }}
          </p>
        </form>
      </div>
    </UCard>
  </div>
</template>
