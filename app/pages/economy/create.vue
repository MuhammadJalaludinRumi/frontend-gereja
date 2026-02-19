<template>
  <div class="p-6 w-full overflow-hidden" style="background: var(--ui-bg); color: var(--ui-text);">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold" style="color: var(--ui-text-highlighted);">Tambah Economy</h1>
      <UButton to="/economy" icon="i-heroicons-arrow-left" color="neutral" variant="link" label="Kembali" />
    </div>

    <UCard>
      <form @submit.prevent="save" class="space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block mb-1 font-medium text-sm">Member</label>
            <UInputMenu
            v-model="form.member"
            :items="memberOptions"
            class="w-full"
            />
          </div>

          <div>
            <label class="block mb-1 font-medium text-sm">Update</label>
            <UInput v-model="form.update" type="date" class="w-full"/>
          </div>

          <div>
            <label class="block mb-1 font-medium text-sm">Class</label>
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
            />
          </div>
        </div>

        <div class="flex justify-end gap-3 pt-2">
          <UButton color="neutral" variant="link" label="Batal" @click="router.push('/economy')"
            icon="i-heroicons-x-mark" />
          <UButton type="submit" color="primary" :loading="saving" :disabled="saving" label="Simpan"
            icon="i-heroicons-check-circle" />
        </div>
      </form>
    </UCard>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: ['role'],
  roles: [4]
})
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useEconomies } from '~/composables/useEconomies'
import { useMembers } from '~/composables/useMembers'

const router = useRouter()
const { create } = useEconomies()
const { members, fetchAll: fetchMembers } = useMembers()

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

onMounted(fetchMembers)

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
