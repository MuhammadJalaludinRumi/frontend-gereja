<script setup lang="ts">
definePageMeta({
  middleware: ['role'],
  roles: [4]
})

import { label } from '@unovis/ts/components/axis/style'
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

const memberInput = ref({ label: '', value: 0 })

const form = reactive({
  member: "" as string | number,
  level: "",
  institution: "",
  major: "",
  year_graduate: ""
})

onMounted(async () => {
  try {
    await fetchMembers()
  } catch (err) {
    console.error(err)
    serverError.value = "Gagal memuat data member."
  } finally {
    loading.value = false
  }
})

const save = async () => {
  serverError.value = null
  form.member = memberInput.value.value
  
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
  <div class="p-6 w-full">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">
        Tambah Riwayat Pendidikan
      </h1>
      <UButton to="/educations" icon="i-heroicons-arrow-left" color="neutral" variant="link" label="Kembali" />
    </div>

    <UCard>
      <form @submit.prevent="save" class="space-y-6">

        <!-- Member -->
        <div>
          <label class="block mb-2 text-sm font-semibold">Pilih Member <span class="text-red-500">*</span></label>
          <UInputMenu v-model="memberInput" :items="members.map(m => ({ label: m.name, value: m.id }))" placeholder="Cari member..." class="w-full" :loading="loading"/>
        </div>

        <!-- Level, Institution, Major, Year -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block mb-2 text-sm font-semibold">Jenjang Pendidikan <span class="text-red-500">*</span></label>
            <USelect v-model="form.level" :items="['TK', 'SD', 'SMP', 'SMA', 'D1', 'D2', 'D3', 'S1', 'S2', 'S3'].map(l => ({ label: l, value: l }))" placeholder="Pilih jenjang..." class="w-full" />
          </div>
          <div>
            <label class="block mb-2 text-sm font-semibold">Institusi <span class="text-red-500">*</span></label>
            <UInput v-model="form.institution" type="text" placeholder="Contoh: Universitas Brawijaya" class="w-full" />
          </div>
          <div>
            <label class="block mb-2 text-sm font-semibold">Jurusan</label>
            <UInput v-model="form.major" type="text" placeholder="Contoh: Teknik Informatika" class="w-full" />
          </div>
          <div>
            <label class="block mb-2 text-sm font-semibold">Tahun Lulus</label>
            <UInput v-model="form.year_graduate" type="number" placeholder="Contoh: 2021" class="w-full" />
          </div>
        </div>

        <div v-if="serverError" class="px-4 py-3 rounded-lg text-sm whitespace-pre-wrap" style="background: rgba(239,68,68,0.1); border:1px solid rgba(239,68,68,0.3); color:#ef4444;">
          {{ serverError }}
        </div>

        <div class="flex items-center justify-end gap-3 pt-2 ">
          <UButton color="neutral" variant="ghost" icon="i-heroicons-x-mark" label="Batal" @click="router.push('/educations')" />
          <UButton type="submit" :loading="saving" :disabled="saving" color="primary" icon="i-heroicons-check-circle" :label="saving ? 'Menyimpan...' : 'Simpan'" />
        </div>
      </form>
    </UCard>

    <UCard class="mt-6">
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
