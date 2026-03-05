<script setup lang="ts">
const props = defineProps<{
  row: any
  onDelete: (row: any) => Promise<void>
  label?: string
  type?: string
  labelData?: string
}>()

const toast = useToast()
const confirm = useConfirmDialog()

const loading = ref(false)

const handleClick = async () => {
  const confirmed = await confirm({
    title: 'Konfirmasi Hapus',
    type: props.type || 'data',
    data: props.labelData || ''
  })

  if (!confirmed) return

  loading.value = true
  try {
    await props.onDelete(props.row)

    toast.add({
      title: 'Berhasil Menghapus',
      description: `${props.type || 'Data'} #${props.row?.name || ''} berhasil dihapus.`,
      color: 'success'
    })
  } catch (err) {
    console.error(err)

    toast.add({
      title: 'Gagal Menghapus',
      description: 'Terjadi kesalahan saat menghapus data.',
      color: 'error'
    })
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <UButton
    icon="i-heroicons-trash"
    color="error"
    variant="soft"
    size="xs"
    :label="label || 'Hapus'"
    :loading="loading"
    class="cursor-pointer"
    @click="handleClick"
  />
</template>