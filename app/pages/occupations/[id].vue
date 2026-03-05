<script setup lang="ts">
definePageMeta({ middleware: ['role'], roles: [4] })

import DropdownMember from '~/components/member/DropdownMember.vue'
import DefaultForm from '~/layouts/default-form.vue'

const router = useRouter()
const route = useRoute()

const { occupation, fetchById, update } = useOccupations()
const { memberSelect, fetchMemberSelect, loading: memberLoading } = useMembers()
const currentMemberSelect = ref<{ value: number, label: string } >({ value: 0, label: '' })

const loading = ref(true)
const saving = ref(false)
const errorMessage = ref<string | null>(null)


const form = reactive({
  member: 0,
  company: "",
  position: "",
  year_start: 0,
  year_end: 0
})

onMounted(async () => {
  try {
    const id = Number(route.params.id)
    await fetchById(id)

    if (occupation.value) {
      form.member = occupation.value.member
      form.company = occupation.value.company
      form.position = occupation.value.position
      form.year_start = occupation.value.year_start
      form.year_end = occupation.value.year_end
    }
    
    await fetchMemberSelect({id: form.member })
    currentMemberSelect.value = memberSelect.value?.[0] ?? { value: 0, label: '' }

  } catch (err) {
    errorMessage.value = "Gagal ambil data, mampus kita wkwk."
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

<template>
  <DefaultForm title="Edit Pekerjaan" :loading="loading">
    <form @submit.prevent="save" class="space-y-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">

        <!-- MEMBER -->
        <div>
          <label class="block mb-2 text-sm font-semibold">Anggota <span class="text-red-500">*</span></label>
          <DropdownMember
            :member-items="memberSelect"
            :loading="memberLoading"
            :selected="currentMemberSelect?.value"
            :selected-label="currentMemberSelect?.label"
            @search="fetchMembers"
            @update:selected="(val: number) => form.member = val ?? 0"
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
  </DefaultForm>
</template>
