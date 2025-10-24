<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useLicenses } from '~/composables/useLicenses'

const { licenses, fetchAll, remove, loading, error } = useLicenses()

const tableHeaders = ['Nama Lisensi', 'Harga (Rp)', 'Dibuat Pada']
const deleting = ref(false)

// 🔹 Ambil semua data pas pertama kali masuk halaman
onMounted(async () => {
  await fetchAll()
})

// 🔹 Fungsi hapus data
const handleDelete = async (id: number) => {
  if (!confirm('Yakin mau hapus lisensi ini?')) return
  deleting.value = true
  try {
    await remove(id)
    await fetchAll()
  } catch (err) {
    console.error('❌ Error delete license:', err)
    alert('Gagal menghapus lisensi')
  } finally {
    deleting.value = false
  }
}

// 🔹 Format tanggal jadi YYYY-MM-DD
const formatDate = (date: string | null) => {
  if (!date) return '-'
  try {
    return new Date(date).toISOString().split('T')[0]
  } catch {
    return '-'
  }
}
</script>

<template>
  <div
    class="p-6 w-full overflow-hidden"
    style="color: var(--ui-text); background: var(--ui-bg);"
  >
    <!-- Header -->
    <div class="flex justify-between items-center mb-6">
      <h1
        class="text-2xl font-bold"
        style="color: var(--ui-text-highlighted);"
      >
        Daftar Lisensi
      </h1>
      <UButton
        to="/licenses/create"
        icon="i-heroicons-plus-circle"
        size="md"
        color="primary"
        label="Tambah Lisensi"
      />
    </div>

    <!-- Error -->
    <div
      v-if="error"
      class="mb-4 px-4 py-3 rounded-lg text-sm"
      style="background: rgba(239,68,68,0.1); border: 1px solid rgba(239,68,68,0.3); color: #ef4444;"
    >
      {{ error }}
    </div>

    <!-- Loading -->
    <div
      v-if="loading"
      class="text-gray-500 text-center py-4"
    >
      Memuat data...
    </div>

    <!-- Empty state -->
    <div
      v-else-if="!licenses.length && !error"
      class="text-gray-500 text-center py-8 italic"
    >
      Belum ada data lisensi.
    </div>

    <!-- Table -->
    <UCard
      v-else
      :ui="{ body: { padding: '' } }"
      class="relative z-0 overflow-hidden"
    >
      <div class="overflow-x-auto w-full">
        <table class="min-w-full table-auto border-collapse">
          <thead>
            <tr>
              <th
                v-for="head in tableHeaders"
                :key="head"
                class="px-3 py-3 text-left text-xs font-semibold uppercase whitespace-nowrap border-b border-gray-700/20"
              >
                {{ head }}
              </th>
              <th
                class="px-3 py-3 text-center text-xs font-semibold uppercase whitespace-nowrap border-b border-gray-700/20"
              >
                Aksi
              </th>
            </tr>
          </thead>

          <tbody>
            <tr
              v-for="license in licenses"
              :key="license.id"
              class="transition-colors hover:bg-gray-50/5 border-b border-gray-700/10"
            >
              <td class="px-3 py-3 text-sm font-medium whitespace-nowrap">
                {{ license.name }}
              </td>
              <td class="px-3 py-3 text-sm whitespace-nowrap">
                Rp {{ (license.price ?? 0).toLocaleString('id-ID') }}
              </td>
              <td class="px-3 py-3 text-sm whitespace-nowrap">
                {{ formatDate(license.created_at) }}
              </td>

              <td class="px-3 py-3 text-sm whitespace-nowrap text-center">
                <div class="flex justify-center gap-2">
                  <UButton
                    :to="`/licenses/${license.id}`"
                    icon="i-heroicons-pencil-square"
                    size="xs"
                    color="blue"
                    variant="soft"
                    label="Edit"
                  />
                  <UButton
                    :disabled="deleting"
                    @click.stop="handleDelete(license.id)"
                    icon="i-heroicons-trash"
                    size="xs"
                    color="red"
                    variant="soft"
                    label="Hapus"
                  />
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </UCard>
  </div>
</template>
