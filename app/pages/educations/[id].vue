<script setup lang="ts">
definePageMeta({
  middleware: ['role'],
  roles: [4]
})

import { ref, reactive, onMounted } from "vue"
import { useRouter, useRoute } from "vue-router"
import DropdownMember from '~/components/member/DropdownMember.vue'
import { useEducations } from "~/composables/useEducations"
import { useMembers } from "~/composables/useMembers"
import DefaultForm from '~/layouts/default-form.vue'

const router = useRouter()
const route = useRoute()
const id = Number(route.params.id)

const { fetchById, update, education } = useEducations()
const { memberSelect, fetchMemberSelect, loading: memberLoading } = useMembers()
const currentMemberSelect = ref<{ value: number, label: string } >({ value: 0, label: '' })

const loading = ref(true)
const saving = ref(false)
const serverError = ref<string | null>(null)

const form = reactive({
  member: 0,
  level: "",
  institution: "",
  major: "",
  year_graduate: ""
})

onMounted(async () => {
  try {
    await fetchById(id)
    
    if (education.value) {
      Object.assign(form, education.value)
    }

    await fetchMemberSelect({id: form.member})
    currentMemberSelect.value = memberSelect.value?.[0] ?? { value: 0, label: '' }

  } catch (err) {
    console.error(err)
    serverError.value = "Gagal memuat data."
  } finally {
    loading.value = false
  }
})

const fetchMembers = async (search: string) => {
  if (!search || search.length < 3) {
    memberSelect.value = []
    return
  }

  memberLoading.value = true
  try {
    await fetchMemberSelect({ search })
  } finally {
    memberLoading.value = false
  }
}

const save = async () => {
  serverError.value = null
  if (!form.member || !form.level || !form.institution) {
    serverError.value = "Member, Jenjang, dan Institusi wajib diisi."
    return
  }

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
  <DefaultForm title="Edit Pendidikan" :loading="loading">
    <form @submit.prevent="save" class="space-y-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block mb-2 text-sm font-semibold">Pilih Member <span class="text-red-500">*</span></label>
          <DropdownMember
            :member-items="memberSelect"
            :loading="memberLoading"
            :selected="currentMemberSelect?.value"
            :selected-label="currentMemberSelect?.label"
            @search="fetchMembers"
            @update:selected="(val: number) => form.member = val ?? 0"
          />
        </div>
        <div>
          <label class="block mb-2 text-sm font-semibold">Jenjang Pendidikan <span class="text-red-500">*</span></label>
          <USelect v-model="form.level" :items="['TK', 'SD', 'SMP', 'SMA', 'D1', 'D2', 'D3', 'S1', 'S2', 'S3']" placeholder="Pilih jenjang..." class="w-full" required />
        </div>
        <div>
          <label class="block mb-2 text-sm font-semibold">Institusi <span class="text-red-500">*</span></label>
          <UInput v-model="form.institution" type="text" placeholder="Contoh: Universitas Brawijaya" class="w-full" required />
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

      <div class="flex items-center justify-end gap-3 pt-2">
        <UButton color="neutral" variant="ghost" icon="i-heroicons-x-mark" label="Batal" @click="router.push('/educations')" />
        <UButton type="submit" :loading="saving" :disabled="saving" color="primary" icon="i-heroicons-check-circle" :label="saving ? 'Menyimpan...' : 'Update'" />
      </div>
    </form>
  </DefaultForm>
</template>

<style scoped>
input:focus,
select:focus,
textarea:focus {
  outline: none;
  border-color: var(--ui-primary);
}
</style>
