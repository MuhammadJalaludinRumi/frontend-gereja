<template>
  <div class="p-6 w-full overflow-hidden" style="background: var(--ui-bg); color: var(--ui-text);">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold" style="color: var(--ui-text-highlighted);">Tambah Occupation</h1>
      <UButton to="/occupations" icon="i-heroicons-arrow-left" color="gray" variant="soft" label="Kembali" />
    </div>

    <UCard :ui="{ body: { padding: 'p-6' } }">
      <form @submit.prevent="save" class="space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block mb-1 font-semibold text-sm">Member</label>
            <select v-model="form.member" class="w-full px-3 py-2 rounded-lg border" style="background: var(--ui-bg); border:1px solid var(--ui-border)">
              <option value="">Pilih Member</option>
              <option v-for="m in members" :key="m.id" :value="m.id">{{ m.name }}</option>
            </select>
          </div>
          <div>
            <label class="block mb-1 font-semibold text-sm">Company</label>
            <input type="text" v-model="form.company" placeholder="Contoh: PT ABC" class="w-full px-3 py-2 rounded-lg border" style="background: var(--ui-bg); border:1px solid var(--ui-border)" />
          </div>
          <div>
            <label class="block mb-1 font-semibold text-sm">Position</label>
            <input type="text" v-model="form.position" placeholder="Contoh: Manager" class="w-full px-3 py-2 rounded-lg border" style="background: var(--ui-bg); border:1px solid var(--ui-border)" />
          </div>
          <div>
            <label class="block mb-1 font-semibold text-sm">Year Start</label>
            <input type="number" v-model="form.year_start" placeholder="2020" class="w-full px-3 py-2 rounded-lg border" style="background: var(--ui-bg); border:1px solid var(--ui-border)" />
          </div>
          <div>
            <label class="block mb-1 font-semibold text-sm">Year End</label>
            <input type="number" v-model="form.year_end" placeholder="2023" class="w-full px-3 py-2 rounded-lg border" style="background: var(--ui-bg); border:1px solid var(--ui-border)" />
          </div>
        </div>

        <div class="flex justify-end gap-3 pt-2">
          <UButton type="submit" color="primary" :loading="saving" :disabled="saving" label="Simpan" icon="i-heroicons-check-circle" />
          <UButton color="gray" variant="soft" label="Batal" @click="router.push('/occupations')" icon="i-heroicons-x-mark" />
        </div>
      </form>
    </UCard>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: ['role'],
  roles: [4]
})
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useOccupations } from '~/composables/useOccupations'
import { useMembers } from '~/composables/useMembers'

const router = useRouter()
const { create } = useOccupations()
const { members, fetchAll: fetchMembers } = useMembers()

const saving = ref(false)
const form = reactive({
  member: '',
  company: '',
  position: '',
  year_start: '',
  year_end: ''
})

onMounted(fetchMembers)

const save = async () => {
  saving.value = true
  try {
    await create(form)
    router.push('/occupations')
  } catch (err) {
    console.error(err)
    alert('Gagal menyimpan occupation')
  } finally {
    saving.value = false
  }
}
</script>
