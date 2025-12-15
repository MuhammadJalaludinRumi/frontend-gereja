<template>
  <div class="p-6 w-full overflow-hidden" style="color: var(--ui-text); background: var(--ui-bg);">
    <!-- Header -->
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold" style="color: var(--ui-text-highlighted);">
        Buat Asset Document
      </h1>
      <UButton to="/asset-documents" icon="i-heroicons-arrow-left" color="gray" variant="soft" label="Back" />
    </div>

    <UCard :ui="{ body: { padding: 'p-6' } }">
      <form @submit.prevent="save" class="space-y-6">
        <!-- Asset Dropdown -->
        <div>
          <label class="block mb-2 text-sm font-semibold">Asset <span class="text-red-500">*</span></label>
          <select v-model.number="form.asset_id"
            class="w-full px-3 py-2 text-sm rounded-lg"
            style="background: var(--ui-bg); border: 1px solid var(--ui-border);">
            <option value="">Pilih Asset</option>
            <option v-for="a in assets" :key="a.id" :value="a.id">{{ a.name }}</option>
          </select>
        </div>

        <!-- Type -->
        <div>
          <label class="block mb-2 text-sm font-semibold">Type <span class="text-red-500">*</span></label>
          <select v-model="form.type"
            class="w-full px-3 py-2 text-sm rounded-lg"
            style="background: var(--ui-bg); border: 1px solid var(--ui-border);">
            <option value="">Pilih Type</option>
            <option value="invoice">Invoice</option>
            <option value="warranty">Warranty</option>
            <option value="photo">Photo</option>
            <option value="other">Other</option>
          </select>
        </div>

        <!-- File Upload -->
        <div>
          <label class="block mb-2 text-sm font-semibold">File</label>
          <input type="file" @change="onFileChange" class="w-full px-3 py-2 text-sm rounded-lg"
            style="background: var(--ui-bg); border: 1px solid var(--ui-border);" />
          <div v-if="filePreview" class="mt-3">
            <p class="text-sm text-gray-500 truncate">Preview: {{ filePreview }}</p>
          </div>
        </div>

        <!-- Description -->
        <div>
          <label class="block mb-2 text-sm font-semibold">Description</label>
          <textarea v-model="form.description" rows="3" placeholder="Deskripsi tambahan"
            class="w-full px-3 py-2 text-sm rounded-lg"
            style="background: var(--ui-bg); border: 1px solid var(--ui-border);"></textarea>
        </div>

        <!-- Server Error -->
        <div v-if="serverError"
          class="px-4 py-3 rounded-lg text-sm whitespace-pre-wrap"
          style="background: rgba(239,68,68,0.1); border:1px solid rgba(239,68,68,0.3); color:#ef4444;">
          {{ serverError }}
        </div>

        <!-- Buttons -->
        <div class="flex items-center gap-3 pt-2">
          <UButton type="submit" :loading="saving" :disabled="saving" color="primary" icon="i-heroicons-check-circle"
            :label="saving ? 'Saving...' : 'Save Document'" />
          <UButton color="gray" variant="soft" icon="i-heroicons-x-mark" label="Cancel"
            @click="router.push('/asset-documents')" />
        </div>
      </form>
    </UCard>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from "vue"
import { useRouter } from "vue-router"
import { useAssetDocuments } from "@/composables/useAssetDocuments"
import { useAssets } from "@/composables/useAssets"

const router = useRouter()
const { create } = useAssetDocuments()
const { assets, fetchAll: fetchAssets } = useAssets()

const loading = ref(true)
const saving = ref(false)
const serverError = ref<string | null>(null)

const form = reactive({
  asset_id: null as number | null,
  type: "",
  description: "",
})

const fileUpload = ref<File | null>(null)
const filePreview = ref<string | null>(null)

const onFileChange = (e: Event) => {
  const file = (e.target as HTMLInputElement).files?.[0] || null
  fileUpload.value = file
  filePreview.value = file?.name || null
}

onMounted(async () => {
  try {
    await fetchAssets()
  } catch (err) {
    console.error(err)
    serverError.value = "Gagal memuat assets."
  } finally {
    loading.value = false
  }
})

const save = async () => {
  serverError.value = null
  if (!form.asset_id || !form.type) {
    serverError.value = "Asset & type wajib diisi."
    return
  }

  saving.value = true
  try {
    const fd = new FormData()
    fd.append("asset_id", String(form.asset_id))
    fd.append("type", form.type)
    if (form.description) fd.append("description", form.description)
    if (fileUpload.value) fd.append("file", fileUpload.value) // ✅ pakai key 'file', bukan file_path

    console.log("=== FORM DATA ===")
    for (let [key, value] of fd.entries()) console.log(key, value)

    await create(fd)
    router.push("/asset-documents")
  } catch (err: any) {
    console.error(err)
    serverError.value = err?.message || "Gagal menyimpan document."
  } finally {
    saving.value = false
  }
}

</script>

<style scoped>
input:focus,
select:focus,
textarea:focus {
  outline: none;
  border-color: var(--ui-primary);
}
</style>
