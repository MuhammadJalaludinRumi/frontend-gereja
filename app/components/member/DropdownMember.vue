<script setup lang="ts">
import { useDebounceFn } from '@vueuse/core'

const props = withDefaults(defineProps<{
  required?: boolean,
  multiple?: boolean
  placeholder?: string,
  loading?: boolean 
  selected: number
  selectedLabel?: string
  memberItems: {value: number, label: string}[]
}>(), {
  required: false,
  multiple: false,
  placeholder: 'Cari dan pilih Anggota',
  loading: false,
  selectedLabel: '',
})

const emit = defineEmits<{
  (e: 'update:selected', value: number): void
  (e: 'search', value: string): void
}>()

const selectedMemberId = ref<number>(props.selected)
const selectedMember = ref<{value: number, label: string}>({value: props.selected, label: props.selectedLabel})

const searchTerm = ref('')

const emitSearch = useDebounceFn((value: string) => {
  searchTerm.value = value

  if (!value || value.length < 3) return

  emit('search', value)
}, 400)

watch(selectedMember, () => {
  selectedMemberId.value = selectedMember.value?.value
  emit('update:selected', selectedMemberId.value)
})
</script>

<template>
  <UInputMenu
    v-model="selectedMember"
    :multiple="multiple"
    :items="memberItems"
    :loading="loading"
    @update:search-term="emitSearch($event)"
    :placeholder="placeholder"
    class="w-full"
  >
    <template #empty>
      <span v-if="loading">Memuat...</span>

      <span v-else-if="searchTerm.length > 0 && searchTerm.length < 3">
        Ketik minimal 3 karakter
      </span>

      <span v-else-if="searchTerm.length >= 3">
        Data anggota tidak ditemukan
      </span>

      <span v-else>
        Mulai mengetik untuk mencari
      </span>
    </template>
  </UInputMenu>
</template>