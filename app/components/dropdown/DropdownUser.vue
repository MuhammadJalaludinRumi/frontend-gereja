<script setup lang="ts">
import { useDebounceFn } from '@vueuse/core'

const props = withDefaults(defineProps<{
  modelValue: SelectOption
  disabled?: boolean
}>(), {
  disabled: false,
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: SelectOption | null): void
}>()

const { userOptions, fetchUserSelect, loading } = useUsers()

const searchTerm = shallowRef('')

const selectedOption = ref<SelectOption>(props.modelValue)

watch(selectedOption, (value) => {
  emit('update:modelValue', value)
})

watch(
  () => props.modelValue,
  (newVal) => {
    if (newVal?.value !== selectedOption.value?.value) {
      selectedOption.value = newVal
    }
  },
  { immediate: true }
)

const searching = useDebounceFn((query: string) => {
  searchTerm.value = query

  if (!query || query.length < 3) return

  fetchUserSelect(query)
}, 400)

const items = computed(() => {
  if (userOptions.value.length > 0) {
    return userOptions.value
  }

  if (selectedOption.value) {
    return [selectedOption.value]
  }

  return []
})
</script>

<template>
  <UInputMenu
    v-model="selectedOption"
    :items="items"
    :loading="loading"
    :disabled="disabled"
    @update:search-term="searching"
    placeholder="Cari nama dan Pilih Pengguna"
    class="w-full"
  >
    <template #empty>
      <span v-if="loading">Memuat...</span>

      <span v-else-if="searchTerm.length > 0 && searchTerm.length < 3">
        Ketik minimal 3 karakter
      </span>

      <span v-else-if="searchTerm.length >= 3">
        Data user tidak ditemukan
      </span>

      <span v-else class="text-primary">
        Mulai mengetik untuk mencari
      </span>
    </template>
  </UInputMenu>
</template>
