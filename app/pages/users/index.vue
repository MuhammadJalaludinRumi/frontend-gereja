<template>
  <div
    class="p-6 w-full overflow-hidden transition-colors duration-300"
    style="color: var(--ui-text); background: var(--ui-bg);"
  >
    <!-- Header -->
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold" style="color: var(--ui-text-highlighted);">
        Daftar Pengguna
      </h1>
      <UButton
        to="/users/create"
        icon="i-heroicons-plus-circle"
        size="md"
        color="primary"
        label="Tambah User"
      />
    </div>

    <!-- Table Card -->
    <UCard :ui="{ body: { padding: '' } }" class="relative z-0 overflow-hidden shadow-lg rounded-xl">
      <div class="overflow-x-auto w-full">
        <table
          class="min-w-full table-auto border-collapse"
          style="color: var(--ui-text);"
        >
          <thead
            style="background: var(--ui-bg-muted); border-bottom: 1px solid var(--ui-border);"
          >
            <tr>
              <th
                v-for="head in tableHeaders"
                :key="head"
                class="px-3 py-3 text-left text-xs font-semibold uppercase whitespace-nowrap"
                style="color: var(--ui-text-highlighted);"
              >
                {{ head }}
              </th>
            </tr>
          </thead>

          <tbody style="background: var(--ui-bg);">
            <tr
              v-for="user in users"
              :key="user.id"
              class="transition-colors cursor-pointer"
              :class="{ 'hovered-row': hover === user.id }"
              @mouseover="hover = user.id"
              @mouseleave="hover = null"
              :style="{ borderBottom: '1px solid var(--ui-border)' }"
            >
              <td class="px-3 py-3 text-sm">{{ user.id }}</td>
              <td class="px-3 py-3 text-sm font-medium" style="color: var(--ui-text-highlighted);">
                {{ user.username }}
              </td>
              <td class="px-3 py-3 text-sm">{{ user.name }}</td>

              <td class="px-3 py-3 text-sm">
                <span
                  class="px-2 py-1 rounded-full text-xs font-semibold"
                  :class="user.is_active
                    ? 'bg-green-100 text-green-700 dark:bg-green-800 dark:text-green-100'
                    : 'bg-red-100 text-red-700 dark:bg-red-800 dark:text-red-100'"
                >
                  {{ user.is_active ? 'Active' : 'Inactive' }}
                </span>
              </td>

              <!-- Role Name -->
              <td class="px-3 py-3 text-sm font-medium" style="color: var(--ui-primary);">
                {{ user.role?.name || 'Tidak Ada Role' }}
              </td>

              <!-- Actions -->
              <td class="px-3 py-3 text-sm text-center whitespace-nowrap">
                <div class="flex justify-center gap-2">
                  <UButton
                    :to="`/users/${user.id}`"
                    icon="i-heroicons-pencil-square"
                    size="xs"
                    color="blue"
                    variant="soft"
                    label="Edit"
                  />
                  <UButton
                    @click.stop="openDeleteModal(user.id)"
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
        class="fixed inset-0 z-[99999] flex items-center justify-center transition-all"
        style="background: rgba(0, 0, 0, 0.5);"
      >
        <UCard
          class="max-w-md w-full mx-4 shadow-2xl animate-fade-in"
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
            <p>Apakah Anda yakin ingin menghapus pengguna ini?</p>
          </div>

          <template #footer>
            <div class="flex justify-end gap-3">
              <UButton
                color="gray"
                variant="soft"
                label="Batal"
                @click="isDeleteModalOpen = false"
              />
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
  roles: [1]
})

import { ref, onMounted } from 'vue'
import { useUsers } from '~/composables/useUsers'

const { users, fetchUsers, deleteUser } = useUsers()

const tableHeaders = ['ID', 'Username', 'Name', 'Active', 'Role', 'Actions']
const hover = ref<number | null>(null)

const isDeleteModalOpen = ref(false)
const selectedUserId = ref<number | null>(null)

const fetchData = async () => {
  try {
    await fetchUsers()
  } catch (error) {
    console.error('Gagal memuat data pengguna:', error)
  }
}

const openDeleteModal = (id: number) => {
  selectedUserId.value = id
  isDeleteModalOpen.value = true
}

const confirmDelete = async () => {
  if (!selectedUserId.value) return
  try {
    await deleteUser(selectedUserId.value)
    isDeleteModalOpen.value = false
    await fetchData()
  } catch (error) {
    console.error('Gagal menghapus user:', error)
  }
}

onMounted(fetchData)
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
  from {
    opacity: 0;
    transform: scale(0.96);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
</style>
