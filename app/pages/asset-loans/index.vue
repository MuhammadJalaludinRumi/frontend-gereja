<template>
  <div class="p-6 w-full overflow-hidden" style="color: var(--ui-text); background: var(--ui-bg);">
    <!-- Header -->
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold" style="color: var(--ui-text-highlighted);">
        Daftar Peminjaman Asset
      </h1>
      <UButton
        to="/asset-loans/create"
        icon="i-heroicons-plus-circle"
        size="md"
        color="primary"
        label="Tambah Peminjaman"
      />
    </div>

    <!-- Table -->
    <UCard :ui="{ body: { padding: '' } }" class="relative z-0 overflow-hidden">
      <div class="overflow-x-auto w-full">
        <table class="min-w-full table-auto border-collapse">
          <thead style="background: var(--ui-bg-muted); border-bottom: 1px solid var(--ui-border);">
            <tr>
              <th v-for="h in tableHeaders" :key="h"
                class="px-3 py-3 text-left text-xs font-semibold uppercase whitespace-nowrap"
                style="color: var(--ui-text-highlighted);">
                {{ h }}
              </th>
              <th class="px-3 py-3 text-center text-xs font-semibold uppercase">Action</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="item in loans" :key="item.id"
              class="transition-colors"
              :style="{ borderBottom: '1px solid var(--ui-border)' }">

              <td class="px-3 py-3">{{ item.asset?.name || '-' }}</td>
              <td class="px-3 py-3">{{ item.borrower_name }}</td>
              <td class="px-3 py-3 capitalize">{{ item.borrower_type }}</td>
              <td class="px-3 py-3">{{ item.loan_date }}</td>
              <td class="px-3 py-3">{{ item.expected_return_date }}</td>
              <td class="px-3 py-3">{{ item.actual_return_date || '-' }}</td>

              <td class="px-3 py-3">
                <UBadge :color="statusColor(item.status)" variant="soft">
                  {{ item.status }}
                </UBadge>
              </td>

              <td class="px-3 py-3 max-w-[200px] truncate">{{ item.notes }}</td>

              <td class="px-3 py-3 whitespace-nowrap">
                <div class="flex justify-center gap-2">
                  <UButton
                    size="xs"
                    color="blue"
                    variant="soft"
                    :to="`/asset-loans/${item.id}`"
                    icon="i-heroicons-pencil-square"
                    label="Edit" />

                  <UButton
                    size="xs"
                    color="red"
                    variant="soft"
                    icon="i-heroicons-trash"
                    @click="openDelete(item.id)"
                    label="Delete" />
                </div>
              </td>

            </tr>
          </tbody>
        </table>
      </div>
    </UCard>

    <!-- Delete Modal -->
    <Teleport to="body">
      <div
        v-if="deleteModal"
        class="fixed inset-0 z-[99999] flex items-center justify-center"
        style="background: rgba(0,0,0,0.5);"
      >
        <UCard class="max-w-md w-full mx-4"
          style="background: var(--ui-bg); color: var(--ui-text); border: 1px solid var(--ui-border);">

          <template #header>
            <div class="flex justify-between items-center">
              <h3 class="text-lg font-semibold">Konfirmasi Hapus</h3>
              <UButton icon="i-heroicons-x-mark" variant="ghost" @click="deleteModal = false" />
            </div>
          </template>

          <p class="py-4">Yakin ingin menghapus data ini?</p>

          <template #footer>
            <div class="flex justify-end gap-3">
              <UButton color="gray" variant="soft" @click="deleteModal = false">Batal</UButton>
              <UButton color="red" @click="confirmDelete">Hapus</UButton>
            </div>
          </template>

        </UCard>
      </div>
    </Teleport>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAssetLoans } from '~/composables/useAssetLoans'

const { loans, fetchAll, remove } = useAssetLoans()

const tableHeaders = [
  "Asset", "Peminjam", "Tipe", "Tgl Pinjam",
  "Tgl Kembali (Ekspektasi)", "Tgl Dikembalikan",
  "Status", "Catatan"
]

const deleteModal = ref(false)
const selectedId = ref(null)

const fetchData = async () => {
  await fetchAll()
}

onMounted(fetchData)

const openDelete = (id) => {
  selectedId.value = id
  deleteModal.value = true
}

const confirmDelete = async () => {
  await remove(selectedId.value)
  deleteModal.value = false
  fetchData()
}

const statusColor = (s) => {
  return {
    borrowed: 'yellow',
    returned: 'green',
    late: 'red'
  }[s] || 'gray'
}
</script>

<style scoped>
.hovered-row {
  background: var(--ui-bg-muted) !important;
}
</style>
