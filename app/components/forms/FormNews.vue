<script setup lang="ts">

const props = withDefaults(defineProps<{
  modelValue: NewsForm
  saving?: boolean
  error?: string | null
}>(), {
  saving: false,
  error: null
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: NewsForm): void,
  (e: 'submit'): void
  (e: 'cancel'): void
}>()

const form = ref({ ...props.modelValue })
const formError = ref<string | null>(null)

watch(
  () => props.modelValue,
  (val) => {
    form.value = { ...val }
  },
  { deep: true }
)

watch(
  form,
  (val) => {
    emit("update:modelValue", val)
  },
  { deep: true }
)

const submit = () => {
  if (!form.value.title?.trim() || !form.value.content?.trim()) {
    formError.value = "Judul dan konten wajib diisi."
    return
  }

  formError.value = null
  emit("submit")
}
</script>

<template>
  <form @submit.prevent="submit" class="space-y-5">
    <!-- tanggal -->
    <div>
      <label class="block mb-1 font-medium text-sm">
        Tanggal Publikasi <Mandatory/>
      </label>
      <UInput v-model="form.date_post" type="date" class="w-full" required />
    </div>

    <!-- judul -->
    <div>
      <label class="block mb-1 font-medium text-sm">
        Judul Berita <Mandatory/>
      </label>
      <UInput v-model="form.title" class="w-full" placeholder="Masukkan judul berita" required />
    </div>

    <!-- konten -->
    <div>
      <label class="block mb-1 font-medium text-sm">
        Konten <Mandatory/>
      </label>
      <UTextarea
        v-model="form.content"
        placeholder="Masukkan isi berita"
        :rows="6"
        class="w-full"
        required
      />
    </div>

    <!-- thumbnail -->
    <div>
      <label class="block mb-1 font-medium text-sm">Thumbnail URL</label>
      <UInput v-model="form.thumbnail" placeholder="Opsional" class="w-full" />
    </div>

    <!-- image -->
    <div>
      <label class="block mb-1 font-medium text-sm">
        Image URL
      </label>
      <UInput v-model="form.image" placeholder="Opsional" class="w-full" />
    </div>

    <!-- status -->
    <div>
      <label class="block mb-1 font-medium text-sm">
        Status <Mandatory/>
      </label>
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
        variant="ghost"
        icon="i-heroicons-x-mark"
        label="Batal"
        @click="$emit('cancel')"
      />

      <UButton
        type="submit"
        icon="i-heroicons-check-circle"
        :loading="saving"
        color="primary"
        label="Simpan Renungan"
      />
    </div>

    <p v-if="formError" class="text-red-500 text-sm">
      {{ formError }}
    </p>
  </form>
</template>