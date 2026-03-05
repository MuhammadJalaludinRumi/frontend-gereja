<script setup lang="ts">
definePageMeta({
  middleware: ['role'],
  roles: [4]
})
import { ref, reactive, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import DropdownMember from '~/components/member/DropdownMember.vue'
import { useEconomyHistory } from '~/composables/useEconomyHistory'
import DefaultForm from '~/layouts/default-form.vue'

const { addHistory } = useEconomyHistory()

const router = useRouter()
const route = useRoute()
const id = Number(route.params.id)

const { economy, fetchById, update, loading } = useEconomies()
const { memberSelect, fetchMemberSelect } = useMembers()
const currentMemberSelect = ref<{ value: number, label: string }>({ value: 0, label: '' })

const saving = ref(false)
const loadingData = ref(true)

const form = reactive({
  member: 0,
  update: '',
  class: ''
})

onMounted(async () => {
  try {
    await fetchById(id)

    form.member = economy.value?.member.id ?? 0
    form.update = $formatDateForInput(String(economy.value?.update)) ?? '' 
    form.class = economy.value?.class ?? ''
    
    await fetchMemberSelect({ id: form.member })
    currentMemberSelect.value = memberSelect.value?.[0] ?? { value: 0, label: '' }
  } catch (err) {
    console.error('Failed to Fetch', err)
  } finally {
    loadingData.value = false
  }
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

const updateData = async () => {
  if (form.member === 0 || !form.update || !form.class) {
    alert('Semua field harus diisi')
    return
  }
  
  saving.value = true
  
  try {
    const before = economy.value?.class      // class lama
    const after = form.class                // class baru

    await update(id, form)

    // simpan riwayat
    await addHistory({
      economy_id: id,
      old_class: before,
      new_class: after,
      updated_by: 'Admin' // bisa diisi user login nanti
    })

    router.push(`/economy/${id}/history`)
  } catch (err) {
    console.error(err)
    alert('Gagal update economy')
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <DefaultForm title="Edit Ekonomi" :loading="loadingData">
    <form @submit.prevent="updateData" class="space-y-4">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <!-- Member -->
        <div>
          <label class="block mb-1 font-medium text-sm">Anggota<span class="text-error">*</span></label>
          <DropdownMember
            :member-items="memberSelect"
            :loading="loading"
            :selected="currentMemberSelect?.value"
            :selected-label="currentMemberSelect?.label"
            @search="fetchMembers"
            @update:selected="(val: number) => form.member = val ?? 0"
          />
        </div>

        <!-- Update -->
        <div>
          <label class="block mb-1 font-medium text-sm">Update<span class="text-error">*</span></label>
          <UInput v-model="form.update" type="date" class="w-full" required/>
        </div>

        <!-- Class -->
        <div>
          <label class="block mb-1 font-medium text-sm">Kelas<span class="text-error">*</span></label>
          <USelect
            v-model="form.class"
            :items="[
              { label: 'Miskin', value: 'miskin' },
              { label: 'Rentan Miskin', value: 'rentan miskin' },
              { label: 'Menuju Menengah', value: 'menuju menengah' },
              { label: 'Menengah', value: 'menengah' },
              { label: 'Atas', value: 'atas' },
            ]"
            class="w-full"
            placeholder="Pilih Kelas"
            required
          />
        </div>
      </div>

      <div class="flex justify-end gap-3 pt-2">
        <UButton color="neutral" variant="ghost" label="Batal" @click="router.push('/economy')"
          icon="i-heroicons-x-mark" />
        <UButton type="submit" color="primary" :loading="saving" :disabled="saving" label="Update"
          icon="i-heroicons-check-circle" />
      </div>
    </form>
  </DefaultForm>
</template>


