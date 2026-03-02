<script setup lang="ts">
import DefaultList from '~/layouts/default-list.vue';

definePageMeta({
  middleware: ['role'],
  roles: [4]
})

const { educations, meta, fetchAll, remove } = useEducations()
const loading = ref(true)

const pagination = ref({
  pageIndex: 0,
  pageSize: 10
})

const search = ref('')

watch(
  (): [number, number, string] => [pagination.value.pageIndex, pagination.value.pageSize, search.value],
  async ([pageIndex, pageSize, searchValue]: [number, number, string]) => {
    loading.value = true
    try {
      await fetchAll({
        page: pageIndex + 1,
        per_page: pageSize,
        search: searchValue
      })
    } finally {
      loading.value = false
    }
  }
)

onMounted(async () => {
  try {
    await fetchAll({
      page: pagination.value.pageIndex + 1,
      per_page: pagination.value.pageSize,
    })
  } catch (err) {
    console.error("Error fetching marriages:", err)
  } finally {
    loading.value = false
  }
})

const columns = [
  { header: '#', accessorKey: 'id', id: 'id',},
  { header: 'Anggota', accessorKey: 'member_name', id: 'member_name' },
  { header: 'Jenjang', accessorKey: 'level', id: 'level', },
  { header: 'Institusi', accessorKey: 'institution', id: 'institution', },
  { header: 'Jurusan', accessorKey: 'major', id: 'major', },
  { header: 'Tahun', accessorKey: 'year_graduate', id: 'year_graduate', },
]

const educationData = computed(() => {
  return educations.value.map(education => ({
    ...education,
    member_name: education.member_data.name ?? '-'
  }))
})

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
      :data="educationData"
      :columns="columns"
      :loading="loading"
      :total="meta.total"
      :pagination="pagination"
      @update:pagination="pagination = $event"
      @delete="handleDelete"
      @search="onSearch"
    />
  </DefaultList>
</template>