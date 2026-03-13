<script setup lang="ts">
import DefaultList from '~/layouts/default-list.vue';

definePageMeta({
  middleware: ['role'],
  roles: [4]
})

const { educations, meta, fetchAll, remove, loading, error } = useEducations()

const pagination = ref({
  pageIndex: 0,
  pageSize: 10
})

const search = ref('')

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

onMounted(async () => {
  await fetchAll({
    page: pagination.value.pageIndex + 1,
    per_page: pagination.value.pageSize,
  })
})

const columns = [
  { header: '#', accessorKey: 'id', id: 'id',},
  { header: 'Anggota', accessorKey: 'member_data.name', id: 'member_data.name' },
  { header: 'Jenjang', accessorKey: 'level', id: 'level', },
  { header: 'Institusi', accessorKey: 'institution', id: 'institution', },
  { header: 'Jurusan', accessorKey: 'major', id: 'major', },
  { header: 'Tahun', accessorKey: 'year_graduate', id: 'year_graduate', },
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

</script>

<template>
  <DefaultList title="Pendidikan">
    <DataTable 
      type="Pendidikan"
      :data="educations"
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