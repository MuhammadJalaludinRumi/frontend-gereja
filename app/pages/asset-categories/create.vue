<template>
  <div class="p-6" style="background: var(--ui-bg); color: var(--ui-text);">

    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">Tambah Asset Category</h1>
      <UButton to="/asset-categories" icon="i-heroicons-arrow-left" color="gray" variant="soft" label="Back" />
    </div>

    <UCard :ui="{ body: { padding: 'p-6' } }">
      <form @submit.prevent="save" class="space-y-6">

        <div>
          <label class="block mb-2 text-sm font-semibold">Name *</label>
          <input v-model="form.name" type="text" required class="w-full px-3 py-2 text-sm rounded-lg"
            style="background: var(--ui-bg); border: 1px solid var(--ui-border);" />
        </div>

        <div>
          <label class="block mb-2 text-sm font-semibold">Description</label>
          <textarea v-model="form.description" rows="3" class="w-full px-3 py-2 text-sm rounded-lg"
            style="background: var(--ui-bg); border: 1px solid var(--ui-border);"></textarea>
        </div>

        <div class="flex items-center gap-3 pt-2">
          <UButton type="submit" :loading="saving" color="primary" icon="i-heroicons-check-circle"
            :label="saving ? 'Saving...' : 'Save Category'" />

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

import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAssetCategories } from '~/composables/useAssetCategories'

const router = useRouter()
const { create } = useAssetCategories()

const saving = ref(false)
const form = ref({ name: '', description: '' })
const serverError = ref('')

const save = async () => {
  saving.value = true
  serverError.value = ''

  try {
    await create(form.value)
    router.push('/asset-categories')
  } catch (err: any) {
    serverError.value = err.message
  } finally {
    saving.value = false
  }
}
</script>
