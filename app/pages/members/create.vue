<script setup lang="ts">
import DefaultForm from '~/layouts/default-form.vue'

definePageMeta({
  middleware: ['role'],
  roles: [4]
})

const router = useRouter()
const { members, fetchAll, create } = useMembers()
const { cities, fetchAll: fetchCities } = useCities()

const loading = ref(true)
const saving = ref(false)
const serverError = ref<string | null>(null)

const dropdownCity = ref({label: '', value: 0 })

const form = reactive<Record<string, any>>({
  id_local: "",
  id_type: "",
  id_number: "",
  name: "",
  dob: "",
  pob: "",
  nationality: "",
  ethnic: "",
  sex: "",
  phone: "",
  email: "",
  address: "",
  city: null,
  latitude: "",
  longitude: "",
  photo: null as File | null,

  marriage: "",
  is_deceased: 0,
  is_active: 1,
  family_id: "",
  family_relation: "",
  religion: "",

  blood: "",
  baptist_date: "",
  baptist_place: "",
  baptist_host_name: "",
  consecrate_date: "",
  consecrate_place: "",
  consecrate_host_name: "",
  attest_date: "",
  attest_origin: ""
})

const photoPreview = ref<string | null>(null)

onMounted(async () => {
  try {
    await Promise.all([
      fetchCities(),
      fetchAll()
    ])
  } catch (err) {
    serverError.value = "Gagal memuat data."
  } finally {
    loading.value = false
  }
})

// 🔥 INI YANG DIPAKAI DI TEMPLATE
const familyMembersComputed = computed(() => {
  if (!form.family_id) return []
  return members.value.filter(m => m.family_id == form.family_id)
})

const familyMembers = familyMembersComputed

const onPhotoChange = (e: Event) => {
  const file = (e.target as HTMLInputElement).files?.[0] || null
  form.photo = file

  if (!file) {
    photoPreview.value = null
    return
  }

  const reader = new FileReader()
  reader.onload = (e) => {
    photoPreview.value = e.target?.result as string
  }
  reader.readAsDataURL(file)
}

const save = async () => {
  saving.value = true
  serverError.value = null

  try {
    const fd = new FormData()

    for (const key in form) {
      const value = form[key]
      if (value !== null && value !== "") {
        fd.append(key, value)
      }
    }

    if (form.photo) {
      fd.append("photo", form.photo)
    }

    await create(fd)
    router.push("/members")
  } catch (err: any) {
    serverError.value = "Gagal menyimpan data."
    console.log("Gagal menyimpan data: ", err)
  } finally {
    saving.value = false
  }
}

const filteredCities = computed(() => {
  return cities.value.map(city => ({
    label: `${city.name} - ${city.province_name}`,
    value: city.id
  }))
})
</script>

<template>
  <DefaultForm title="Tambah Anggota" :loading="loading">
    <form @submit.prevent="save" class="space-y-6">
      <!-- Data Identitas -->
      <div class="border-b pb-4" style="border-color: var(--ui-border);">
        <h2 class="text-lg font-semibold mb-4" style="color: var(--ui-text-highlighted);">
          Data Identitas
        </h2>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block mb-2 text-sm font-semibold">
              Nomor Induk Internal <span class="text-red-500">*</span>
            </label>
            <UInput v-model="form.id_local" type="text" required placeholder="Masukkan nomor induk" class="w-full" />
          </div>

          <div>
            <label class="block mb-2 text-sm font-semibold">
              Nama Lengkap <span class="text-red-500">*</span>
            </label>
            <UInput v-model="form.name" type="text" required placeholder="Masukkan nama lengkap" class="w-full" />
          </div>

          <div>
            <label class="block mb-2 text-sm font-semibold">Jenis Identitas</label>
            <USelect 
              v-model="form.id_type" class="w-full"
              :items="[
                'KTP',
                'KIA',
                'KITAS',
                'KITAP',
                'Paspor'
              ]"
              placeholder="Pilih jenis"
            />
          </div>

          <div>
            <label class="block mb-2 text-sm font-semibold">Nomor Identitas</label>
            <UInput v-model="form.id_number" type="text" placeholder="Masukkan nomor identitas" class="w-full" />
          </div>
        </div>
      </div>

      <!-- Data Kelahiran -->
      <div class="border-b pb-4" style="border-color: var(--ui-border);">
        <h2 class="text-lg font-semibold mb-4" style="color: var(--ui-text-highlighted);">
          Data Kelahiran
        </h2>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block mb-2 text-sm font-semibold">Tanggal Lahir</label>
            <UInput v-model="form.dob" type="date" class="w-full" />
          </div>

          <div>
            <label class="block mb-2 text-sm font-semibold">Tempat Lahir</label>
            <UInput v-model="form.pob" type="text" placeholder="Kota" class="w-full" />
          </div>

          <div>
            <label class="block mb-2 text-sm font-semibold">Kewarganegaraan</label>
            <USelect 
              v-model="form.nationality"
              placeholder="Pilih Kewarganegaraan"
              class="w-full"
              :items="['WNI', 'WNA']"
            />
          </div>

          <div>
            <label class="block mb-2 text-sm font-semibold">Suku / Bangsa</label>
            <UInput v-model="form.ethnic" type="text" placeholder="Masukkan suku" class="w-full" />
          </div>

          <div>
            <label class="block mb-2 text-sm font-semibold">Jenis Kelamin</label>
            <USelect 
              v-model="form.sex"
              placeholder="Pilih Jenis Kelamin"
              class="w-full"
              :items="[{label: 'Laki-laki', value: 'L',}, {label: 'Perempuan', value: 'P'}]"
            />
          </div>

          <div>
            <label class="block mb-2 text-sm font-semibold">Golongan Darah</label>
            <USelect 
              v-model="form.blood"
              placeholder="Pilih Golongan Darah"
              class="w-full"
              :items="['A', 'B', 'AB', 'O']"
            />
          </div>
        </div>
      </div>

      <!-- Kontak -->
      <div class="border-b pb-4" style="border-color: var(--ui-border);">
        <h2 class="text-lg font-semibold mb-4" style="color: var(--ui-text-highlighted);">
          Informasi Kontak
        </h2>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block mb-2 text-sm font-semibold">Nomor Telepon</label>
            <UInput v-model="form.phone" type="tel" placeholder="08123456789" class="w-full" />
          </div>

          <div>
            <label class="block mb-2 text-sm font-semibold">Alamat Email</label>
            <UInput v-model="form.email" type="email" placeholder="email@example.com" class="w-full" />
          </div>
        </div>

        <div class="mt-4">
          <label class="block mb-2 text-sm font-semibold">Alamat Jalan dan Nomor</label>
          <UTextarea v-model="form.address" placeholder="Masukkan alamat lengkap" class="w-full"></UTextarea>
        </div>

        <div class="mt-4 relative">
          <label class="block mb-2 text-sm font-semibold">Kota & Provinsi</label>
          <UInputMenu 
            v-model="dropdownCity"
            :items="filteredCities"
            class="w-full"
            @change="form.city = dropdownCity.value"
            placeholder="Pilih atau cari kota..."
          />
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div>
            <label class="block mb-2 text-sm font-semibold">Koordinat Latitude</label>
            <UInput v-model="form.latitude" type="text" placeholder="-6.200000" class="w-full" />
          </div>

          <div>
            <label class="block mb-2 text-sm font-semibold">Koordinat Longitude</label>
            <UInput v-model="form.longitude" type="text" placeholder="106.816666" class="w-full" />
          </div>
        </div>
      </div>

      <!-- Foto -->
      <div class="border-b pb-4" style="border-color: var(--ui-border);">
        <h2 class="text-lg font-semibold mb-4" style="color: var(--ui-text-highlighted);">
          Foto Anggota
        </h2>

        <div>
          <label class="block mb-2 text-sm font-semibold">Upload Foto</label>
          <UInput type="file" accept="image/*" @change="onPhotoChange" class="w-full" />
          <div v-if="photoPreview" class="mt-3">
            <img :src="photoPreview" alt="Foto Preview" class="h-32 w-32 object-cover rounded-lg border"
              style="border-color: var(--ui-border);" />
          </div>
        </div>
      </div>

      <!-- Data Keluarga -->
      <div class="border-b pb-4" style="border-color: var(--ui-border);">
        <h2 class="text-lg font-semibold mb-4" style="color: var(--ui-text-highlighted);">
          Data Keluarga & Agama
        </h2>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <!-- Nomor Kartu Keluarga -->
          <div>
            <label class="block mb-2 text-sm font-semibold">Nomor Kartu Keluarga (KK)</label>
            <UInput v-model="form.family_id" type="text" placeholder="Masukkan nomor KK (16 digit)" maxlength="16" class="w-full" />
          </div>

          <!-- Hubungan Keluarga -->
          <div>
            <label class="block mb-2 text-sm font-semibold">Hubungan Keluarga</label>
            <USelect 
              v-model="form.family_relation"
              :items="[
                'Kepala Keluarga',
                'Ayah',
                'Ibu',
                'Suami',
                'Istri',
                'Anak',
                'Menantu',
                'Cucu',
                'Orangtua',
                'Mertua',
                'Famili',
                'Pembantu',
                'Lainnya',
              ]"
              class="w-full"
              placeholder="Pilih"
            />
          </div>

          <!-- Status Perkawinan -->
          <div>
            <label class="block mb-2 text-sm font-semibold">Status Perkawinan</label>
            <USelect 
              v-model="form.marriage" 
              class="w-full"
              :items="[
                {value: 'belum kawin', label: 'Belum Kawin'},
                {value: 'kawin', label: 'Kawin'},
                {value: 'cerai hidup', label: 'Cerai Hidup'},
                {value: 'cerai mati', label: 'Cerai Mati'},
              ]"
              placeholder="Pilih"
            />
          </div>

          <!-- Agama -->
          <div>
            <label class="block mb-2 text-sm font-semibold">Agama</label>
            <USelect 
              v-model="form.religion"
              class="w-full"
              :items="[
                'Islam', 
                'Kristen',
                'Katolik',
                'Hindu',
                'Buddha',
                'Konghucu',
                'Lainnya',
              ]"
              placeholder="Pilih"
            />
          </div>

          <!-- ✅ BARU: Status Hidup/Meninggal -->
          <div>
            <label class="block mb-2 text-sm font-semibold">
              Status Kehidupan <span class="text-red-500">*</span>
            </label>
            <USelect
              v-model="form.is_deceased"
              :items="[
                {value: 0, label: 'Masih Hidup'},
                {value: 1, label: 'Sudah Meninggal'},
              ]"
              class="w-full"
              required
            />
          </div>

          <!-- ✅ BARU: Status Aktif/Keluar -->
          <div>
            <label class="block mb-2 text-sm font-semibold">
              Status Keanggotaan <span class="text-red-500">*</span>
            </label>
            <USelect
              v-model="form.is_active"
              :items="[
                {value: 1, label: 'Aktif'},
                {value: 0, label: 'Tidak Aktif / Keluar'},
              ]"
              class="w-full"
              required
            />
          </div>
        </div>
      </div>

      <!-- Daftar Anggota Keluarga -->
      <div v-if="familyMembers.length > 0" class="mt-6 border-t pt-4" style="border-color: var(--ui-border);">
        <h2 class="text-lg font-semibold mb-3" style="color: var(--ui-text-highlighted);">
          Anggota Dalam Kartu Keluarga Ini
        </h2>

        <div class="space-y-3">
          <div v-for="member in familyMembers" :key="member.id" class="p-3 rounded-lg"
            >
            <div class="font-semibold text-sm">
              {{ member.name }}
            </div>

            <div class="text-xs opacity-80 mt-1 leading-relaxed">
              • Hubungan: <b>{{ member.family_relation }}</b><br />
              • Status:
              <span v-if="member.is_deceased == 1" class="text-red-500">Meninggal</span>
              <span v-else class="text-green-500">Hidup</span>
              <br />
              • Keanggotaan:
              <span v-if="member.is_active == 1" class="text-green-500">Aktif</span>
              <span v-else class="text-gray-500">Tidak Aktif</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Jika belum ada anggota -->
      <div v-if="form.family_id && familyMembers.length === 0" class="mt-6 text-sm text-gray-400">
        Tidak ada anggota keluarga lain dengan nomor KK ini.
      </div>

      <!-- ▲▲▲ Tambahan Baru Berakhir Di Sini ▲▲▲ -->

      <!-- Data Baptis -->
      <div class="border-b pb-4" style="border-color: var(--ui-border);">
        <h2 class="text-lg font-semibold mb-4" style="color: var(--ui-text-highlighted);">
          Data Baptis
        </h2>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block mb-2 text-sm font-semibold">Tanggal Baptis</label>
            <UInput v-model="form.baptist_date" type="date" class="w-full" />
          </div>

          <div>
            <label class="block mb-2 text-sm font-semibold">Gereja Tempat Baptis</label>
            <UInput v-model="form.baptist_place" type="text" placeholder="Nama gereja" class="w-full" />
          </div>
        </div>

        <div class="mt-4">
          <label class="block mb-2 text-sm font-semibold">Nama Pendeta yang Membaptis</label>
          <UInput v-model="form.baptist_host_name" type="text" placeholder="Nama pendeta" class="w-full" />
        </div>
      </div>

      <!-- Data Sidi -->
      <div class="border-b pb-4" style="border-color: var(--ui-border);">
        <h2 class="text-lg font-semibold mb-4" style="color: var(--ui-text-highlighted);">
          Data Sidi
        </h2>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block mb-2 text-sm font-semibold">Tanggal Sidi</label>
            <UInput v-model="form.consecrate_date" type="date" class="w-full" />
          </div>

          <div>
            <label class="block mb-2 text-sm font-semibold">Gereja Tempat Sidi</label>
            <UInput v-model="form.consecrate_place" type="text" placeholder="Nama gereja" class="w-full" />
          </div>
        </div>

        <div class="mt-4">
          <label class="block mb-2 text-sm font-semibold">Nama Pendeta yang Mensidi</label>
          <UInput v-model="form.consecrate_host_name" type="text" placeholder="Nama pendeta" class="w-full" />
        </div>
      </div>

      <!-- Data Jemaat -->
      <div class="border-b pb-4" style="border-color: var(--ui-border);">
        <h2 class="text-lg font-semibold mb-4" style="color: var(--ui-text-highlighted);">
          Data Keanggotaan Jemaat
        </h2>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block mb-2 text-sm font-semibold">Tanggal Menjadi Jemaat</label>
            <UInput v-model="form.attest_date" type="date" class="w-full" />
          </div>

          <div>
            <label class="block mb-2 text-sm font-semibold">Gereja Sebelumnya</label>
            <UInput v-model="form.attest_origin" type="text" placeholder="Nama gereja asal" class="w-full" />
          </div>
        </div>
      </div>

      <!-- Error Message -->
      <div v-if="serverError" class="px-4 py-3 rounded-lg text-sm"
        style="background: rgba(239,68,68,0.1); border:1px solid rgba(239,68,68,0.3); color:#ef4444;">
        {{ serverError }}
      </div>

      <!-- Action Buttons -->
      <div class="flex items-center justify-end gap-3 pt-2">
        <UButton color="neutral" variant="ghost" icon="i-heroicons-x-mark" label="Batal"
          @click="router.push('/members')" />
        <UButton type="submit" :loading="saving" :disabled="saving" color="primary" icon="i-heroicons-check-circle"
          :label="saving ? 'Menyimpan...' : 'Simpan Data Anggota'" />
      </div>
    </form>
  </DefaultForm>
</template>