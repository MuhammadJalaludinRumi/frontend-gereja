<template>
  <div class="p-6 w-full overflow-hidden" style="background: var(--ui-bg); color: var(--ui-text)">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold" style="color: var(--ui-text-highlighted)">Daftar Economy</h1>
      <UButton to="/economy/create" icon="i-heroicons-plus-circle" color="primary" label="Tambah Economy" />
    </div>

    <UCard class="relative overflow-hidden">
      <div v-if="loading" class="p-4 text-center text-sm" style="color: var(--ui-text-muted)">
        Loading bentar...
      </div>

      <div v-else class="overflow-x-auto w-full">
        <table class="min-w-full table-auto border-collapse" style="color: var(--ui-text)">
          <thead style="background: var(--ui-bg-muted); border-bottom: 1px solid var(--ui-border)">
            <tr class="transition-colors hover:bg-gray-50/5 border-b border-gray-700/10">
              <th class="px-3 py-3 text-left text-xs font-semibold uppercase whitespace-nowrap">ID</th>
              <th class="px-3 py-3 text-left text-xs font-semibold uppercase whitespace-nowrap">Member</th>
              <th class="px-3 py-3 text-left text-xs font-semibold uppercase whitespace-nowrap">Update</th>
              <th class="px-3 py-3 text-left text-xs font-semibold uppercase whitespace-nowrap">Class</th>
              <th class="px-3 py-3 text-center text-xs font-semibold uppercase whitespace-nowrap">Aksi</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="item in economies" :key="item.id" class="transition-colors hover:bg-gray-50/5 border-b border-gray-700/10">
              <td class="px-3 py-3 text-sm font-medium whitespace-nowrap">{{ item.id }}</td>
              <td class="px-3 py-3 text-sm whitespace-nowrap">
                {{ item.member.name }}
              </td>
              <td class="px-3 py-3 text-sm whitespace-nowrap">{{ $formatDate(item.update) }}</td>
              <td class="px-3 py-3 text-sm whitespace-nowrap">{{ item.class }}</td>
              <td class="px-3 py-3 text-sm whitespace-nowrap">
                <div class="flex justify-center gap-2">
                  <UButton :to="`/economy/${item.id}`" icon="i-heroicons-pencil-square" size="xs" color="info"
                    variant="soft" label="Edit"/>
                  <UButton @click="openDeleteModal(item.id)" icon="i-heroicons-trash" size="xs" color="error"
                    variant="soft" label="Hapus"/>
                  <UButton :to="`/economy/${item.id}/history`" icon="i-heroicons-calendar-days" size="xs" color="warning"
                    variant="soft" label="History"/>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </UCard>

    <!-- Delete Modal -->
    <Teleport to="body">
      <div v-if="isDeleteModalOpen" class="fixed inset-0 z-99999 flex items-center justify-center bg-black/50">
        <UCard class="max-w-md w-full p-4">
          <div class="flex justify-between items-center">
            <h3 class="text-lg font-semibold">Konfirmasi Hapus</h3>
            <UButton color="neutral" variant="ghost" icon="i-heroicons-x-mark" @click="isDeleteModalOpen = false" />
          </div>
          <p class="my-4">Yakin mau hapus economy ini?</p>
          <div class="flex justify-end gap-2">
            <UButton color="neutral" label="Batal" @click="isDeleteModalOpen = false" />
            <UButton color="error" label="Hapus" @click="confirmDelete" />
          </div>
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
import { useEconomies } from '~/composables/useEconomies'

const { economies, fetchAll, remove, loading } = useEconomies()

const isDeleteModalOpen = ref(false)
const selectedId = ref<number | null>(null)

onMounted(async () => {
  await fetchAll()
})

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
