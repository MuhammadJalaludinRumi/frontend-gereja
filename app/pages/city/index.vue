<script setup lang="ts">
definePageMeta({
  middleware: ['role'],
  roles: [1]
})

const { cities, fetchAll, loading, error } = useCities()

const columns = [
  { header: '#', accessorKey: 'id', id: 'id' },
  { header: 'Nama Kota', accessorKey: 'name', id: 'name' },
  { header: 'Provinsi', accessorKey: 'province_name', id: 'province_name' },
]

onMounted(fetchAll)
</script>

<template>
  <DefaultList title="Kota" :show-add-button="false">
    <DataTable
      type="Kota"
      :data="cities"
      :columns="columns"
      :loading="loading"
      :error="error"
      :show-actions="false"
      :show-input-search="false"
      @retry="fetchAll"
    />
  </DefaultList>
</template>
