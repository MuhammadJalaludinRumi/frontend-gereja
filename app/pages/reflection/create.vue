<script setup lang="ts">
definePageMeta({
  middleware: ["role"],
  roles: [1, 4],
})

import { ref } from "vue";
import { useRouter } from 'vue-router'

const router = useRouter()
const { create, loading } = useReflections()

const form = ref({
  date_post: new Date().toISOString().split('T')[0], // default hari ini
  title: '',
  content: '',
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
    await create(form.value as any)
    router.push('/reflection')
  } catch (err) {
    console.error('❌ Gagal membuat renungan:', err)
    formError.value = 'Gagal menyimpan renungan. Coba lagi nanti.'
  } finally {
    saving.value = true
  }
}

</script>

<template>
  <div class="p-6 w-full" style="color: var(--ui-text); background: var(--ui-bg)">
    <h1 class="text-2xl font-bold mb-6" style="color: var(--ui-text-highlighted)">
      Tambah Renungan Baru
    </h1>

    <UCard>
      <form @submit.prevent="submit" class="space-y-5">
        <!-- tanggal -->
        <div>
          <label class="block mb-1 font-medium">Tanggal Publikasi</label>
          <UInput v-model="form.date_post" type="date"  class="w-full"/>
        </div>

        <!-- judul -->
        <div>
          <label class="block mb-1 font-medium">Judul Renungan</label>
          <UInput v-model="form.title" placeholder="Masukkan judul renungan" class="w-full"/>
        </div>

        <!-- konten -->
        <div>
          <label class="block mb-1 font-medium">Konten</label>
          <UTextarea
            v-model="form.content"
            placeholder="Masukkan isi renungan"
            :rows="6"
            class="w-full"
          />
        </div>

        <!-- image -->
        <div>
          <label class="block mb-1 font-medium">Image URL</label>
          <UInput v-model="form.image" placeholder="Opsional" class="w-full" />
        </div>

        <!-- status -->
        <div>
          <label class="block mb-1 font-medium">Status</label>
          <USelect
            v-model="form.status"
            :items="[
              { label: 'Aktif', value: 1 },
              { label: 'Nonaktif', value: 0 }
            ]"
          />
        </div>
        
        <!-- actions -->
        <div class="flex justify-end gap-3 pt-4">
          <UButton
            color="neutral"
            variant="soft"
            label="Batal"
            @click="router.push('/reflection')"
          />
          <UButton
            type="submit"
            :loading="saving || loading"
            color="primary"
            label="Simpan"
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