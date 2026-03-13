<script setup lang="ts">
definePageMeta({
  middleware: ["role"],
  roles: [1, 4],
})

const route = useRoute()
const router = useRouter()

const { fetchById, currentAnnouncement, update, loading, error } = useAnnouncements() 
const saving = shallowRef(false)

const form = reactive({
  id: 0,
  date_post: "",
  title: "",
  content: "",
  status: 1,
})

onMounted(async () => {
  const id = Number(route.params.id)
  if (id) fetchById(id)
})

watch(currentAnnouncement, (announcement) => {
  if (!announcement) return
  
  form.id = announcement.id
  form.date_post = $formatDateForInput(announcement.date_post)
  form.title = announcement.title
  form.content = announcement.content
  form.status = announcement.status
})

const submit = async () => {
  try {
    saving.value = true
    error.value = null

    await update(Number(route.params.id), {
      ...form,
      date_post: form.date_post?.replace("T", " ") || ""
    });

    router.push('/announcement')
  } catch (err) {
    console.error("❌ Gagal update pengumuman:", err);
    error.value = "Gagal memperbarui pengumuman.";
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <DefaultForm title="Edit Pengumuman" :loading="loading" >
    <form @submit.prevent="submit" class="space-y-4 flex flex-col gap-3">
      <div>
        <label class="block mb-2 text-sm font-semibold"
          >Tanggal Posting <Mandatory/></label
        >
        <UInput
          class="w-full"
          v-model="form.date_post"
          label="Tanggal Posting"
          type="date"
          required
        />
      </div>
      <div class="w-full">
        <label class="block mb-2 text-sm font-semibold">Judul Berita <Mandatory/></label>
        <UInput
          class="w-full"
          v-model="form.title"
          label="Judul Berita"
          placeholder="Masukkan judul berita"
          required
        />
      </div>
      <div>
        <label class="block mb-2 text-sm font-semibold">Konten <Mandatory/></label>
        <UTextarea
          class="w-full"
          v-model="form.content"
          label="Konten"
          placeholder="Isi berita..."
          :rows="6"
        />
      </div>

      <div>
        <label class="block mb-2 text-sm font-semibold">Status <Mandatory/></label>
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
          icon="i-heroicons-x-mark"
          variant="ghost"
          label="Batal"
          @click="router.push('/announcement')"
        />
        <UButton
          type="submit"
          icon="i-heroicons-check-circle"
          :loading="saving"
          color="primary"
          label="Simpan Pengumuman"
        />
      </div>

      <p v-if="error" class="text-red-500 text-sm mt-2">
        {{ error }}
      </p>
    </form>
  </DefaultForm>
</template>
