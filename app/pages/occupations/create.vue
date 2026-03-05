<script setup lang="ts">
definePageMeta({
  middleware: ['role'],
  roles: [4]
})

import DefaultForm from '~/layouts/default-form.vue'
import DropdownMember from '~/components/member/DropdownMember.vue'

const router = useRouter()
const { create } = useOccupations()
const { memberSelect, fetchMemberSelect, loading } = useMembers()

const saving = ref(false)

const form = reactive({
  member: 0,
  company: '',
  position: '',
  year_start: '',
  year_end: ''
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
  saving.value = true

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

<template>
  <DefaultForm title="Tambah Pekerjaan">
    <form @submit.prevent="save" class="space-y-4">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block mb-1 font-semibold text-sm">Anggota <span class="text-red-500">*</span></label>
          <DropdownMember
            :member-items="memberSelect"
            :loading="loading"
            :selected="form.member"
            @search="fetchMembers"
            @update:selected="val => form.member = val ?? 0"
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
  </DefaultForm>
</template>
