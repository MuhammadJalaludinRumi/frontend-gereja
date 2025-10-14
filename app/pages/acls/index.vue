<template>
  <div class="p-6 w-full overflow-hidden" style="background: var(--ui-bg); color: var(--ui-text);">
    <!-- Header -->
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold" style="color: var(--ui-text-highlighted);">Daftar ACL</h1>
      <UButton
        to="/acls/create"
        icon="i-heroicons-plus-circle"
        size="md"
        color="primary"
        label="Tambah ACL"
      />
    </div>

    <!-- Table Card -->
    <UCard :ui="{ body: { padding: '' } }" class="relative overflow-hidden">
      <div v-if="loading" class="p-4 text-center text-sm" style="color: var(--ui-text-muted);">
        Memuat data...
      </div>

      <div v-else class="overflow-x-auto w-full">
        <table class="min-w-full table-auto border-collapse" style="color: var(--ui-text);">
          <thead style="background: var(--ui-bg-muted); border-bottom: 1px solid var(--ui-border);">
            <tr>
              <th class="px-3 py-3 text-left text-xs font-semibold uppercase whitespace-nowrap" style="color: var(--ui-text-highlighted);">
                ID
              </th>
              <th class="px-3 py-3 text-left text-xs font-semibold uppercase whitespace-nowrap" style="color: var(--ui-text-highlighted);">
                Nama
              </th>
              <th class="px-3 py-3 text-center text-xs font-semibold uppercase whitespace-nowrap" style="color: var(--ui-text-highlighted);">
                Aksi
              </th>
            </tr>
          </thead>

          <tbody>
            <tr
              v-for="item in acls"
              :key="item.id"
              class="transition-colors"
              :style="{
                borderBottom: '1px solid var(--ui-border)',
                background: 'var(--ui-bg)',
              }"
              @mouseover="hover = item.id"
              @mouseleave="hover = null"
              :class="{ 'hovered-row': hover === item.id }"
            >
              <td class="px-3 py-3 text-sm font-medium whitespace-nowrap" style="color: var(--ui-text-highlighted);">
                {{ item.id }}
              </td>
              <td class="px-3 py-3 text-sm whitespace-nowrap">
                {{ item.name }}
              </td>
              <td class="px-3 py-3 text-sm whitespace-nowrap">
                <div class="flex justify-center gap-2">
                  <UButton
                    :to="`/acls/${item.id}`"
                    icon="i-heroicons-pencil-square"
                    size="xs"
                    color="blue"
                    variant="soft"
                    label="Edit"
                  />
                  <UButton
                    @click.stop="openDeleteModal(item.id)"
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
            <p>Yakin ingin menghapus ACL ini?</p>
          </div>

          <template #footer>
            <div class="flex justify-end gap-3">
              <UButton
                color="gray"
                variant="soft"
                label="Batal"
                @click="isDeleteModalOpen = false"
              />
              <UButton
                color="red"
                label="Hapus"
                @click="confirmDelete"
              />
            </div>
          </template>
        </UCard>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAcls } from '~/composables/useAcls'

const { acls, fetchAll, remove, loading } = useAcls()
const hover = ref<number | null>(null)
const isDeleteModalOpen = ref(false)
const selectedId = ref<number | null>(null)

onMounted(fetchAll)

const openDeleteModal = (id: number) => {
  selectedId.value = id
  isDeleteModalOpen.value = true
}

const confirmDelete = async () => {
  if (!selectedId.value) return
  await remove(selectedId.value)
  isDeleteModalOpen.value = false
  await fetchAll()
}
</script>

<style scoped>
.hovered-row {
  background: var(--ui-bg-muted) !important;
}
</style>