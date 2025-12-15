<template>
  <div class="p-6 max-w-xl mx-auto space-y-6">
    <h1 class="text-2xl font-bold">Add Asset Image</h1>

    <UCard>
      <form class="space-y-4" @submit.prevent="submit">

        <div>
          <label class="font-semibold">Asset ID</label>
          <input
            v-model="form.asset_id"
            type="number"
            class="w-full border rounded px-3 py-2"
            required
          />
        </div>

        <div>
          <label class="font-semibold">Image</label>
          <input type="file" accept="image/*" @change="onFileChange" required />

          <img
            v-if="preview"
            :src="preview"
            class="h-32 rounded border mt-3"
          />
        </div>

        <UButton type="submit" color="primary" :loading="saving">Save</UButton>
        <UButton to="/asset-images" variant="soft" color="gray">Cancel</UButton>
      </form>
    </UCard>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAssetImages } from '~/composables/useAssetImages'

const router = useRouter()
const { create } = useAssetImages()

const saving = ref(false)
const preview = ref(null)

const form = ref({
  asset_id: "",
  image: null
})

const onFileChange = (e) => {
  const file = e.target.files[0]
  form.value.image = file
  preview.value = URL.createObjectURL(file)
}

const submit = async () => {
  saving.value = true
  const fd = new FormData()
  fd.append('asset_id', form.value.asset_id)
  fd.append('image', form.value.image)

  await create(fd)
  router.push('/asset-images')
}
</script>
