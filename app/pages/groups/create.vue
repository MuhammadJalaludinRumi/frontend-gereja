<template>
  <div class="p-6 w-full overflow-hidden" style="background: var(--ui-bg); color: var(--ui-text);">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold" style="color: var(--ui-text-highlighted);">Tambah Group</h1>
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
          <label class="block mb-2 text-sm font-semibold" style="color: var(--ui-text-highlighted);">Address</label>
          <textarea v-model="form.address" placeholder="Masukkan alamat" rows="3"
                    class="w-full px-3 py-2 text-sm rounded-lg transition-colors"
                    style="background: var(--ui-bg); border: 1px solid var(--ui-border); color: var(--ui-text);"></textarea>
        </div>

        <!-- City -->
        <div>
          <label class="block mb-2 text-sm font-semibold" style="color: var(--ui-text-highlighted);">City</label>
          <select v-model="form.city_id"
                  class="w-full px-3 py-2 text-sm rounded-lg transition-colors"
                  style="background: var(--ui-bg); border: 1px solid var(--ui-border); color: var(--ui-text);">
            <option value="" disabled>Pilih Kota</option>
            <option v-for="c in cities" :key="c.id" :value="c.id">{{ c.name }}</option>
          </select>
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
          <input type="file" accept="image/*" @change="onFileChange"
                 class="w-full px-3 py-2 text-sm rounded-lg transition-colors"
                 style="background: var(--ui-bg); border: 1px solid var(--ui-border); color: var(--ui-text);" />
          <div v-if="logoPreview" class="mt-3">
            <img :src="logoPreview" alt="Logo Preview" class="h-20 w-auto rounded border" style="border-color: var(--ui-border);" />
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

        <!-- Error -->
        <div v-if="serverError" class="px-4 py-3 rounded-lg text-sm" style="background: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.3); color: #ef4444;">
          {{ serverError }}
        </div>

        <!-- Buttons -->
        <div class="flex items-center gap-3 pt-2">
          <UButton type="submit" :loading="saving" :disabled="saving" color="primary" icon="i-heroicons-check-circle" :label="saving ? 'Saving...' : 'Save Group'" />
          <UButton color="gray" variant="soft" icon="i-heroicons-x-mark" label="Cancel" @click="router.push('/groups')" />
        </div>
      </form>
    </UCard>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: ['role'],
  roles: [1]
})

import { reactive, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useGroups } from '../../composables/useGroups'
import { useCities } from '../../composables/useCity'

const router = useRouter()
const { createGroup } = useGroups()
const { cities, fetchAll: fetchCities } = useCities()

const form = reactive({
  name: '',
  address: '',
  city_id: '', // backend expects city_id
  phone: '',
  email: '',
  website: '',
  founded: '',
  legal: ''
})

const loading = ref(true)
const saving = ref(false)
const serverError = ref<string | null>(null)

const logoFile = ref<File | null>(null)
const logoPreview = ref<string | null>(null)

const onFileChange = (e: Event) => {
  const file = (e.target as HTMLInputElement).files?.[0] || null
  logoFile.value = file
  if (file) {
    const reader = new FileReader()
    reader.onload = (e) => logoPreview.value = e.target?.result as string
    reader.readAsDataURL(file)
  } else logoPreview.value = null
}

onMounted(async () => {
  try { await fetchCities() } catch (err) { console.error(err) }
  finally { loading.value = false }
})

const submit = async () => {
  serverError.value = null
  if (!form.name) { serverError.value = 'Nama group wajib diisi'; return }
  saving.value = true
  try {
    const fd = new FormData()
    Object.entries(form).forEach(([k, v]) => fd.append(k, v || ''))
    if (logoFile.value) fd.append('logo', logoFile.value)
    await createGroup(fd)
    router.push('/groups')
  } catch (err: any) {
    console.error(err)
    serverError.value = err.message || 'Gagal menyimpan data'
  } finally { saving.value = false }
}
</script>

<style scoped>
input:focus, select:focus, textarea:focus { outline: none; border-color: var(--ui-primary); }
</style>
