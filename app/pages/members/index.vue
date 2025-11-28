<template>
  <div class="p-6 w-full overflow-hidden" style="color: var(--ui-text); background: var(--ui-bg);">
    <!-- Header -->
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold" style="color: var(--ui-text-highlighted);">Daftar Member</h1>
      <UButton to="/members/create" icon="i-heroicons-plus-circle" size="md" color="primary" label="Tambah Member" />
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
            <tr v-for="m in members" :key="m.id" class="transition-colors"
              :style="{ borderBottom: '1px solid var(--ui-border)' }" @mouseover="hover = m.id"
              @mouseleave="hover = null" :class="{ 'hovered-row': hover === m.id }" @click="openDetail(m)">

              <!-- Nomor Induk -->
              <td class=" px-3 py-3 text-sm font-medium whitespace-nowrap">{{ m.id_local || '-' }}</td>

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
                  <UButton :to="`/members/${m.id}`" icon="i-heroicons-pencil-square" size="xs" color="blue"
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
            <p style="color: var(--ui-text);">Yakin ingin menghapus data ini?</p>
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
const hover = ref<number | null>(null)
const isDeleteModalOpen = ref(false)
const selectedId = ref<number | null>(null)

const tableHeaders = [
  'No Induk',
  'Nama', 'Jenis ID', 'Nomor ID', 'Tgl Lahir', 'Tempat Lahir', 'Warga Negara', 'Suku', 'Kelamin',
  'Telepon', 'Email', 'Alamat', 'Kota', 'Lat', 'Long', 'Foto', 'Perkawinan',
  'Meninggal', 'Aktif', 'No KK', 'Hubungan Keluarga', 'Agama', 'Gol Darah',
  'Tgl Baptis', 'Tempat Baptis', 'Pendeta Baptis', 'Tgl Sidi', 'Tempat Sidi', 'Pendeta Sidi',
  'Tgl Jadi Jemaat', 'Gereja Asal'
]

const isOpen = ref(false)
const selectedMember = ref(null)
const allMembersData = ref([])

const handleSwitchMember = (newMember: any) => {
  selectedMember.value = newMember
}

const fetchData = async () => {
  await fetchAll()
  members.value = membersRef.value
  allMembersData.value = membersRef.value
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

const isDetailOpen = ref(false)
const detailData = ref<any>(null)

const openDetail = (m: any) => {
  detailData.value = m
  selectedMember.value = m
  isDetailOpen.value = true
  isOpen.value = true
}

const formatBool = (v: any) => v == 1 ? 'Ya' : 'Tidak'
const formatDate = (d: any) => d ? d.split(' ')[0] : '-'
</script>

<style scoped>
.hovered-row {
  background: var(--ui-bg-muted) !important;
}
</style>
