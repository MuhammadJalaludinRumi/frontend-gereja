<script setup lang="ts">
definePageMeta({
  middleware: ['role'],
  roles: [1]
})

const { userAuthorities, loading, error, fetchAll, remove } = useUserAuthorities()

const search = shallowRef('')

watch(
  (): [string] => [search.value],
  async ([searchValue]: [string]) => {
    await fetchAll({ search: searchValue })
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
      @delete="handleDelete"
      @search="onSearch"
      @retry="fetchAll"
    />
  </DefaultList>
</template>

