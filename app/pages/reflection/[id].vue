<script setup lang="ts">
definePageMeta({
  middleware: ["role"],
  roles: [1],
});

import { ref, onMounted, watch } from "vue";
import { useRoute, useRouter } from "#app";
import { useReflections, type Reflection } from "~/composables/useReflections";

const route = useRoute();
const router = useRouter();

const { fetchById, currentReflection, update, loading, error } =
  useReflections();

const form = ref<Partial<Reflection>>({
  id: undefined,
  date_post: "",
  title: "",
  content: "",
  image: "",
  status: 1,
});

function formatDateForInput(dateString: string | null | undefined) {
  if (!dateString) return "";
  return dateString.replace(" ", "T").slice(0, 16);
}

onMounted(async () => {
  const id = Number(route.params.id);
  if (id) fetchById(id);
});

watch(currentReflection, (reflection) => {
  if (!reflection) return;

  form.value = {
    id: reflection.id,
    date_post: formatDateForInput(reflection.date_post),
    title: reflection.title ?? "",
    content: reflection.content ?? "",
    image: reflection.image ?? "",
    status: reflection.status ?? 1,
  };
});

const submit = async () => {
  try {
    loading.value = true;
    error.value = null;

    await update(Number(route.params.id), {
      ...form.value,
      date_post: form.value.date_post?.replace("T", " ") || "",
    });
  } catch (err) {
    console.error("❌ Gagal update renungan:", err);
    error.value = "Gagal memperbarui renungan.";
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="p-6 mx-auto">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold" style="color: var(--ui-text-highlighted)">
        Edit Renungan #{{ route.params.id }}
      </h1>
      <UButton
        to="/reflection"
        icon="i-heroicons-arrow-left"
        color="neutral"
        variant="soft"
        label="Back"
      />
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
            <label class="block mb-1 font-medium">Image URL</label>
            <UInput
              v-model="form.image"
              placeholder="Opsional"
              class="w-full"
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
            <UButton
              color="neutral"
              variant="soft"
              @click="router.push('/reflection')"
            >
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
