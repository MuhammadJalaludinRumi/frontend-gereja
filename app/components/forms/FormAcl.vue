<script setup lang="ts">
const props = withDefaults(defineProps<{
  modelValue: AclForm,
  saving?: boolean,
  error?: string | null,
}>(), {
  saving: false,
  error: null,
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: AclForm): void,
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
  if (form.value.name === '') {
    formError.value = "Field nama harus diisi."
    return
  }

  emit('submit')
}


</script>

<template>
  <form @submit.prevent="submit" class="space-y-6">
    <div>
      <label class="block mb-2 text-sm font-semibold">Nama ACL</label>
      <UInput
        v-model="form.name"
        type="text"
        placeholder="Masukkan nama ACL"
        class="w-full"
        required
      />
    </div>

    <div class="flex items-center justify-end gap-3 pt-2">
      <UButton
        color="neutral"
        variant="ghost"
        icon="i-heroicons-x-mark"
        label="Batal"
        @click="$emit('cancel')"
      />

      <UButton
        type="submit"
        color="primary"
        :loading="saving"
        :disabled="saving"
        icon="i-heroicons-check-circle"
        :label="saving ? 'Menyimpan..' : 'Simpan ACL'"
      />
    </div>

    <!-- Error -->
    <div
      v-if="formError || error"
      class="px-4 py-3 rounded-lg text-sm"
      style="background: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.3); color: #ef4444;"
    >
      {{ formError ?? error }}
    </div>
  </form>
</template>