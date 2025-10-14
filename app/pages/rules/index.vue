<template>
  <div
    class="p-6 w-full overflow-hidden transition-colors duration-300"
    style="color: var(--ui-text); background: var(--ui-bg);"
  >
    <!-- Header -->
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold" style="color: var(--ui-text-highlighted);">
        Daftar Rules
      </h1>
      <UButton
        to="/rules/create"
        icon="i-heroicons-plus-circle"
        size="md"
        color="primary"
        label="Tambah Rule"
      />
    </div>

    <!-- Table Card -->
    <UCard :ui="{ body: { padding: '' } }" class="relative z-0 overflow-hidden shadow-lg rounded-xl">
      <div class="overflow-x-auto w-full">
        <table class="min-w-full table-auto border-collapse" style="color: var(--ui-text);">
          <thead
            style="background: var(--ui-bg-muted); border-bottom: 1px solid var(--ui-border);"
          >
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
                Aksi
              </th>
            </tr>
          </thead>

          <tbody style="background: var(--ui-bg);">
            <tr
              v-for="rule in rules"
              :key="rule.id"
              class="transition-colors cursor-pointer"
              :class="{ 'hovered-row': hover === rule.id }"
              @mouseover="hover = rule.id"
              @mouseleave="hover = null"
              :style="{ borderBottom: '1px solid var(--ui-border)' }"
            >
              <td
                class="px-3 py-3 text-sm font-medium whitespace-nowrap"
                style="color: var(--ui-text-highlighted);"
              >
                {{ rule.role?.name || '-' }}
              </td>
              <td class="px-3 py-3 text-sm">{{ rule.acl?.name || '-' }}</td>
              <td class="px-3 py-3 text-sm">
                <span
                  :class="rule.permission ? 'text-green-500 font-semibold' : 'text-red-500 font-semibold'"
                >
                  {{ rule.permission ? 'Yes' : 'No' }}
                </span>
              </td>
              <td class="px-3 py-3 text-sm whitespace-nowrap">
                {{ formatDate(rule.created_at) }}
              </td>

              <!-- ACTION -->
              <td class="px-3 py-3 text-sm whitespace-nowrap text-center">
                <div class="flex justify-center gap-2">
                  <UButton
                    :to="`/rules/${rule.id}`"
                    icon="i-heroicons-pencil-square"
                    size="xs"
                    color="blue"
                    variant="soft"
                    label="Edit"
                  />
                  <UButton
                    @click.stop="openDeleteModal(rule.id)"
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
        class="fixed inset-0 z-[99999] flex items-center justify-center transition-all"
        style="background: rgba(0, 0, 0, 0.5);"
      >
        <UCard
          class="max-w-md w-full mx-4 shadow-2xl animate-fade-in"
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
            <p style="color: var(--ui-text);">Apakah Anda yakin ingin menghapus rule ini?</p>
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
import { useRules } from '~/composables/useRules'

const rules = ref<any[]>([])
const hover = ref<number | null>(null)
const { getRules, deleteRule } = useRules()
const tableHeaders = ['Role', 'ACL', 'Permission', 'Created At']

const isDeleteModalOpen = ref(false)
const selectedRuleId = ref<number | null>(null)

// ambil data dari API
const fetchData = async () => {
  try {
    const data = await getRules()
    rules.value = Array.isArray(data) ? data : []
  } catch (error) {
    console.error('Gagal memuat data rules:', error)
  }
}

const openDeleteModal = (id: number) => {
  selectedRuleId.value = id
  isDeleteModalOpen.value = true
}

const confirmDelete = async () => {
  if (!selectedRuleId.value) return
  try {
    await deleteRule(selectedRuleId.value)
    isDeleteModalOpen.value = false
    await fetchData()
  } catch (error) {
    console.error('Gagal menghapus rule:', error)
  }
}

const formatDate = (date: string) => (date ? date.split('T')[0] : '-')

// load data saat komponen dipasang
onMounted(fetchData)
</script>

<style scoped>
.hovered-row {
  background: var(--ui-bg-muted) !important;
  transition: background 0.2s ease-in-out;
}

.animate-fade-in {
  animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.96);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
</style>
