<script setup lang="ts">
definePageMeta({
  middleware: ['role'],
  roles: [1]
})

import { ref, reactive, computed, onMounted } from "vue"
import { useRouter } from "vue-router"
import { useOrganizations } from "../../composables/useOrganizations"
import { useCities } from "../../composables/useCity"
import { useGroups } from "../../composables/useGroups"

const router = useRouter()
const { create } = useOrganizations()
const { cities, fetchAll: fetchCities } = useCities()
const { groups, fetchAll: fetchGroups } = useGroups()

const loading = ref(true)
const saving = ref(false)
const serverError = ref<string | null>(null)

const form = reactive({
  name: "",
  abbreviation: "",
  address: "",
  city: "" as string | number, // backend mungkin expect string
  latitude: "" as string | number,
  longitude: "" as string | number,
  phone: "",
  email: "",
  group_id: "" as string | number, // backend mungkin expect string
  website: "",
  founded: "",
  legal: "",
})

const selectedCity = computed(() =>
  cities.value.find((c: any) => c.id == form.city) // == untuk compare string dan number
)
const selectedGroup = computed(() =>
  groups.value.find((g: any) => g.id == form.group_id)
)

const logoFile = ref<File | null>(null)
const logoPreview = ref<string | null>(null)

const onFileChange = (e: Event) => {
  const file = (e.target as HTMLInputElement).files?.[0] || null
  logoFile.value = file
  if (file) {
    const reader = new FileReader()
    reader.onload = (e) => (logoPreview.value = e.target?.result as string)
    reader.readAsDataURL(file)
  } else logoPreview.value = null
}

onMounted(async () => {
  try {
    await Promise.all([fetchCities(), fetchGroups()])
  } catch (err) {
    console.error(err)
    serverError.value = "Gagal memuat data kota atau yayasan."
  } finally {
    loading.value = false
  }
})

const save = async () => {
  serverError.value = null
  if (!form.name) {
    serverError.value = "Nama organisasi wajib diisi."
    return
  }

  saving.value = true
  try {
    const fd = new FormData()

    // Append semua field (backend akan validasi mana yang required)
    Object.entries(form).forEach(([key, val]) => {
      // Skip jika value kosong string atau null
      if (val !== null && val !== "") {
        fd.append(key, String(val))
      }
    })

    if (logoFile.value) {
      fd.append('logo', logoFile.value)
    }

    // 🔍 DEBUG: Lihat apa yang dikirim
    console.log('=== FORM DATA DEBUG ===')
    for (let [key, value] of fd.entries()) {
      console.log(`${key}:`, value)
    }
    console.log('======================')

    await create(fd)
    router.push("/organizations")
  } catch (err: any) {
    console.error("Submit error:", err)

    // Tampilkan detail error dari backend jika ada
    if (err?.data) {
      console.error('Backend error detail:', err.data)
      serverError.value = JSON.stringify(err.data, null, 2)
    } else {
      serverError.value = err.message || "Gagal menyimpan data organisasi."
    }
  } finally {
    saving.value = false
  }
}
</script>

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
        Buat Organization Baru
      </h1>
      <UButton
        to="/organizations"
        icon="i-heroicons-arrow-left"
        color="gray"
        variant="soft"
        label="Back"
      />
    </div>

    <div v-if="loading" class="mb-4 text-sm text-gray-400">Loading...</div>

    <UCard v-else :ui="{ body: { padding: 'p-6' } }">
      <form @submit.prevent="save" class="space-y-6">
        <!-- Name & Abbreviation -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block mb-2 text-sm font-semibold">
              Name <span class="text-red-500">*</span>
            </label>
            <input
              v-model="form.name"
              type="text"
              required
              placeholder="Masukkan nama organization"
              class="w-full px-3 py-2 text-sm rounded-lg"
              style="background: var(--ui-bg); border: 1px solid var(--ui-border);"
            />
          </div>
          <div>
            <label class="block mb-2 text-sm font-semibold">Abbreviation</label>
            <input
              v-model="form.abbreviation"
              type="text"
              placeholder="Singkatan"
              class="w-full px-3 py-2 text-sm rounded-lg"
              style="background: var(--ui-bg); border: 1px solid var(--ui-border);"
            />
          </div>
        </div>

        <!-- Address -->
        <div>
          <label class="block mb-2 text-sm font-semibold">Address</label>
          <textarea
            v-model="form.address"
            placeholder="Masukkan alamat"
            rows="3"
            class="w-full px-3 py-2 text-sm rounded-lg"
            style="background: var(--ui-bg); border: 1px solid var(--ui-border);"
          ></textarea>
        </div>

        <!-- City -->
        <div>
          <label class="block mb-2 text-sm font-semibold">City</label>
          <select
            v-model="form.city"
            class="w-full px-3 py-2 text-sm rounded-lg"
            style="background: var(--ui-bg); border: 1px solid var(--ui-border);"
          >
            <option value="">Pilih Kota</option>
            <option v-for="city in cities" :key="city.id" :value="city.id">
              {{ city.name }}
            </option>
          </select>
          <UBadge v-if="selectedCity" color="primary" variant="soft" class="mt-2">
            {{ selectedCity.name }}
          </UBadge>
        </div>

        <!-- Lat & Long -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block mb-2 text-sm font-semibold">Latitude</label>
            <input
              v-model="form.latitude"
              type="text"
              placeholder="-6.200000"
              class="w-full px-3 py-2 text-sm rounded-lg"
              style="background: var(--ui-bg); border: 1px solid var(--ui-border);"
            />
          </div>
          <div>
            <label class="block mb-2 text-sm font-semibold">Longitude</label>
            <input
              v-model="form.longitude"
              type="text"
              placeholder="106.816666"
              class="w-full px-3 py-2 text-sm rounded-lg"
              style="background: var(--ui-bg); border: 1px solid var(--ui-border);"
            />
          </div>
        </div>

        <!-- Phone & Email -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block mb-2 text-sm font-semibold">Phone</label>
            <input
              v-model="form.phone"
              type="tel"
              placeholder="08123456789"
              class="w-full px-3 py-2 text-sm rounded-lg"
              style="background: var(--ui-bg); border: 1px solid var(--ui-border);"
            />
          </div>
          <div>
            <label class="block mb-2 text-sm font-semibold">Email</label>
            <input
              v-model="form.email"
              type="email"
              placeholder="email@example.com"
              class="w-full px-3 py-2 text-sm rounded-lg"
              style="background: var(--ui-bg); border: 1px solid var(--ui-border);"
            />
          </div>
        </div>

        <!-- Group -->
        <div>
          <label class="block mb-2 text-sm font-semibold">Yayasan</label>
          <select
            v-model="form.group_id"
            class="w-full px-3 py-2 text-sm rounded-lg"
            style="background: var(--ui-bg); border: 1px solid var(--ui-border);"
          >
            <option value="">Pilih Yayasan</option>
            <option v-for="group in groups" :key="group.id" :value="group.id">
              {{ group.name }}
            </option>
          </select>
          <UBadge v-if="selectedGroup" color="blue" variant="soft" class="mt-2">
            {{ selectedGroup.name }}
          </UBadge>
        </div>

        <!-- Website -->
        <div>
          <label class="block mb-2 text-sm font-semibold">Website</label>
          <input
            v-model="form.website"
            type="text"
            placeholder="https://example.com"
            class="w-full px-3 py-2 text-sm rounded-lg"
            style="background: var(--ui-bg); border: 1px solid var(--ui-border);"
          />
        </div>

        <!-- Logo -->
        <div>
          <label class="block mb-2 text-sm font-semibold">Logo</label>
          <input
            type="file"
            accept="image/*"
            @change="onFileChange"
            class="w-full px-3 py-2 text-sm rounded-lg"
            style="background: var(--ui-bg); border: 1px solid var(--ui-border);"
          />
          <div v-if="logoPreview" class="mt-3">
            <img
              :src="logoPreview"
              alt="Logo Preview"
              class="h-20 w-auto rounded border"
              style="border-color: var(--ui-border);"
            />
          </div>
        </div>

        <!-- Founded & Legal -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block mb-2 text-sm font-semibold">Founded Date</label>
            <input
              v-model="form.founded"
              type="date"
              class="w-full px-3 py-2 text-sm rounded-lg"
              style="background: var(--ui-bg); border: 1px solid var(--ui-border);"
            />
          </div>
          <div>
            <label class="block mb-2 text-sm font-semibold">Legal</label>
            <input
              v-model="form.legal"
              type="text"
              placeholder="Legal entity"
              class="w-full px-3 py-2 text-sm rounded-lg"
              style="background: var(--ui-bg); border: 1px solid var(--ui-border);"
            />
          </div>
        </div>

        <div
          v-if="serverError"
          class="px-4 py-3 rounded-lg text-sm whitespace-pre-wrap"
          style="background: rgba(239,68,68,0.1); border:1px solid rgba(239,68,68,0.3); color:#ef4444; max-height: 300px; overflow-y: auto;"
        >
          {{ serverError }}
        </div>

        <div class="flex items-center gap-3 pt-2">
          <UButton
            type="submit"
            :loading="saving"
            :disabled="saving"
            color="primary"
            icon="i-heroicons-check-circle"
            :label="saving ? 'Saving...' : 'Save Organization'"
          />
          <UButton
            color="gray"
            variant="soft"
            icon="i-heroicons-x-mark"
            label="Cancel"
            @click="router.push('/organizations')"
          />
        </div>
      </form>
    </UCard>

    <UCard class="mt-6" :ui="{ body: { padding: 'p-4' } }">
      <div class="flex items-start gap-3">
        <span class="text-blue-400 text-lg">ℹ️</span>
        <div class="text-sm">
          <p class="font-semibold mb-1">Debug Mode Active:</p>
          <p>
            Check browser console untuk melihat payload yang dikirim ke backend.
            Field dengan <span class="text-red-500">*</span> wajib diisi.
          </p>
        </div>
      </div>
    </UCard>
  </div>
</template>

<style scoped>
input:focus,
select:focus,
textarea:focus {
  outline: none;
  border-color: var(--ui-primary);
}
</style>
