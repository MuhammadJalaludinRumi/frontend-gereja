<script setup lang="ts">
definePageMeta({
  middleware: ['role'],
  roles: [1]
})

const { licenses, loading, error, fetchAll, remove } = useLicenses()

const search = shallowRef('')

const columns = [
  { header: '#', accessorKey: 'id', id: 'id' },
  { header: 'Nama Lisensi', accessorKey: 'name', id: 'name' },
  { header: 'Harga', accessorKey: 'price', id: 'price' },
  { header: 'Dibuat Pada', accessorKey: 'created_at', id: 'created_at' },
]

const handleDelete = async (row: any) => {
  await remove(row.id)
  await fetchAll()
}

const onSearch = async (query: string) => {
  search.value = query
  await fetchAll({ search: query })
}

onMounted(fetchAll)
</script>

<template>
  <DefaultList title="Lisensi">
    <DataTable
      type="Lisensi"
      :data="licenses"
      :columns="columns"
      :loading="loading"
      :error="error"
      @delete="handleDelete"
      @search="onSearch"
    >

      <template #price-cell={row}>
        {{ $formatCurrency(Number(row.original.price)) }}
      </template>

      <template #created_at-cell={row}>
        {{ $formatDate(row.original.created_at) }}
      </template>
    </DataTable>
  </DefaultList>
</template>
