<template>
  <div class="p-6 w-full overflow-hidden" style="background: var(--ui-bg); color: var(--ui-text);">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold" style="color: var(--ui-text-highlighted);">Tambah Occupation</h1>
      <UButton to="/occupations" icon="i-heroicons-arrow-left" color="neutral" variant="link" label="Kembali" />
    </div>

    <UCard>
      <form @submit.prevent="save" class="space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block mb-1 font-semibold text-sm">Anggota <span class="text-red-500">*</span></label>
            <UInputMenu 
              v-model="memberInput" 
              :items="members.map(m => ({ label: m.name, value: m.id }))" 
              placeholder="Pilih Anggota..." 
              class="w-full" 
              :loading="loading"
              required
            />

          </div>
          <div>
            <label class="block mb-1 font-semibold text-sm">Perusahaan  <span class="text-red-500">*</span></label>
            <UInput type="text" v-model="form.company" placeholder="Contoh: PT ABC" class="w-full" required/>
          </div>
          <div>
            <label class="block mb-1 font-semibold text-sm">Posisi <span class="text-red-500">*</span></label>
            <UInput type="text" v-model="form.position" placeholder="Contoh: Manager" class="w-full" required/>
          </div>
          <div>
            <label class="block mb-1 font-semibold text-sm">Tahun Mulai <span class="text-red-500">*</span></label>
            <UInput type="number" v-model="form.year_start" placeholder="Contoh: 2020" class="w-full" required/>
          </div>
          <div>
            <label class="block mb-1 font-semibold text-sm">Tahun Selesai</label>
            <UInput type="number" v-model="form.year_end" placeholder="Contoh: 2023" class="w-full"/>
          </div>
        </div>

        <div class="flex justify-end gap-3 pt-2">
          <UButton color="neutral" variant="ghost" label="Batal" @click="router.push('/occupations')" icon="i-heroicons-x-mark" />
          <UButton type="submit" color="primary" :loading="saving" :disabled="saving" label="Simpan" icon="i-heroicons-check-circle" />
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
const { members, fetchAll: fetchMembers, loading } = useMembers()

const saving = ref(false)

const memberInput = ref({ label: '', value: 0 })

const form = reactive({
  member: 0 as number | string,
  company: '',
  position: '',
  year_start: '',
  year_end: ''
})

onMounted(fetchMembers)

const save = async () => {
  saving.value = true

  form.member = memberInput.value.value
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
