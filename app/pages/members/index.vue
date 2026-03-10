<script setup lang="ts">
definePageMeta({
  middleware: ['role'],
  roles: [4]
})

const { members, meta, fetchAll, remove, loading, error } = useMembers()

const showDetailModal = ref(false)
const selectedRow = ref<any>(null)

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
  { header: '#', accessorKey: 'id', id: 'id'},
  { header: 'Foto', accessorKey: 'photo', id: 'photo' },
  { header: 'No Induk', accessorKey: 'id_local', id: 'id_local', sortable: true },
  { header: 'Nama', accessorKey: 'name', id: 'name', sortable: true },
  { header: 'Jenis Kelamin', accessorKey: 'sex', id: 'sex', sortable: true },
  { header: 'Usia', accessorKey: 'age', id: 'age', sortable: true }
]

const membersData = computed(() => {
  return members.value.map(member => ({
    ...member,
    sex: member.sex === 'L' ? 'Laki-laki' : member.sex === 'P' ? 'Perempuan' : '-',
    age: member.dob ? `${$age(member.dob)} Tahun` : '-'
  }))
})

const openDetail = (row: any) => {
  selectedRow.value = row
  showDetailModal.value = true
}

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
  <DefaultList title="Anggota">
    <DataTable
      type="Anggota"
      :data="membersData"
      :columns="columns" 
      :loading="loading" 
      :error="error"
      :total="meta.total"
      :pagination="pagination"
      @update:pagination="pagination = $event"
      @detail="openDetail"
      @delete="handleDelete"
      @search="onSearch"
      @retry="fetchAll"
    >
      <template #photo-cell="{row}">
        <UAvatar
          :src="row.original.photo"
          size="xs"
        />
      </template>
      
      <template #actions-cell="{ row }">
        <UButton
          icon="i-heroicons-information-circle"
          color="neutral"
          variant="soft"
          size="xs"
          label="Detail"
          @click="openDetail(row.original)"
        />
      </template>
    </DataTable>

    <MemberDetail
      v-model="showDetailModal"
      :data="selectedRow"
    />
  </DefaultList>
</template>