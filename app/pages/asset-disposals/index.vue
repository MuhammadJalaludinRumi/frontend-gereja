<template>
  <div class="p-6 w-full overflow-hidden" style="color: var(--ui-text); background: var(--ui-bg);">
    <!-- Header -->
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold" style="color: var(--ui-text-highlighted);">
        Asset Disposals
      </h1>

      <UButton
        to="/asset-disposals/create"
        icon="i-heroicons-plus-circle"
        size="md"
        color="primary"
        label="Tambah Disposal"
      />
    </div>

    <!-- Table Card -->
    <UCard :ui="{ body: { padding: '' } }" class="relative z-0 overflow-hidden">
      <div class="overflow-x-auto w-full">
        <table class="min-w-full table-auto border-collapse" style="color: var(--ui-text);">
          <thead style="background: var(--ui-bg-muted); border-bottom: 1px solid var(--ui-border);">
            <tr>
              <th
                v-for="head in tableHeaders"
                :key="head"
                class="px-3 py-3 text-left text-xs font-semibold uppercase whitespace-nowrap"
                style="color: var(--ui-text-highlighted);"
              >
                {{ head }}
              </th>

              <th
                class="px-3 py-3 text-center text-xs font-semibold uppercase whitespace-nowrap"
                style="color: var(--ui-text-highlighted);"
              >
                Action
              </th>
            </tr>
          </thead>

          <tbody style="background: var(--ui-bg);">
            <tr
              v-for="item in disposals"
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
                {{ item.asset?.name || '-' }}
              </td>

              <td class="px-3 py-3 text-sm whitespace-nowrap">
                {{ formatDate(item.disposal_date) }}
              </td>

              <td class="px-3 py-3 text-sm whitespace-nowrap capitalize">
                {{ item.disposal_type }}
              </td>

              <td class="px-3 py-3 text-sm whitespace-nowrap">
                Rp {{ Number(item.value).toLocaleString('id-ID') }}
              </td>

              <td class="px-3 py-3 text-sm max-w-[200px] truncate">
                {{ item.notes || '-' }}
              </td>

              <td class="px-3 py-3 text-sm whitespace-nowrap">
                <div class="flex justify-center gap-2">
                  <UButton
                    :to="`/asset-disposals/${item.id}`"
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
            <p>Yakin ingin menghapus disposal ini?</p>
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
import { ref, onMounted } from 'vue'
import { useAssetDisposals } from '~/composables/useAssetDisposals'

const {
  disposals: disposalsRef,
  fetchAll,
  remove
} = useAssetDisposals()

const disposals = ref<any[]>([])
const hover = ref<number | null>(null)

const tableHeaders = [
  'Asset',
  'Tanggal Disposal',
  'Tipe',
  'Nilai',
  'Notes'
]

const isDeleteModalOpen = ref(false)
const selectedId = ref<number | null>(null)

const fetchData = async () => {
  try {
    await fetchAll()
    disposals.value = disposalsRef.value
  } catch (err) {
    console.error('Gagal memuat disposals:', err)
    disposals.value = []
  }
}

onMounted(fetchData)

const openDeleteModal = (id: number) => {
  selectedId.value = id
  isDeleteModalOpen.value = true
}

const confirmDelete = async () => {
  if (!selectedId.value) return
  try {
    await remove(selectedId.value)
    isDeleteModalOpen.value = false
    await fetchData()
  } catch (err) {
    console.error('Gagal menghapus disposal:', err)
  }
}

const formatDate = (date: string) => {
  if (!date) return '-'
  return date.split(' ')[0]
}
</script>

<style scoped>
.hovered-row {
  background: var(--ui-bg-muted) !important;
}
</style>
