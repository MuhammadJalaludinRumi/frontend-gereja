<script setup lang="ts">
import { reactive, ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useGroups } from '~/composables/useGroups'
import { useCities } from '~/composables/useCity'

const route = useRoute()
const router = useRouter()
const { fetchById, update, group } = useGroups()
const { cities, fetchAll: fetchCities } = useCities()

const form = reactive({
  name: '',
  address: '',
  city_id: '',
  phone: '',
  email: '',
  website: '',
  founded: '',
  legal: ''
})

const loading = ref(true)
const saving = ref(false)
const serverError = ref<string | null>(null)
const currentLogo = ref<string | null>(null)
const logoFile = ref<File | null>(null)
const logoPreview = ref<string | null>(null)

// preview logo baru
const onFileChange = (e: Event) => {
  const file = (e.target as HTMLInputElement).files?.[0] || null
  logoFile.value = file
  if (file) {
    const reader = new FileReader()
    reader.onload = (e) => (logoPreview.value = e.target?.result as string)
    reader.readAsDataURL(file)
  } else {
    logoPreview.value = null
  }
}

// load data group & city
onMounted(async () => {
  loading.value = true
  try {
    await fetchCities()
    await fetchById(Number(route.params.id))
  } catch (err) {
    console.error(err)
    serverError.value = 'Gagal memuat data'
  } finally {
    loading.value = false
  }
})

// auto sync group -> form
watch(group, (val) => {
  if (val) {
    form.name = val.name || ''
    form.address = val.address || ''
    form.city_id = val.city_id || ''
    form.phone = val.phone || ''
    form.email = val.email || ''
    form.website = val.website || ''
    form.founded = val.founded ? val.founded.split('T')[0] : ''
    form.legal = val.legal || ''
    currentLogo.value = val.logo || null
  }
}, { immediate: true })

// update
const submit = async () => {
  saving.value = true
  serverError.value = null
  try {
    const fd = new FormData()
    Object.entries(form).forEach(([k, v]) => fd.append(k, v || ''))
    if (logoFile.value) fd.append('logo', logoFile.value)
    fd.append('_method', 'PUT')
    await update(Number(route.params.id), fd)
    router.push('/groups')
  } catch (err: any) {
    console.error(err)
    serverError.value = err.message || 'Gagal update data'
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <div class="p-6 w-full overflow-hidden" style="background: var(--ui-bg); color: var(--ui-text);">
    <!-- Header -->
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold" style="color: var(--ui-text-highlighted);">Edit Group</h1>
      <UButton to="/groups" icon="i-heroicons-arrow-left" color="gray" variant="soft" label="Kembali" />
    </div>

    <!-- Loading -->
    <div v-if="loading" class="text-gray-400 text-sm">Memuat data...</div>

    <!-- Form -->
    <UCard v-else :ui="{ body: { padding: 'p-6' } }">
      <form @submit.prevent="submit" class="space-y-6">

        <!-- Name -->
        <div>
          <label class="block mb-2 text-sm font-semibold">Name <span class="text-red-500">*</span></label>
          <input v-model="form.name" required type="text" placeholder="Masukkan nama group"
            class="w-full px-3 py-2 text-sm rounded-lg"
            style="background: var(--ui-bg); border: 1px solid var(--ui-border); color: var(--ui-text);" />
        </div>

        <!-- Address -->
        <div>
          <label class="block mb-2 text-sm font-semibold">Address</label>
          <textarea v-model="form.address" rows="3" placeholder="Masukkan alamat"
            class="w-full px-3 py-2 text-sm rounded-lg resize-none"
            style="background: var(--ui-bg); border: 1px solid var(--ui-border); color: var(--ui-text);" />
        </div>

        <!-- City -->
        <div>
          <label class="block mb-2 text-sm font-semibold">City</label>
          <select v-model="form.city_id"
            class="w-full px-3 py-2 text-sm rounded-lg"
            style="background: var(--ui-bg); border: 1px solid var(--ui-border); color: var(--ui-text);">
            <option disabled value="">Pilih Kota</option>
            <option v-for="city in cities" :key="city.id" :value="city.id">{{ city.name }}</option>
          </select>
          <p v-if="selectedCity" class="text-xs text-gray-400 mt-1 italic">
            Kota terpilih: {{ selectedCity.name }}
          </p>
        </div>

        <!-- Phone & Email -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block mb-2 text-sm font-semibold">Phone</label>
            <input v-model="form.phone" type="tel" placeholder="08123456789"
              class="w-full px-3 py-2 text-sm rounded-lg"
              style="background: var(--ui-bg); border: 1px solid var(--ui-border); color: var(--ui-text);" />
          </div>
          <div>
            <label class="block mb-2 text-sm font-semibold">Email</label>
            <input v-model="form.email" type="email" placeholder="email@example.com"
              class="w-full px-3 py-2 text-sm rounded-lg"
              style="background: var(--ui-bg); border: 1px solid var(--ui-border); color: var(--ui-text);" />
          </div>
        </div>

        <!-- Website -->
        <div>
          <label class="block mb-2 text-sm font-semibold">Website</label>
          <input v-model="form.website" type="text" placeholder="https://example.com"
            class="w-full px-3 py-2 text-sm rounded-lg"
            style="background: var(--ui-bg); border: 1px solid var(--ui-border); color: var(--ui-text);" />
        </div>

        <!-- Logo -->
        <div>
          <label class="block mb-2 text-sm font-semibold">Logo</label>

          <div v-if="currentLogo && !logoPreview" class="mb-3">
            <p class="text-xs text-gray-400 mb-1">Logo saat ini:</p>
            <img :src="currentLogo" class="h-20 rounded border" />
          </div>

          <input type="file" accept="image/*" @change="onFileChange"
            class="w-full px-3 py-2 text-sm rounded-lg"
            style="background: var(--ui-bg); border: 1px solid var(--ui-border); color: var(--ui-text);" />

          <div v-if="logoPreview" class="mt-3">
            <p class="text-xs text-gray-400 mb-1">Preview logo baru:</p>
            <img :src="logoPreview" class="h-20 rounded border" />
          </div>

          <p class="text-xs text-gray-400 italic mt-1">Tidak wajib mengganti logo</p>
        </div>

        <!-- Founded & Legal -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block mb-2 text-sm font-semibold">Founded Date</label>
            <input v-model="form.founded" type="date"
              class="w-full px-3 py-2 text-sm rounded-lg"
              style="background: var(--ui-bg); border: 1px solid var(--ui-border); color: var(--ui-text);" />
          </div>

          <div>
            <label class="block mb-2 text-sm font-semibold">Legal</label>
            <input v-model="form.legal" type="text" placeholder="Legal entity"
              class="w-full px-3 py-2 text-sm rounded-lg"
              style="background: var(--ui-bg); border: 1px solid var(--ui-border); color: var(--ui-text);" />
          </div>
        </div>

        <!-- Error -->
        <div v-if="serverError" class="p-3 rounded text-sm bg-red-100 text-red-700 border border-red-300">
          {{ serverError }}
        </div>

        <!-- Buttons -->
        <div class="flex gap-3 pt-2">
          <UButton type="submit" :loading="saving" color="primary" icon="i-heroicons-check-circle"
            :label="saving ? 'Updating...' : 'Update Group'" />
          <UButton color="gray" variant="soft" icon="i-heroicons-x-mark" label="Cancel"
            @click="router.push('/groups')" />
        </div>
      </form>
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
