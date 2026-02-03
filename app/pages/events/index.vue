<script setup lang="ts">
definePageMeta({
  middleware: ['role'],
  roles: [4]
})

import { onMounted } from 'vue';
import { useEvent } from '~/composables/useEvents'

const { events, fetchAll, remove, loading, error } = useEvent()

onMounted(fetchAll)

const formatDate = (date: string) => {
  if (!date) return "-";
  try {
    return new Date(date).toLocaleDateString("id-ID", {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  } catch {
    return date.split("T")[0];
  }
}

const handleDelete = async (id: number) => {
  if (!confirm("Apakah kamu yakin ingin menghapus agenda ini?")) return;
  try {
    await remove(id);
    await fetchAll();
  } catch (err) {
    console.error("❌ Gagal hapus agenda:", err);
    alert("Gagal menghapus agenda");
  }
}
</script>

<template>
  <div
    class="p-6 w-full overflow-hidden"
    style="color: var(--ui-text); background: var(--ui-bg)"
  >
    <!-- Header -->
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold" style="color: var(--ui-text-highlighted)">
        Daftar Agenda
      </h1>
      <UButton
      to="/events/create"
      icon="i-heroicons-plus-circle"
      size="md"
      color="primary"
      label="Tambah Agenda"
      />
    </div>

    <!-- Loading & Error -->
    <div v-if="loading" class="text-center py-6 text-gray-500">
      Memuat data renungan...
    </div>
    <div v-else-if="error" class="text-center py-6 text-red-500">
      {{ error }}
    </div>

    <!-- Table -->
    <UCard v-else class="relative z-0 overflow-hidden">
      <div class="overflow-x-auto w-full">
        <table class="min-w-full table-auto border-collapse">
          <thead>
            <tr class="border-b border-gray-700/20">
              <th
                class="px-3 py-3 text-left text-xs font-semibold uppercase whitespace-nowrap"
              >
                ID
              </th>
              <th
                class="px-3 py-3 text-left text-xs font-semibold uppercase whitespace-nowrap"
              >
                Jenis Kebaktian
              </th>
              <th
                class="px-3 py-3 text-left text-xs font-semibold uppercase whitespace-nowrap"
              >
                Tanggal
              </th>
              <th
                class="px-3 py-3 text-left text-xs font-semibold uppercase whitespace-nowrap"
              >
                Waktu
              </th>
              <th
                class="px-3 py-3 text-left text-xs font-semibold uppercase whitespace-nowrap"
              >
                Pelayan Kebaktian
              </th>
              <th
                class="px-3 py-3 text-left text-xs font-semibold uppercase whitespace-nowrap"
              >
                Asal Jemaat Pelayan Kebaktian
              </th>
              <th
                class="px-3 py-3 text-left text-xs font-semibold uppercase whitespace-nowrap"
              >
                Pembacaan Alkitab
              </th>
              <th
                class="px-3 py-3 text-left text-xs font-semibold uppercase whitespace-nowrap"
              >
                Nats Khotbah
              </th>
              <th
                class="px-3 py-3 text-left text-xs font-semibold uppercase whitespace-nowrap"
              >
                Tema
              </th>
              <th
                class="px-3 py-3 text-left text-xs font-semibold uppercase whitespace-nowrap"
              >
                Koordinator
              </th>
              <th
                class="px-3 py-3 text-left text-xs font-semibold uppercase whitespace-nowrap"
              >
                Liturgos
              </th>
              <th
                class="px-3 py-3 text-left text-xs font-semibold uppercase whitespace-nowrap"
              >
                Pendamping PF
              </th>
              <th
                class="px-3 py-3 text-left text-xs font-semibold uppercase whitespace-nowrap"
              >
                Pemusik
              </th>
              <th
                class="px-3 py-3 text-left text-xs font-semibold uppercase whitespace-nowrap"
              >
                Pamandu Pujian
              </th>
              <th
                class="px-3 py-3 text-left text-xs font-semibold uppercase whitespace-nowrap"
              >
                Petugas Persembahan
              </th>
              <th
                class="px-3 py-3 text-left text-xs font-semibold uppercase whitespace-nowrap"
              >
                Paduan Suara
              </th>
              <th
                class="px-3 py-3 text-left text-xs font-semibold uppercase whitespace-nowrap"
              >
                Jumlah Hadir (Pria)
              </th>
              <th
                class="px-3 py-3 text-left text-xs font-semibold uppercase whitespace-nowrap"
              >
                Jumlah Hadir (Wanita)
              </th>
              <th
                class="px-3 py-3 text-left text-xs font-semibold uppercase whitespace-nowrap"
              >
                Jumlah Total Hadir
              </th>
              <th
                class="px-3 py-3 text-left text-xs font-semibold uppercase whitespace-nowrap"
              >
                Persembahan (Amplop Merah)
              </th>
              <th
                class="px-3 py-3 text-left text-xs font-semibold uppercase whitespace-nowrap"
              >
                Persembahan (Amplop Biru)
              </th>
              <th
                class="px-3 py-3 text-left text-xs font-semibold uppercase whitespace-nowrap"
              >
                Persembahan (Amplop Lainnya)
              </th>
              <th
                class="px-3 py-3 text-left text-xs font-semibold uppercase whitespace-nowrap"
              >
                Persembahan Total
              </th>
              <th
                class="px-3 py-3 text-left text-xs font-semibold uppercase whitespace-nowrap"
              >
                Catatan
              </th>
              <th
                class="px-3 py-3 text-center text-xs font-semibold uppercase whitespace-nowrap"
              >
                Aksi
              </th>
            </tr>
          </thead>

          <tbody>
            <tr
              v-for="item in events"
              class="transition-colors hover:bg-gray-50/5 border-b border-gray-700/10"
            >
              <td class="px-3 py-3 text-sm font-medium whitespace-nowrap">
                {{ item.id }}
              </td>
              <td class="px-3 py-3 text-sm font-medium whitespace-nowrap">
                {{ item.service_type }}
              </td>
              <td class="px-3 py-3 text-sm whitespace-nowrap">
                {{ formatDate(item.service_date) }}
              </td>
              <td class="px-3 py-3 text-sm whitespace-nowrap">
                {{ item.service_time }}
              </td>
              <td class="px-3 py-3 text-sm whitespace-nowrap">
                {{ item.service_ministry.name }}
              </td>
              <td class="px-3 py-3 text-sm whitespace-nowrap">
                {{ item.organization?.name }}
              </td>
              <td class="px-3 py-3 text-sm whitespace-nowrap">
                {{ item.scripture_reading }}
              </td>
              <td class="px-3 py-3 text-sm whitespace-nowrap">
                {{ item.sermon_text }}
              </td>
              <td class="px-3 py-3 text-sm whitespace-nowrap">
                {{ item.sermon_theme }}
              </td>
              <td class="px-3 py-3 text-sm whitespace-nowrap">
                {{ item.coordinator?.name }}
              </td>
              <td class="px-3 py-3 text-sm whitespace-nowrap">
                {{ item.liturgist?.name }}
              </td>
              <td class="px-3 py-3 text-sm whitespace-nowrap">
                {{ item.pf_assistant?.name }}
              </td>
              <td class="px-3 py-3 text-sm whitespace-nowrap">
                {{ item.musician?.map(m => m.name).join(', ') }}
              </td>
              <td class="px-3 py-3 text-sm whitespace-nowrap">
                {{ item.worship_leader?.map(m => m.name).join(', ') }}
              </td>
              <td class="px-3 py-3 text-sm whitespace-nowrap">
                {{ item.offering_officer?.map(m => m.name).join(', ') }}
              </td>
              <td class="px-3 py-3 text-sm whitespace-nowrap">
                {{ item.choir?.map(m => m.name).join(', ') }}
              </td>
              <td class="px-3 py-3 text-sm whitespace-nowrap">
                {{ item.male_attendance }}
              </td>
              <td class="px-3 py-3 text-sm whitespace-nowrap">
                {{ item.female_attendance }}
              </td>
              <td class="px-3 py-3 text-sm whitespace-nowrap">
                {{ item.total_attendance }}
              </td>
              <td class="px-3 py-3 text-sm whitespace-nowrap">
                {{ item.red_envelope }}
              </td>
              <td class="px-3 py-3 text-sm whitespace-nowrap">
                {{ item.blue_envelope }}
              </td>
              <td class="px-3 py-3 text-sm whitespace-nowrap">
                {{ item.other_envelope }}
              </td>
              <td class="px-3 py-3 text-sm whitespace-nowrap">
                {{ item.total_envelope }}
              </td>
              <td class="px-3 py-3 text-sm whitespace-nowrap">
                {{ item.note }}
              </td>
              
              <td class="px-3 py-3 text-sm whitespace-nowrap text-center">
                <div class="flex justify-center gap-2">
                  <UButton
                    :to="`/events/${item.id}`"
                    icon="i-heroicons-pencil-square"
                    size="xs"
                    color="info"
                    variant="soft"
                    label="Edit"
                  />
                  <UButton
                    @click.stop="handleDelete(item.id!)"
                    icon="i-heroicons-trash"
                    size="xs"
                    color="error"
                    variant="soft"
                    label="Hapus"
                  />
                </div>
              </td>
            </tr>

            <tr v-if="!events.length">
              <td
                colspan="5"
                class="px-3 py-4 text-center text-gray-500 text-sm italic"
              >
                Tidak ada renungan ditemukan.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </UCard>
  </div>
</template>