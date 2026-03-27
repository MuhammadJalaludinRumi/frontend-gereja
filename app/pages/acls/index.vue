<script setup lang="ts">
definePageMeta({
  middleware: ['role'],
  roles: [1]
})

const { acls, fetchAll, remove, loading, error } = useAcls()

const search = shallowRef('')

watch(
  (): [string] => [search.value],
  async ([searchValue]: [string]) => {
    await fetchAll({ search: searchValue })
  } 
)

const columns = [
  {header: '#', accessorKey: 'id', id: 'id'}, 
  {header: 'Nama', accessorKey: 'name', id: 'name'}, 
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
  <DefaultList title="ACL">
    <DataTable
      type="ACL"
      :data="acls"
      :columns="columns"
      :loading="loading"
      :error="error"
      @delete="handleDelete"
      @search="onSearch"
      @retry="fetchAll"
    />
  </DefaultList>
</template>