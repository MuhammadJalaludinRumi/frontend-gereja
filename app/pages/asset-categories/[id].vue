<template>
  <div class="p-6" style="background: var(--ui-bg); color: var(--ui-text);">

    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">Edit Asset Category</h1>
      <UButton to="/asset-categories" icon="i-heroicons-arrow-left" color="gray" variant="soft" label="Back" />
    </div>

    <UCard :ui="{ body: { padding: 'p-6' } }">

      <form @submit.prevent="save" class="space-y-6">

        <div>
          <label class="block mb-2 text-sm font-semibold">Name *</label>
          <input v-model="form.name" type="text" required class="w-full px-3 py-2 rounded-lg text-sm"
            style="background: var(--ui-bg); border: 1px solid var(--ui-border);" />
        </div>

        <div>
          <label class="block mb-2 text-sm font-semibold">Description</label>
          <textarea v-model="form.description" rows="3" class="w-full px-3 py-2 text-sm rounded-lg"
            style="background: var(--ui-bg); border: 1px solid var(--ui-border);"></textarea>
        </div>

        <div class="flex items-center gap-3">
          <UButton type="submit" :loading="saving" icon="i-heroicons-check-circle" color="primary"
            :label="saving ? 'Saving...' : 'Update Category'" />

          <UButton color="gray" variant="soft" icon="i-heroicons-x-mark" label="Cancel"
            @click="router.push('/asset-categories')" />
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
import { useAssetCategories } from '~/composables/useAssetCategories'

const route = useRoute()
const router = useRouter()
const { category, fetchById, update, loading } = useAssetCategories()

const saving = ref(false)
const form = ref({ name: '', description: '' })

onMounted(async () => {
  await fetchById(route.params.id as string)

  if (category.value) {
    form.value.name = category.value.name
    form.value.description = category.value.description
  }
})

const save = async () => {
  saving.value = true
  await update(route.params.id as string, form.value)
  router.push('/asset-categories')
}
</script>
