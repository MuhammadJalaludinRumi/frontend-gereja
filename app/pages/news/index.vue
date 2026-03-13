<script setup lang="ts">
definePageMeta({
  middleware: ["role"],
  roles: [1],
});

const { news, meta, fetchAll, update, remove, loading, saving, error } = useNews();

const search = shallowRef('')

const pagination = ref({
  pageIndex: 0,
  pageSize: 10,
})

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

onMounted(fetchAll);

const columns = [
  { header: '#', accessorKey: 'id', id: 'id'},
  { header: 'Tanggal', accessorKey: 'date_post', id: 'date_post' },
  { header: 'Judul', accessorKey: 'title', id: 'title' },
  { header: 'Status', accessorKey: 'status', id: 'status' },
  { header: 'Tampil Di Login', accessorKey: 'show_on_login', id: 'show_on_login' },
]

const handleDelete = async (row: any ) => {
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

const toggleShowOnLogin = async (item: any) => {
  const newValue = item.show_on_login ? 0 : 1;

  try {
    await update(item.id, { show_on_login: newValue });
    item.show_on_login = newValue;
  } catch (err) {
    console.error("Gagal update:", err);
    alert("Gagal mengubah status");
  }
};
</script>

<template>
    <DefaultList title="Berita">
    <DataTable
      type="Berita"
      :data="news"
      :columns="columns" 
      :loading="loading || saving" 
      :error="error"
      :total="meta.total"
      :pagination="pagination"
      @update:pagination="pagination = $event"
      @delete="handleDelete"
      @search="onSearch"
      @retry="fetchAll"
    >
      <template #date_post-cell="{row}">
        {{ $formatDate(row.original.date_post) }}
      </template>

      <template #status-cell="{row}">
        <span :class="row.original.status ? 'text-primary' : 'text-error'">
          {{ row.original.status ? 'Aktif' : 'Nonaktif' }}
        </span>
      </template>

      <template #show_on_login-cell="{row}">
        <UButton
          :color="row.original.show_on_login ? 'primary' : 'neutral'"
          variant="soft"
          size="xs"
          :label="row.original.show_on_login ? 'Ya' : 'Tidak' "
          @click="toggleShowOnLogin(row.original)"
        />
      </template>
    </DataTable>
  </DefaultList>
</template>
