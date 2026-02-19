<template>
  <div class="p-6 w-full overflow-hidden" style="color: var(--ui-text); background: var(--ui-bg);">
    <!-- Header -->
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold" style="color: var(--ui-text-highlighted);">Daftar Anggota</h1>
      <UButton to="/members/create" icon="i-heroicons-plus-circle" size="md" color="primary" label="Tambah Anggota" />
    </div>

    <!-- Table Card -->
    <UCard class="relative z-0 overflow-hidden">
      <div class="overflow-x-auto w-full">
        <table class="min-w-full table-auto border-collapse" style="color: var(--ui-text);">
          <thead style="background: var(--ui-bg-muted); border-bottom: 1px solid var(--ui-border);">
            <tr>
              <th class="px-3 py-3 text-start text-xs font-semibold uppercase whitespace-nowrap"
                style="color: var(--ui-text-highlighted);">
                Foto
              </th>
              <th v-for="head in tableHeaders" :key="head.key"
                class="py-3 text-start"
                style="color: var(--ui-text-highlighted);"
              >
                <UButton 
                  :trailing-icon="
                    activeSort.key === head.key
                      ? activeSort.order === 'asc'
                        ? 'i-heroicons-bars-arrow-up'
                        : 'i-heroicons-bars-arrow-down'
                      : 'i-heroicons-arrows-up-down'
                  "
                  size="sm"
                  :color="activeSort.key === head.key ? 'primary' : 'neutral'"
                  variant="ghost"
                  class="text-xs font-semibold uppercase whitespace-nowrap cursor-pointer"
                  @click="onSort(head.key)"
                >
                  {{ head.label }}
                </UButton>
              </th>
              <th class="px-3 py-3 text-start text-xs font-semibold uppercase whitespace-nowrap"
                style="color: var(--ui-text-highlighted);">
                Telepon
              </th>
              <th class="px-3 py-3 text-center text-xs font-semibold uppercase whitespace-nowrap"
                style="color: var(--ui-text-highlighted);">
                Aksi
              </th>
            </tr>
          </thead>

          <tbody style="background: var(--ui-bg);">
            <tr v-for="m in sortedMembers" :key="m.id" class="transition-colors cursor-pointer"
              :style="{ borderBottom: '1px solid var(--ui-border)' }" @mouseover="hover = m.id"
              @mouseleave="hover = null" :class="{ 'hovered-row': hover === m.id }" @click="openDetail(m)">

              <td class="px-3 py-3 text-sm whitespace-nowrap">
                <img v-if="m.photo" :src="m.photo" class="h-10 w-10 rounded object-cover border" alt="Foto" />
                <span v-else class="text-gray-400">-</span>
              </td>

              <td class="px-3 py-3 text-sm font-medium whitespace-nowrap">{{ m.id_local || '-' }}</td>
              <td class="px-3 py-3 text-sm font-medium whitespace-nowrap">{{ m.name }}</td>
              <td class="px-3 py-3 text-sm whitespace-nowrap">{{ m.sex || '-' }}</td>
              <td class="px-3 py-3 text-sm whitespace-nowrap">{{ $age(m.dob) }} Tahun</td>
              <td class="px-3 py-3 text-sm whitespace-nowrap">{{ m.phone || '-' }}</td>

              <td class="px-3 py-3 text-sm whitespace-nowrap">
                <div class="flex justify-center gap-2">
                  <UButton :to="`/members/${m.id}`" icon="i-heroicons-pencil-square" size="xs" color="info"
                    variant="soft" label="Edit" />

                  <UButton @click.stop="openDeleteModal(m.id, m.name)" icon="i-heroicons-trash" size="xs" color="error"
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
      <div v-if="isDeleteModalOpen" class="fixed inset-0 z-99999 flex items-center justify-center"
        style="background: rgba(0,0,0,0.5);">
        <UCard class="max-w-md w-full mx-4"
          style="background: var(--ui-bg); color: var(--ui-text); border: 1px solid var(--ui-border);">
          <template #header>
            <div class="flex items-center justify-between">
              <h3 class="text-lg font-semibold" style="color: var(--ui-text-highlighted);">
                Konfirmasi Hapus
              </h3>
              <UButton color="neutral" variant="ghost" icon="i-heroicons-x-mark-20-solid"
                @click="isDeleteModalOpen = false" />
            </div>
          </template>

          <div class="py-4">
            <p style="color: var(--ui-text);">Yakin ingin menghapus data <strong>{{ selectedName }}</strong>?</p>
          </div>

          <template #footer>
            <div class="flex justify-end gap-3">
              <UButton color="neutral" variant="soft" label="Batal" @click="isDeleteModalOpen = false" />
              <UButton color="error" label="Hapus" @click="confirmDelete" />
            </div>
          </template>
        </UCard>
      </div>
    </Teleport>

    <!-- Modal Baru (Switch Member) -->
    <MemberModal
      :open="isOpen"
      :member="selectedMember"
      :all-members="allMembersData"
      @update:open="isOpen = $event"
      @switch-member="handleSwitchMember"
    />
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: ['role'],
  roles: [4]
})

import { ref, onMounted } from 'vue'
import { useMembers } from '~/composables/useMembers'
import MemberModal from '~/components/memberComponents/MemberDetailModal.vue'

const { members: membersRef, fetchAll, remove } = useMembers()

const members = ref<any[]>([])
const sortedMembers = ref<any[]>([])
const hover = ref<number | null>(null)
const isDeleteModalOpen = ref(false)
const selectedId = ref<number | null>(null)
const selectedName = ref<string | null>(null)
const activeSort = ref<{
  key: string | null
  order: 'asc' | 'desc' | null
}>({
  key: null,
  order: null
})

const tableHeaders = [
  { label: 'No Induk', key: 'id_local' },
  { label: 'Nama', key: 'name' },
  { label: 'Jenis Kelamin', key: 'sex' },
  { label: 'Usia', key: 'dob' } 
]

const isOpen = ref(false)
const selectedMember = ref<any | null>(null)
const allMembersData = ref<any[]>([])

const handleSwitchMember = (newMember: any) => {
  selectedMember.value = newMember
}

const fetchData = async () => {
  await fetchAll()
  members.value = membersRef.value
  sortedMembers.value = [...membersRef.value]
  allMembersData.value = membersRef.value
}
onMounted(fetchData)

const openDeleteModal = (id: number, name: string) => {
  selectedId.value = id
  selectedName.value = name
  isDeleteModalOpen.value = true
}

const confirmDelete = async () => {
  if (!selectedId.value) return
  await remove(selectedId.value)
  isDeleteModalOpen.value = false
  await fetchData()
}

const isDetailOpen = ref(false)
const detailData = ref<any>(null)

const openDetail = (m: any) => {
  detailData.value = m
  selectedMember.value = m
  isDetailOpen.value = true
  isOpen.value = true
}

const sortMembers = () => {
  const { key, order } = activeSort.value
  if (!key || !order) return

  sortedMembers.value = [...sortedMembers.value].sort((a, b) => {
    const valA = a[key]
    const valB = b[key]

    if (valA == null) return 1
    if (valB == null) return -1

    if (key === 'dob') {
      const timeA = new Date(valA).getTime()
      const timeB = new Date(valB).getTime()

      return order === 'asc'
        ? timeB - timeA   
        : timeA - timeB  
    }

    if (typeof valA === 'string') {
      return order === 'asc'
        ? valA.localeCompare(valB)
        : valB.localeCompare(valA)
    }

    return order === 'asc' ? valA - valB : valB - valA
  })
}


const onSort = (field: string) => {
  if (activeSort.value.key !== field) {
    // klik pertama di kolom baru → asc
    activeSort.value.key = field
    activeSort.value.order = 'asc'
  } else {
    if (activeSort.value.order === 'asc') {
      activeSort.value.order = 'desc'
    } else if (activeSort.value.order === 'desc') {
      // klik ketiga → reset
      activeSort.value.key = null
      activeSort.value.order = null
      sortedMembers.value = [...members.value]
      return
    }
  }

  sortMembers()
}


</script>

<style scoped>
.hovered-row {
  background: var(--ui-bg-muted) !important;
}
</style>

    <!-- Table Card -->
