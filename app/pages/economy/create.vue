<template>
  <div class="p-6 w-full overflow-hidden" style="background: var(--ui-bg); color: var(--ui-text);">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold" style="color: var(--ui-text-highlighted);">Tambah Economy</h1>
      <UButton to="/economy" icon="i-heroicons-arrow-left" color="gray" variant="soft" label="Kembali" />
    </div>

    <UCard :ui="{ body: { padding: 'p-6' } }">
      <form @submit.prevent="save" class="space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block mb-1 font-semibold text-sm">Member</label>
            <select v-model="form.member" class="w-full px-3 py-2 rounded-lg border"
              style="background: var(--ui-bg); border:1px solid var(--ui-border)">
              <option value="">Pilih Member</option>
              <option v-for="m in members" :key="m.id" :value="m.id">{{ m.name }}</option>
            </select>
          </div>

          <div>
            <label class="block mb-1 font-semibold text-sm">Update</label>
            <input type="datetime-local" v-model="form.update" class="w-full px-3 py-2 rounded-lg border"
              style="background: var(--ui-bg); border:1px solid var(--ui-border)" />
          </div>

          <div>
            <label class="block mb-1 font-semibold text-sm">Class</label>
            <select v-model="form.class" class="w-full px-3 py-2 rounded-lg border"
              style="background: var(--ui-bg); border:1px solid var(--ui-border)">
              <option value="">Pilih Class</option>
              <option value="miskin">Miskin</option>
              <option value="rentan miskin">Rentan Miskin</option>
              <option value="menuju menengah">Menuju Menengah</option>
              <option value="menengah">Menengah</option>
              <option value="atas">Atas</option>
            </select>
          </div>
        </div>

        <div class="flex justify-end gap-3 pt-2">
          <UButton type="submit" color="primary" :loading="saving" :disabled="saving" label="Simpan"
            icon="i-heroicons-check-circle" />
          <UButton color="gray" variant="soft" label="Batal" @click="router.push('/economy')"
            icon="i-heroicons-x-mark" />
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
import { useEconomies } from '~/composables/useEconomies'
import { useMembers } from '~/composables/useMembers'

const router = useRouter()
const { create } = useEconomies()
const { members, fetchAll: fetchMembers } = useMembers()

const saving = ref(false)
const form = reactive({
  member: '',
  update: '',
  class: ''
})

onMounted(fetchMembers)

const save = async () => {
  saving.value = true
  try {
    await create(form)
    router.push('/economy')
  } catch (err) {
    console.error(err)
    alert('Gagal menyimpan economy')
  } finally {
    saving.value = false
  }
}
</script>
