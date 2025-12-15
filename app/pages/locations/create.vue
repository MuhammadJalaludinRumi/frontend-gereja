<template>
  <div class="p-6" style="background: var(--ui-bg); color: var(--ui-text);">

    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">Tambah Lokasi</h1>
      <UButton to="/locations" icon="i-heroicons-arrow-left" variant="soft" label="Back" />
    </div>

    <UCard :ui="{ body: { padding: 'p-6' } }">
      <form @submit.prevent="save" class="space-y-6">

        <!-- Parent -->
        <div>
          <label class="block mb-2 text-sm font-semibold">Parent Location</label>
          <select
            v-model="form.parent_id"
            class="w-full px-3 py-2 rounded-lg text-sm"
            style="background: var(--ui-bg); border: 1px solid var(--ui-border);"
          >
            <option :value="null">— No Parent —</option>
            <option
              v-for="p in parents"
              :key="p.id"
              :value="p.id"
            >
              {{ p.name }}
            </option>
          </select>
        </div>

        <!-- Name -->
        <div>
          <label class="block mb-2 text-sm font-semibold">Name *</label>
          <input
            v-model="form.name"
            required
            class="w-full px-3 py-2 rounded-lg text-sm"
            style="background: var(--ui-bg); border: 1px solid var(--ui-border);"
          />
        </div>

        <!-- Description -->
        <div>
          <label class="block mb-2 text-sm font-semibold">Description</label>
          <textarea
            v-model="form.description"
            rows="3"
            class="w-full px-3 py-2 rounded-lg text-sm"
            style="background: var(--ui-bg); border: 1px solid var(--ui-border);"
          />
        </div>

        <div class="flex gap-3">
          <UButton type="submit" color="primary" :loading="saving" icon="i-heroicons-check-circle"
            :label="saving ? 'Saving...' : 'Save Location'" />

          <UButton to="/locations" variant="soft" label="Cancel" />
        </div>

      </form>
    </UCard>

  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: ['role'], roles: [4] })

import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useLocations } from '~/composables/useLocations'

const router = useRouter()
const { create, fetchAll, locations } = useLocations()

const form = ref({
  parent_id: null,
  name: '',
  description: ''
})

const parents = ref([])
const saving = ref(false)

onMounted(async () => {
  await fetchAll()
  parents.value = locations.value
})

const save = async () => {
  saving.value = true
  await create(form.value)
  router.push('/locations')
}
</script>
