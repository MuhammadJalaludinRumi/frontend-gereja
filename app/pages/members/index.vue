<template>
  <div class="p-6 w-full overflow-hidden" style="color: var(--ui-text); background: var(--ui-bg);">
    <!-- Header -->
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold" style="color: var(--ui-text-highlighted);">Daftar Member</h1>
      <UButton to="/members/create" icon="i-heroicons-plus-circle" size="md" color="primary" label="Tambah Member" />
    </div>

    <!-- Search Bar -->
    <div class="mb-4">
      <UInput
        v-model="searchQuery"
        icon="i-heroicons-magnifying-glass"
        size="lg"
        placeholder="Cari berdasarkan nama, nomor ID, email, telepon..."
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
        Menampilkan {{ paginatedMembers.length }} dari {{ filteredMembers.length }} member
        <span v-if="searchQuery">(hasil pencarian)</span>
      </p>
    </div>

    <!-- Table Card -->
    <UCard :ui="{ body: { padding: '' } }" class="relative z-0 overflow-hidden">
      <div class="overflow-x-auto w-full">
        <table class="min-w-[2700px] table-auto border-collapse" style="color: var(--ui-text);">
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
            <tr v-if="paginatedMembers.length === 0">
              <td :colspan="tableHeaders.length + 1" class="px-3 py-8 text-center text-sm" style="color: var(--ui-text-muted);">
                {{ searchQuery ? 'Tidak ada data yang cocok dengan pencarian' : 'Tidak ada data member' }}
              </td>
            </tr>
            <tr v-for="m in paginatedMembers" :key="m.id" class="transition-colors"
              :style="{ borderBottom: '1px solid var(--ui-border)' }"
              @mouseover="hover = m.id" @mouseleave="hover = null"
              :class="{ 'hovered-row': hover === m.id }">

              <td class="px-3 py-3 text-sm font-medium whitespace-nowrap">{{ m.id_local || '-' }}</td>
              <td class="px-3 py-3 text-sm font-medium whitespace-nowrap">{{ m.name }}</td>
              <td class="px-3 py-3 text-sm whitespace-nowrap">{{ m.id_type || '-' }}</td>
              <td class="px-3 py-3 text-sm whitespace-nowrap">{{ m.id_number || '-' }}</td>
              <td class="px-3 py-3 text-sm whitespace-nowrap">{{ formatDate(m.dob) }}</td>
              <td class="px-3 py-3 text-sm whitespace-nowrap">{{ m.pob || '-' }}</td>
              <td class="px-3 py-3 text-sm whitespace-nowrap">{{ m.nationality || '-' }}</td>
              <td class="px-3 py-3 text-sm whitespace-nowrap">{{ m.ethnic || '-' }}</td>
              <td class="px-3 py-3 text-sm whitespace-nowrap">{{ m.sex || '-' }}</td>
              <td class="px-3 py-3 text-sm whitespace-nowrap">{{ m.phone || '-' }}</td>
              <td class="px-3 py-3 text-sm whitespace-nowrap">{{ m.email || '-' }}</td>
              <td class="px-3 py-3 text-sm max-w-[220px] truncate">{{ m.address || '-' }}</td>
              <td class="px-3 py-3 text-sm whitespace-nowrap">{{ typeof m.city === 'object' ? m.city?.name : m.city || '-' }}</td>
              <td class="px-3 py-3 text-sm whitespace-nowrap">{{ m.latitude || '-' }}</td>
              <td class="px-3 py-3 text-sm whitespace-nowrap">{{ m.longitude || '-' }}</td>

              <td class="px-3 py-3 text-sm whitespace-nowrap">
                <img v-if="m.photo" :src="m.photo" class="h-10 w-10 rounded object-cover border" alt="Foto" />
                <span v-else class="text-gray-400">-</span>
              </td>

              <td class="px-3 py-3 text-sm whitespace-nowrap">{{ m.marriage || '-' }}</td>
              <td class="px-3 py-3 text-sm whitespace-nowrap">
                <span :class="m.is_deceased == 1 ? 'text-red-500 font-semibold' : 'text-green-500'">
                  {{ formatBool(m.is_deceased) }}
                </span>
              </td>
              <td class="px-3 py-3 text-sm whitespace-nowrap">
                <span :class="m.is_active == 1 ? 'text-green-500 font-semibold' : 'text-gray-400'">
                  {{ formatBool(m.is_active) }}
                </span>
              </td>
              <td class="px-3 py-3 text-sm whitespace-nowrap">{{ m.family_id || '-' }}</td>
              <td class="px-3 py-3 text-sm whitespace-nowrap">{{ m.family_relation || '-' }}</td>
              <td class="px-3 py-3 text-sm whitespace-nowrap">{{ m.religion || '-' }}</td>
              <td class="px-3 py-3 text-sm whitespace-nowrap">{{ m.blood || '-' }}</td>
              <td class="px-3 py-3 text-sm whitespace-nowrap">{{ formatDate(m.baptist_date) }}</td>
              <td class="px-3 py-3 text-sm whitespace-nowrap">{{ m.baptist_place || '-' }}</td>
              <td class="px-3 py-3 text-sm whitespace-nowrap">{{ m.baptist_host_name || '-' }}</td>
              <td class="px-3 py-3 text-sm whitespace-nowrap">{{ formatDate(m.consecrate_date) }}</td>
              <td class="px-3 py-3 text-sm whitespace-nowrap">{{ m.consecrate_place || '-' }}</td>
              <td class="px-3 py-3 text-sm whitespace-nowrap">{{ m.consecrate_host_name || '-' }}</td>
              <td class="px-3 py-3 text-sm whitespace-nowrap">{{ formatDate(m.attest_date) }}</td>
              <td class="px-3 py-3 text-sm whitespace-nowrap">{{ m.attest_origin || '-' }}</td>

              <td class="px-3 py-3 text-sm whitespace-nowrap">
                <div class="flex justify-center gap-2">
                  <UButton :to="`/members/${m.id}`" icon="i-heroicons-pencil-square" size="xs" color="blue" variant="soft" label="Edit" />
                  <UButton @click.stop="openDeleteModal(m.id)" icon="i-heroicons-trash" size="xs" color="red" variant="soft" label="Delete" />
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
            <p style="color: var(--ui-text);">Yakin ingin menghapus data ini? Data jemaat sifatnya penting.</p>
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
import { useMembers } from '~/composables/useMembers'

const { members: membersRef, fetchAll, remove } = useMembers()

const members = ref<any[]>([])
const hover = ref<number | null>(null)
const isDeleteModalOpen = ref(false)
const selectedId = ref<number | null>(null)
const searchQuery = ref('')
const currentPage = ref(1)
const itemsPerPage = 10

const tableHeaders = [
  'No Induk',
  'Nama', 'Jenis ID', 'Nomor ID', 'Tgl Lahir', 'Tempat Lahir', 'Warga Negara', 'Suku', 'Kelamin',
  'Telepon', 'Email', 'Alamat', 'Kota', 'Lat', 'Long', 'Foto', 'Perkawinan',
  'Meninggal', 'Aktif', 'No KK', 'Hubungan Keluarga', 'Agama', 'Gol Darah',
  'Tgl Baptis', 'Tempat Baptis', 'Pendeta Baptis', 'Tgl Sidi', 'Tempat Sidi', 'Pendeta Sidi',
  'Tgl Jadi Jemaat', 'Gereja Asal'
]

// Filter members based on search query
const filteredMembers = computed(() => {
  if (!searchQuery.value) return members.value

  const query = searchQuery.value.toLowerCase()
  return members.value.filter(m => {
    return (
      m.name?.toLowerCase().includes(query) ||
      m.id_local?.toLowerCase().includes(query) ||
      m.id_number?.toLowerCase().includes(query) ||
      m.email?.toLowerCase().includes(query) ||
      m.phone?.toLowerCase().includes(query) ||
      m.address?.toLowerCase().includes(query) ||
      (typeof m.city === 'object' ? m.city?.name?.toLowerCase().includes(query) : m.city?.toLowerCase().includes(query))
    )
  })
})

// Calculate total pages
const totalPages = computed(() => {
  return Math.ceil(filteredMembers.value.length / itemsPerPage) || 1
})

// Get paginated members
const paginatedMembers = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredMembers.value.slice(start, end)
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

const fetchData = async () => {
  await fetchAll()
  members.value = membersRef.value
}

onMounted(fetchData)

const openDeleteModal = (id: number) => {
  selectedId.value = id
  isDeleteModalOpen.value = true
}

const confirmDelete = async () => {
  if (!selectedId.value) return
  await remove(selectedId.value)
  isDeleteModalOpen.value = false
  fetchData()
}

const formatBool = (v: any) => v == 1 ? 'Ya' : 'Tidak'
const formatDate = (d: any) => {
  if (!d) return '-'
  const dateOnly = d.split('T')[0].split(' ')[0]
  return dateOnly
}
</script>

<style scoped>
.hovered-row {
  background: var(--ui-bg-muted) !important;
}
</style>
