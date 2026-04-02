<script setup lang="ts">
definePageMeta({
  middleware: ['role'],
  roles: [1, 4]
})

const { roles, fetchAll, remove, loading, error } = useRoles()

const search = shallowRef('')

watch(
  (): [string] => [search.value],
  async ([searchValue]: [string]) => {
    await fetchAll({ search: searchValue })
  } 
)

const columns = [
  {header: '#', accessorKey: 'id', id: 'id'}, 
  {header: 'Organisasi', accessorKey: 'organization.name', id: 'organization.name'}, 
  {header: 'Nama Role', accessorKey: 'name', id: 'name'}, 
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
  <DefaultList title="Role">
    <DataTable
      type="Role"
      :data="roles"
      :columns="columns"
      :loading="loading"
      :error="error"
      @delete="handleDelete"
      @search="onSearch"
      @retry="fetchAll"
    />
  </DefaultList>
</template>

