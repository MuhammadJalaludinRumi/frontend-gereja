<script setup lang="ts">
import DefaultList from '~/layouts/default-list.vue';

definePageMeta({
  middleware: ['role'],
  roles: [4]
})

const { economies, meta, fetchAll, remove, loading, error } = useEconomies()

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
  { header: 'Nama', accessorKey: 'member.name', id: 'member.name' },
  { header: 'Update', accessorKey: 'update', id: 'update', },
  { header: 'Kelas', accessorKey: 'class', id: 'class', },
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
  <DefaultList title="Ekonomi">
    <DataTable
      type="Ekonomi"
      :data="economies"
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
      <template #class-cell="{ row }">
        <span class="capitalize">
          {{ row.original.class }}
        </span>
      </template>
      <template #update-cell="{ row }">
        {{ $formatDate(row.original.update) }}
      </template>

      <template #actions-cell="{ row }">
        <UButton 
          :to="`/economy/${row.original.id}/history`" 
          icon="i-heroicons-calendar-days" 
          size="xs" 
          color="warning"
          variant="soft" 
          label="History"
        />
      </template>
    </DataTable>
  </DefaultList>
</template>