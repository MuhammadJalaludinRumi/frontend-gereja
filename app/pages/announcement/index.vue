<script setup lang="ts">
definePageMeta({
  middleware: ["role"],
  roles: [1],
});

import { onMounted } from "vue";
import { useAnnouncements } from "~/composables/useAnnouncements";

const { announcements, fetchAll, remove, loading, error } = useAnnouncements();

onMounted(fetchAll)

const handleDelete = async (id: number) => {
  if (!confirm("Apakah kamu yakin ingin menghapus pengumuman ini?")) return;
  try {
    await remove(id);
    await fetchAll();
  } catch (err) {
    console.error("❌ Gagal hapus pengumuman:", err);
    alert("Gagal menghapus pengumuman");
  }
};

const formatDate = (date: string) => {
  if (!date) return "-";
  try {
    return new Date(date).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return date.split("T")[0];
  }
};
</script>

<template>
  <div
    class="p-6 w-full overflow-hidden"
    style="color: var(--ui-text); background: var(--ui-bg)"
  >
    <!-- Header -->
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold" style="color: var(--ui-text-highlighted)">
        Daftar Pengumuman
      </h1>
      <UButton
        to="/announcement/create"
        icon="i-heroicons-plus-circle"
        size="md"
        color="primary"
        label="Tambah Pengumuman"
      />
    </div>

    <!-- Loading & Error -->
    <div v-if="loading" class="text-center py-6 text-gray-500">
      Memuat data pengumuman...
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
                Tanggal
              </th>
              <th
                class="px-3 py-3 text-left text-xs font-semibold uppercase whitespace-nowrap"
              >
                Judul
              </th>
              <th
                class="px-3 py-3 text-left text-xs font-semibold uppercase whitespace-nowrap"
              >
                Status
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
              v-for="item in announcements"
              class="transation-colors hover:bg-gray-50/5 border-b border-gray-700/10"
            >
              <td class="px-3 py-3 text-sm font-medium whitespace-nowrap">
                {{ item.id }}
              </td>
              <td class="px-3 py-3 text-sm whitespace-nowrap">
                {{ formatDate(item.date_post) }}
              </td>
              <td class="px-3 py-3 text-sm">
                {{ item.title }}
              </td>
              <td class="px-3 py-3 text-sm whitespace-nowrap">
                <span :class="item.status ? 'text-green-600' : 'text-red-600'">
                  {{ item.status ? "Aktif" : "Nonaktif" }}
                </span>
              </td>
              <td class="px-3 py-3 text-sm whitespace-nowrap text-center">
                <div class="flex justify-center gap-2">
                  <UButton
                    :to="`/announcement/${item.id}`"
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

            <tr v-if="!announcements.length">
              <td
                colspan="5"
                class="px-3 py-4 text-center text-gray-500 text-sm italic"
              >
                Tidak ada pengumuman ditemukan.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </UCard>
  </div>
</template>
