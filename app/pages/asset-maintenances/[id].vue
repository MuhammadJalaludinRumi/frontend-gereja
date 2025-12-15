<template>
  <div class="p-6 w-full overflow-hidden" style="background:var(--ui-bg);color:var(--ui-text);">

    <!-- HEADER -->
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold" style="color:var(--ui-text-highlighted);">
        Edit Maintenance
      </h1>

      <UButton
        to="/asset-maintenances"
        icon="i-heroicons-arrow-left"
        color="gray"
        variant="soft"
        label="Back"
      />
    </div>

    <UCard v-if="loading" class="p-4">Loading...</UCard>

    <UCard v-else :ui="{ body: { padding: 'p-6' } }">
      <form @submit.prevent="save" class="space-y-6">

        <!-- ASSET -->
        <div>
          <label class="block mb-2 text-sm font-semibold">
            Asset <span class="text-red-500">*</span>
          </label>
          <select
            v-model="form.asset_id"
            class="w-full px-3 py-2 text-sm rounded-lg"
            style="background:var(--ui-bg);border:1px solid var(--ui-border);"
          >
            <option value="">Pilih Asset</option>
            <option v-for="a in assets" :key="a.id" :value="a.id">
              {{ a.name }}
            </option>
          </select>
        </div>

        <!-- CREATED BY (READ ONLY) -->
        <div>
          <label class="block mb-2 text-sm font-semibold">Created By</label>
          <input
            type="text"
            class="w-full px-3 py-2 rounded-lg text-sm bg-gray-100"
            :value="createdByName"
            disabled
          />
        </div>

        <!-- MAINTENANCE DATE -->
        <div>
          <label class="block mb-2 text-sm font-semibold">Maintenance Date</label>
          <input
            v-model="form.maintenance_date"
            type="date"
            class="w-full px-3 py-2 text-sm rounded-lg"
            style="background:var(--ui-bg);border:1px solid var(--ui-border);"
          />
        </div>

        <!-- DESCRIPTION -->
        <div>
          <label class="block mb-2 text-sm font-semibold">Description</label>
          <textarea
            v-model="form.description"
            rows="3"
            class="w-full px-3 py-2 text-sm rounded-lg"
            style="background:var(--ui-bg);border:1px solid var(--ui-border);"
          ></textarea>
        </div>

        <!-- COST & PERFORMED BY -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block mb-2 text-sm font-semibold">Cost</label>
            <input
              v-model="form.cost"
              type="number"
              class="w-full px-3 py-2 text-sm rounded-lg"
              style="background:var(--ui-bg);border:1px solid var(--ui-border);"
            />
          </div>

          <div>
            <label class="block mb-2 text-sm font-semibold">Performed By</label>
            <input
              v-model="form.performed_by"
              type="text"
              class="w-full px-3 py-2 text-sm rounded-lg"
              style="background:var(--ui-bg);border:1px solid var(--ui-border);"
            />
          </div>
        </div>

        <!-- NEXT MAINTENANCE -->
        <div>
          <label class="block mb-2 text-sm font-semibold">Next Maintenance Date</label>
          <input
            v-model="form.next_maintenance_date"
            type="date"
            class="w-full px-3 py-2 text-sm rounded-lg"
            style="background:var(--ui-bg);border:1px solid var(--ui-border);"
          />
        </div>

        <!-- ERROR -->
        <div
          v-if="serverError"
          class="px-4 py-3 rounded-lg text-sm"
          style="background:rgba(239,68,68,0.1);border:1px solid rgba(239,68,68,0.3);color:#ef4444;"
        >
          {{ serverError }}
        </div>

        <!-- BUTTONS -->
        <div class="flex items-center gap-3">
          <UButton
            type="submit"
            :loading="saving"
            :disabled="saving"
            color="primary"
            icon="i-heroicons-check-circle"
            label="Update Maintenance"
          />
          <UButton
            color="gray"
            variant="soft"
            icon="i-heroicons-x-mark"
            label="Cancel"
            @click="router.push('/asset-maintenances')"
          />
        </div>

      </form>
    </UCard>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from "vue"
import { useRouter, useRoute } from "vue-router"

import { useAssets } from "~/composables/useAssets"
import { useAssetMaintenances } from "~/composables/useAssetMaintenances"
import { useAuth } from "~/composables/useAuth"

const router = useRouter()
const route = useRoute()
const id = route.params.id as string

const { assets, fetchAll: fetchAssets } = useAssets()
const { fetchById, update, maintenance } = useAssetMaintenances()

const auth = useAuth()
const user = auth?.user ?? ref(null)

const loading = ref(true)
const saving = ref(false)
const serverError = ref<string | null>(null)

const form = reactive({
  asset_id: "",
  maintenance_date: "",
  description: "",
  cost: "",
  performed_by: "",
  next_maintenance_date: ""
})

const createdByName = computed(() => {
  return maintenance.value?.created_by_name || "-"
})

onMounted(async () => {
  try {
    await Promise.all([
      fetchAssets(),
      fetchById(id)
    ])

    if (!maintenance.value) {
      serverError.value = "Data maintenance tidak ditemukan"
      return
    }

    Object.assign(form, {
      asset_id: maintenance.value.asset_id,
      maintenance_date: maintenance.value.maintenance_date,
      description: maintenance.value.description,
      cost: maintenance.value.cost,
      performed_by: maintenance.value.performed_by,
      next_maintenance_date: maintenance.value.next_maintenance_date
    })
  } catch (err) {
    console.error(err)
    serverError.value = "Gagal memuat data maintenance"
  } finally {
    loading.value = false
  }
})

const save = async () => {
  serverError.value = null

  if (!form.asset_id) {
    serverError.value = "Asset wajib dipilih"
    return
  }

  saving.value = true
  try {
    await update(id, {
      ...form,
      cost: Number(form.cost || 0)
    })

    router.push("/asset-maintenances")
  } catch (err: any) {
    console.error(err)
    serverError.value = err?.message ?? "Gagal update maintenance"
  } finally {
    saving.value = false
  }
}
</script>
