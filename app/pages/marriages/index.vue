<template>
  <div class="p-6 w-full overflow-hidden" style="color: var(--ui-text); background: var(--ui-bg);">
    <!-- Header -->
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold" style="color: var(--ui-text-highlighted);">
        Daftar Pernikahan
      </h1>
      <UButton to="/marriages/create" icon="i-heroicons-plus-circle" size="md" color="primary"
        label="Tambah Pernikahan" />
    </div>

    <!-- Search Bar -->
    <div class="mb-4">
      <UInput
        v-model="searchQuery"
        icon="i-heroicons-magnifying-glass"
        size="lg"
        placeholder="Cari berdasarkan nama istri, suami, pelayan, atau lokasi..."
        :ui="{ icon: { trailing: { pointer: '' } } }"
      >
        <template #trailing>
          <UButton
            v-show="searchQuery !== ''"
            color="gray"
            variant="link"
            icon="i-heroicons-x-mark-20-solid"
            :padded="false"
            @click="searchQuery = ''"
          />
        </template>
      </UInput>
    </div>

    <!-- Info & Results Count -->
    <div class="mb-3 flex justify-between items-center">
      <p class="text-sm" style="color: var(--ui-text-muted);">
        Menampilkan {{ paginatedMarriages.length }} dari {{ filteredMarriages.length }} data pernikahan
        <span v-if="searchQuery">(hasil pencarian)</span>
      </p>
    </div>

    <!-- Table Card -->
    <UCard :ui="{ body: { padding: '' } }" class="relative z-0 overflow-hidden">
      <div class="overflow-x-auto w-full">
        <table class="min-w-full table-auto border-collapse" style="color: var(--ui-text);">
          <thead style="background: var(--ui-bg-muted); border-bottom: 1px solid var(--ui-border);">
            <tr>
              <th v-for="head in tableHeaders" :key="head"
                class="px-3 py-3 text-left text-xs font-semibold uppercase whitespace-nowrap"
                style="color: var(--ui-text-highlighted);">
                {{ head }}
              </th>
              <th class="px-3 py-3 text-center text-xs font-semibold uppercase whitespace-nowrap"
                style="color: var(--ui-text-highlighted);">
                Action
              </th>
            </tr>
          </thead>

          <tbody style="background: var(--ui-bg);">
            <tr v-if="paginatedMarriages.length === 0">
              <td :colspan="tableHeaders.length + 1" class="px-3 py-8 text-center text-sm" style="color: var(--ui-text-muted);">
                {{ searchQuery ? 'Tidak ada data yang cocok dengan pencarian' : 'Tidak ada data pernikahan' }}
              </td>
            </tr>
            <tr v-for="m in paginatedMarriages" :key="m.id" class="transition-colors" :style="{
              borderBottom: '1px solid var(--ui-border)',
              background: 'var(--ui-bg)',
            }" @mouseover="hover = m.id" @mouseleave="hover = null" :class="{ 'hovered-row': hover === m.id }">
              <!-- Bride -->
              <td class="px-3 py-3 text-sm whitespace-nowrap">
                <div class="flex flex-col">
                  <span class="font-medium">{{ m.brideMember?.name || m.bride_name || '-' }}</span>
                  <small v-if="m.brideMember" class="text-xs">ID: {{ m.brideMember.id }}</small>
                </div>
              </td>
              <!-- Groom -->
              <td class="px-3 py-3 text-sm whitespace-nowrap">
                <div class="flex flex-col">
                  <span class="font-medium">{{ m.groomMember?.name || m.groom_name || '-' }}</span>
                  <small v-if="m.groomMember" class="text-xs">ID: {{ m.groomMember.id }}</small>
                </div>
              </td>
              <!-- Date (without time) -->
              <td class="px-3 py-3 text-sm whitespace-nowrap">{{ formatDate(m.date) }}</td>

              <!-- Venue -->
              <td class="px-3 py-3 text-sm max-w-[220px] truncate">{{ m.venue || '-' }}</td>

              <!-- Priest -->
              <td class="px-3 py-3 text-sm whitespace-nowrap">
                <div class="flex flex-col">
                  <span class="font-medium">{{ m.priestMember?.name || m.priest_name || '-' }}</span>
                  <small v-if="m.priestMember" class="text-xs">ID: {{ m.priestMember.id }}</small>
                </div>
              </td>

              <!-- is_active (1 = pasangan saat ini, 0 = cerai hidup/cerai mati) -->
              <td class="px-3 py-3 text-sm whitespace-nowrap">
                <span :class="m.is_active ? 'text-green-600 font-medium' : 'text-red-600 font-medium'">
                  {{ m.is_active ? 'Pasangan Saat Ini' : 'Cerai (tercatat)' }}
                </span>
              </td>

              <!-- raw fields for clarity (optional columns: bride_name/groom_name/priest_name) -->
              <td class="px-3 py-3 text-sm whitespace-nowrap">{{ m.bride_name || '-' }}</td>
              <td class="px-3 py-3 text-sm whitespace-nowrap">{{ m.groom_name || '-' }}</td>
              <td class="px-3 py-3 text-sm whitespace-nowrap">{{ m.priest_name || '-' }}</td>

              <!-- Actions -->
              <td class="px-3 py-3 text-sm whitespace-nowrap">
                <div class="flex justify-center gap-2">
                  <UButton :to="`/marriages/${m.id}`" icon="i-heroicons-pencil-square" size="xs" color="blue"
                    variant="soft" label="Edit" />
                  <UButton @click.stop="openDeleteModal(m.id)" icon="i-heroicons-trash" size="xs" color="red"
                    variant="soft" label="Delete" />
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </UCard>

    <!-- Pagination -->
    <div class="flex justify-between items-center mt-4">
      <div class="text-sm" style="color: var(--ui-text-muted);">
        Halaman {{ currentPage }} dari {{ totalPages }}
      </div>
      <div class="flex gap-2">
        <UButton
          icon="i-heroicons-chevron-left"
          size="sm"
          color="gray"
          variant="soft"
          :disabled="currentPage === 1"
          @click="currentPage--"
        />
        <UButton
          v-for="page in visiblePages"
          :key="page"
          size="sm"
          :color="currentPage === page ? 'primary' : 'gray'"
          :variant="currentPage === page ? 'solid' : 'soft'"
          :label="String(page)"
          @click="currentPage = page"
        />
        <UButton
          icon="i-heroicons-chevron-right"
          size="sm"
          color="gray"
          variant="soft"
          :disabled="currentPage === totalPages"
          @click="currentPage++"
        />
      </div>
    </div>

    <!-- Delete Modal -->
    <Teleport to="body">
      <div v-if="isDeleteModalOpen" class="fixed inset-0 z-[99999] flex items-center justify-center"
        style="background: rgba(0,0,0,0.5);">
        <UCard class="max-w-md w-full mx-4"
          style="background: var(--ui-bg); color: var(--ui-text); border: 1px solid var(--ui-border);">
          <template #header>
            <div class="flex items-center justify-between">
              <h3 class="text-lg font-semibold" style="color: var(--ui-text-highlighted);">
                Konfirmasi Hapus
              </h3>
              <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark-20-solid"
                @click="isDeleteModalOpen = false" />
            </div>
          </template>

          <div class="py-4">
            <p style="color: var(--ui-text);">Yakin ingin menghapus data pernikahan ini?</p>
            <p class="text-sm text-muted mt-2">ID: {{ selectedId }}</p>
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
  roles: [4]
})

import { ref, computed, onMounted, watch } from 'vue'
import { useMarriages } from '~/composables/useMarriages'

const { marriages: marriagesRef, fetchAll, remove } = useMarriages()

const marriages = ref<any[]>([])
const hover = ref<string | null>(null)
const isDeleteModalOpen = ref(false)
const selectedId = ref<string>('')
const searchQuery = ref('')
const currentPage = ref(1)
const itemsPerPage = 10

const tableHeaders = [
  'Istri', 'Suami', 'Tanggal', 'Lokasi',
  'Pelayan', 'Status',
  'Nama Istri', 'Nama Suami', 'Nama Pelayan'
]

// Filter marriages based on search query
const filteredMarriages = computed(() => {
  if (!searchQuery.value) return marriages.value

  const query = searchQuery.value.toLowerCase()
  return marriages.value.filter(m => {
    return (
      m.brideMember?.name?.toLowerCase().includes(query) ||
      m.bride_name?.toLowerCase().includes(query) ||
      m.groomMember?.name?.toLowerCase().includes(query) ||
      m.groom_name?.toLowerCase().includes(query) ||
      m.priestMember?.name?.toLowerCase().includes(query) ||
      m.priest_name?.toLowerCase().includes(query) ||
      m.venue?.toLowerCase().includes(query)
    )
  })
})

// Calculate total pages
const totalPages = computed(() => {
  return Math.ceil(filteredMarriages.value.length / itemsPerPage) || 1
})

// Get paginated marriages
const paginatedMarriages = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredMarriages.value.slice(start, end)
})

// Calculate visible page numbers (max 5 pages shown)
const visiblePages = computed(() => {
  const pages = []
  const maxVisible = 5
  let startPage = Math.max(1, currentPage.value - Math.floor(maxVisible / 2))
  let endPage = Math.min(totalPages.value, startPage + maxVisible - 1)

  if (endPage - startPage + 1 < maxVisible) {
    startPage = Math.max(1, endPage - maxVisible + 1)
  }

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i)
  }
  return pages
})

// Reset to page 1 when search query changes
watch(searchQuery, () => {
  currentPage.value = 1
})

const load = async () => {
  try {
    await fetchAll()
    marriages.value = marriagesRef.value
  } catch (err) {
    console.error('Gagal memuat marriages:', err)
    marriages.value = []
  }
}

onMounted(load)

const openDeleteModal = (id: string | number) => {
  selectedId.value = String(id)
  isDeleteModalOpen.value = true
}

const confirmDelete = async () => {
  if (!selectedId.value) return
  try {
    await remove(selectedId.value)
    isDeleteModalOpen.value = false
    await load()
  } catch (err) {
    console.error('Gagal menghapus marriage:', err)
  }
}

const formatDate = (d: any) => {
  if (!d) return '-'
  // Handle ISO format (2025-11-10T00:00:00.000000Z) or standard format (2025-11-10 00:00:00)
  const dateOnly = d.split('T')[0].split(' ')[0]
  return dateOnly
}
</script>

<style scoped>
.hovered-row {
  background: var(--ui-bg-muted) !important;
}
.text-muted {
  color: rgba(255,255,255,0.6);
}
</style>
