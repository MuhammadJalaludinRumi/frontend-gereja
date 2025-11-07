<script setup lang="ts">
definePageMeta({
  middleware: ['role'],
  roles: [4]
})

import { ref, reactive, computed, onMounted } from "vue"
import { useRouter } from "vue-router"
import { useEducations } from "~/composables/useEducations"
import { useMembers } from "~/composables/useMembers"

const router = useRouter()
const { create } = useEducations()
const { members, fetchAll: fetchMembers } = useMembers()

const loading = ref(true)
const saving = ref(false)
const serverError = ref<string | null>(null)

const form = reactive({
  member: "" as string | number,
  level: "",
  institution: "",
  major: "",
  year_graduate: ""
})

const memberOptions = ref<{ id: number; name: string }[]>([])

const selectedMember = computed(() =>
  members.value.find((m: any) => m.id == form.member)
)

onMounted(async () => {
  try {
    await fetchMembers()
    memberOptions.value = members.value.map(item => ({
      id: item.id,
      name: `${item.name} (${item.id})`
    }))
  } catch (err) {
    console.error(err)
    serverError.value = "Gagal memuat data member."
  } finally {
    loading.value = false
  }
})

const save = async () => {
  serverError.value = null
  if (!form.member || !form.level || !form.institution) {
    serverError.value = "Member, Jenjang, dan Institusi wajib diisi."
    return
  }

  saving.value = true
  try {
    await create(form)
    router.push("/educations")
  } catch (err: any) {
    console.error(err)
    serverError.value = err?.message || "Gagal menyimpan data pendidikan."
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <div class="p-6 w-full max-w-3xl mx-auto" style="background: var(--ui-bg); color: var(--ui-text);">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold" style="color: var(--ui-text-highlighted);">
        Tambah Riwayat Pendidikan
      </h1>
      <UButton to="/educations" icon="i-heroicons-arrow-left" color="gray" variant="soft" label="Kembali" />
    </div>

    <div v-if="loading" class="mb-4 text-sm text-gray-400">Loading members...</div>

    <UCard v-else :ui="{ body: { padding: 'p-6' } }">
      <form @submit.prevent="save" class="space-y-6">

        <!-- Member -->
        <div>
          <label class="block mb-2 text-sm font-semibold">Pilih Member <span class="text-red-500">*</span></label>
          <select v-model="form.member" class="w-full px-3 py-2 rounded-lg text-sm" style="background: var(--ui-bg); border:1px solid var(--ui-border);">
            <option value="">Pilih anggota gereja</option>
            <option v-for="m in memberOptions" :key="m.id" :value="m.id">{{ m.name }}</option>
          </select>
          <UBadge v-if="selectedMember" color="primary" variant="soft" class="mt-2">
            {{ selectedMember.name }}
          </UBadge>
        </div>

        <!-- Level, Institution, Major, Year -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block mb-2 text-sm font-semibold">Jenjang Pendidikan <span class="text-red-500">*</span></label>
            <input v-model="form.level" type="text" placeholder="Contoh: S1 / SMA / S2" class="w-full px-3 py-2 rounded-lg text-sm" style="background: var(--ui-bg); border:1px solid var(--ui-border);" />
          </div>
          <div>
            <label class="block mb-2 text-sm font-semibold">Institusi <span class="text-red-500">*</span></label>
            <input v-model="form.institution" type="text" placeholder="Contoh: Universitas Brawijaya" class="w-full px-3 py-2 rounded-lg text-sm" style="background: var(--ui-bg); border:1px solid var(--ui-border);" />
          </div>
          <div>
            <label class="block mb-2 text-sm font-semibold">Jurusan</label>
            <input v-model="form.major" type="text" placeholder="Contoh: Teknik Informatika" class="w-full px-3 py-2 rounded-lg text-sm" style="background: var(--ui-bg); border:1px solid var(--ui-border);" />
          </div>
          <div>
            <label class="block mb-2 text-sm font-semibold">Tahun Lulus</label>
            <input v-model="form.year_graduate" type="number" placeholder="Contoh: 2021" class="w-full px-3 py-2 rounded-lg text-sm" style="background: var(--ui-bg); border:1px solid var(--ui-border);" />
          </div>
        </div>

        <div v-if="serverError" class="px-4 py-3 rounded-lg text-sm whitespace-pre-wrap" style="background: rgba(239,68,68,0.1); border:1px solid rgba(239,68,68,0.3); color:#ef4444;">
          {{ serverError }}
        </div>

        <div class="flex items-center gap-3 pt-2">
          <UButton type="submit" :loading="saving" :disabled="saving" color="primary" icon="i-heroicons-check-circle" :label="saving ? 'Menyimpan...' : 'Simpan'" />
          <UButton color="gray" variant="soft" icon="i-heroicons-x-mark" label="Batal" @click="router.push('/educations')" />
        </div>
      </form>
    </UCard>

    <UCard class="mt-6" :ui="{ body: { padding: 'p-4' } }">
      <div class="flex items-start gap-3">
        <span class="text-blue-400 text-lg">ℹ️</span>
        <div class="text-sm">
          <p class="font-semibold mb-1">Debug Mode Active:</p>
          <p>Field dengan <span class="text-red-500">*</span> wajib diisi. Cek console browser untuk payload debug.</p>
        </div>
      </div>
    </UCard>
  </div>
</template>

<style scoped>
input:focus,
select:focus,
textarea:focus {
  outline: none;
  border-color: var(--ui-primary);
}
</style>
