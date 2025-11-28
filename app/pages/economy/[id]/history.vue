<template>
  <div class="p-6 w-full" style="background: var(--ui-bg); color: var(--ui-text)">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold" style="color: var(--ui-text-highlighted)">
        Riwayat Perubahan Economy
      </h1>
      <UButton :to="`/economy`" icon="i-heroicons-arrow-left" label="Kembali" />
    </div>

    <UCard>
      <div v-if="loading" class="p-4 text-center text-sm" style="color: var(--ui-text-muted)">
        Loading riwayat...
      </div>

      <div v-else>
        <div v-if="history.length === 0" class="text-sm text-gray-400">
          Belum ada riwayat perubahan.
        </div>

        <table v-else class="w-full table-auto border-collapse">
          <thead style="background: var(--ui-bg-muted); border-bottom: 1px solid var(--ui-border)">
            <tr>
              <th class="px-3 py-3 text-left text-xs font-semibold uppercase">Tanggal</th>
              <th class="px-3 py-3 text-left text-xs font-semibold uppercase">Kelas Lama</th>
              <th class="px-3 py-3 text-left text-xs font-semibold uppercase">Kelas Baru</th>
              <th class="px-3 py-3 text-left text-xs font-semibold uppercase">Diubah Oleh</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="item in history" :key="item.id" class="border-b">
              <td class="px-3 py-3 text-sm whitespace-nowrap">{{ formatDate(item.created_at) }}</td>
              <td class="px-3 py-3 text-sm">{{ item.old_class }}</td>
              <td class="px-3 py-3 text-sm">{{ item.new_class }}</td>
              <td class="px-3 py-3 text-sm">{{ item.updated_by || '-' }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </UCard>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useEconomyHistory } from '~/composables/useEconomyHistory'

const route = useRoute()
const id = Number(route.params.id)

const { history, fetchHistory } = useEconomyHistory()
const loading = ref(true)

onMounted(async () => {
  await fetchHistory(id)
  loading.value = false
})

const formatDate = (date: string) => {
  if (!date) return '-'
  return date.split('T')[0]
}

</script>
