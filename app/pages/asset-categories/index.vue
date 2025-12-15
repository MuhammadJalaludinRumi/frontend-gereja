<template>
  <div class="p-6 w-full overflow-hidden" style="color: var(--ui-text); background: var(--ui-bg);">

    <!-- Header -->
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold" style="color: var(--ui-text-highlighted);">
        Asset Categories
      </h1>
      <UButton
        to="/asset-categories/create"
        icon="i-heroicons-plus-circle"
        size="md"
        color="primary"
        label="Tambah Kategori"
      />
    </div>

    <!-- Table -->
    <UCard :ui="{ body: { padding: '' } }">
      <div class="overflow-x-auto">
        <table class="min-w-full table-auto border-collapse" style="color: var(--ui-text);">
          <thead style="background: var(--ui-bg-muted); border-bottom: 1px solid var(--ui-border);">
            <tr>
              <th class="px-3 py-3 text-left text-xs font-semibold uppercase whitespace-nowrap"
                  style="color: var(--ui-text-highlighted);">
                Name
              </th>
              <th class="px-3 py-3 text-left text-xs font-semibold uppercase whitespace-nowrap"
                  style="color: var(--ui-text-highlighted);">
                Description
              </th>
              <th class="px-3 py-3 text-center text-xs font-semibold uppercase whitespace-nowrap"
                  style="color: var(--ui-text-highlighted);">
                Action
              </th>
            </tr>
          </thead>

          <tbody>
            <tr
              v-for="cat in categories"
              :key="cat.id"
              class="transition-colors"
              :style="{ borderBottom: '1px solid var(--ui-border)' }"
            >
              <td class="px-3 py-3 text-sm font-medium">{{ cat.name }}</td>
              <td class="px-3 py-3 text-sm">{{ cat.description || '-' }}</td>

              <td class="px-3 py-3 text-sm whitespace-nowrap">
                <div class="flex justify-center gap-2">
                  <UButton
                    :to="`/asset-categories/${cat.id}`"
                    icon="i-heroicons-pencil-square"
                    size="xs"
                    color="blue"
                    variant="soft"
                    label="Edit"
                  />

                  <UButton
                    @click="openDeleteModal(cat.id)"
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
        class="fixed inset-0 z-50 flex items-center justify-center"
        style="background: rgba(0,0,0,0.5);"
      >
        <UCard class="max-w-md w-full mx-4">
          <template #header>
            <div class="flex items-center justify-between">
              <h3 class="text-lg font-semibold">Konfirmasi Hapus</h3>
              <UButton
                color="gray"
                variant="ghost"
                icon="i-heroicons-x-mark-20-solid"
                @click="isDeleteModalOpen = false"
              />
            </div>
          </template>

          <p>Yakin ingin menghapus data ini?</p>

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
definePageMeta({
  middleware: ['role'],
  roles: [4]
})

import { ref, onMounted } from 'vue'
import { useAssetCategories } from '~/composables/useAssetCategories'

const { categories: refData, fetchAll, remove } = useAssetCategories()

const categories = ref<any[]>([])
const isDeleteModalOpen = ref(false)
const selectedId = ref<string | null>(null)

const fetchData = async () => {
  await fetchAll()
  categories.value = refData.value
}

onMounted(fetchData)

const openDeleteModal = (id: string) => {
  selectedId.value = id
  isDeleteModalOpen.value = true
}

const confirmDelete = async () => {
  if (!selectedId.value) return
  await remove(selectedId.value)
  await fetchData()
  isDeleteModalOpen.value = false
}
</script>
