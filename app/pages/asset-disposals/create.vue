<script setup lang="ts">
import { ref, reactive, computed, onMounted } from "vue"
import { useRouter } from "vue-router"
import { useAssetDisposals } from "@/composables/useAssetDisposals"
import { useAssets } from "@/composables/useAssets"

const router = useRouter()
const { create } = useAssetDisposals()
const { assets, fetchAll: fetchAssets } = useAssets()

const loading = ref(true)
const saving = ref(false)
const serverError = ref<string | null>(null)

const form = reactive({
  asset_id: "" as string | number,
  disposal_date: "",
  disposal_type: "",
  value: "",
  notes: "",
})

const selectedAsset = computed(() =>
  assets.value.find((a: any) => a.id == form.asset_id)
)

onMounted(async () => {
  try {
    await fetchAssets()
  } catch (err) {
    console.error(err)
    serverError.value = "Gagal memuat data assets."
  } finally {
    loading.value = false
  }
})

const save = async () => {
  serverError.value = null

  if (!form.asset_id || !form.disposal_type) {
    serverError.value = "Asset & Disposal type wajib diisi."
    return
  }

  saving.value = true
  try {
    await create(form)
    router.push("/asset-disposals")
  } catch (err: any) {
    console.error("Submit error:", err)
    serverError.value = err?.message || "Gagal menyimpan data."
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <div class="p-6 w-full overflow-hidden" style="background: var(--ui-bg); color: var(--ui-text);">

    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold" style="color: var(--ui-text-highlighted);">
        Buat Asset Disposal
      </h1>
      <UButton
        to="/asset-disposals"
        icon="i-heroicons-arrow-left"
        color="gray"
        variant="soft"
        label="Back"
      />
    </div>

    <div v-if="loading" class="mb-4 text-sm text-gray-400">Loading...</div>

    <UCard v-else :ui="{ body: { padding: 'p-6' } }">
      <form @submit.prevent="save" class="space-y-6">

        <!-- Asset Dropdown -->
        <div>
          <label class="block mb-2 text-sm font-semibold">
            Asset <span class="text-red-500">*</span>
          </label>
          <select
            v-model="form.asset_id"
            class="w-full px-3 py-2 text-sm rounded-lg"
            style="background: var(--ui-bg); border: 1px solid var(--ui-border);"
          >
            <option value="">Pilih Asset</option>
            <option v-for="a in assets" :key="a.id" :value="a.id">
              {{ a.name }}
            </option>
          </select>

          <UBadge v-if="selectedAsset" color="primary" variant="soft" class="mt-2">
            {{ selectedAsset.name }}
          </UBadge>
        </div>

        <!-- Disposal Date -->
        <div>
          <label class="block mb-2 text-sm font-semibold">Tanggal Disposal</label>
          <input
            v-model="form.disposal_date"
            type="date"
            class="w-full px-3 py-2 text-sm rounded-lg"
            style="background: var(--ui-bg); border: 1px solid var(--ui-border);"
          />
        </div>

        <!-- Disposal Type -->
        <div>
          <label class="block mb-2 text-sm font-semibold">
            Disposal Type <span class="text-red-500">*</span>
          </label>
          <select
            v-model="form.disposal_type"
            class="w-full px-3 py-2 text-sm rounded-lg"
            style="background: var(--ui-bg); border: 1px solid var(--ui-border);"
          >
            <option value="">Pilih Tipe</option>
            <option value="dijual">Dijual</option>
            <option value="rusak">Rusak</option>
            <option value="hilang">Hilang</option>
          </select>
        </div>

        <!-- Value -->
        <div>
          <label class="block mb-2 text-sm font-semibold">Nilai</label>
          <input
            v-model="form.value"
            type="number"
            step="0.01"
            placeholder="0.00"
            class="w-full px-3 py-2 text-sm rounded-lg"
            style="background: var(--ui-bg); border: 1px solid var(--ui-border);"
          />
        </div>

        <!-- Notes -->
        <div>
          <label class="block mb-2 text-sm font-semibold">Catatan</label>
          <textarea
            v-model="form.notes"
            rows="3"
            placeholder="Catatan tambahan"
            class="w-full px-3 py-2 text-sm rounded-lg"
            style="background: var(--ui-bg); border: 1px solid var(--ui-border);"
          ></textarea>
        </div>

        <!-- Server Error -->
        <div
          v-if="serverError"
          class="px-4 py-3 rounded-lg text-sm whitespace-pre-wrap"
          style="background: rgba(239,68,68,0.1); border:1px solid rgba(239,68,68,0.3); color:#ef4444;"
        >
          {{ serverError }}
        </div>

        <!-- Buttons -->
        <div class="flex items-center gap-3 pt-2">
          <UButton
            type="submit"
            :loading="saving"
            :disabled="saving"
            color="primary"
            icon="i-heroicons-check-circle"
            :label="saving ? 'Saving...' : 'Save Disposal'"
          />
          <UButton
            color="gray"
            variant="soft"
            icon="i-heroicons-x-mark"
            label="Cancel"
            @click="router.push('/asset-disposals')"
          />
        </div>

      </form>
    </UCard>

  </div>
</template>
