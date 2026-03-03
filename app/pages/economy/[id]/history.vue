<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useEconomyHistory } from '~/composables/useEconomyHistory'

const route = useRoute()
const id = Number(route.params.id)

const { history, fetchHistory } = useEconomyHistory()
const loading = ref(true)

onMounted(async () => {
  await fetchHistory(id)
  loading.value = false
})

const columns = [
  { header: '#', accessorKey: 'id', id: 'id',},
  { header: 'Tanggal Perubahan', accessorKey: 'updated_at', id: 'updated_at' },
  { header: 'Kelas Lama', accessorKey: 'old_class', id: 'old_class', },
  { header: 'Kelas Baru', accessorKey: 'new_class', id: 'new_class', },
  { header: 'Diperbarui Oleh', accessorKey: 'updated_by', id: 'updated_by', },
]

</script>

<template>
  <div class="p-6 w-full" style="background: var(--ui-bg); color: var(--ui-text)">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold" style="color: var(--ui-text-highlighted)">
        Riwayat Perubahan Ekonomi
      </h1>
      <UButton :to="`/economy`" icon="i-heroicons-arrow-left" label="Kembali" variant="ghost" color="neutral" />
    </div>

    <DataTable
      type="Riwayat Perubahan Ekonomi" 
      :data="history"
      :columns="columns"
      :loading="loading"
      :show-actions="false"
      :show-input-search="false"
    >
      <template #updated_at-cell="{ row }">
        {{ $formatDate(row.original.updated_at) }}
      </template>
    </DataTable>
  </div>
</template>
