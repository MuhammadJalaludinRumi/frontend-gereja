<template>
  <div class="p-6 max-w-xl mx-auto space-y-6">
    <h1 class="text-2xl font-bold">Edit Asset Image</h1>

    <UCard v-if="image">
      <form class="space-y-4" @submit.prevent="submit">

        <div>
          <label class="font-semibold">Asset ID</label>
          <input
            v-model="form.asset_id"
            type="number"
            class="w-full border rounded px-3 py-2"
          />
        </div>

        <div>
          <p class="text-sm mb-1">Current Image:</p>
          <img :src="image.image_path" class="h-32 rounded border mb-3" />

          <label class="font-semibold">Replace Image</label>
          <input type="file" accept="image/*" @change="onFileChange" />

          <img
            v-if="preview"
            :src="preview"
            class="h-32 rounded border mt-3"
          />
        </div>

        <UButton type="submit" color="primary" :loading="saving">Update</UButton>
        <UButton to="/asset-images" variant="soft" color="gray">Cancel</UButton>
      </form>
    </UCard>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAssetImages } from '~/composables/useAssetImages'

const route = useRoute()
const router  = useRouter()
const { image, fetchById, update } = useAssetImages()

const saving = ref(false)
const preview = ref(null)

const form = ref({
  asset_id: "",
  image: null
})

onMounted(async () => {
  await fetchById(route.params.id)
  if (image.value) {
    form.value.asset_id = image.value.asset_id
  }
})

const onFileChange = (e) => {
  const file = e.target.files[0]
  form.value.image = file
  preview.value = URL.createObjectURL(file)
}

const submit = async () => {
  saving.value = true
  const fd = new FormData()
  fd.append("asset_id", form.value.asset_id)

  if (form.value.image) {
    fd.append("image", form.value.image)
  }

  await update(route.params.id, fd)
  router.push('/asset-images')
}
</script>
