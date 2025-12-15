<template>
  <div class="p-6 w-full overflow-hidden" style="color: var(--ui-text); background: var(--ui-bg);">

    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold" style="color: var(--ui-text-highlighted);">
        Assets
      </h1>

      <UButton to="/assets/create" icon="i-heroicons-plus-circle" size="md" color="primary" label="Tambah Asset" />
    </div>

    <UCard :ui="{ body: { padding: '' } }">
      <div class="overflow-x-auto">
        <table class="min-w-full table-auto border-collapse">
          <thead style="background: var(--ui-bg-muted); border-bottom: 1px solid var(--ui-border);">
            <tr>
              <th class="px-3 py-3 text-left text-xs font-semibold uppercase">Kode</th>
              <th class="px-3 py-3 text-left text-xs font-semibold uppercase">Nama</th>
              <th class="px-3 py-3 text-left text-xs font-semibold uppercase">Kategori</th>
              <th class="px-3 py-3 text-left text-xs font-semibold uppercase">Lokasi</th>
              <th class="px-3 py-3 text-left text-xs font-semibold uppercase">Tanggal Beli</th>
              <th class="px-3 py-3 text-left text-xs font-semibold uppercase">Harga Beli</th>
              <th class="px-3 py-3 text-left text-xs font-semibold uppercase">Kondisi</th>
              <th class="px-3 py-3 text-left text-xs font-semibold uppercase">Status</th>
              <th class="px-3 py-3 text-left text-xs font-semibold uppercase">Vendor</th>
              <th class="px-3 py-3 text-left text-xs font-semibold uppercase">Catatan</th>
              <th class="px-3 py-3 text-center text-xs font-semibold uppercase">Action</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="item in assetList" :key="item.id" class="transition-colors"
              style="border-bottom: 1px solid var(--ui-border);">
              <td class="px-3 py-3 text-sm font-medium">{{ item.asset_code }}</td>
              <td class="px-3 py-3">{{ item.name }}</td>
              <td class="px-3 py-3">{{ item.category?.name }}</td>
              <td class="px-3 py-3">{{ item.location?.name }}</td>
              <td class="px-3 py-3">{{ item.purchase_date }}</td>
              <td class="px-3 py-3">{{ item.purchase_price }}</td>
              <td class="px-3 py-3">{{ item.condition }}</td>
              <td class="px-3 py-3">{{ item.status }}</td>
              <td class="px-3 py-3">{{ item.vendor }}</td>
              <td class="px-3 py-3">{{ item.notes }}</td>

              <td class="px-3 py-3 text-sm whitespace-nowrap">
                <div class="flex justify-center gap-2">
                  <UButton :to="`/assets/${item.id}`" icon="i-heroicons-pencil-square" color="blue" size="xs"
                    variant="soft" label="Edit" />
                  <UButton @click="openDeleteModal(item.id)" icon="i-heroicons-trash" color="red" size="xs"
                    variant="soft" label="Delete" />
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </UCard>

    <!-- Delete Modal -->
    <Teleport to="body">
      <div v-if="isDeleteModalOpen" class="fixed inset-0 z-50 flex items-center justify-center"
        style="background: rgba(0,0,0,0.5);">
        <UCard class="max-w-md w-full mx-4">
          <template #header>
            <div class="flex justify-between items-center">
              <h3 class="text-lg font-semibold">Konfirmasi Hapus</h3>
              <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark-20-solid"
                @click="isDeleteModalOpen = false" />
            </div>
          </template>

          <p>Yakin ingin menghapus asset ini?</p>

          <template #footer>
            <div class="flex justify-end gap-3">
              <UButton label="Batal" color="gray" variant="soft" @click="isDeleteModalOpen = false" />
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
  roles: [4]
})

import { ref, onMounted } from 'vue'
import { useAssets } from '~/composables/useAssets'

const { assets: refData, fetchAll, remove } = useAssets()

const assetList = ref([])
const isDeleteModalOpen = ref(false)
const selectedId = ref<number | null>(null)

const loadData = async () => {
  await fetchAll()
  assetList.value = refData.value
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
