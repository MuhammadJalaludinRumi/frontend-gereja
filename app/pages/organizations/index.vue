<script setup lang="ts">
definePageMeta({
  middleware: ['role'],
  roles: [1]
})

const { organizations, fetchAll, remove, loading, error } = useOrganizations()

const search = shallowRef('')

watch(
  (): [string] => [search.value],
  async ([searchValue]: [string]) => {
    await fetchAll({ search: searchValue })
  } 
)

const columns = [
  {header: '#', accessorKey: 'id', id: 'id'}, 
  {header: 'Logo', accessorKey: 'logo', id: 'logo'},
  {header: 'Nama', accessorKey: 'name', id: 'name'},
  {header: 'Kota', accessorKey: 'city.name', id: 'city.name'},
  {header: 'Alamat', accessorKey: 'address', id: 'address'},
  {header: 'Telepon', accessorKey: 'phone', id: 'phone'},
  {header: 'Email', accessorKey: 'email', id: 'email'},
  {header: 'Website', accessorKey: 'website', id: 'website'}
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
  <DefaultList title="Organisasi">
    <DataTable
      type="Organisasi"
      :data="organizations"
      :columns="columns"
      :loading="loading"
      :error="error"
      @delete="handleDelete"
      @search="onSearch"
      @retry="fetchAll"
    >
      <template #logo-cell="{ row }">
        <UAvatar
          :src="row.original.logo"
          size="xs"
        />
      </template>

      <template #email-cell="{ row }">
        <a 
          :href="`mailto:${row.original.email}`" 
          target="_blank"
          class="text-primary hover:underline"
        >
          {{ row.original.email }}
        </a>
      </template>

      <template #website-cell="{ row }">
        <ULink 
          :to="`https://${row.original.website}`" 
          target="_blank"
          class="text-primary hover:underline"
        >
          {{ row.original.website }}
        </ULink>
      </template>
    </DataTable>
  </DefaultList>
</template>