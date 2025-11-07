<script setup lang="ts">
definePageMeta({
  middleware: ['role'],
  roles: [1]
})

import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useNews } from '~/composables/useNews'

const router = useRouter()
const { create, loading } = useNews()

const form = ref({
  date_post: new Date().toISOString().split('T')[0], // default hari ini
  title: '',
  content: '',
  thumbnail: '',
  image: '',
  status: 1
})

const saving = ref(false)
const formError = ref<string | null>(null)

const submit = async () => {
  // validasi basic
  if (!form.value.title.trim() || !form.value.content.trim()) {
    formError.value = 'Judul dan konten wajib diisi.'
    return
  }

  saving.value = true
  formError.value = null

  try {
    await create(form.value)
    router.push('/news')
  } catch (err) {
    console.error('❌ Gagal membuat berita:', err)
    formError.value = 'Gagal menyimpan berita. Coba lagi nanti.'
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <div class="p-6 w-full" style="color: var(--ui-text); background: var(--ui-bg)">
    <h1 class="text-2xl font-bold mb-6" style="color: var(--ui-text-highlighted)">
      Tambah Berita Baru
    </h1>

    <UCard class="max-w-2xl">
      <form @submit.prevent="submit" class="space-y-5">
        <!-- tanggal -->
        <div>
          <label class="block mb-1 font-medium">Tanggal Publikasi</label>
          <UInput v-model="form.date_post" type="date" />
        </div>

        <!-- judul -->
        <div>
          <label class="block mb-1 font-medium">Judul Berita</label>
          <UInput v-model="form.title" placeholder="Masukkan judul berita" />
        </div>

        <!-- konten -->
        <div>
          <label class="block mb-1 font-medium">Konten</label>
          <UTextarea
            v-model="form.content"
            placeholder="Masukkan isi berita"
            rows="6"
          />
        </div>

        <!-- thumbnail -->
        <div>
          <label class="block mb-1 font-medium">Thumbnail URL</label>
          <UInput v-model="form.thumbnail" placeholder="Opsional" />
        </div>

        <!-- image -->
        <div>
          <label class="block mb-1 font-medium">Image URL</label>
          <UInput v-model="form.image" placeholder="Opsional" />
        </div>

        <!-- status -->
        <div>
          <label class="block mb-1 font-medium">Status</label>
          <USelect
            v-model="form.status"
            :options="[
              { label: 'Aktif', value: 1 },
              { label: 'Nonaktif', value: 0 }
            ]"
          />
        </div>

        <!-- actions -->
        <div class="flex gap-3 pt-4">
          <UButton
            type="submit"
            :loading="saving || loading"
            color="primary"
            label="Simpan"
          />
          <UButton
            color="gray"
            variant="soft"
            label="Batal"
            @click="router.push('/news')"
          />
        </div>

        <!-- error -->
        <p v-if="formError" class="text-red-500 text-sm mt-2">
          {{ formError }}
        </p>
      </form>
    </UCard>
  </div>
</template>
