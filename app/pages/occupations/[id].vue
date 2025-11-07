<template>
  <div class="p-6 w-full overflow-hidden" style="background: var(--ui-bg); color: var(--ui-text);">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold" style="color: var(--ui-text-highlighted);">Edit Data Occupation</h1>
      <UButton to="/occupations" icon="i-heroicons-arrow-left" color="gray" variant="soft" label="Back" />
    </div>

    <div v-if="loading" class="mb-4 text-sm text-gray-400">
      Sabar bro bentar, lagi ngambil data...
    </div>

    <UCard v-else :ui="{ body: { padding: 'p-6' } }">
      <form @submit.prevent="save" class="space-y-6">

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">

          <!-- MEMBER -->
          <div>
            <label class="block mb-2 text-sm font-semibold">Member <span class="text-red-500">*</span></label>
            <select
              v-model="form.member"
              required
              class="w-full px-3 py-2 text-sm rounded-lg"
              style="background: var(--ui-bg); border: 1px solid var(--ui-border);"
            >
              <option value="">Pilih Member</option>
              <option v-for="m in members" :key="m.id" :value="m.id">
                {{ m.name }}
              </option>
            </select>
          </div>

          <!-- COMPANY -->
          <div>
            <label class="block mb-2 text-sm font-semibold">Company</label>
            <input
              v-model="form.company"
              type="text"
              placeholder="Nama Perusahaan"
              class="w-full px-3 py-2 text-sm rounded-lg"
              style="background: var(--ui-bg); border: 1px solid var(--ui-border);"
            />
          </div>

          <!-- POSITION -->
          <div>
            <label class="block mb-2 text-sm font-semibold">Position</label>
            <input
              v-model="form.position"
              type="text"
              placeholder="Jabatan"
              class="w-full px-3 py-2 text-sm rounded-lg"
              style="background: var(--ui-bg); border: 1px solid var(--ui-border);"
            />
          </div>

          <!-- YEAR START -->
          <div>
            <label class="block mb-2 text-sm font-semibold">Year Start</label>
            <input
              v-model="form.year_start"
              type="number"
              placeholder="2020"
              class="w-full px-3 py-2 text-sm rounded-lg"
              style="background: var(--ui-bg); border: 1px solid var(--ui-border);"
            />
          </div>

          <!-- YEAR END -->
          <div>
            <label class="block mb-2 text-sm font-semibold">Year End</label>
            <input
              v-model="form.year_end"
              type="number"
              placeholder="2024 / kosongkan klo masih kerja"
              class="w-full px-3 py-2 text-sm rounded-lg"
              style="background: var(--ui-bg); border: 1px solid var(--ui-border);"
            />
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
        <div class="flex items-center gap-3 pt-2">
          <UButton type="submit" :loading="saving" :disabled="saving" color="primary" icon="i-heroicons-check-circle" :label="saving ? 'Nyimpen...' : 'Update Occupation'" />
          <UButton color="gray" variant="soft" icon="i-heroicons-x-mark" label="Batal" @click="router.push('/occupations')" />
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

const form = reactive({
  member: "",
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
  } catch (err) {
    errorMessage.value = "Gagal ambil data, mampus kita wkwk."
  } finally {
    loading.value = false
  }
})

const save = async () => {
  saving.value = true
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
