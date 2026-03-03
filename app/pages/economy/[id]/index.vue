<script setup lang="ts">
definePageMeta({
  middleware: ['role'],
  roles: [4]
})
import { ref, reactive, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useEconomies } from '~/composables/useEconomies'
import { useMembers } from '~/composables/useMembers'
import { useEconomyHistory } from '~/composables/useEconomyHistory'
import DefaultForm from '~/layouts/default-form.vue'

const { addHistory } = useEconomyHistory()

const router = useRouter()
const route = useRoute()
const id = Number(route.params.id)

const { economy, fetchById, update, loading } = useEconomies()
const { members, fetchAll: fetchMembers } = useMembers()

const saving = ref(false)
const loadingData = ref(true)

const form = reactive({
  member: { label: '', value: 0 },
  update: '',
  class: ''
})

onMounted(async () => {
  try {
    await fetchMembers()
    await fetchById(id)
  } catch (err) {
    console.error('Failed to Fetch', err)
  } finally {
    loadingData.value = false
  }
})

watch(economy, (newVal: any) => {
  if (newVal) {
    const selected = $findOptions(
      memberOptions.value,
      [newVal.member?.id || 0]
    )[0]

    form.member = selected || { label: '', value: 0 }
    form.update = $formatDateForInput(newVal.update) || ''
    form.class = newVal.class || ''
  }
}, { immediate: true })


const memberOptions = computed<{ label: string; value: number }[]>(() =>
  members.value
    .filter(m => typeof m.id === 'number')
    .map(m => ({
      label: m.name,
      value: m.id!
    }))
)

const updateData = async () => {
  if (form.member.value === 0 || !form.update || !form.class) {
    alert('Semua field harus diisi')
    return
  }
  
  saving.value = true
  
  try {
    const before = economy.value?.class      // class lama
    const after = form.class                // class baru

    await update(id, {
      member: form.member.value,
      update: form.update,
      class: form.class
    })

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
          <UInputMenu
          v-model="form.member"
          :items="memberOptions"
          class="w-full"
          placeholder="Pilih Anggota"
          required
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


