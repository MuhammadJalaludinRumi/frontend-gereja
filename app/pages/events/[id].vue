<script setup lang="ts">
import DropdownMember from '~/components/member/DropdownMember.vue';
import DefaultForm from '~/layouts/default-form.vue';

definePageMeta({
  middleware: ["role"],
  roles: [4],
});


const route = useRoute()
const router = useRouter()

const { memberSelect, fetchMemberSelect } = useMembers()
const { fetchById, currentEvent, update, error  } = useEvent()

const saving = ref(false)
const loadingData = ref(false)
const formError = ref<string | null>(null)

const loading = ref({
  serviceMinistry: false,
  coordinator: false,
  liturgist: false,
  pfAssistant: false,
  musician: false,
  worshipLeader: false,
  offeringOfficer: false,
  choir: false,
})

const items = ref({
  serviceMinistry: [] as { label: string; value: number }[], 
  coordinator: [] as { label: string; value: number }[],
  liturgist: [] as { label: string; value: number }[], 
  pfAssistant: [] as { label: string; value: number }[], 
  musician: [] as { label: string; value: number }[], 
  worshipLeader: [] as { label: string; value: number }[], 
  offeringOfficer: [] as { label: string; value: number }[], 
  choir: [] as { label: string; value: number }[], 
})

const fetchMembers = async (key: keyof typeof items.value, search: string) => {
  if (!search || search.length < 3) {
    items.value[key] = []
    return
  }

  loading.value[key] = true

  try {
    await fetchMemberSelect({ search })

    items.value[key] = memberSelect.value.map((member) => ({
      label: member.label,
      value: member.value
    }))
  } finally {
    loading.value[key] = false
  }
}

const fetchMultipleMembers = async (key: keyof typeof items.value, search: string) => {
  if (!search || search.length < 3) {
    items.value[key] = []
    return
  }

  loading.value[key] = true

  try {
    await fetchMemberSelect({ search })

    const newItems = memberSelect.value.map((member) => ({
      label: member.label,
      value: member.value
    }))

    const merged = [...items.value[key], ...newItems]

    items.value[key] = merged.filter(
      (item, index, self) =>
        index === self.findIndex((i) => i.value === item.value)
    )
  } finally {
    loading.value[key] = false
  }
}

const form = ref({
  service_type: '',
  service_date: '',
  service_time: '',

  service_ministry: { label: '', value: 0 },

  scripture_reading: '',
  sermon_text: '',
  sermon_theme: '',

  coordinator: { label: '', value: 0 },
  liturgist: { label: '', value: 0 },
  pf_assistant: { label: '', value: 0 },

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

onMounted(async () => {
  const id = Number(route.params.id)

  loadingData.value = true
  try {
    await fetchMemberSelect()
    if (id) await fetchById(id)
  } catch (err) {
  console.error(err)
  } finally {
  loadingData.value = false
  }
})

watch(currentEvent, (event) => {
  if (!event) return

  form.value.service_type = event.service_type
  form.value.service_date = event.service_date
  form.value.service_time = event.service_time

  form.value.scripture_reading = event.scripture_reading
  form.value.sermon_text = event.sermon_text
  form.value.sermon_theme = event.sermon_theme

  form.value.note = event.note ?? ''

  // single select
  form.value.service_ministry = mapMember(event.service_ministry)
  items.value.serviceMinistry = [mapMember(event.service_ministry)]

  form.value.coordinator = mapMember(event.coordinator)
  items.value.coordinator = [mapMember(event.coordinator)]

  form.value.liturgist = mapMember(event.liturgist)
  items.value.liturgist = [mapMember(event.liturgist)]

  form.value.pf_assistant = mapMember(event.pf_assistant)
  items.value.pfAssistant = [mapMember(event.pf_assistant)]
  
  // multiple select
  form.value.musician = mapMembers(event.musician)
  items.value.musician = mapMembers(event.musician)

  form.value.worship_leader = mapMembers(event.worship_leader)
  items.value.worshipLeader = mapMembers(event.worship_leader)

  form.value.offering_officer = mapMembers(event.offering_officer)
  items.value.offeringOfficer = mapMembers(event.offering_officer)

  form.value.choir = mapMembers(event.choir)
  items.value.choir = mapMembers(event.choir)

  // numbers
  form.value.male_attendance = event.male_attendance ?? 0
  form.value.female_attendance = event.female_attendance ?? 0

  form.value.red_envelope = event.red_envelope ?? 0
  form.value.blue_envelope = event.blue_envelope ?? 0
  form.value.other_envelope = event.other_envelope ?? 0

  console.log(form.value)
}, { immediate: true })

function normalizeTime(time: string | undefined): string {
  if (!time) return ''
  return time.slice(0, 5)
}

const mapMember = (member: any) => {
  if (!member) return { label: '', value: 0 }

  return {
    label: member.name,
    value: member.id
  }
}

const mapMembers = (members: any[]) => {
  if (!members) return []

  return members.map(member => ({
    label: member.name,
    value: member.id
  }))
}

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
    service_time: normalizeTime(form.value.service_time),
    
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
    await update(Number(route.params.id), payload as any)

    router.push('/events')
  } catch (e) {
    console.error("❌ Gagal memperbarui agenda:", e);
    error.value = "Gagal memperbarui agenda."
  } finally {
    saving.value = false
  }
}

</script>

<template>
  <DefaultForm title="Edit Agenda" :loading="loadingData">
    <form @submit.prevent="submit" class="space-y-5">
      <div class="grid grid-cols-2 space-y-3 gap-x-4">
        <h1 class="text-xl font-medium col-span-2">Informasi Agenda</h1>
        
        <div>
          <label class="block mb-1 text-sm font-medium">Jenis Kebaktian <Mandatory/></label>
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
            placeholder="Pilih Jenis Kebaktian"
            required
          />
        </div>
        
        <div>
          <label class="block mb-1 text-sm font-medium">Pelayan Kebaktian <Mandatory/></label>
          <DropdownMember
            :member-items="items.serviceMinistry"
            :loading="loading.serviceMinistry"
            :selected="form.service_ministry.value"
            :selected-label="form.service_ministry.label"
            @search="(q) => fetchMembers('serviceMinistry', q)"
            @update:selected-object="(member: any) => { form.service_ministry = member }"
            placeholder="Cari dan pilih anggota untuk Pelayan Kebaktian"
          />
        </div>

        <div>
          <label class="block mb-1 text-sm font-medium">Tanggal <Mandatory/></label>
          <UInput v-model="form.service_date" type="date" class="w-full" required/>
        </div>

        <div>
          <label class="block mb-1 text-sm font-medium">Waktu <Mandatory/></label>
          <UInput v-model="form.service_time" type="time" class="w-full" required/>
        </div>

        <USeparator class="col-span-2"/>
      </div>
      
      <div class="grid grid-cols-2 space-y-3 gap-x-4">
        <h1 class="text-xl font-medium col-span-2">Liturgi & Khotbah</h1>

        <div>
          <label class="block mb-1 text-sm font-medium">Pembacaan Alkitab <Mandatory/></label>
          <UInput v-model="form.scripture_reading" placeholder="Masukkan pembacaan Alkitab" class="w-full" required/>
        </div>

        <div>
          <label class="block mb-1 text-sm font-medium">Nats Khotbah <Mandatory/></label>
          <UInput v-model="form.sermon_text" placeholder="Masukkan nats khotbah" class="w-full" required/>
        </div>

        <div>
          <label class="block mb-1 text-sm font-medium">Tema <Mandatory/></label>
          <UInput v-model="form.sermon_theme" placeholder="Masukkan tema" class="w-full" required/>
        </div>

        <USeparator  class="col-span-2"/>
      </div>

      <div class="grid grid-cols-2 space-y-3 gap-x-4">
        <h1 class="text-xl font-medium col-span-2">Pelayan Utama</h1>
        <div>
          <label class="block mb-1 text-sm font-medium">Koordinator <Mandatory/></label>
          <DropdownMember
            :member-items="items.coordinator"
            :loading="loading.coordinator"
            :selected="form.coordinator.value"
            :selected-label="form.coordinator.label"
            @search="(q) => fetchMembers('coordinator', q)"
            @update:selected-object="(member: any) => { form.coordinator = member }"
            placeholder="Cari dan pilih anggota untuk Koordinator"
          />
        </div>
        
        <div>
          <label class="block mb-1 text-sm font-medium">Liturgos <Mandatory/></label>
          <DropdownMember
            :member-items="items.liturgist"
            :loading="loading.liturgist"
            :selected="form.liturgist.value"
            :selected-label="form.liturgist.label"
            @search="(q) => fetchMembers('liturgist', q)"
            @update:selected-object="(member: any) => { form.liturgist = member }"
            placeholder="Cari dan pilih anggota untuk Liturgos"
          />
        </div>
        
        <div>
          <label class="block mb-1 text-sm font-medium">Pendamping PF <Mandatory/></label>
          <DropdownMember
            :member-items="items.pfAssistant"
            :loading="loading.pfAssistant"
            :selected="form.pf_assistant.value"
            :selected-label="form.pf_assistant.label"
            @search="(q) => fetchMembers('pfAssistant', q)"
            @update:selected-object="(member: any) => { form.pf_assistant = member }"
            placeholder="Cari dan pilih anggota untuk Pendamping PF"
          />
        </div>

        <USeparator class="col-span-2" />
      </div>
      
      <div class="grid grid-cols-2 space-y-3 gap-x-4">
        <h1 class="text-xl font-medium col-span-2">Pelayan Tim</h1>
        <div>
          <label class="block mb-1 text-sm font-medium">Pemusik (Minimal 1) <Mandatory/></label>
          <DropdownMember
            :member-items="items.musician"
            :loading="loading.musician"
            :multiple="true"
            :selected-multiple="form.musician"
            @search="(q) => fetchMultipleMembers('musician', q)"
            @update:selected-multiple="(members) => form.musician = members"
            placeholder="Cari dan pilih anggota untuk Pemusik"
          />
        </div>
        
        <div>
          <label class="block mb-1 text-sm font-medium">Pemandu Pujian (Minimal 1) <Mandatory/></label>
          <DropdownMember
            :member-items="items.worshipLeader"
            :loading="loading.worshipLeader"
            :multiple="true"
            :selected-multiple="form.worship_leader"
            @search="(q) => fetchMultipleMembers('worshipLeader', q)"
            @update:selected-multiple="(members) => form.worship_leader = members"
            placeholder="Cari dan pilih anggota untuk Pemusik"
          />
        </div>
        
        <div>
          <label class="block mb-1 text-sm font-medium">Petugas Persembahan (Minimal 1) <Mandatory/></label>
          <DropdownMember
            :member-items="items.offeringOfficer"
            :loading="loading.offeringOfficer"
            :multiple="true"
            :selected-multiple="form.offering_officer"
            @search="(q) => fetchMultipleMembers('offeringOfficer', q)"
            @update:selected-multiple="(members) => form.offering_officer = members"
            placeholder="Cari dan pilih anggota untuk Pemusik"
          />
        </div>
        
        <div>
          <label class="block mb-1 text-sm font-medium">Paduan Suara <Mandatory/></label>
          <DropdownMember
            :member-items="items.choir"
            :loading="loading.choir"
            :multiple="true"
            :selected-multiple="form.choir"
            @search="(q) => fetchMultipleMembers('choir', q)"
            @update:selected-multiple="(members) => form.choir = members"
            placeholder="Cari dan pilih anggota untuk Pemusik"
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
          :loading="saving"
          color="primary"
          label="Simpan"
        />
      </div>

      <!-- error -->
      <p v-if="formError" class="text-red-500 text-sm mt-2">
        {{ formError }}
      </p>
    </form>
  </DefaultForm>
</template>