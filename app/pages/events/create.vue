<script setup lang="ts">
definePageMeta({
  middleware: ['role'],
  roles: [4]
})

import { onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const { members, fetchAll } = useMembers()
const { create, loading } = useEvent()

const saving = ref(false)
const formError = ref<string | null>(null)

onMounted(fetchAll)

const memberOptions = computed(() =>
  members.value.map(member => ({
    label: member.name,
    value: member.id
  }))
)

const form = ref({
  service_type: '',
  service_date: '',
  service_time: '',

  service_ministry: undefined as { label: string; value: number } | undefined,

  scripture_reading: '',
  sermon_text: '',
  sermon_theme: '',

  coordinator: undefined as { label: string; value: number } | undefined,
  liturgist: undefined as { label: string; value: number } | undefined,
  pf_assistant: undefined as { label: string; value: number } | undefined,

  musician: [] as { label: string; value: number }[],
  worship_leader: [] as { label: string; value: number }[],
  offering_officer: [] as { label: string; value: number }[],
  choir: [] as { label: string; value: number }[],

  male_attendance: 0 as number | 0,
  female_attendance: 0 as number | 0,

  red_envelope: 0 as number | 0,
  blue_envelope: 0 as number | 0,
  other_envelope: 0 as number | 0,

  note: ''
})

const validateForm = () => {
  formError.value = null

  if (!form.value.service_type) {
    formError.value = 'Jenis kebaktian wajib dipilih.'
    return false
  }

  if (!form.value.service_date) {
    formError.value = 'Tanggal kebaktian wajib diisi.'
    return false
  }

  if (!form.value.service_time) {
    formError.value = 'Waktu kebaktian wajib diisi.'
    return false
  }

  if (!form.value.service_ministry) {
    formError.value = 'Pelayan kebaktian wajib dipilih.'
    return false
  }

  if (!form.value.scripture_reading.trim()) {
    formError.value = 'Pembacaan Alkitab wajib diisi.'
    return false
  }

  if (!form.value.sermon_text.trim()) {
    formError.value = 'Nats khotbah wajib diisi.'
    return false
  }

  if (!form.value.sermon_theme.trim()) {
    formError.value = 'Tema khotbah wajib diisi.'
    return false
  }

  if (!form.value.coordinator) {
    formError.value = 'Koordinator wajib dipilih.'
    return false
  }

  if (!form.value.liturgist) {
    formError.value = 'Liturgos wajib dipilih.'
    return false
  }

  if (!form.value.pf_assistant) {
    formError.value = 'Pendamping PF wajib dipilih.'
    return false
  }

  if (!form.value.musician.length) {
    formError.value = 'Pemusik minimal 1 orang.'
    return false
  }

  if (!form.value.worship_leader.length) {
    formError.value = 'Pemandu pujian minimal 1 orang.'
    return false
  }

  if (!form.value.offering_officer.length) {
    formError.value = 'Petugas persembahan minimal 1 orang.'
    return false
  }

  if (!form.value.choir.length) {
    formError.value = 'Paduan suara minimal 1 orang.'
    return false
  }

  return true
}

const submit = async () => {
  if (!validateForm()) return

  const payload = {
    service_type: form.value.service_type,
    service_date: form.value.service_date,
    service_time: form.value.service_time,
    
    service_ministry: form.value.service_ministry?.value,
    
    scripture_reading: form.value.scripture_reading,
    sermon_text: form.value.sermon_text,
    sermon_theme: form.value.sermon_theme,
    
    coordinator: form.value.coordinator?.value,
    liturgist: form.value.liturgist?.value,
    pf_assistant: form.value.pf_assistant?.value,
    
    musician: form.value.musician.map(m => m.value),
    worship_leader: form.value.worship_leader.map(w => w.value),
    offering_officer: form.value.offering_officer.map(o => o.value),
    choir: form.value.choir.map(c => c.value),
    
    male_attendance: form.value.male_attendance,
    female_attendance: form.value.female_attendance,
    
    red_envelope: form.value.red_envelope,
    blue_envelope: form.value.blue_envelope,
    other_envelope: form.value.other_envelope,
    
    note: form.value.note
  }

  saving.value = true
  formError.value = null

  try {
    await create(payload as any)
    router.push('/events')
  } catch (e) {
    console.error('❌ Gagal membuat agenda:', e)
    formError.value = 'Gagal menyimpan agenda. Coba lagi nanti.'
  } finally {
    saving.value = true
  }
}

</script>

<template>
  <div class="p-6 w-full" style="color: var(--ui-text); background: var(--ui-bg)">
    <h1 class="text-2xl font-bold mb-6" style="color: var(--ui-text-highlighted)">
      Tambah Agenda Baru
    </h1>

    <UCard>
      <form @submit.prevent="submit" class="space-y-5">
        <div class="grid grid-cols-2 space-y-3 gap-x-4">
          <h1 class="text-xl font-medium col-span-2">Informasi Agenda</h1>
          
          <div>
            <label class="block mb-1 text-sm font-medium">Jenis Kebaktian</label>
            <USelect
              v-model="form.service_type"
              :items="[
                { label: 'Umum', value: 'Umum' },
                { label: 'KRT', value: 'KRT' },
                { label: 'Pemuda Remaja', value: 'Pemuda Remaja' },
                { label: 'Sekolah Minggu', value: 'Sekolah Minggu' },
                { label: 'Pria', value: 'Pria' },
                { label: 'Lansia', value: 'Lansia' },
                { label: 'Perempuan', value: 'Perempuan' },
                { label: 'Perayaan HRG', value: 'Perayaan HRG' },
                { label: 'Lain-lain', value: 'Lain-lain' },
              ]"
              class="w-full"
            />
          </div>
          
          <div>
            <label class="block mb-1 text-sm font-medium">Pelayan Kebaktian</label>
            <UInputMenu
              v-model="form.service_ministry"
              :items="memberOptions"
              class="w-full"
            />
          </div>

          <div>
            <label class="block mb-1 text-sm font-medium">Tanggal</label>
            <UInput v-model="form.service_date" type="date" class="w-full"/>
          </div>

          <div>
            <label class="block mb-1 text-sm font-medium">Waktu</label>
            <UInput v-model="form.service_time" type="time" class="w-full"/>
          </div>

          <USeparator  class="col-span-2"/>
        </div>
        
        <div class="grid grid-cols-2 space-y-3 gap-x-4">
          <h1 class="text-xl font-medium col-span-2">Liturgi & Khotbah</h1>

          <div>
            <label class="block mb-1 text-sm font-medium">Pembacaan Alkitab</label>
            <UInput v-model="form.scripture_reading" placeholder="Masukkan pembacaan Alkitab" class="w-full"/>
          </div>
  
          <div>
            <label class="block mb-1 text-sm font-medium">Nats Khotbah</label>
            <UInput v-model="form.sermon_text" placeholder="Masukkan nats khotbah" class="w-full"/>
          </div>
  
          <div>
            <label class="block mb-1 text-sm font-medium">Tema</label>
            <UInput v-model="form.sermon_theme" placeholder="Masukkan tema" class="w-full"/>
          </div>

          <USeparator  class="col-span-2"/>
        </div>

        <div class="grid grid-cols-2 space-y-3 gap-x-4">
          <h1 class="text-xl font-medium col-span-2">Pelayan Utama</h1>
          <div>
            <label class="block mb-1 text-sm font-medium">Koordinator</label>
            <UInputMenu
            v-model="form.coordinator"
            :items="memberOptions"
            class="w-full"
            />
          </div>
          
          <div>
            <label class="block mb-1 text-sm font-medium">Liturgos</label>
            <UInputMenu
            v-model="form.liturgist"
            :items="memberOptions"
            class="w-full"
            />
          </div>
          
          <div>
            <label class="block mb-1 text-sm font-medium">Pendamping PF</label>
            <UInputMenu
            v-model="form.pf_assistant"
            :items="memberOptions"
            class="w-full"
            />
          </div>

          <USeparator class="col-span-2" />
        </div>
        
        <div class="grid grid-cols-2 space-y-3 gap-x-4">
          <h1 class="text-xl font-medium col-span-2">Pelayan Tim</h1>
          <div>
            <label class="block mb-1 text-sm font-medium">Pemusik</label>
            <UInputMenu
            v-model="form.musician"
            multiple
            :items="memberOptions"
            class="w-full"
            />
          </div>
          
          <div>
            <label class="block mb-1 text-sm font-medium">Pemandu Pujian</label>
            <UInputMenu
            v-model="form.worship_leader"
            multiple
            :items="memberOptions"
            class="w-full"
            />
          </div>
          
          <div>
            <label class="block mb-1 text-sm font-medium">Petugas Persembahan</label>
            <UInputMenu
            v-model="form.offering_officer"
            multiple
            :items="memberOptions"
            class="w-full"
            />
          </div>
          
          <div>
            <label class="block mb-1 text-sm font-medium">Paduan Suara</label>
            <UInputMenu
            v-model="form.choir"
            multiple
            :items="memberOptions"
            class="w-full"
            />
          </div>
          
          <USeparator class="col-span-2" />
        </div>

        <div class="grid grid-cols-2 space-y-3 gap-x-4">
          <h1 class="text-xl font-medium col-span-2">Kehadiran Jemaat</h1>
          <div>
            <label class="block mb-1 text-sm font-medium">Jumlah Hadir (Pria)</label>
            <UInput 
            v-model="form.male_attendance" 
            placeholder="Masukkan jumlah hadir (Pria)" 
            class="w-full" 
            type="number" 
            min="0" 
            @input="form.male_attendance = Math.max(0, Number(form.male_attendance || 0))" 
            @keydown="['-', '+', '.', ','].includes($event.key) && $event.preventDefault()"
            />
          </div>
          
          <div>
            <label class="block mb-1 text-sm font-medium">Jumlah Hadir (Wanita)</label>
            <UInput 
            v-model="form.female_attendance" 
            placeholder="Masukkan jumlah hadir (Wanita)" 
            class="w-full" 
            type="number" 
            min="0" 
            @input="form.female_attendance = Math.max(0, Number(form.female_attendance || 0))" 
            @keydown="['-', '+', '.', ','].includes($event.key) && $event.preventDefault()"
            />
          </div>

          <USeparator class="col-span-2" />
        </div>
        
        <div class="grid grid-cols-2 space-y-3 gap-x-4">
          <h1 class="text-xl font-medium col-span-2">Persembahan</h1>
          <div>
            <label class="block mb-1 text-sm font-medium">Persembahan (Amplop Merah)</label>
            <UInput 
            v-model="form.red_envelope" 
            placeholder="Masukkan persembahan (amplop merah)" 
            class="w-full" 
            type="number" 
            min="0" 
            @input="form.red_envelope = Math.max(0, Number(form.red_envelope || 0))" 
            @keydown="['-', '+', '.', ','].includes($event.key) && $event.preventDefault()"
            />
          </div>
          
          <div>
            <label class="block mb-1 text-sm font-medium">Persembahan (Amplop Biru)</label>
            <UInput 
            v-model="form.blue_envelope" 
            placeholder="Masukkan persembahan (amplop biru)" 
            class="w-full" 
            type="number" 
            min="0" 
            @input="form.blue_envelope = Math.max(0, Number(form.blue_envelope || 0))" 
            @keydown="['-', '+', '.', ','].includes($event.key) && $event.preventDefault()"
            />
          </div>
          
          <div>
            <label class="block mb-1 text-sm font-medium">Persembahan (Amplop Lainnya)</label>
            <UInput 
            v-model="form.other_envelope" 
            placeholder="Masukkan persembahan (amplop lainnya)" 
            class="w-full" 
            type="number" 
            min="0" 
            @input="form.other_envelope = Math.max(0, Number(form.other_envelope || 0))" 
            @keydown="['-', '+', '.', ','].includes($event.key) && $event.preventDefault()"/>
          </div>

          <USeparator class="col-span-2" />
        </div>

        <div>
          <label class="block mb-1 text-sm font-medium">Catatan</label>
          <UTextarea v-model="form.note" class="w-full"></UTextarea>
        </div>

        <div class="flex justify-end gap-3 pt-4 col-span-2">
          <UButton
            color="neutral"
            variant="soft"
            label="Batal"
            @click="router.push('/events')"
          />
          <UButton
            type="submit"
            :loading="saving || loading"
            color="primary"
            label="Simpan"
          />
        </div>

        <!-- error -->
        <p v-if="formError" class="text-red-500 text-sm mt-2">
          {{ formError }}
        </p>
      </form>
    </UCard>
  </div>
</template>