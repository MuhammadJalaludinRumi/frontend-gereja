<script setup lang="ts">
import DefaultList from '~/layouts/default-list.vue'

definePageMeta({
  middleware: ['role'],
  roles: [4]
})

const { members, meta, fetchAll, remove } = useMembers()
const loading = ref(true)

const showDetailModal = ref(false)
const selectedRow = ref<any>(null)
const confirm = useConfirmDialog()

const toast = useToast()

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
    console.error("Error fetching members:", err)
  } finally {
    loading.value = false
  }
})

const columns = [
  { header: '#', accessorKey: 'id', id: 'id', sortable: true},
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

// const handleDelete = async (row: any) => {
//   const confirmed = await confirm({
//     title: 'Konfirmasi Hapus',
//     type: 'anggota',
//     data: row.name
//   })

//   if (confirmed) {
//     loading.value = true
//     try {
//       await remove(row.id)
//       toast.add({
//         title: 'Berhasil Menghapus',
//         description: `Anggota ${row.name} berhasil dihapus.`,
//         color: 'success'
//       })

//       await fetchAll()
//     } catch (err) {
//       console.error("Error deleting member:", err)
      
//       toast.add({
//         title: 'Gagal Menghapus',
//         description: 'Terjadi kesalahan saat menghapus anggota. Silakan coba lagi.',
//         color: 'error'
//       })
//     } finally {
//       loading.value = false
//     }
//   }
// }

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
      :data="membersData" 
      :columns="columns" 
      :loading="loading" 
      :show-detail="true" 
      :total="meta.total"
      :pagination="pagination"
      @update:pagination="pagination = $event"
      @detail="openDetail"
      @delete="handleDelete"
      @search="onSearch"
    >
      <template #photo-cell="{row}">
        <UAvatar
          :src="row.original.photo"
          size="xs"
        />
      </template>
    </DataTable>

    <MemberDetail
      v-model="showDetailModal"
      :data="selectedRow"
    />
  </DefaultList>
</template>