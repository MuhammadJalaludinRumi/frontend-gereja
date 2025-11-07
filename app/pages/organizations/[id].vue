<script setup lang="ts">
definePageMeta({
  middleware: ['role'],
  roles: [1]
})

import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useOrganizations } from '~/composables/useOrganizations'
import { useCities } from '~/composables/useCity'

const route = useRoute()
const router = useRouter()
const { organization, fetchById, update, loading, error } = useOrganizations()
const { cities, fetchAll: fetchCities } = useCities()

const saving = ref(false)
const serverError = ref('')
const logoPreview = ref<string | null>(null)
const currentLogo = ref<string | null>(null)

// form data reactive
const form = ref({
  name: '',
  address: '',
  city: '',
  phone: '',
  email: '',
  website: '',
  logo: null as File | null,
  founded: '',
  legal: ''
})

// ambil data saat mount
onMounted(async () => {
  await fetchCities()
  const id = route.params.id
  await fetchById(id)

  if (organization.value) {
    // isi data form
    Object.assign(form.value, {
      name: organization.value.name || '',
      address: organization.value.address || '',
      city: organization.value.city || '',
      phone: organization.value.phone || '',
      email: organization.value.email || '',
      website: organization.value.website || '',
      founded: organization.value.founded || '',
      legal: organization.value.legal || ''
    })

    if (organization.value.logo) {
      currentLogo.value = organization.value.logo
    }
  } else {
    serverError.value = 'Data organisasi tidak ditemukan'
  }
})

// handle file change
const onFileChange = (e: Event) => {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (file) {
    form.value.logo = file
    logoPreview.value = URL.createObjectURL(file)
  }
}

// submit update
const submit = async () => {
  try {
    saving.value = true
    serverError.value = ''

    const formData = new FormData()
    Object.entries(form.value).forEach(([key, value]) => {
      if (value !== null && value !== '') formData.append(key, value as any)
    })

    await update(route.params.id as string, formData)
    router.push('/organizations')
  } catch (err: any) {
    console.error('Submit error:', err)
    serverError.value = err.message || 'Gagal memperbarui data'
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <div class="p-6 w-full overflow-hidden" style="background: var(--ui-bg); color: var(--ui-text);">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold" style="color: var(--ui-text-highlighted);">
        Edit Organization
      </h1>
      <UButton to="/organizations" icon="i-heroicons-arrow-left" color="gray" variant="soft" label="Back" />
    </div>

    <div v-if="loading" class="mb-4 text-sm text-gray-400">Loading...</div>

    <UCard v-else :ui="{ body: { padding: 'p-6' } }">
      <form @submit.prevent="submit" class="space-y-6">
        <!-- Name -->
        <div>
          <label class="block mb-2 text-sm font-semibold">Name <span class="text-red-500">*</span></label>
          <input v-model="form.name" type="text" required placeholder="Masukkan nama organisasi"
            class="w-full px-3 py-2 text-sm rounded-lg border"
            style="background: var(--ui-bg); border-color: var(--ui-border); color: var(--ui-text);" />
        </div>

        <!-- Address -->
        <div>
          <label class="block mb-2 text-sm font-semibold">Address</label>
          <textarea v-model="form.address" rows="3" placeholder="Masukkan alamat"
            class="w-full px-3 py-2 text-sm rounded-lg border"
            style="background: var(--ui-bg); border-color: var(--ui-border); color: var(--ui-text);"></textarea>
        </div>

        <!-- City -->
        <div>
          <label class="block mb-2 text-sm font-semibold">City</label>
          <select v-model="form.city"
            class="w-full px-3 py-2 text-sm rounded-lg border"
            style="background: var(--ui-bg); border-color: var(--ui-border); color: var(--ui-text);">
            <option value="" disabled>Pilih Kota</option>
            <option v-for="city in cities" :key="city.id" :value="city.id">{{ city.name }}</option>
          </select>
        </div>

        <!-- Phone & Email -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block mb-2 text-sm font-semibold">Phone</label>
            <input v-model="form.phone" type="tel" placeholder="08123456789"
              class="w-full px-3 py-2 text-sm rounded-lg border"
              style="background: var(--ui-bg); border-color: var(--ui-border); color: var(--ui-text);" />
          </div>
          <div>
            <label class="block mb-2 text-sm font-semibold">Email</label>
            <input v-model="form.email" type="email" placeholder="email@example.com"
              class="w-full px-3 py-2 text-sm rounded-lg border"
              style="background: var(--ui-bg); border-color: var(--ui-border); color: var(--ui-text);" />
          </div>
        </div>

        <!-- Website -->
        <div>
          <label class="block mb-2 text-sm font-semibold">Website</label>
          <input v-model="form.website" type="text" placeholder="https://example.com"
            class="w-full px-3 py-2 text-sm rounded-lg border"
            style="background: var(--ui-bg); border-color: var(--ui-border); color: var(--ui-text);" />
        </div>

        <!-- Logo -->
        <div>
          <label class="block mb-2 text-sm font-semibold">Logo</label>

          <div v-if="currentLogo && !logoPreview" class="mb-3">
            <p class="text-xs mb-2 text-gray-400">Current logo:</p>
            <img :src="currentLogo" alt="Current Logo" class="h-20 w-auto rounded border" />
          </div>

          <input type="file" accept="image/*" @change="onFileChange"
            class="w-full px-3 py-2 text-sm rounded-lg border"
            style="background: var(--ui-bg); border-color: var(--ui-border); color: var(--ui-text);" />

          <div v-if="logoPreview" class="mt-3">
            <p class="text-xs mb-2 text-gray-400">New logo preview:</p>
            <img :src="logoPreview" alt="Preview" class="h-20 w-auto rounded border" />
          </div>
        </div>

        <!-- Founded & Legal -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block mb-2 text-sm font-semibold">Founded Date</label>
            <input v-model="form.founded" type="date" readonly
              class="w-full px-3 py-2 text-sm rounded-lg border cursor-not-allowed"
              style="background: var(--ui-bg); border-color: var(--ui-border); color: var(--ui-text);" />
            <p class="mt-1 text-xs text-gray-400 italic">Tanggal tidak bisa diubah</p>
          </div>

          <div>
            <label class="block mb-2 text-sm font-semibold">Legal</label>
            <input v-model="form.legal" type="text" placeholder="Legal entity"
              class="w-full px-3 py-2 text-sm rounded-lg border"
              style="background: var(--ui-bg); border-color: var(--ui-border); color: var(--ui-text);" />
          </div>
        </div>

        <div v-if="serverError" class="p-3 text-sm text-red-500 border border-red-300 rounded-lg bg-red-50">
          {{ serverError }}
        </div>

        <div class="flex gap-3 pt-2">
          <UButton type="submit" :loading="saving" :disabled="saving" color="primary"
            icon="i-heroicons-check-circle" :label="saving ? 'Updating...' : 'Update Organization'" />
          <UButton color="gray" variant="soft" icon="i-heroicons-x-mark" label="Cancel"
            @click="router.push('/organizations')" />
        </div>
      </form>
    </UCard>
  </div>
</template>
