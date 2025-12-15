<template>
  <div class="p-6 w-full overflow-hidden" style="color: var(--ui-text); background: var(--ui-bg);">
    <!-- Header -->
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold" style="color: var(--ui-text-highlighted);">
        Daftar Asset Documents
      </h1>
      <UButton
        to="/asset-documents/create"
        icon="i-heroicons-plus-circle"
        size="md"
        color="primary"
        label="Tambah Document"
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
              v-for="doc in documents"
              :key="doc.id"
              class="transition-colors"
              :style="{
                borderBottom: '1px solid var(--ui-border)',
                background: 'var(--ui-bg)',
              }"
              @mouseover="hover = doc.id"
              @mouseleave="hover = null"
              :class="{ 'hovered-row': hover === doc.id }"
            >
              <td class="px-3 py-3 text-sm font-medium whitespace-nowrap">
                {{ doc.asset_id }}
              </td>

              <td class="px-3 py-3 text-sm whitespace-nowrap">
                {{ doc.type }}
              </td>

              <td class="px-3 py-3 text-sm max-w-[200px] truncate">
                {{ doc.description }}
              </td>

              <!-- GAMBAR LANGSUNG MUNCUL -->
              <td class="px-3 py-3 text-sm whitespace-nowrap">
                <div v-if="doc.file_path">
                  <img
                    :src="getImageUrl(doc.file_path)"
                    alt="Asset Document"
                    class="max-w-[100px] max-h-[60px] object-cover rounded border"
                    style="border-color: var(--ui-border);"
                    @error="handleImageError($event, doc.file_path)"
                  />
                  <!-- Debug info (hapus setelah selesai) -->
                  <div class="text-xs mt-1" style="color: var(--ui-text-muted);">
                    {{ getImageUrl(doc.file_path) }}
                  </div>
                </div>
                <span v-else class="text-xs" style="color: var(--ui-text-muted);">No file</span>
              </td>

              <td class="px-3 py-3 text-sm whitespace-nowrap">
                {{ formatDate(doc.created_at) }}
              </td>

              <td class="px-3 py-3 text-sm whitespace-nowrap">
                <div class="flex justify-center gap-2">
                  <UButton
                    :to="`/asset-documents/${doc.id}`"
                    icon="i-heroicons-pencil-square"
                    size="xs"
                    color="blue"
                    variant="soft"
                    label="Edit"
                  />
                  <UButton
                    @click.stop="openDeleteModal(doc.id)"
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
            <p style="color: var(--ui-text);">Yakin ingin menghapus document ini?</p>
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
import { useApiUrl } from '@/composables/useApiUrl'
import { useAssetDocuments } from '@/composables/useAssetDocuments'

const { documents: docsRef, fetchAll, remove } = useAssetDocuments()

const documents = ref<any[]>([])
const hover = ref<string | null>(null)
const isDeleteModalOpen = ref(false)
const selectedDocId = ref<string>('')

const tableHeaders = ['Asset ID', 'Type', 'Description', 'File', 'Created At']

// BASE URL backend - gunakan useApiUrl() yang sama dengan composable
const apiBase = useApiUrl().replace(/\/$/, '') // remove trailing slash
// Untuk storage files, ganti /api dengan /storage
const STORAGE_URL = apiBase.replace('/api', '/storage')
console.log('🔍 API BASE:', apiBase)
console.log('🔍 STORAGE URL:', STORAGE_URL)

// Convert file_path -> Full URL (support local & S3)
const getImageUrl = (path: string) => {
  if (!path) return ''

  // Jika sudah full URL (S3 atau lainnya), return as is
  if (path.startsWith('http://') || path.startsWith('https://')) {
    console.log('🖼️ Image URL (S3):', path)
    return path
  }

  // Jika path relatif (local storage)
  const cleanPath = path.replace(/^\/+/, '')
  const fullUrl = `${STORAGE_URL}/${cleanPath}`
  console.log('🖼️ Image URL (Local):', { original: path, generated: fullUrl })
  return fullUrl
}

// Load data
const fetchData = async () => {
  try {
    await fetchAll()
    documents.value = docsRef.value
  } catch (err) {
    console.error('Gagal memuat documents:', err)
    documents.value = []
  }
}

onMounted(fetchData)

// Delete modal
const openDeleteModal = (id: string) => {
  selectedDocId.value = id
  isDeleteModalOpen.value = true
}

const confirmDelete = async () => {
  if (!selectedDocId.value) return

  try {
    await remove(selectedDocId.value)
    isDeleteModalOpen.value = false
    await fetchData()
  } catch (err) {
    console.error('Gagal menghapus document:', err)
  }
}

// Format date
const formatDate = (date: string) => {
  if (!date) return '-'
  return date.split('T')[0]
}

// Handle image error
const handleImageError = (event: Event, path: string) => {
  console.error('Failed to load image:', path)
  console.error('Attempted URL:', getImageUrl(path))
  const img = event.target as HTMLImageElement
  img.style.display = 'none'
}
</script>

<style scoped>
.hovered-row {
  background: var(--ui-bg-muted) !important;
}
</style>
