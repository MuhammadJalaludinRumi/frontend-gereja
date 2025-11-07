<template>
  <div class="p-6 w-full overflow-hidden" style="background: var(--ui-bg); color: var(--ui-text);">
    <!-- Header -->
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold" style="color: var(--ui-text-highlighted);">
        CRUD Province
      </h1>
    </div>

    <!-- Form Tambah -->
    <UCard class="mb-6" :ui="{ body: { padding: 'p-4' } }">
      <div class="flex flex-col md:flex-row gap-3 items-center">
        <input
          v-model="search"
          placeholder="Cari province..."
          class="flex-1 rounded-lg border px-3 py-2 text-sm"
          style="background: var(--ui-bg); border-color: var(--ui-border); color: var(--ui-text);"
        />

        <input
          v-model="name"
          placeholder="Nama Province"
          class="flex-1 rounded-lg border px-3 py-2 text-sm"
          style="background: var(--ui-bg); border-color: var(--ui-border); color: var(--ui-text);"
        />

        <UButton :loading="creating" color="primary" icon="i-heroicons-plus-circle" label="Tambah" @click="addProvince" />
      </div>
    </UCard>

    <!-- Table Province -->
    <UCard :ui="{ body: { padding: '' } }" class="relative overflow-hidden">
      <div v-if="loading" class="p-6">Loading...</div>
      <div v-else class="overflow-x-auto w-full">
        <table class="min-w-full table-auto border-collapse" style="color: var(--ui-text);">
          <thead style="background: var(--ui-bg-muted); border-bottom: 1px solid var(--ui-border);">
            <tr>
              <th class="px-3 py-3 text-left text-xs font-semibold uppercase whitespace-nowrap" style="color: var(--ui-text-highlighted);">
                ID
              </th>
              <th class="px-3 py-3 text-left text-xs font-semibold uppercase whitespace-nowrap" style="color: var(--ui-text-highlighted);">
                Province
              </th>
              <th class="px-3 py-3 text-center text-xs font-semibold uppercase whitespace-nowrap" style="color: var(--ui-text-highlighted);">
                Action
              </th>
            </tr>
          </thead>

          <tbody style="background: var(--ui-bg);">
            <tr
              v-for="prov in filteredProvinces"
              :key="prov.id"
              class="transition-colors"
              :style="{ borderBottom: '1px solid var(--ui-border)' }"
            >
              <td class="px-3 py-3 text-sm whitespace-nowrap">{{ prov.id }}</td>
              <td class="px-3 py-3 text-sm whitespace-nowrap" style="color: var(--ui-text-highlighted);">
                {{ prov.name }}
              </td>
              <td class="px-3 py-3 text-center whitespace-nowrap flex justify-center gap-2">
                <UButton color="yellow" variant="soft" size="xs" icon="i-heroicons-pencil" label="Edit"
                  @click="openEditModal(prov)" />
                <UButton color="red" variant="soft" size="xs" icon="i-heroicons-trash" label="Hapus"
                  @click="openDeleteModal(prov)" />
              </td>
            </tr>

            <tr v-if="filteredProvinces.length === 0">
              <td colspan="3" class="text-center py-3 text-gray-500">Tidak ada data ditemukan</td>
            </tr>
          </tbody>
        </table>
      </div>
    </UCard>

    <!-- Modal Edit -->
    <Teleport to="body">
      <div v-if="showEditModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <UCard class="max-w-md w-full mx-4 p-6">
          <h2 class="text-xl font-bold mb-4" style="color: var(--ui-text-highlighted);">Edit Province</h2>
          <input v-model="editProvince.name" class="border px-3 py-2 w-full mb-4 rounded"
            style="background: var(--ui-bg); border-color: var(--ui-border); color: var(--ui-text);" />
          <div class="flex justify-end">
            <UButton color="gray" label="Batal" @click="showEditModal = false" class="mr-2" />
            <UButton :loading="updating" color="green" label="Simpan" @click="saveUpdate" />
          </div>
        </UCard>
      </div>
    </Teleport>

    <!-- Modal Delete -->
    <Teleport to="body">
      <div v-if="showDeleteModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <UCard class="max-w-md w-full mx-4 p-6">
          <h2 class="text-xl font-bold mb-4" style="color: var(--ui-text-highlighted);">Konfirmasi Hapus</h2>
          <p style="color: var(--ui-text);" class="mb-4">
            Yakin mau hapus <strong>{{ deleteTarget.name }}</strong>?
          </p>
          <div class="flex justify-end">
            <UButton color="gray" label="Batal" @click="showDeleteModal = false" class="mr-2" />
            <UButton :loading="deleting" color="red" label="Hapus" @click="confirmDelete" />
          </div>
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

import { ref, computed, onMounted } from 'vue'
import { useProvinces } from '~/composables/useProvince'

const {
  provinces,
  fetchAll,
  create,
  update,
  remove,
  loading,
  error
} = useProvinces()

const name = ref('')
const search = ref('')

// modals & state
const showEditModal = ref(false)
const editProvince = ref<{ id: number | null; name: string }>({ id: null, name: '' })

const showDeleteModal = ref(false)
const deleteTarget = ref<{ id: number | null; name: string }>({ id: null, name: '' })

// action loaders
const creating = ref(false)
const updating = ref(false)
const deleting = ref(false)

const filteredProvinces = computed(() => {
  if (!search.value) return provinces.value
  const keyword = search.value.toLowerCase()
  return provinces.value.filter((p: any) => p.name.toLowerCase().includes(keyword))
})

const addProvince = async () => {
  if (!name.value) {
    alert('Isi nama province dulu bro 🙏')
    return
  }
  try {
    creating.value = true
    await create({ name: name.value })
    name.value = ''
    await fetchAll()
  } catch (err: any) {
    alert(err?.message || 'Gagal nambah province')
  } finally {
    creating.value = false
  }
}

const openEditModal = (prov: any) => {
  editProvince.value = { id: prov.id, name: prov.name }
  showEditModal.value = true
}

const saveUpdate = async () => {
  if (!editProvince.value.id) return
  try {
    updating.value = true
    await update(editProvince.value.id, { name: editProvince.value.name })
    showEditModal.value = false
    await fetchAll()
  } catch (err: any) {
    alert(err?.message || 'Gagal update province')
  } finally {
    updating.value = false
  }
}

const openDeleteModal = (prov: any) => {
  deleteTarget.value = { id: prov.id, name: prov.name }
  showDeleteModal.value = true
}

const confirmDelete = async () => {
  if (!deleteTarget.value.id) return
  try {
    deleting.value = true
    await remove(deleteTarget.value.id as number)
    showDeleteModal.value = false
    await fetchAll()
  } catch (err: any) {
    alert(err?.message || 'Gagal hapus province')
  } finally {
    deleting.value = false
  }
}

onMounted(() => {
  fetchAll()
})
</script>

<style scoped>
tr:hover {
  background: var(--ui-bg-muted) !important;
  transition: background 0.2s ease;
}
</style>
