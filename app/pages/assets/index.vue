<template>
  <div class="p-6 w-full overflow-hidden" style="color: var(--ui-text); background: var(--ui-bg);">

    <!-- Header -->
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold" style="color: var(--ui-text-highlighted);">
        Assets
      </h1>

      <UButton
        to="/assets/create"
        icon="i-heroicons-plus-circle"
        size="md"
        color="primary"
        label="Tambah Asset"
      />
    </div>

    <!-- Table -->
    <UCard :ui="{ body: { padding: '' } }">
      <div class="overflow-x-auto">
        <table class="min-w-full table-auto border-collapse">
          <thead style="background: var(--ui-bg-muted); border-bottom: 1px solid var(--ui-border);">
            <tr>
              <th class="px-3 py-3 text-left text-xs font-semibold uppercase">Image</th>
              <th class="px-3 py-3 text-left text-xs font-semibold uppercase">Kode</th>
              <th class="px-3 py-3 text-left text-xs font-semibold uppercase">Nama</th>
              <th class="px-3 py-3 text-left text-xs font-semibold uppercase">Kategori</th>
              <th class="px-3 py-3 text-left text-xs font-semibold uppercase">Lokasi</th>
              <th class="px-3 py-3 text-left text-xs font-semibold uppercase">Kondisi</th>
              <th class="px-3 py-3 text-left text-xs font-semibold uppercase">Status</th>
              <th class="px-3 py-3 text-center text-xs font-semibold uppercase">Action</th>
            </tr>
          </thead>

          <tbody>
            <tr
              v-for="item in assets"
              :key="item.id"
              style="border-bottom: 1px solid var(--ui-border);"
            >
              <!-- IMAGE -->
              <td class="px-3 py-3">
                <img
                  v-if="item.image"
                  :src="item.image"
                  class="w-12 h-12 object-cover rounded-md border"
                />
                <div
                  v-else
                  class="w-12 h-12 flex items-center justify-center text-xs text-gray-400 border rounded-md"
                >
                  N/A
                </div>
              </td>

              <td class="px-3 py-3 text-sm font-medium">
                {{ item.asset_code }}
              </td>

              <td class="px-3 py-3">
                {{ item.name }}
              </td>

              <td class="px-3 py-3">
                {{ item.category?.name || '-' }}
              </td>

              <td class="px-3 py-3">
                {{ item.location?.name || '-' }}
              </td>

              <td class="px-3 py-3 capitalize">
                {{ item.condition }}
              </td>

              <td class="px-3 py-3">
                <UBadge
                  :color="item.status === 'disposed' ? 'red' : 'green'"
                  variant="soft"
                >
                  {{ item.status }}
                </UBadge>
              </td>

              <td class="px-3 py-3 text-sm whitespace-nowrap">
                <div class="flex justify-center gap-2">
                  <UButton
                    :to="`/assets/${item.id}`"
                    icon="i-heroicons-pencil-square"
                    color="blue"
                    size="xs"
                    variant="soft"
                    label="Edit"
                  />

                  <UButton
                    @click="openDeleteModal(item.id!)"
                    icon="i-heroicons-trash"
                    color="red"
                    size="xs"
                    variant="soft"
                    label="Delete"
                  />
                </div>
              </td>
            </tr>

            <tr v-if="assets.length === 0">
              <td colspan="8" class="text-center py-6 text-sm text-gray-400">
                Tidak ada data asset
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
        class="fixed inset-0 z-50 flex items-center justify-center"
        style="background: rgba(0,0,0,0.5);"
      >
        <UCard class="max-w-md w-full mx-4">
          <template #header>
            <div class="flex justify-between items-center">
              <h3 class="text-lg font-semibold">Konfirmasi Hapus</h3>
              <UButton
                color="gray"
                variant="ghost"
                icon="i-heroicons-x-mark"
                @click="isDeleteModalOpen = false"
              />
            </div>
          </template>

          <p>Yakin ingin menghapus asset ini?</p>

          <template #footer>
            <div class="flex justify-end gap-3">
              <UButton label="Batal" color="gray" variant="soft" @click="closeDelete" />
              <UButton label="Hapus" color="red" @click="confirmDelete" />
            </div>
          </template>
        </UCard>
      </div>
    </Teleport>

  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: ['role'],
  roles: [4],
})

import { ref, onMounted } from 'vue'
import { useAssets } from '~/composables/useAssets'

const { assets, fetchAll, remove } = useAssets()

const isDeleteModalOpen = ref(false)
const selectedId = ref<number | null>(null)

onMounted(fetchAll)

const openDeleteModal = (id: number) => {
  selectedId.value = id
  isDeleteModalOpen.value = true
}

const closeDelete = () => {
  selectedId.value = null
  isDeleteModalOpen.value = false
}

const confirmDelete = async () => {
  if (!selectedId.value) return
  await remove(selectedId.value)
  await fetchAll()
  closeDelete()
}
</script>
