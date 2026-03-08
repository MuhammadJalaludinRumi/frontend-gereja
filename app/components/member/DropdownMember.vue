<script setup lang="ts">
import { useDebounceFn } from '@vueuse/core'

const props = withDefaults(defineProps<{
  required?: boolean,
  multiple?: boolean
  placeholder?: string,
  loading?: boolean 
  selected?: number
  selectedLabel?: string
  selectedMultiple?: {value: number, label: string}[]
  memberItems: {value: number, label: string}[]
}>(), {
  required: false,
  multiple: false,
  placeholder: 'Cari dan pilih Anggota',
  loading: false,
  selected: 0,
  selectedLabel: '',
  selectedMultiple: () => []
})

const emit = defineEmits<{
  (e: 'update:selected', value: number): void
  (e: 'update:selected-object', value: { value: number, label: string }): void
  (e: 'update:selected-multiple', value: { value: number; label: string }[]): void
  (e: 'search', value: string): void
}>()

const selectedMemberId = ref<number>(props.selected)
const selectedMember = ref<{value: number, label: string}>({ value: 0, label: '' })
// const selectedMemberMultiply = computed({
//   get() {
//     return props.selectedMultiple ?? []
//   },
//   set(value) {
//     emit('update:selected-multiple', value)
//   }
// })

watch(
  () => [props.selected, props.selectedLabel] as const,
  ([newVal, newLabel]) => {
    if (newVal !== selectedMember.value?.value) {
      selectedMember.value = { value: newVal, label: newLabel }
    }
  },
  { immediate: true }
)

const searchTerm = ref('')

const emitSearch = useDebounceFn((value: string) => {
  searchTerm.value = value

  if (!value || value.length < 3) return

  emit('search', value)
}, 400)

watch(selectedMember, () => {
  selectedMemberId.value = selectedMember.value?.value

  emit('update:selected', selectedMemberId.value) // return number
  emit('update:selected-object', selectedMember.value) //return object
})

const mergedItems = computed(() => {
  const selected = props.multiple
    ? props.selectedMultiple
    : selectedMember.value
      ? [selectedMember.value]
      : []

  const map = new Map<number, { value: number; label: string }>()

  ;[...selected, ...props.memberItems].forEach((item: any) => {
    map.set(item.value, item)
  })

  return Array.from(map.values())
})

const inputModel = computed({
  get() {
    return props.multiple ? props.selectedMultiple : selectedMember.value
  },
  set(value: any) {
    if (props.multiple) {
      emit('update:selected-multiple', value)
    } else {
      selectedMember.value = value
    }
  }
})
</script>

<template>
  <UInputMenu
    v-model="inputModel"
    :multiple="multiple"
    :items="mergedItems"
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

      <span v-else class="text-primary">
        Mulai mengetik untuk mencari
      </span>
    </template>
  </UInputMenu>
</template>