<script setup lang="ts">
definePageMeta({
  middleware: ['role'],
  roles: [1]
})

const { orgLicenses, meta, fetchAll, loading, error, remove } = useOrganizationLicenses()

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
  {header: 'Organisasi', accessorKey: 'organization.name', id: 'organization.name'}, 
  {header: 'Lisensi', accessorKey: 'license.name', id: 'license.name'}, 
  {header: 'Maks. Anggota', accessorKey: 'max_member', id: 'max_member'}, 
  {header: 'Aktif', accessorKey: 'is_active', id: 'is_active'}, 
  {header: 'Kedaluarsa', accessorKey: 'expiry', id: 'expiry'}, 
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
  <DefaultList title="Lisensi Organisasi">
    <DataTable
      type="Lisensi Organisasi"
      :data="orgLicenses"
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
      <template #is_active-cell="{ row }">
        <UBadge 
          :color="row.original.is_active ? 'primary' : 'error'"
          size="md"
          variant="soft"
        >
          {{ row.original.is_active ? 'Aktif' : 'Tidak' }}
        </UBadge>
      </template>

      <template #expiry-cell="{ row }">
        {{ $formatDate(row.original.expiry) }}
      </template>
    </DataTable>
  </DefaultList>
</template>
