<script setup lang="ts">
definePageMeta({
  middleware: ['role'],
  roles: [4]
})
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useEconomies } from '~/composables/useEconomies'
import { useMembers } from '~/composables/useMembers'
import DefaultForm from '~/layouts/default-form.vue'

const router = useRouter()
const { create } = useEconomies()
const { members, fetchAll: fetchMembers } = useMembers()

const loading = ref(true)

const saving = ref(false)
const form = reactive({
  member: { label: '', value: 0 },
  update: '',
  class: ''
})

const memberOptions = computed(() =>
  members.value.map(member => ({
    label: member.name,
    value: member.id
  }))
)

onMounted(async () => {
  try {
    await fetchMembers()
  } catch (err) {
    console.log('Error fetching members', err)
  } finally {
    loading.value = false
  }
})

const save = async () => {
  if (form.member.value === 0 || !form.update || !form.class) {
    alert('Semua field harus diisi')
    return
  }

  saving.value = true
  try {
    await create({
      member: form.member.value,
      update: form.update,
      class: form.class
    })
    router.push('/economy')
  } catch (err) {
    console.error(err)
    alert('Gagal menyimpan economy')
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <DefaultForm title="Tambah Ekonomi" :loading="loading">
    <form @submit.prevent="save" class="space-y-4">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block mb-1 font-medium text-sm">Anggota<span class="text-error">*</span></label>
          <UInputMenu
          v-model="form.member"
          :items="memberOptions"
          class="w-full"
          placeholder="Pilih Anggota"
          required
          />
        </div>

        <div>
          <label class="block mb-1 font-medium text-sm">Update<span class="text-error">*</span></label>
          <UInput v-model="form.update" type="date" class="w-full" required/>
        </div>

        <div>
          <label class="block mb-1 font-medium text-sm">Class<span class="text-error">*</span></label>
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
        <UButton type="submit" color="primary" :loading="saving" :disabled="saving" label="Simpan"
          icon="i-heroicons-check-circle" />
      </div>
    </form>
  </DefaultForm>
</template>
