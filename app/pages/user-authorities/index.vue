<script setup lang="ts">
definePageMeta({
  middleware: ['role'],
  roles: [1]
})

const { userAuthorities, meta, loading, error, fetchAll, remove } = useUserAuthorities()

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
  {header: 'Nama Pengguna', accessorKey: 'user.name', id: 'user.name'},
  {header: 'Role', accessorKey: 'role.name', id: 'role.name'}
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
  <DefaultList title="Otoritas Pengguna">
    <DataTable
      type="Otoritas Pengguna"
      :data="userAuthorities"
      :columns="columns"
      :loading="loading"
      :error="error"
      :total="meta.total"
      :pagination="pagination"
      @update:pagination="pagination = $event"
      @delete="handleDelete"
      @search="onSearch"
      @retry="fetchAll"
    />
  </DefaultList>
</template>

