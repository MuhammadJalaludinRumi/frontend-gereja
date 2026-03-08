<script setup lang="ts">
import DefaultList from '~/layouts/default-list.vue';

definePageMeta({
  middleware: ['role'],
  roles: [4]
})

const { events, meta, fetchAll, remove, loading, error } = useEvent()

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

onMounted(fetchAll)
const columns = [
  { header: '#', accessorKey: 'id', id: 'id', },
  { header: 'Jenis Kebaktian', accessorKey: 'service_type', id: 'service_type', },
  { header: 'Tanggal', accessorKey: 'service_date', id: 'service_date', },
  { header: 'Waktu', accessorKey: 'service_time', id: 'service_time', },
  { header: 'Pelayan Kebaktian', accessorKey: 'service_ministry.name', id: 'service_ministry.name', },
  { header: 'Asal Jemaat Pelayan Kebaktian', accessorKey: 'organization.name', id: 'organization.name', },
  { header: 'Pembacaan Alkitab', accessorKey: 'scripture_reading', id: 'scripture_reading', },
  { header: 'Nats Khotbah', accessorKey: 'sermon_text', id: 'sermon_text', },
  { header: 'Tema', accessorKey: 'sermon_theme', id: 'sermon_theme', },
  { header: 'Koordinator', accessorKey: 'coordinator.name', id: 'coordinator.name', },
  { header: 'Liturgos', accessorKey: 'liturgist.name', id: 'liturgist.name', },
  { header: 'Pendamping PF', accessorKey: 'pf_assistant.name', id: 'pf_assistant.name', },
  { header: 'Pemusik', accessorKey: 'musician', id: 'musician', },
  { header: 'Pemandu Pujian', accessorKey: 'worship_leader', id: 'worship_leader', },
  { header: 'Petugas Persembahan', accessorKey: 'offering_officer', id: 'offering_officer', },
  { header: 'Paduan Suara', accessorKey: 'choir', id: 'choir', },
  { header: 'Jumlah Hadir (Pria)', accessorKey: 'male_attendance', id: 'male_attendance', },
  { header: 'Jumlah Hadir (Wanita)', accessorKey: 'female_attendance', id: 'female_attendance', },
  { header: 'Jumlah Hadir (Total)', accessorKey: 'total_attendance', id: 'total_attendance', },
  { header: 'Persembahan (Amplop Merah)', accessorKey: 'red_envelope', id: 'red_envelope', },
  { header: 'Persembahan (Amplop Biru)', accessorKey: 'blue_envelope', id: 'blue_envelope', },
  { header: 'Persembahan (Amplop Lainnya)', accessorKey: 'other_envelope', id: 'other_envelope', },
  { header: 'Persembahan Total', accessorKey: 'total_envelope', id: 'total_envelope', },
  { header: 'Catatan', accessorKey: 'note', id: 'note', },
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
  <DefaultList title="Agenda">
    <DataTable
      type="Agenda"
      :data="events"
      :columns="columns"
      :loading="loading"
      :total="meta.total"
      :pagination="pagination"
      @update:pagination="pagination = $event"
      @delete="handleDelete"
      @search="onSearch"
    >
      <template #service_date-cell={row}>
        {{ $formatDate(row.original.service_date) }}
      </template>
      <template #musician-cell={row}>
        {{ row.original.musician?.map((m: any) => m.name).join(', ') }}
      </template>
      <template #worship_leader-cell={row}>
        {{ row.original.worship_leader?.map((m: any) => m.name).join(', ') }}
      </template>
      <template #offering_officer-cell={row}>
        {{ row.original.offering_officer?.map((m: any) => m.name).join(', ') }}
      </template>
      <template #choir-cell={row}>
        {{ row.original.choir?.map((m: any) => m.name).join(', ') }}
      </template>
    </DataTable>
  </DefaultList>
</template>