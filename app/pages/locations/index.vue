<template>
  <div class="p-6 w-full" style="color: var(--ui-text); background: var(--ui-bg);">

    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold" style="color: var(--ui-text-highlighted);">
        Locations
      </h1>
      <UButton to="/locations/create" icon="i-heroicons-plus-circle" color="primary" label="Tambah Lokasi" />
    </div>

    <UCard :ui="{ body: { padding: '' } }">
      <div class="overflow-x-auto">

        <table class="min-w-full table-auto border-collapse" style="color: var(--ui-text);">
          <thead style="background: var(--ui-bg-muted); border-bottom: 1px solid var(--ui-border);">
            <tr>
              <th class="px-3 py-3 text-xs font-semibold uppercase text-left">Name</th>
              <th class="px-3 py-3 text-xs font-semibold uppercase text-left">Parent</th>
              <th class="px-3 py-3 text-xs font-semibold uppercase text-left">Description</th>
              <th class="px-3 py-3 text-xs font-semibold uppercase text-center">Action</th>
            </tr>
          </thead>

          <tbody>
            <tr
              v-for="loc in locations"
              :key="loc.id"
              :style="{ borderBottom: '1px solid var(--ui-border)' }"
            >
              <td class="px-3 py-3 text-sm font-medium">{{ loc.name }}</td>
              <td class="px-3 py-3 text-sm">{{ loc.parent?.name ?? '-' }}</td>
              <td class="px-3 py-3 text-sm">{{ loc.description || '-' }}</td>

              <td class="px-3 py-3 text-sm">
                <div class="flex justify-center gap-2">
                  <UButton
                    :to="`/locations/${loc.id}`"
                    color="blue"
                    variant="soft"
                    size="xs"
                    icon="i-heroicons-pencil-square"
                    label="Edit"
                  />
                  <UButton
                    @click="openDeleteModal(loc.id)"
                    color="red"
                    variant="soft"
                    size="xs"
                    icon="i-heroicons-trash"
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
      <div v-if="isDeleteModalOpen" class="fixed inset-0 flex justify-center items-center bg-black/50 z-50">
        <UCard class="max-w-md w-full mx-4">

          <template #header>
            <div class="flex justify-between items-center">
              <h3 class="text-lg font-semibold">Konfirmasi Hapus</h3>
              <UButton icon="i-heroicons-x-mark" variant="ghost" @click="isDeleteModalOpen = false" />
            </div>
          </template>

          <p>Yakin ingin menghapus lokasi ini?</p>

          <template #footer>
            <div class="flex justify-end gap-3">
              <UButton label="Batal" variant="soft" @click="isDeleteModalOpen = false" />
              <UButton color="red" label="Hapus" @click="confirmDelete" />
            </div>
          </template>

        </UCard>
      </div>
    </Teleport>

  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: ['role'], roles: [4] })

import { ref, onMounted } from 'vue'
import { useLocations } from '~/composables/useLocations'

const { locations: refData, fetchAll, remove } = useLocations()

const locations = ref([])
const isDeleteModalOpen = ref(false)
const selectedId = ref<number | null>(null)

const loadData = async () => {
  await fetchAll()
  locations.value = refData.value
}

onMounted(loadData)

const openDeleteModal = (id: number) => {
  selectedId.value = id
  isDeleteModalOpen.value = true
}

const confirmDelete = async () => {
  if (!selectedId.value) return
  await remove(selectedId.value)
  await loadData()
  isDeleteModalOpen.value = false
}
</script>
