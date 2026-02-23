<script setup lang="ts">
definePageMeta({
  middleware: ['role'],
  roles: [4]
})

import { ref, reactive, onMounted } from "vue"
import { useRouter, useRoute } from "vue-router"
import { useEducations } from "~/composables/useEducations"
import { useMembers } from "~/composables/useMembers"

const router = useRouter()
const route = useRoute()
const id = Number(route.params.id)

const { fetchById, update, education, loading: eduLoading } = useEducations()
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

const memberOptions = computed<{ label: string; value: number }[]>(() =>
  members.value
    .filter(m => typeof m.id === 'number')
    .map(m => ({
      label: m.name,
      value: m.id!
    }))
)

onMounted(async () => {
  try {
    await fetchMembers()
    
    await fetchById(id)
    
    if (education.value) {
      Object.assign(form, education.value)
    }

    memberInput.value = memberOptions.value.find(m => m.value === education.value?.member) || { label: '', value: 0 }
  } catch (err) {
    console.error(err)
    serverError.value = "Gagal memuat data."
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

  form.member = memberInput.value.value

  saving.value = true
  try {
    await update(id, form)
    router.push("/educations")
  } catch (err: any) {
    console.error(err)
    serverError.value = err?.message || "Gagal update data pendidikan."
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <div class="p-6 w-full mx-auto">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">Edit Pendidikan</h1>
      <UButton to="/educations" icon="i-heroicons-arrow-left" color="neutral" variant="link" label="Kembali" />
    </div>

    <UCard>
      <form @submit.prevent="save" class="space-y-6">

        <!-- Member -->
        <div>
          <label class="block mb-2 text-sm font-semibold">Pilih Member <span class="text-red-500">*</span></label>
          <UInputMenu v-model="memberInput" :items="memberOptions" placeholder="Cari member..." class="w-full" :loading="loading"/>
        </div>

        <!-- Level, Institution, Major, Year -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block mb-2 text-sm font-semibold">Jenjang Pendidikan <span class="text-red-500">*</span></label>
            <USelect v-model="form.level" :items="['TK', 'SD', 'SMP', 'SMA', 'D1', 'D2', 'D3', 'S1', 'S2', 'S3'].map(l => ({ label: l, value: l }))" placeholder="Pilih jenjang..." class="w-full mt-2" />
          </div>
          <div>
            <label class="block mb-2 text-sm font-semibold">Institusi <span class="text-red-500">*</span></label>
            <UInput v-model="form.institution" type="text" placeholder="Contoh: Universitas Brawijaya" class="w-full mt-2" />
          </div>
          <div>
            <label class="block mb-2 text-sm font-semibold">Jurusan</label>
            <UInput v-model="form.major" type="text" placeholder="Contoh: Teknik Informatika" class="w-full mt-2" />
          </div>
          <div>
            <label class="block mb-2 text-sm font-semibold">Tahun Lulus</label>
            <UInput v-model="form.year_graduate" type="number" placeholder="Contoh: 2021" class="w-full mt-2" />            
          </div>
        </div>

        <div v-if="serverError" class="px-4 py-3 rounded-lg text-sm whitespace-pre-wrap" style="background: rgba(239,68,68,0.1); border:1px solid rgba(239,68,68,0.3); color:#ef4444;">
          {{ serverError }}
        </div>

        <div class="flex items-center justify-end gap-3 pt-2">
          <UButton color="neutral" variant="ghost" icon="i-heroicons-x-mark" label="Batal" @click="router.push('/educations')" />
          <UButton type="submit" :loading="saving" :disabled="saving" color="primary" icon="i-heroicons-check-circle" :label="saving ? 'Menyimpan...' : 'Update'" />
        </div>
      </form>
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
