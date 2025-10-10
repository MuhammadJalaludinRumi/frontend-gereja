<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useOrganizationLicenses } from '~/composables/useOrganizationLicenses'

const { getAll, remove } = useOrganizationLicenses()
const licenses = ref<any[]>([])

const search = ref('')
const hover = ref<number | null>(null)

const isDeleteModalOpen = ref(false)
const selectedLicenseId = ref<number | null>(null)

const fetchData = async () => {
  licenses.value = await getAll()
}

const filteredLicenses = computed(() => {
  if (!search.value) return licenses.value
  const keyword = search.value.toLowerCase()
  return licenses.value.filter(l =>
    l.organization?.name?.toLowerCase().includes(keyword) ||
    l.license?.name?.toLowerCase().includes(keyword) ||
    String(l.id).includes(keyword)
  )
})

const openDeleteModal = (id: number) => {
  selectedLicenseId.value = id
  isDeleteModalOpen.value = true
}

const confirmDelete = async () => {
  if (!selectedLicenseId.value) return
  await remove(selectedLicenseId.value)
  isDeleteModalOpen.value = false
  await fetchData()
}

onMounted(fetchData)
</script>

<template>
  <div class="p-6 w-full overflow-hidden" style="background: var(--ui-bg); color: var(--ui-text);">
    <!-- Header -->
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold" style="color: var(--ui-text-highlighted);">
        Organization Licenses
      </h1>
      <UButton to="/organizationLicense/create" icon="i-heroicons-plus-circle" color="primary" label="Tambah" />
    </div>

    <!-- Search -->
    <UCard class="mb-6" :ui="{ body: { padding: 'p-4' } }">
      <input
        v-model="search"
        placeholder="Cari organization / license..."
        class="w-full border rounded-lg px-3 py-2 text-sm"
        style="background: var(--ui-bg); border-color: var(--ui-border); color: var(--ui-text);"
      />
    </UCard>

    <!-- Table -->
    <UCard :ui="{ body: { padding: '' } }" class="relative z-0 overflow-hidden">
      <div class="overflow-x-auto w-full">
        <table class="min-w-full table-auto border-collapse" style="color: var(--ui-text);">
          <thead style="background: var(--ui-bg-muted); border-bottom: 1px solid var(--ui-border);">
            <tr>
              <th class="px-3 py-3 text-left text-xs font-semibold uppercase whitespace-nowrap" style="color: var(--ui-text-highlighted);">ID</th>
              <th class="px-3 py-3 text-left text-xs font-semibold uppercase whitespace-nowrap" style="color: var(--ui-text-highlighted);">Organization</th>
              <th class="px-3 py-3 text-left text-xs font-semibold uppercase whitespace-nowrap" style="color: var(--ui-text-highlighted);">License</th>
              <th class="px-3 py-3 text-left text-xs font-semibold uppercase whitespace-nowrap" style="color: var(--ui-text-highlighted);">Max Member</th>
              <th class="px-3 py-3 text-center text-xs font-semibold uppercase whitespace-nowrap" style="color: var(--ui-text-highlighted);">Active</th>
              <th class="px-3 py-3 text-left text-xs font-semibold uppercase whitespace-nowrap" style="color: var(--ui-text-highlighted);">Expiry</th>
              <th class="px-3 py-3 text-center text-xs font-semibold uppercase whitespace-nowrap" style="color: var(--ui-text-highlighted);">Action</th>
            </tr>
          </thead>

          <tbody style="background: var(--ui-bg);">
            <tr
              v-for="l in filteredLicenses"
              :key="l.id"
              class="transition-colors"
              :style="{ borderBottom: '1px solid var(--ui-border)' }"
              @mouseover="hover = l.id"
              @mouseleave="hover = null"
              :class="{ 'hovered-row': hover === l.id }"
            >
              <td class="px-3 py-3 text-sm whitespace-nowrap">{{ l.id }}</td>
              <td class="px-3 py-3 text-sm whitespace-nowrap text-blue-400 font-medium">{{ l.organization?.name || '-' }}</td>
              <td class="px-3 py-3 text-sm whitespace-nowrap text-green-400 font-medium">{{ l.license?.name || '-' }}</td>
              <td class="px-3 py-3 text-sm whitespace-nowrap">{{ l.max_member }}</td>
              <td class="px-3 py-3 text-center whitespace-nowrap">
                <span
                  class="px-2 py-1 rounded text-xs font-semibold"
                  :class="l.is_active ? 'bg-green-100 text-green-700 dark:bg-green-800 dark:text-green-200' : 'bg-red-100 text-red-700 dark:bg-red-800 dark:text-red-200'"
                >
                  {{ l.is_active ? 'Active' : 'Inactive' }}
                </span>
              </td>
              <td class="px-3 py-3 text-sm whitespace-nowrap">{{ l.expiry }}</td>
              <td class="px-3 py-3 text-center whitespace-nowrap flex justify-center gap-2">
                <UButton :to="`/organizationLicense/${l.id}`" color="yellow" variant="soft" size="xs" icon="i-heroicons-pencil" label="Edit" />
                <UButton color="red" variant="soft" size="xs" icon="i-heroicons-trash" label="Hapus" @click="openDeleteModal(l.id)" />
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-if="!filteredLicenses.length" class="text-center py-6 text-gray-400">
        No data found.
      </div>
    </UCard>

    <!-- Delete Modal -->
    <Teleport to="body">
      <div v-if="isDeleteModalOpen" class="fixed inset-0 z-[99999] flex items-center justify-center" style="background: rgba(0,0,0,0.5);">
        <UCard class="max-w-md w-full mx-4" style="background: var(--ui-bg); color: var(--ui-text); border: 1px solid var(--ui-border);">
          <template #header>
            <div class="flex items-center justify-between">
              <h3 class="text-lg font-semibold" style="color: var(--ui-text-highlighted);">Konfirmasi Hapus</h3>
              <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark-20-solid" @click="isDeleteModalOpen = false" />
            </div>
          </template>

          <div class="py-4">
            <p style="color: var(--ui-text);">
              Yakin mau hapus license <strong>{{ licenses.find(l => l.id === selectedLicenseId)?.license?.name }}</strong>
              dari organization <strong>{{ licenses.find(l => l.id === selectedLicenseId)?.organization?.name }}</strong>?
            </p>
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

<style scoped>
.hovered-row {
  background: var(--ui-bg-muted) !important;
}
</style>
