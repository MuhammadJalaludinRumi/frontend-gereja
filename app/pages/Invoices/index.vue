<script setup lang="ts">
definePageMeta({
  middleware: ['role'],
  roles: [1]
})

const { invoices, meta, fetchAll, loading, error, remove } = useInvoices()

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

const columns = [
  {header: '#', accessorKey: 'id', id: 'id'}, 
  {header: 'Organization', accessorKey: 'organization.name', id: 'organization.name'}, 
  {header: 'Tanggal', accessorKey: 'date', id: 'date'}, 
  {header: 'Kadaluarsa', accessorKey: 'current_expiry', id: 'current_expiry'}, 
  {header: 'Baru', accessorKey: 'new_expiry', id: 'new_expiry'}, 
  {header: 'Total', accessorKey: 'total', id: 'total'}, 
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

onMounted(fetchAll)
</script>

<template>
  <DefaultList title="Invoice">
    <DataTable
      type="Invoice"
      :data="invoices"
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
      <template #date-cell="{ row }">
        {{ $formatDate(row.original.date) }}
      </template>

      <template #current_expiry-cell="{ row }">
        {{ $formatDate(row.original.current_expiry) }}
      </template>
      
      <template #new_expiry-cell="{ row }">
        {{ $formatDate(row.original.new_expiry) }}
      </template>

      <template #total-cell="{ row }">
        {{ $formatCurrency(row.original.total) }}
      </template>
    </DataTable>
  </DefaultList>
</template>

