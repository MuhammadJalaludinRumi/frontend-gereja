<script setup lang="ts">
const props = withDefaults(defineProps<{
  modelValue: LicenseForm
  saving?: boolean
  error?: string | null
}>(), {
  saving: false,
  error: null,
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: LicenseForm): void
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
    formError.value = 'Nama lisensi harus diisi.'
    return
  }

  if (form.value.price <= 0) {
    formError.value = 'Harga lisensi harus lebih besar dari 0.'
    return
  }

  emit('submit')
}

</script>

<template>
  <form @submit.prevent="submit" class="space-y-6">
    <div>
      <label class="block mb-2 text-sm font-medium">
        Nama Lisensi <Mandatory />
      </label>
      <UInput v-model="form.name" type="text" placeholder="Masukkan nama lisensi" class="w-full" required />
    </div>
    <div>
      <label class="block mb-2 text-sm font-medium">
        Harga Lisensi <Mandatory />
      </label>
      <UInput 
        v-model="form.price" 
        type="number" 
        placeholder="Masukkan harga lisensi" 
        class="w-full" 
        min="0" 
        @input="form.price = Math.max(0, Number(form.price || 0))" 
        @keydown="['-', '+', '.', ','].includes($event.key) && $event.preventDefault()"
        required 
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
        :label="saving ? 'Menyimpan...' : 'Simpan Lisensi'"
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