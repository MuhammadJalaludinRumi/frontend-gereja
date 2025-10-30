<script setup lang="ts">
import { reactive, ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useGroups } from '~/composables/useGroups'
import { useCities } from '~/composables/useCity'

const route = useRoute()
const router = useRouter()

const { getGroup, updateGroup } = useGroups()
const { cities, fetchAll: fetchCities } = useCities()

// Form state
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

const selectedCity = computed(() => cities.value.find(c => c.id === Number(form.city_id)))

// Handle logo change
const onFileChange = (e: Event) => {
  const file = (e.target as HTMLInputElement).files?.[0] || null
  logoFile.value = file
  if (file) {
    const reader = new FileReader()
    reader.onload = (e) => (logoPreview.value = e.target?.result as string)
    reader.readAsDataURL(file)
  } else logoPreview.value = null
}

// Load group data & cities
onMounted(async () => {
  loading.value = true
  try {
    await fetchCities()

    const { data, error } = await getGroup(Number(route.params.id))
    if (error) throw error

    if (data) {
      // Langsung assign dari data tanpa .value
      form.name = data.name || ''
      form.address = data.address || ''
      form.city_id = data.city_id || ''
      form.phone = data.phone || ''
      form.email = data.email || ''
      form.website = data.website || ''
      form.founded = data.founded ? data.founded.split('T')[0] : ''
      form.legal = data.legal || ''

      currentLogo.value = data.logo || null
    }
  } catch (err: any) {
    console.error(err)
    serverError.value = 'Gagal memuat data'
  } finally {
    loading.value = false
  }
})

// Submit form
const submit = async () => {
  serverError.value = null
  saving.value = true
  try {
    const fd = new FormData()
    Object.entries(form).forEach(([key, val]) => fd.append(key, val || ''))
    if (logoFile.value) fd.append('logo', logoFile.value)
    // Hapus baris ini karena sudah ditangani di composable
    // fd.append('_method', 'PUT')

    await updateGroup(Number(route.params.id), fd)
    router.push('/groups')
  } catch (err: any) {
    console.error('Update error:', err)
    serverError.value = err.message || 'Gagal update data'
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <div class="p-6 w-full overflow-hidden" style="background: var(--ui-bg); color: var(--ui-text);">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold" style="color: var(--ui-text-highlighted);">Edit Group</h1>
      <UButton to="/groups" icon="i-heroicons-arrow-left" color="gray" variant="soft" label="Back" />
    </div>

    <div v-if="loading" class="mb-4 text-sm text-gray-400">Loading...</div>

    <UCard v-else :ui="{ body: { padding: 'p-6' } }">
      <form @submit.prevent="submit" class="space-y-6">

        <!-- Name -->
        <div>
          <label class="block mb-2 text-sm font-semibold" style="color: var(--ui-text-highlighted);">
            Name <span class="text-red-500">*</span>
          </label>
          <input v-model="form.name" type="text" required placeholder="Masukkan nama group"
            class="w-full px-3 py-2 text-sm rounded-lg transition-colors"
            style="background: var(--ui-bg); border: 1px solid var(--ui-border); color: var(--ui-text);" />
        </div>

        <!-- Address -->
        <div>
          <label class="block mb-2 text-sm font-semibold" style="color: var(--ui-text-highlighted);">
            Address
          </label>
          <textarea v-model="form.address" placeholder="Masukkan alamat" rows="3"
            class="w-full px-3 py-2 text-sm rounded-lg transition-colors"
            style="background: var(--ui-bg); border: 1px solid var(--ui-border); color: var(--ui-text);"></textarea>
        </div>

        <!-- City -->
        <div>
          <label class="block mb-2 text-sm font-semibold" style="color: var(--ui-text-highlighted);">City</label>
          <select v-model="form.city_id" class="w-full px-3 py-2 text-sm rounded-lg transition-colors"
            style="background: var(--ui-bg); border: 1px solid var(--ui-border); color: var(--ui-text);">
            <option value="" disabled>Pilih Kota</option>
            <option v-for="city in cities" :key="city.id" :value="city.id">{{ city.name }}</option>
          </select>
          <UBadge v-if="selectedCity" color="primary" variant="soft" class="mt-2">{{ selectedCity.name }}</UBadge>
        </div>

        <!-- Phone & Email -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block mb-2 text-sm font-semibold" style="color: var(--ui-text-highlighted);">Phone</label>
            <input v-model="form.phone" type="tel" placeholder="08123456789"
              class="w-full px-3 py-2 text-sm rounded-lg transition-colors"
              style="background: var(--ui-bg); border: 1px solid var(--ui-border); color: var(--ui-text);" />
          </div>
          <div>
            <label class="block mb-2 text-sm font-semibold" style="color: var(--ui-text-highlighted);">Email</label>
            <input v-model="form.email" type="email" placeholder="email@example.com"
              class="w-full px-3 py-2 text-sm rounded-lg transition-colors"
              style="background: var(--ui-bg); border: 1px solid var(--ui-border); color: var(--ui-text);" />
          </div>
        </div>

        <!-- Website -->
        <div>
          <label class="block mb-2 text-sm font-semibold" style="color: var(--ui-text-highlighted);">Website</label>
          <input v-model="form.website" type="text" placeholder="https://example.com"
            class="w-full px-3 py-2 text-sm rounded-lg transition-colors"
            style="background: var(--ui-bg); border: 1px solid var(--ui-border); color: var(--ui-text);" />
        </div>

        <!-- Logo -->
        <div>
          <label class="block mb-2 text-sm font-semibold" style="color: var(--ui-text-highlighted);">Logo</label>
          <div v-if="currentLogo && !logoPreview" class="mb-3">
            <p class="text-xs mb-2" style="color: var(--ui-text-dimmed);">Current logo:</p>
            <img :src="currentLogo" alt="Current Logo" class="h-20 w-auto rounded border" style="border-color: var(--ui-border);" />
          </div>
          <input type="file" accept="image/*" @change="onFileChange"
            class="w-full px-3 py-2 text-sm rounded-lg transition-colors"
            style="background: var(--ui-bg); border: 1px solid var(--ui-border); color: var(--ui-text);" />
          <div v-if="logoPreview" class="mt-3">
            <p class="text-xs mb-2" style="color: var(--ui-text-dimmed);">New logo preview:</p>
            <img :src="logoPreview" alt="New Logo Preview" class="h-20 w-auto rounded border" style="border-color: var(--ui-border);" />
          </div>
        </div>

        <!-- Founded & Legal -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block mb-2 text-sm font-semibold" style="color: var(--ui-text-highlighted);">Founded Date</label>
            <input v-model="form.founded" type="date"
              class="w-full px-3 py-2 text-sm rounded-lg transition-colors"
              style="background: var(--ui-bg); border: 1px solid var(--ui-border); color: var(--ui-text);" />
          </div>
          <div>
            <label class="block mb-2 text-sm font-semibold" style="color: var(--ui-text-highlighted);">Legal</label>
            <input v-model="form.legal" type="text" placeholder="Legal entity"
              class="w-full px-3 py-2 text-sm rounded-lg transition-colors"
              style="background: var(--ui-bg); border: 1px solid var(--ui-border); color: var(--ui-text);" />
          </div>
        </div>

        <div v-if="serverError" class="px-4 py-3 rounded-lg text-sm"
          style="background: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.3); color: #ef4444;">
          {{ serverError }}
        </div>

        <div class="flex items-center gap-3 pt-2">
          <UButton type="submit" :loading="saving" :disabled="saving" color="primary" icon="i-heroicons-check-circle"
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
