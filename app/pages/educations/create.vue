<script setup lang="ts">
definePageMeta({
  middleware: ['role'],
  roles: [4]
})

import { ref, reactive, computed, onMounted } from "vue"
import { useRouter } from "vue-router"
import DropdownMember from '~/components/member/DropdownMember.vue'
import { useEducations } from "~/composables/useEducations"
import { useMembers } from "~/composables/useMembers"
import DefaultForm from '~/layouts/default-form.vue'

const router = useRouter()
const { create } = useEducations()
const { memberSelect, fetchMemberSelect } = useMembers()

const loading = ref(false)
const saving = ref(false)
const serverError = ref<string | null>(null)

const memberInput = ref({ label: '', value: 0 })

const form = reactive({
  member: 0,
  level: "",
  institution: "",
  major: "",
  year_graduate: ""
})

const fetchMembers = async (search: string) => {
  if (!search || search.length < 3) {
    memberSelect.value = []
    return
  }

  loading.value = true
  try {
    await fetchMemberSelect({ search })
  } finally {
    loading.value = false
  }
}

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
  <DefaultForm title="Tambah Pendidikan">
    <form @submit.prevent="save" class="space-y-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block mb-2 text-sm font-semibold">Pilih Anggota <span class="text-red-500">*</span></label>
          <DropdownMember
            :member-items="memberSelect"
            :loading="loading"
            :selected="form.member"
            @search="fetchMembers"
            @update:selected="val => form.member = val ?? 0"
          />
        </div>
        <div>
          <label class="block mb-2 text-sm font-semibold">Jenjang Pendidikan <span class="text-red-500">*</span></label>
          <USelect 
            v-model="form.level" 
            :items="['TK', 'SD', 'SMP', 'SMA', 'D1', 'D2', 'D3', 'S1', 'S2', 'S3']" 
            placeholder="Pilih jenjang..." 
            class="w-full" 
            required
          />
        </div>
        <div>
          <label class="block mb-2 text-sm font-semibold">Institusi <span class="text-red-500">*</span></label>
          <UInput 
            v-model="form.institution" 
            type="text" 
            placeholder="Contoh: Universitas Brawijaya" 
            class="w-full"
            required 
          />
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
  </DefaultForm>
</template>
