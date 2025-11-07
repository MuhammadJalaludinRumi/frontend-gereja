<template>
  <div class="p-6 w-full overflow-hidden" style="background: var(--ui-bg); color: var(--ui-text);">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold" style="color: var(--ui-text-highlighted);">Daftar Pendidikan</h1>
      <UButton to="/educations/create" icon="i-heroicons-plus-circle" size="md" color="primary"
        label="Tambah Riwayat Pendidikan" />
    </div>

    <UCard :ui="{ body: { padding: '' } }" class="relative overflow-hidden">
      <div v-if="loading" class="p-4 text-center text-sm" style="color: var(--ui-text-muted);">
        Loading bentar sabar...
      </div>

      <div v-else class="overflow-x-auto w-full">
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
                Aksi
              </th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="item in educations" :key="item.id" class="transition-colors"
              :style="{ borderBottom: '1px solid var(--ui-border)', background: 'var(--ui-bg)' }"
              @mouseover="hover = item.id" @mouseleave="hover = null" :class="{ 'hovered-row': hover === item.id }">

              <td class="px-3 py-3 text-sm font-medium whitespace-nowrap">{{ item.id }}</td>
              <td class="px-3 py-3 text-sm whitespace-nowrap">
                {{ memberMap[item.member] || 'Unknown' }}
              </td>
              <td class="px-3 py-3 text-sm whitespace-nowrap">{{ item.level }}</td>
              <td class="px-3 py-3 text-sm whitespace-nowrap">{{ item.institution }}</td>
              <td class="px-3 py-3 text-sm whitespace-nowrap">{{ item.major }}</td>
              <td class="px-3 py-3 text-sm whitespace-nowrap">{{ item.year_graduate }}</td>

              <td class="px-3 py-3 text-sm whitespace-nowrap">
                <div class="flex justify-center gap-2">
                  <UButton :to="`/educations/${item.id}`" icon="i-heroicons-pencil-square" size="xs" color="blue"
                    variant="soft" label="Edit" />
                  <UButton @click.stop="openDeleteModal(item.id)" icon="i-heroicons-trash" size="xs" color="red"
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
              <h3 class="text-lg font-semibold" style="color: var(--ui-text-highlighted);">Konfirmasi Hapus</h3>
              <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark-20-solid"
                @click="isDeleteModalOpen = false" />
            </div>
          </template>

          <div class="py-4">
            <p>Yakin mau hapus riwayat ini? Jangan asal, ini penting.</p>
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
definePageMeta({ middleware: ['role'], roles: [4] })

import { ref, onMounted, computed } from 'vue' // <--- jangan lupa computed
import { useEducations } from '~/composables/useEducations'
import { useMembers } from '~/composables/useMembers'

const { educations, fetchAll, remove, loading } = useEducations()
const { members, fetchAll: fetchMembers } = useMembers()

onMounted(async () => {
  await Promise.all([fetchAll(), fetchMembers()]) // fetch semua data
})

// bikin map id → nama
const memberMap = computed(() => {
  const map: Record<number, string> = {}
  members.value.forEach(m => {
    if (m.id != null) map[m.id] = m.name
  })
  return map
})

const hover = ref<number | null>(null)
const isDeleteModalOpen = ref(false)
const selectedId = ref<number | null>(null)

const tableHeaders = ['ID', 'Member', 'Jenjang', 'Institusi', 'Jurusan', 'Tahun Lulus']

onMounted(fetchAll)

const openDeleteModal = (id: number) => {
  selectedId.value = id
  isDeleteModalOpen.value = true
}

const confirmDelete = async () => {
  if (!selectedId.value) return
  await remove(selectedId.value)
  isDeleteModalOpen.value = false
  fetchAll()
}
</script>

<style scoped>
.hovered-row {
  background: var(--ui-bg-muted) !important;
}
</style>
