<script setup lang="ts">
definePageMeta({
  middleware: ["role"],
  roles: [1, 4],
})

const { reflections, meta, fetchAll, remove, loading, error } = useReflections()

const pagination = ref({
  pageIndex: 0,
  pageSize: 10,
})

const search = shallowRef('')

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

onMounted(fetchAll)

const columns = [
  { header: '#', accessorKey: 'id', id: 'id'},
  { header: 'Tanggal', accessorKey: 'date_post', id: 'date_post' },
  { header: 'Judul', accessorKey: 'title', id: 'title' },
  { header: 'Status', accessorKey: 'status', id: 'status' },
]

const handleDelete = async (row: any ) => {
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
  <DefaultList title="Renungan">
    <DataTable
      type="Renungan"
      :data="reflections"
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
      <template #date_post-cell="{row}">
        {{ $formatDate(row.original.date_post) }}
      </template>

      <template #status-cell="{row}">
        <span :class="row.original.status ? 'text-primary' : 'text-error'">
          {{ row.original.status ? 'Aktif' : 'Nonaktif' }}
        </span>
      </template>
    </DataTable>
  </DefaultList>
</template>