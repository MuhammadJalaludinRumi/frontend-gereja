<script lang="ts" setup>
interface ConfirmDialogProps {
  title?: 'Konfirmasi Hapus'| string
  description?: string
  type?: string
  data?: string
}

defineProps<ConfirmDialogProps>()

const emits = defineEmits<{
  close: [value: boolean]
}>()
</script>

<template>
  <UModal
    :dismissible="true"
    :transition="true"
    :open="true"
    :ui="{
      footer: 'justify-end' 
    }"
  >
    <template #header>
      <h2 class="text-lg font-bold">{{ title }}</h2>
    </template>
    <template #body>
      <p>Apakah Anda yakin ingin menghapus {{ type }} <span class="font-bold italic">#{{ data }}</span>?</p>
      <small class="text-error font-medium">Data yang dihapus tidak dapat dikembalikan!</small>
    </template>

    <template #footer>
      <UButton label="Kembali" color="neutral" variant="outline" @click="emits('close', false)" />
      <UButton icon="i-heroicons-trash" label="Hapus" variant="solid" color="error" @click="emits('close', true)" />
    </template>
  </UModal>
</template>
