<template>
  <div class="p-6 w-full overflow-hidden" style="background: var(--ui-bg); color: var(--ui-text);">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold" style="color: var(--ui-text-highlighted);">Edit Data Occupation</h1>
      <UButton to="/occupations" icon="i-heroicons-arrow-left" color="neutral" variant="link" label="Kembali" />
    </div>

    <UCard>
      <form @submit.prevent="save" class="space-y-6">

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">

          <!-- MEMBER -->
          <div>
            <label class="block mb-2 text-sm font-semibold">Anggota <span class="text-red-500">*</span></label>
            <UInputMenu 
              v-model="memberInput" 
              :items="members.map(m => ({ label: m.name, value: m.id }))" 
              placeholder="Pilih Anggota..." 
              class="w-full" 
              :loading="loading"
              required
            />
          </div>

          <!-- COMPANY -->
          <div>
            <label class="block mb-2 text-sm font-semibold">Perusahaan <span class="text-red-500">*</span></label>
            <UInput type="text" v-model="form.company" placeholder="Contoh: PT ABC" class="w-full" required/>
          </div>

          <!-- POSITION -->
          <div>
            <label class="block mb-2 text-sm font-semibold">Posisi <span class="text-red-500">*</span></label>
            <UInput type="text" v-model="form.position" placeholder="Contoh: Manager" class="w-full" required/>
          </div>

          <!-- YEAR START -->
          <div>
            <label class="block mb-2 text-sm font-semibold">Tahun Mulai <span class="text-red-500">*</span></label>
            <UInput type="number" v-model="form.year_start" placeholder="Contoh: 2020" class="w-full" required/>
          </div>

          <!-- YEAR END -->
          <div>
            <label class="block mb-2 text-sm font-semibold">Tahun Selesai</label>
            <UInput type="number" v-model="form.year_end" placeholder="Contoh: 2023" class="w-full"/>
          </div>
        </div>

        <!-- ERROR -->
        <div
          v-if="errorMessage"
          class="px-4 py-3 rounded-lg text-sm"
          style="background: rgba(239,68,68,0.1); border:1px solid rgba(239,68,68,0.3); color:#ef4444;"
        >
          {{ errorMessage }}
        </div>

        <!-- ACTION -->
        <div class="flex items-center justify-end gap-3 pt-2">
          <UButton color="neutral" variant="ghost" icon="i-heroicons-x-mark" label="Batal" @click="router.push('/occupations')" />
          <UButton type="submit" :loading="saving" :disabled="saving" color="primary" icon="i-heroicons-check-circle" :label="saving ? 'Menyimpan...' : 'Update'" />
        </div>

      </form>
    </UCard>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: ['role'], roles: [4] })

import { ref, reactive, onMounted } from "vue"
import { useRouter, useRoute } from "vue-router"
import { useOccupations } from "~/composables/useOccupations"
import { useMembers } from "~/composables/useMembers"

const router = useRouter()
const route = useRoute()

const { occupation, fetchById, update } = useOccupations()
const { members, fetchAll: fetchMembers } = useMembers()

const loading = ref(true)
const saving = ref(false)
const errorMessage = ref<string | null>(null)

const memberInput = ref<{ label: string; value: number }>({ label: "", value: 0 })

const form = reactive({
  member: 0 as number | string,
  company: "",
  position: "",
  year_start: "",
  year_end: ""
})

onMounted(async () => {
  try {
    const id = Number(route.params.id)
    await Promise.all([fetchMembers(), fetchById(id)])

    if (occupation.value) {
      form.member = occupation.value.member
      form.company = occupation.value.company
      form.position = occupation.value.position
      form.year_start = occupation.value.year_start
      form.year_end = occupation.value.year_end
    }
    
    const memberData = members.value.find(m => m.id === occupation.value?.member)
    if (memberData) {
      memberInput.value = { label: memberData.name, value: Number(memberData.id) }
    }
  } catch (err) {
    errorMessage.value = "Gagal ambil data, mampus kita wkwk."
  } finally {
    loading.value = false
  }
})

const save = async () => {
  saving.value = true
  form.member = memberInput.value.value
  try {
    await update(Number(route.params.id), form)
    router.push("/occupations")
  } catch (err) {
    errorMessage.value = "Gagal update bro."
  } finally {
    saving.value = false
  }
}
</script>
