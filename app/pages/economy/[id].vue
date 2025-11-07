<template>
  <div class="p-6 w-full max-w-3xl mx-auto" style="background: var(--ui-bg); color: var(--ui-text);">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold" style="color: var(--ui-text-highlighted);">Edit Economy</h1>
      <UButton to="/economy" icon="i-heroicons-arrow-left" color="gray" variant="soft" label="Kembali" />
    </div>

    <UCard :ui="{ body: { padding: 'p-6' } }" v-if="!loadingData">
      <form @submit.prevent="updateData" class="space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <!-- Member -->
          <div>
            <label class="block mb-1 font-semibold text-sm">Member</label>
            <select v-model="form.member" class="w-full px-3 py-2 rounded-lg border" style="background: var(--ui-bg); border:1px solid var(--ui-border)">
              <option value="">Pilih Member</option>
              <option v-for="m in members" :key="m.id" :value="m.id">{{ m.name }}</option>
            </select>
          </div>

          <!-- Update -->
          <div>
            <label class="block mb-1 font-semibold text-sm">Update</label>
            <input type="datetime-local" v-model="form.update" class="w-full px-3 py-2 rounded-lg border" style="background: var(--ui-bg); border:1px solid var(--ui-border)" />
          </div>

          <!-- Class -->
          <div class="md:col-span-2">
            <label class="block mb-1 font-semibold text-sm">Class</label>
            <input type="text" v-model="form.class" placeholder="Contoh: A/B/C" class="w-full px-3 py-2 rounded-lg border" style="background: var(--ui-bg); border:1px solid var(--ui-border)" />
          </div>
        </div>

        <div class="flex justify-end gap-3 pt-2">
          <UButton type="submit" color="primary" :loading="saving" :disabled="saving" label="Update" icon="i-heroicons-check-circle" />
          <UButton color="gray" variant="soft" label="Batal" @click="router.push('/economy')" icon="i-heroicons-x-mark" />
        </div>
      </form>
    </UCard>

    <div v-else class="text-center text-sm text-gray-400">Loading data...</div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: ['role'],
  roles: [4]
})
import { ref, reactive, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useEconomies } from '~/composables/useEconomies'
import { useMembers } from '~/composables/useMembers'

const router = useRouter()
const route = useRoute()
const id = Number(route.params.id)

const { economy, fetchById, update, loading } = useEconomies()
const { members, fetchAll: fetchMembers } = useMembers()

const saving = ref(false)
const loadingData = ref(true)

const form = reactive({
  member: '',
  update: '',
  class: ''
})

onMounted(async () => {
  await fetchMembers()
  await fetchById(id)
  Object.assign(form, economy.value)
  loadingData.value = false
})

const updateData = async () => {
  saving.value = true
  try {
    await update(id, form)
    router.push('/economy')
  } catch (err) {
    console.error(err)
    alert('Gagal update economy')
  } finally {
    saving.value = false
  }
}
</script>
