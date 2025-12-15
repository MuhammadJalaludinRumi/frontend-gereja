<template>
  <div class="p-6" style="background: var(--ui-bg); color: var(--ui-text);">

    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">Edit Asset</h1>
      <UButton to="/assets" icon="i-heroicons-arrow-left" color="gray" variant="soft" label="Back" />
    </div>

    <UCard :ui="{ body: { padding: 'p-6' } }">
      <form @submit.prevent="save" class="space-y-6">

        <!-- Asset Code -->
        <div>
          <label class="block mb-2 text-sm font-semibold">Asset Code *</label>
          <input v-model="form.asset_code" required type="text"
            class="w-full px-3 py-2 text-sm rounded-lg"
            style="background: var(--ui-bg); border: 1px solid var(--ui-border);" />
        </div>

        <!-- Name -->
        <div>
          <label class="block mb-2 text-sm font-semibold">Name *</label>
          <input v-model="form.name" required type="text"
            class="w-full px-3 py-2 rounded-lg text-sm"
            style="background: var(--ui-bg); border: 1px solid var(--ui-border);" />
        </div>

        <!-- Category -->
        <div>
          <label class="block mb-2 text-sm font-semibold">Category *</label>
          <select v-model="form.category_id" required class="w-full px-3 py-2 rounded-lg text-sm"
            style="background: var(--ui-bg); border: 1px solid var(--ui-border);">
            <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
          </select>
        </div>

        <!-- Location -->
        <div>
          <label class="block mb-2 text-sm font-semibold">Location *</label>
          <select v-model="form.location_id" required class="w-full px-3 py-2 rounded-lg text-sm"
            style="background: var(--ui-bg); border: 1px solid var(--ui-border);">
            <option v-for="loc in locations" :key="loc.id" :value="loc.id">{{ loc.name }}</option>
          </select>
        </div>

        <!-- Purchase Date -->
        <div>
          <label class="block mb-2 text-sm font-semibold">Purchase Date</label>
          <input v-model="form.purchase_date" type="date"
            class="w-full px-3 py-2 text-sm rounded-lg"
            style="background: var(--ui-bg); border: 1px solid var(--ui-border);" />
        </div>

        <!-- Purchase Price -->
        <div>
          <label class="block mb-2 text-sm font-semibold">Purchase Price</label>
          <input v-model="form.purchase_price" type="number"
            class="w-full px-3 py-2 text-sm rounded-lg"
            style="background: var(--ui-bg); border: 1px solid var(--ui-border);" />
        </div>

        <!-- Condition -->
        <div>
          <label class="block mb-2 text-sm font-semibold">Condition *</label>
          <select v-model="form.condition" required class="w-full px-3 py-2 text-sm rounded-lg"
            style="background: var(--ui-bg); border: 1px solid var(--ui-border);">
            <option value="baik">Baik</option>
            <option value="rusak ringan">Rusak Ringan</option>
            <option value="rusak berat">Rusak Berat</option>
            <option value="hilang">Hilang</option>
          </select>
        </div>

        <!-- Status -->
        <div>
          <label class="block mb-2 text-sm font-semibold">Status *</label>
          <select v-model="form.status" required class="w-full px-3 py-2 text-sm rounded-lg"
            style="background: var(--ui-bg); border: 1px solid var(--ui-border);">
            <option value="available">Available</option>
            <option value="borrowed">Borrowed</option>
            <option value="under_maintenance">Under Maintenance</option>
            <option value="disposed">Disposed</option>
          </select>
        </div>

        <!-- Vendor -->
        <div>
          <label class="block mb-2 text-sm font-semibold">Vendor</label>
          <input v-model="form.vendor" type="text"
            class="w-full px-3 py-2 text-sm rounded-lg"
            style="background: var(--ui-bg); border: 1px solid var(--ui-border);" />
        </div>

        <!-- Notes -->
        <div>
          <label class="block mb-2 text-sm font-semibold">Notes</label>
          <textarea v-model="form.notes" rows="3"
            class="w-full px-3 py-2 text-sm rounded-lg"
            style="background: var(--ui-bg); border: 1px solid var(--ui-border);"></textarea>
        </div>

        <!-- Buttons -->
        <div class="flex items-center gap-3">
          <UButton type="submit" :loading="saving" icon="i-heroicons-check-circle" color="primary"
            :label="saving ? 'Saving...' : 'Update Asset'" />

          <UButton color="gray" variant="soft" icon="i-heroicons-x-mark" label="Cancel"
            @click="router.push('/assets')" />
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
import { useRoute, useRouter } from 'vue-router'
import { useAssets } from '~/composables/useAssets'
import { useAssetCategories } from '~/composables/useAssetCategories'
import { useLocations } from '~/composables/useLocations'

const route = useRoute()
const router = useRouter()

const { asset, fetchById, update } = useAssets()
const { categories, fetchAll: loadCategories } = useAssetCategories()
const { locations, fetchAll: loadLocations } = useLocations()

const saving = ref(false)

const form = ref({
  asset_code: '',
  name: '',
  category_id: '',
  location_id: '',
  purchase_date: '',
  purchase_price: '',
  condition: '',
  status: '',
  vendor: '',
  notes: '',
})

onMounted(async () => {
  await fetchById(route.params.id as string)
  await loadCategories()
  await loadLocations()

  if (asset.value) Object.assign(form.value, asset.value)
})

const save = async () => {
  saving.value = true
  await update(route.params.id as string, form.value)
  router.push('/assets')
}
</script>
