<script setup lang="ts">
import DefaultList from '~/layouts/default-list.vue';

definePageMeta({
  middleware: ['role'],
  roles: [4]
})

const { marriages, meta, fetchAll, remove, loading, error } = useMarriages()

const pagination = ref({
  pageIndex: 0,
  pageSize: 10
})

const search = ref('')

watch(
  (): [number, number, string] => [pagination.value.pageIndex, pagination.value.pageSize, search.value],
  async ([pageIndex, pageSize, searchValue]: [number, number, string]) => {
    await fetchAll({
      page: pageIndex + 1,
      per_page: pageSize,
      search: searchValue
    })
  }
)

onMounted(async () => {
  await fetchAll({
    page: pagination.value.pageIndex + 1,
    per_page: pagination.value.pageSize,
  })
})

const columns = [
  { header: '#', accessorKey: 'id', id: 'id',},
  { header: 'Tanggal', accessorKey: 'date', id: 'date' },
  { header: 'Istri', accessorKey: 'bride_name', id: 'bride_name', },
  { header: 'Suami', accessorKey: 'groom_name', id: 'groom_name', },
  { header: 'Lokasi', accessorKey: 'venue', id: 'venue', },
  { header: 'Status', accessorKey: 'is_active', id: 'is_active', },
]

const handleDelete = async (row: any) => {
  await remove(row.id)
  await fetchAll()
}

const onSearch = async (query: string) => {
  search.value = query

  pagination.value = {
    ...pagination.value,
    pageIndex: 0
  }
}

</script>

<template>
  <DefaultList title="Pernikahan">
    <DataTable
      type="Pernikahan"
      :data="marriages"
      :columns="columns"
      :loading="loading"
      :error="error"
      :total="meta.total"
      :pagination="pagination"
      @update:pagination="pagination = $event"
      @delete="handleDelete"
      @search="onSearch"
      @retry="fetchAll"
    >
      <template #date-cell={row}>
        {{ $formatDate(row.original.date) }}
      </template>

      <template #is_active-cell={row}>
        <div class="text-sm">
          <span :class="row.original.is_active ? 'text-success font-medium' : 'text-error font-medium'">
            {{ row.original.is_active ? 'Pasangan Saat Ini' : 'Cerai (tercatat)' }}
          </span>
          <div v-if="row.original.is_active === 0" class="text-xs text-muted mt-1">
            (0 = cerai hidup / cerai mati — per data)
          </div>
        </div>
      </template>
    </DataTable>
  </DefaultList>
</template>