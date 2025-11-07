<template>
  <div
    class="p-6 w-full overflow-hidden"
    style="background: var(--ui-bg); color: var(--ui-text);"
  >
    <div class="flex justify-between items-center mb-6">
      <h1
        class="text-2xl font-bold"
        style="color: var(--ui-text-highlighted);"
      >
        Tambah Data Anggota
      </h1>
      <UButton
        to="/members"
        icon="i-heroicons-arrow-left"
        color="gray"
        variant="soft"
        label="Back"
      />
    </div>

    <div v-if="loading" class="mb-4 text-sm text-gray-400">Loading...</div>

    <UCard v-else :ui="{ body: { padding: 'p-6' } }">
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
              <input
                v-model="form.id_local"
                type="text"
                required
                placeholder="Masukkan nomor induk"
                class="w-full px-3 py-2 text-sm rounded-lg"
                style="background: var(--ui-bg); border: 1px solid var(--ui-border);"
              />
            </div>

            <div>
              <label class="block mb-2 text-sm font-semibold">
                Nama Lengkap <span class="text-red-500">*</span>
              </label>
              <input
                v-model="form.name"
                type="text"
                required
                placeholder="Masukkan nama lengkap"
                class="w-full px-3 py-2 text-sm rounded-lg"
                style="background: var(--ui-bg); border: 1px solid var(--ui-border);"
              />
            </div>

            <div>
              <label class="block mb-2 text-sm font-semibold">Jenis Identitas</label>
              <select
                v-model="form.id_type"
                class="w-full px-3 py-2 text-sm rounded-lg"
                style="background: var(--ui-bg); border: 1px solid var(--ui-border);"
              >
                <option value="">Pilih Jenis</option>
                <option value="KTP">KTP</option>
                <option value="KIA">KIA</option>
                <option value="KITAS">KITAS</option>
                <option value="KITAP">KITAP</option>
                <option value="Paspor">Paspor</option>
              </select>
            </div>

            <div>
              <label class="block mb-2 text-sm font-semibold">Nomor Identitas</label>
              <input
                v-model="form.id_number"
                type="text"
                placeholder="Masukkan nomor identitas"
                class="w-full px-3 py-2 text-sm rounded-lg"
                style="background: var(--ui-bg); border: 1px solid var(--ui-border);"
              />
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
              <input
                v-model="form.dob"
                type="date"
                class="w-full px-3 py-2 text-sm rounded-lg"
                style="background: var(--ui-bg); border: 1px solid var(--ui-border);"
              />
            </div>

            <div>
              <label class="block mb-2 text-sm font-semibold">Tempat Lahir</label>
              <input
                v-model="form.pob"
                type="text"
                placeholder="Kota"
                class="w-full px-3 py-2 text-sm rounded-lg"
                style="background: var(--ui-bg); border: 1px solid var(--ui-border);"
              />
            </div>

            <div>
              <label class="block mb-2 text-sm font-semibold">Kewarganegaraan</label>
              <input
                v-model="form.nationality"
                type="text"
                placeholder="Indonesia"
                class="w-full px-3 py-2 text-sm rounded-lg"
                style="background: var(--ui-bg); border: 1px solid var(--ui-border);"
              />
            </div>

            <div>
              <label class="block mb-2 text-sm font-semibold">Suku / Bangsa</label>
              <input
                v-model="form.ethnic"
                type="text"
                placeholder="Masukkan suku"
                class="w-full px-3 py-2 text-sm rounded-lg"
                style="background: var(--ui-bg); border: 1px solid var(--ui-border);"
              />
            </div>

            <div>
              <label class="block mb-2 text-sm font-semibold">Jenis Kelamin</label>
              <select
                v-model="form.sex"
                class="w-full px-3 py-2 text-sm rounded-lg"
                style="background: var(--ui-bg); border: 1px solid var(--ui-border);"
              >
                <option value="">Pilih</option>
                <option value="L">Laki-Laki</option>
                <option value="P">Perempuan</option>
              </select>
            </div>

            <div>
              <label class="block mb-2 text-sm font-semibold">Golongan Darah</label>
              <input
                v-model="form.blood"
                type="text"
                placeholder="A, B, AB, O"
                class="w-full px-3 py-2 text-sm rounded-lg"
                style="background: var(--ui-bg); border: 1px solid var(--ui-border);"
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
              <input
                v-model="form.phone"
                type="tel"
                placeholder="08123456789"
                class="w-full px-3 py-2 text-sm rounded-lg"
                style="background: var(--ui-bg); border: 1px solid var(--ui-border);"
              />
            </div>

            <div>
              <label class="block mb-2 text-sm font-semibold">Alamat Email</label>
              <input
                v-model="form.email"
                type="email"
                placeholder="email@example.com"
                class="w-full px-3 py-2 text-sm rounded-lg"
                style="background: var(--ui-bg); border: 1px solid var(--ui-border);"
              />
            </div>
          </div>

          <div class="mt-4">
            <label class="block mb-2 text-sm font-semibold">Alamat Jalan dan Nomor</label>
            <textarea
              v-model="form.address"
              placeholder="Masukkan alamat lengkap"
              rows="3"
              class="w-full px-3 py-2 text-sm rounded-lg"
              style="background: var(--ui-bg); border: 1px solid var(--ui-border);"
            ></textarea>
          </div>

          <div class="mt-4">
            <label class="block mb-2 text-sm font-semibold">Kota & Provinsi</label>
            <select
              v-model="form.city"
              class="w-full px-3 py-2 text-sm rounded-lg"
              style="background: var(--ui-bg); border: 1px solid var(--ui-border);"
            >
              <option value="">Pilih Kota</option>
              <option v-for="c in cities" :key="c.id" :value="c.id">
                {{ c.name }} - {{ c.province }}
              </option>
            </select>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <label class="block mb-2 text-sm font-semibold">Koordinat Latitude</label>
              <input
                v-model="form.latitude"
                type="text"
                placeholder="-6.200000"
                class="w-full px-3 py-2 text-sm rounded-lg"
                style="background: var(--ui-bg); border: 1px solid var(--ui-border);"
              />
            </div>

            <div>
              <label class="block mb-2 text-sm font-semibold">Koordinat Longitude</label>
              <input
                v-model="form.longitude"
                type="text"
                placeholder="106.816666"
                class="w-full px-3 py-2 text-sm rounded-lg"
                style="background: var(--ui-bg); border: 1px solid var(--ui-border);"
              />
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
            <input
              type="file"
              accept="image/*"
              @change="onPhotoChange"
              class="w-full px-3 py-2 text-sm rounded-lg"
              style="background: var(--ui-bg); border: 1px solid var(--ui-border);"
            />
            <div v-if="photoPreview" class="mt-3">
              <img
                :src="photoPreview"
                alt="Foto Preview"
                class="h-32 w-32 object-cover rounded-lg border"
                style="border-color: var(--ui-border);"
              />
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
              <input
                v-model="form.family_id"
                type="text"
                placeholder="Masukkan nomor KK (16 digit)"
                maxlength="16"
                class="w-full px-3 py-2 text-sm rounded-lg"
                style="background: var(--ui-bg); border: 1px solid var(--ui-border);"
              />
            </div>

            <!-- Hubungan Keluarga -->
            <div>
              <label class="block mb-2 text-sm font-semibold">Hubungan Keluarga</label>
              <select
                v-model="form.family_relation"
                class="w-full px-3 py-2 text-sm rounded-lg"
                style="background: var(--ui-bg); border: 1px solid var(--ui-border);"
              >
                <option value="">Pilih</option>
                <option>Kepala Keluarga</option>
                <option>Suami</option>
                <option>Istri</option>
                <option>Anak</option>
                <option>Menantu</option>
                <option>Cucu</option>
                <option>Orangtua</option>
                <option>Mertua</option>
                <option>Famili Lain</option>
                <option>Pembantu</option>
                <option>Lainnya</option>
              </select>
            </div>

            <!-- Status Perkawinan -->
            <div>
              <label class="block mb-2 text-sm font-semibold">Status Perkawinan</label>
              <select
                v-model="form.marriage"
                class="w-full px-3 py-2 text-sm rounded-lg"
                style="background: var(--ui-bg); border: 1px solid var(--ui-border);"
              >
                <option value="">Pilih</option>
                <option value="belum kawin">Belum Kawin</option>
                <option value="kawin">Kawin</option>
                <option value="cerai hidup">Cerai Hidup</option>
                <option value="cerai mati">Cerai Mati</option>
              </select>
            </div>

            <!-- Agama -->
            <div>
              <label class="block mb-2 text-sm font-semibold">Agama</label>
              <select
                v-model="form.religion"
                class="w-full px-3 py-2 text-sm rounded-lg"
                style="background: var(--ui-bg); border: 1px solid var(--ui-border);"
              >
                <option value="">Pilih</option>
                <option>Islam</option>
                <option>Kristen</option>
                <option>Katolik</option>
                <option>Hindu</option>
                <option>Buddha</option>
                <option>Konghucu</option>
                <option>Lainnya</option>
              </select>
            </div>

            <!-- ✅ BARU: Status Hidup/Meninggal -->
            <div>
              <label class="block mb-2 text-sm font-semibold">
                Status Kehidupan <span class="text-red-500">*</span>
              </label>
              <select
                v-model="form.is_deceased"
                required
                class="w-full px-3 py-2 text-sm rounded-lg"
                style="background: var(--ui-bg); border: 1px solid var(--ui-border);"
              >
                <option value="0">Masih Hidup</option>
                <option value="1">Sudah Meninggal</option>
              </select>
            </div>

            <!-- ✅ BARU: Status Aktif/Keluar -->
            <div>
              <label class="block mb-2 text-sm font-semibold">
                Status Keanggotaan <span class="text-red-500">*</span>
              </label>
              <select
                v-model="form.is_active"
                required
                class="w-full px-3 py-2 text-sm rounded-lg"
                style="background: var(--ui-bg); border: 1px solid var(--ui-border);"
              >
                <option value="1">Aktif</option>
                <option value="0">Tidak Aktif / Keluar</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Data Baptis -->
        <div class="border-b pb-4" style="border-color: var(--ui-border);">
          <h2 class="text-lg font-semibold mb-4" style="color: var(--ui-text-highlighted);">
            Data Baptis
          </h2>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block mb-2 text-sm font-semibold">Tanggal Baptis</label>
              <input
                v-model="form.baptist_date"
                type="date"
                class="w-full px-3 py-2 text-sm rounded-lg"
                style="background: var(--ui-bg); border: 1px solid var(--ui-border);"
              />
            </div>

            <div>
              <label class="block mb-2 text-sm font-semibold">Gereja Tempat Baptis</label>
              <input
                v-model="form.baptist_place"
                type="text"
                placeholder="Nama gereja"
                class="w-full px-3 py-2 text-sm rounded-lg"
                style="background: var(--ui-bg); border: 1px solid var(--ui-border);"
              />
            </div>
          </div>

          <div class="mt-4">
            <label class="block mb-2 text-sm font-semibold">Nama Pendeta yang Membaptis</label>
            <input
              v-model="form.baptist_host_name"
              type="text"
              placeholder="Nama pendeta"
              class="w-full px-3 py-2 text-sm rounded-lg"
              style="background: var(--ui-bg); border: 1px solid var(--ui-border);"
            />
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
              <input
                v-model="form.consecrate_date"
                type="date"
                class="w-full px-3 py-2 text-sm rounded-lg"
                style="background: var(--ui-bg); border: 1px solid var(--ui-border);"
              />
            </div>

            <div>
              <label class="block mb-2 text-sm font-semibold">Gereja Tempat Sidi</label>
              <input
                v-model="form.consecrate_place"
                type="text"
                placeholder="Nama gereja"
                class="w-full px-3 py-2 text-sm rounded-lg"
                style="background: var(--ui-bg); border: 1px solid var(--ui-border);"
              />
            </div>
          </div>

          <div class="mt-4">
            <label class="block mb-2 text-sm font-semibold">Nama Pendeta yang Mensidi</label>
            <input
              v-model="form.consecrate_host_name"
              type="text"
              placeholder="Nama pendeta"
              class="w-full px-3 py-2 text-sm rounded-lg"
              style="background: var(--ui-bg); border: 1px solid var(--ui-border);"
            />
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
              <input
                v-model="form.attest_date"
                type="date"
                class="w-full px-3 py-2 text-sm rounded-lg"
                style="background: var(--ui-bg); border: 1px solid var(--ui-border);"
              />
            </div>

            <div>
              <label class="block mb-2 text-sm font-semibold">Gereja Sebelumnya</label>
              <input
                v-model="form.attest_origin"
                type="text"
                placeholder="Nama gereja asal"
                class="w-full px-3 py-2 text-sm rounded-lg"
                style="background: var(--ui-bg); border: 1px solid var(--ui-border);"
              />
            </div>
          </div>
        </div>

        <!-- Error Message -->
        <div
          v-if="serverError"
          class="px-4 py-3 rounded-lg text-sm"
          style="background: rgba(239,68,68,0.1); border:1px solid rgba(239,68,68,0.3); color:#ef4444;"
        >
          {{ serverError }}
        </div>

        <!-- Action Buttons -->
        <div class="flex items-center gap-3 pt-2">
          <UButton
            type="submit"
            :loading="saving"
            :disabled="saving"
            color="primary"
            icon="i-heroicons-check-circle"
            :label="saving ? 'Menyimpan...' : 'Simpan Data Anggota'"
          />
          <UButton
            color="gray"
            variant="soft"
            icon="i-heroicons-x-mark"
            label="Batal"
            @click="router.push('/members')"
          />
        </div>
      </form>
    </UCard>

    <UCard class="mt-6" :ui="{ body: { padding: 'p-4' } }">
      <div class="flex items-start gap-3">
        <span class="text-blue-400 text-lg">ℹ️</span>
        <div class="text-sm">
          <p class="font-semibold mb-1">Informasi:</p>
          <p>
            Field dengan <span class="text-red-500">*</span> wajib diisi.
            Pastikan semua data sudah benar sebelum menyimpan.
          </p>
        </div>
      </div>
    </UCard>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: ['role'],
  roles: [4]
})

import { ref, reactive, onMounted } from "vue"
import { useRouter } from "vue-router"
import { useMembers } from "~/composables/useMembers"
import { useCities } from "~/composables/useCity"

const router = useRouter()
const { create } = useMembers()
const { cities, fetchAll: fetchCities } = useCities()

const loading = ref(true)
const saving = ref(false)
const serverError = ref<string | null>(null)

const form = reactive({
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
  city: "",
  latitude: "",
  longitude: "",
  photo: null as File|null,
  marriage: "",
  is_deceased: "0",
  is_active: "1",
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

const photoPreview = ref<string|null>(null)

const onPhotoChange = (e: Event) => {
  const file = (e.target as HTMLInputElement).files?.[0] || null
  form.photo = file
  if (file) {
    const reader = new FileReader()
    reader.onload = (e) => (photoPreview.value = e.target?.result as string)
    reader.readAsDataURL(file)
  } else photoPreview.value = null
}

onMounted(async () => {
  try {
    await fetchCities()
  } catch (err) {
    console.error(err)
    serverError.value = "Gagal memuat data kota."
  } finally {
    loading.value = false
  }
})

const save = async () => {
  serverError.value = null
  saving.value = true

  try {
    const fd = new FormData()

    // field wajib
    fd.append("name", form.name || "")
    fd.append("id_local", form.id_local || "")

    // loop field lain kecuali photo
    Object.keys(form).forEach((key) => {
      if (key !== "photo" && form[key] !== "" && form[key] !== null) {
        fd.append(key, form[key] as any)
      }
    })

    // foto kalau ada
    if (form.photo) fd.append("photo", form.photo)

    // CALL YANG BENER → tanpa param kedua
    await create(fd)

    router.push("/members")
  } catch (err: any) {
    console.error(err)
    serverError.value = err?.message || "Gagal menyimpan data."
  } finally {
    saving.value = false
  }
}

</script>

<style scoped>
input:focus,
select:focus,
textarea:focus {
  outline: none;
  border-color: var(--ui-primary);
}
</style>
