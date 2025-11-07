<!-- pages/rules/index.vue -->
<template>
  <div class="p-6 w-full overflow-hidden transition-colors duration-300" style="color: var(--ui-text); background: var(--ui-bg);">
    <!-- Header -->
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold" style="color: var(--ui-text-highlighted);">Daftar Rules</h1>
      <UButton to="/rules/create" icon="i-heroicons-plus-circle" size="md" color="primary" label="Tambah Rule" />
    </div>

    <!-- Loading -->
    <div v-if="loading" class="mb-4 text-sm text-gray-400">Loading...</div>

    <!-- Error -->
    <div v-if="error" class="mb-4 text-sm text-red-500">{{ error }}</div>

    <!-- Table Card -->
    <UCard v-else :ui="{ body: { padding: '' } }" class="relative z-0 overflow-hidden shadow-lg rounded-xl">
      <div class="overflow-x-auto w-full">
        <table class="min-w-full table-auto border-collapse" style="color: var(--ui-text);">
          <thead style="background: var(--ui-bg-muted); border-bottom: 1px solid var(--ui-border);">
            <tr>
              <th class="px-3 py-3 text-left text-xs font-semibold uppercase">Role</th>
              <th class="px-3 py-3 text-left text-xs font-semibold uppercase">ACL</th>
              <th class="px-3 py-3 text-left text-xs font-semibold uppercase">Permission</th>
              <th class="px-3 py-3 text-left text-xs font-semibold uppercase">Created At</th>
              <th class="px-3 py-3 text-center text-xs font-semibold uppercase">Aksi</th>
            </tr>
          </thead>

          <tbody style="background: var(--ui-bg);">
            <tr v-for="rule in rules" :key="rule.id" class="transition-colors cursor-pointer"
                :class="{ 'hovered-row': hover === rule.id }"
                @mouseover="hover = rule.id" @mouseleave="hover = null"
                :style="{ borderBottom: '1px solid var(--ui-border)' }">
              <td class="px-3 py-3 text-sm font-medium">{{ rule.role?.name ?? '-' }}</td>
              <td class="px-3 py-3 text-sm">{{ rule.acl?.name ?? '-' }}</td>
              <td class="px-3 py-3 text-sm">
                <span :class="rule.permission ? 'text-green-500 font-semibold' : 'text-red-500 font-semibold'">
                  {{ rule.permission ? 'Yes' : 'No' }}
                </span>
              </td>
              <td class="px-3 py-3 text-sm">{{ formatDate(rule.created_at) }}</td>
              <td class="px-3 py-3 text-sm text-center">
                <div class="flex justify-center gap-2">
                  <UButton :to="`/rules/${rule.id}`" icon="i-heroicons-pencil-square" size="xs" color="blue" variant="soft" label="Edit" />
                  <UButton @click.stop="openDeleteModal(rule.id)" icon="i-heroicons-trash" size="xs" color="red" variant="soft" label="Delete" />
                </div>
              </td>
            </tr>
            <tr v-if="rules.length === 0">
              <td colspan="5" class="text-center py-4 text-sm text-gray-400">No data found.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </UCard>

    <!-- Delete Modal -->
    <Teleport to="body">
      <div v-if="isDeleteModalOpen" class="fixed inset-0 z-[99999] flex items-center justify-center transition-all" style="background: rgba(0,0,0,0.5)">
        <UCard class="max-w-md w-full mx-4 shadow-2xl animate-fade-in" style="background: var(--ui-bg); color: var(--ui-text); border: 1px solid var(--ui-border);">
          <template #header>
            <div class="flex items-center justify-between">
              <h3 class="text-lg font-semibold" style="color: var(--ui-text-highlighted);">Konfirmasi Hapus</h3>
              <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark-20-solid" @click="isDeleteModalOpen = false" />
            </div>
          </template>
          <div class="py-4">
            <p style="color: var(--ui-text)">Apakah Anda yakin ingin menghapus rule ini?</p>
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
definePageMeta({
  middleware: ['role'],
  roles: [1, 4]
})

import { ref, onMounted } from 'vue'
import { useRules } from '~/composables/useRules'

const { rules, fetchAll, remove, loading, error } = useRules()
const hover = ref<number | null>(null)

const isDeleteModalOpen = ref(false)
const selectedRuleId = ref<number | null>(null)

const openDeleteModal = (id: number) => {
  selectedRuleId.value = id
  isDeleteModalOpen.value = true
}

const confirmDelete = async () => {
  if (!selectedRuleId.value) return
  try {
    await remove(selectedRuleId.value)
    isDeleteModalOpen.value = false
  } catch (err) {
    console.error('Gagal menghapus rule:', err)
  }
}

const formatDate = (date: string) => (date ? date.split('T')[0] : '-')

onMounted(fetchAll)
</script>

<style scoped>
.hovered-row {
  background: var(--ui-bg-muted) !important;
  transition: background 0.2s ease-in-out;
}
.animate-fade-in {
  animation: fadeIn 0.3s ease-out;
}
@keyframes fadeIn {
  from { opacity: 0; transform: scale(0.96); }
  to { opacity: 1; transform: scale(1); }
}
</style>
