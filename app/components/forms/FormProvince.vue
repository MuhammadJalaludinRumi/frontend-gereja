<script setup lang="ts">
const props = withDefaults(defineProps<{
  modelValue: ProvinceForm,
  saving?: boolean
  error?: string | null
}>(), {
  saving: false,
  error: null,
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: ProvinceForm): void
  (e: 'submit'): void
  (e: 'cancel'): void
}>()

const form = computed({
  get: () => props.modelValue,
  set: (val) => emit("update:modelValue", val)
})

const formError = ref<string | null>(null)

const submit = () => {
  if (!form.value.name) {
    formError.value = 'Nama provinsi harus diisi.'
    return 
  }

  emit('submit')
}
</script>

<template>
  <form @submit.prevent="submit" class="space-y-6">
    <div>
      <label for="name" class="block mb-2 text-sm font-medium">
        Nama Provinsi <Mandatory/>
      </label>
      <UInput 
        v-model="form.name" 
        class="w-full"
        placeholder="Isi Nama Provinsi"
      />
    </div>

    <div class="flex justify-end items-center gap-3 pt-4">
      <UButton
        color="neutral"
        variant="ghost"
        icon="i-heroicons-x-mark"
        label="Batal"
        @click="$emit('cancel')"
      />
      <UButton
        type="submit"
        :loading="saving"
        :disabled="saving"
        color="primary"
        icon="i-heroicons-check-circle"
        :label="saving ? 'Menyimpan...' : 'Simpan Provinsi'"
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