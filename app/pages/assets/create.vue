<template>
  <div class="p-6" style="background: var(--ui-bg); color: var(--ui-text);">

    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">Tambah Asset</h1>
      <UButton
        to="/assets"
        icon="i-heroicons-arrow-left"
        color="gray"
        variant="soft"
        label="Back"
      />
    </div>

    <UCard :ui="{ body: { padding: 'p-6' } }">
      <form @submit.prevent="save" class="space-y-6">

        <!-- Asset Code -->
        <div>
          <label class="block mb-2 text-sm font-semibold">Asset Code *</label>
          <input
            v-model="form.asset_code"
            required
            type="text"
            class="w-full px-3 py-2 text-sm rounded-lg"
            style="background: var(--ui-bg); border: 1px solid var(--ui-border);"
          />
        </div>

        <!-- Name -->
        <div>
          <label class="block mb-2 text-sm font-semibold">Name *</label>
          <input
            v-model="form.name"
            required
            type="text"
            class="w-full px-3 py-2 text-sm rounded-lg"
            style="background: var(--ui-bg); border: 1px solid var(--ui-border);"
          />
        </div>

        <!-- Category -->
        <div>
          <label class="block mb-2 text-sm font-semibold">Category *</label>
          <select
            v-model="form.category_id"
            required
            class="w-full px-3 py-2 text-sm rounded-lg"
            style="background: var(--ui-bg); border: 1px solid var(--ui-border);"
          >
            <option disabled value="">-- Pilih Category --</option>
            <option v-for="cat in categories" :key="cat.id" :value="cat.id">
              {{ cat.name }}
            </option>
          </select>
        </div>

        <!-- Location -->
        <div>
          <label class="block mb-2 text-sm font-semibold">Location *</label>
          <select
            v-model="form.location_id"
            required
            class="w-full px-3 py-2 text-sm rounded-lg"
            style="background: var(--ui-bg); border: 1px solid var(--ui-border);"
          >
            <option disabled value="">-- Pilih Location --</option>
            <option v-for="loc in locations" :key="loc.id" :value="loc.id">
              {{ loc.name }}
            </option>
          </select>
        </div>

        <!-- Image Upload -->
        <div>
          <label class="block mb-2 text-sm font-semibold">Foto Asset</label>
          <input
            type="file"
            accept="image/*"
            @change="handleFile"
            class="w-full px-3 py-2 text-sm rounded-lg"
            style="background: var(--ui-bg); border: 1px solid var(--ui-border);"
          />
          <img
            v-if="preview"
            :src="preview"
            class="mt-3 h-40 rounded border object-cover"
          />
        </div>

        <!-- Purchase Date -->
        <div>
          <label class="block mb-2 text-sm font-semibold">Purchase Date</label>
          <input
            v-model="form.purchase_date"
            type="date"
            class="w-full px-3 py-2 text-sm rounded-lg"
            style="background: var(--ui-bg); border: 1px solid var(--ui-border);"
          />
        </div>

        <!-- Purchase Price -->
        <div>
          <label class="block mb-2 text-sm font-semibold">Purchase Price</label>
          <input
            v-model="form.purchase_price"
            type="number"
            class="w-full px-3 py-2 text-sm rounded-lg"
            style="background: var(--ui-bg); border: 1px solid var(--ui-border);"
          />
        </div>

        <!-- Condition -->
        <div>
          <label class="block mb-2 text-sm font-semibold">Condition *</label>
          <select
            v-model="form.condition"
            required
            class="w-full px-3 py-2 text-sm rounded-lg"
            style="background: var(--ui-bg); border: 1px solid var(--ui-border);"
          >
            <option value="baik">Baik</option>
            <option value="rusak ringan">Rusak Ringan</option>
            <option value="rusak berat">Rusak Berat</option>
            <option value="hilang">Hilang</option>
          </select>
        </div>

        <!-- Status (ENFORCED) -->
        <div>
          <label class="block mb-2 text-sm font-semibold">Status</label>
          <input
            disabled
            value="Available"
            class="w-full px-3 py-2 text-sm rounded-lg bg-gray-100 text-gray-500"
          />
        </div>

        <!-- Vendor -->
        <div>
          <label class="block mb-2 text-sm font-semibold">Vendor</label>
          <input
            v-model="form.vendor"
            type="text"
            class="w-full px-3 py-2 text-sm rounded-lg"
            style="background: var(--ui-bg); border: 1px solid var(--ui-border);"
          />
        </div>

        <!-- Notes -->
        <div>
          <label class="block mb-2 text-sm font-semibold">Notes</label>
          <textarea
            v-model="form.notes"
            rows="3"
            class="w-full px-3 py-2 text-sm rounded-lg"
            style="background: var(--ui-bg); border: 1px solid var(--ui-border);"
          ></textarea>
        </div>

        <!-- Buttons -->
        <div class="flex items-center gap-3 pt-2">
          <UButton
            type="submit"
            :loading="saving"
            color="primary"
            icon="i-heroicons-check-circle"
            :label="saving ? 'Saving...' : 'Save Asset'"
          />
          <UButton
            color="gray"
            variant="soft"
            icon="i-heroicons-x-mark"
            label="Cancel"
            @click="router.push('/assets')"
          />
        </div>

      </form>
    </UCard>

  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: ['role'],
  roles: [4]
})

import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAssets } from '~/composables/useAssets'
import { useAssetCategories } from '~/composables/useAssetCategories'
import { useLocations } from '~/composables/useLocations'

const router = useRouter()
const { create } = useAssets()
const { categories, fetchAll: loadCategories } = useAssetCategories()
const { locations, fetchAll: loadLocations } = useLocations()

const saving = ref(false)
const preview = ref<string | null>(null)
const imageFile = ref<File | null>(null)

const form = ref({
  asset_code: '',
  name: '',
  category_id: '',
  location_id: '',
  purchase_date: '',
  purchase_price: '',
  condition: 'baik',
  status: 'available',
  vendor: '',
  notes: '',
})

const handleFile = (e: Event) => {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return

  imageFile.value = file
  preview.value = URL.createObjectURL(file)
}

onMounted(() => {
  loadCategories()
  loadLocations()
})

const save = async () => {
  saving.value = true

  try {
    // Buat payload object, bukan FormData
    const payload: any = {
      asset_code: form.value.asset_code,
      name: form.value.name,
      category_id: form.value.category_id,
      location_id: form.value.location_id,
      condition: form.value.condition,
      status: form.value.status,
    }

    // Tambahkan field opsional jika ada nilainya
    if (form.value.purchase_date) payload.purchase_date = form.value.purchase_date
    if (form.value.purchase_price) payload.purchase_price = form.value.purchase_price
    if (form.value.vendor) payload.vendor = form.value.vendor
    if (form.value.notes) payload.notes = form.value.notes
    if (imageFile.value) payload.image = imageFile.value

    await create(payload)
    router.push('/assets')
  } catch (err: any) {
    console.error('Error saving asset:', err)
    alert(err.message || 'Gagal menyimpan asset')
  } finally {
    saving.value = false
  }
}
</script>
