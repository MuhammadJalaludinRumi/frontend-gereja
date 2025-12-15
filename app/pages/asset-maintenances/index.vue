<template>
  <div class="p-6 w-full overflow-hidden" style="color: var(--ui-text); background: var(--ui-bg);">
    <!-- Header -->
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold" style="color: var(--ui-text-highlighted);">Asset Maintenance</h1>

      <UButton
        to="/asset-maintenances/create"
        icon="i-heroicons-plus-circle"
        size="md"
        color="primary"
        label="Tambah Maintenance"
      />
    </div>

    <!-- Table -->
    <UCard :ui="{ body: { padding: '' } }" class="relative z-0 overflow-hidden">
      <div class="overflow-x-auto w-full">
        <table class="min-w-full table-auto border-collapse">
          <thead style="background: var(--ui-bg-muted); border-bottom: 1px solid var(--ui-border);">
            <tr>
              <th
                v-for="head in tableHeaders"
                :key="head"
                class="px-3 py-3 text-left text-xs font-semibold uppercase whitespace-nowrap"
                style="color: var(--ui-text-highlighted);"
              >
                {{ head }}
              </th>
              <th
                class="px-3 py-3 text-center text-xs font-semibold uppercase whitespace-nowrap"
                style="color: var(--ui-text-highlighted);"
              >
                Action
              </th>
            </tr>
          </thead>

          <tbody>
            <tr
              v-for="m in maintenances"
              :key="m.id"
              class="transition-colors"
              :style="{ borderBottom: '1px solid var(--ui-border)' }"
            >
              <td class="px-3 py-3 text-sm whitespace-nowrap">{{ m.asset_id }}</td>
              <td class="px-3 py-3 text-sm whitespace-nowrap">{{ m.maintenance_date }}</td>
              <td class="px-3 py-3 text-sm max-w-[250px] truncate">{{ m.description }}</td>
              <td class="px-3 py-3 text-sm whitespace-nowrap">{{ m.cost }}</td>
              <td class="px-3 py-3 text-sm whitespace-nowrap">{{ m.performed_by }}</td>
              <td class="px-3 py-3 text-sm whitespace-nowrap">
                {{ m.next_maintenance_date ?? '-' }}
              </td>

              <td class="px-3 py-3">
                <div class="flex justify-center gap-2">
                  <UButton
                    :to="`/asset-maintenances/${m.id}`"
                    icon="i-heroicons-pencil-square"
                    size="xs"
                    color="blue"
                    variant="soft"
                    label="Edit"
                  />

                  <UButton
                    @click.stop="openDeleteModal(m.id)"
                    icon="i-heroicons-trash"
                    size="xs"
                    color="red"
                    variant="soft"
                    label="Delete"
                  />
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
        v-if="isDeleteModalOpen"
        class="fixed inset-0 z-[99999] flex items-center justify-center"
        style="background: rgba(0,0,0,0.5);"
      >
        <UCard
          class="max-w-md w-full mx-4"
          style="background: var(--ui-bg); color: var(--ui-text); border: 1px solid var(--ui-border);"
        >
          <template #header>
            <div class="flex items-center justify-between">
              <h3 class="text-lg font-semibold" style="color: var(--ui-text-highlighted);">
                Konfirmasi Hapus
              </h3>
              <UButton
                color="gray"
                variant="ghost"
                icon="i-heroicons-x-mark-20-solid"
                @click="isDeleteModalOpen = false"
              />
            </div>
          </template>

          <div class="py-4">
            <p>Yakin ingin menghapus data ini?</p>
          </div>

          <template #footer>
            <div class="flex justify-end gap-3">
              <UButton color="gray" variant="soft" label="Batal" @click="isDeleteModalOpen = false" />
              <UButton color="red" label="Hapus" @click="confirmDelete" />
            </div>
          </template>
        </UCard>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAssetMaintenances } from '~/composables/useAssetMaintenances'

const {
  maintenances,
  fetchAll,
  remove
} = useAssetMaintenances()

const tableHeaders = [
  'Asset', 'Tanggal', 'Deskripsi', 'Biaya', 'Pelaksana', 'Next Maintenance'
]

const isDeleteModalOpen = ref(false)
const selectedId = ref<number | null>(null)

const loadData = async () => {
  await fetchAll()
}

onMounted(loadData)

const openDeleteModal = (id: number) => {
  selectedId.value = id
  isDeleteModalOpen.value = true
}

const confirmDelete = async () => {
  if (!selectedId.value) return
  await remove(selectedId.value)
  isDeleteModalOpen.value = false
  await loadData()
}
</script>
