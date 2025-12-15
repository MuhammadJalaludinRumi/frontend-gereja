<template>
  <div class="p-6">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">Asset Images</h1>
      <UButton to="/asset-images/create" color="primary" icon="i-heroicons-plus" label="Add Image" />
    </div>

    <div v-if="loading">Loading...</div>

    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div
        v-for="img in images"
        :key="img.id"
        class="border rounded-lg p-3 flex flex-col items-center"
      >
        <img :src="img.image_path" class="h-24 w-auto rounded mb-2" />

        <p class="text-xs text-gray-400 mb-2">Asset ID: {{ img.asset_id }}</p>

        <div class="flex gap-2">
          <UButton
            :to="`/asset-images/${img.id}/edit`"
            color="gray"
            variant="soft"
            icon="i-heroicons-pencil-square"
          />

          <UButton
            color="red"
            variant="soft"
            icon="i-heroicons-trash"
            @click="confirmDelete(img.id)"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useAssetImages } from '~/composables/useAssetImages'

const { images, fetchAll, remove, loading } = useAssetImages()

onMounted(fetchAll)

const confirmDelete = async (id) => {
  if (confirm("Yakin ingin menghapus gambar ini?")) {
    await remove(id)
    await fetchAll()
  }
}
</script>
