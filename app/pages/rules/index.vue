<script setup lang="ts">
definePageMeta({
  middleware: ['role'],
  roles: [1, 4]
})

const { rules, fetchAll, remove, loading, error } = useRules()

const search = shallowRef('')

watch(
  (): [string] => [search.value],
  async ([searchValue]: [string]) => {
    await fetchAll({ search: searchValue })
  } 
)

const columns = [
  {header: '#', accessorKey: 'id', id: 'id'}, 
  {header: 'Role', accessorKey: 'role.name', id: 'role.name'}, 
  {header: 'ACL', accessorKey: 'acl.name', id: 'acl.name'}, 
  {header: 'Permission', accessorKey: 'permission', id: 'permission'}, 
  {header: 'Tanggal Dibuat', accessorKey: 'created_at', id: 'created_at'},
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
  <DefaultList title="Rule">
    <DataTable
      type="Rule"
      :data="rules"
      :columns="columns"
      :loading="loading"
      :error="error"
      @delete="handleDelete"
      @search="onSearch"
      @retry="fetchAll"
    >
      <template #permission-cell="{ row }">
        <span 
          :class="
            row.original.permission ? 'text-primary' : 'text-error'
          "
        >
          {{ row.original.permission ? 'Ya' : 'Tidak' }}
        </span>
      </template>

      <template #created_at-cell="{ row }">
        {{ $formatDate(row.original.created_at) }}
      </template>
    </DataTable>
  </DefaultList>
</template>



