<template>
  <div class="p-6 w-full overflow-hidden" style="background:var(--ui-bg);color:var(--ui-text);">

    <!-- HEADER -->
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold" style="color:var(--ui-text-highlighted);">
        Buat Maintenance Baru
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

        <!-- CREATED BY (AUTO) -->
        <div>
          <label class="block mb-2 text-sm font-semibold">Created By</label>
          <input
            type="text"
            class="w-full px-3 py-2 rounded-lg text-sm bg-gray-100"
            :value="user?.name ?? ''"
            disabled
          />
          <p class="text-xs mt-1 opacity-60">
            Otomatis dari user yang login
          </p>
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
              placeholder="0"
              class="w-full px-3 py-2 text-sm rounded-lg"
              style="background:var(--ui-bg);border:1px solid var(--ui-border);"
            />
          </div>

          <div>
            <label class="block mb-2 text-sm font-semibold">Performed By</label>
            <input
              v-model="form.performed_by"
              type="text"
              placeholder="Nama teknisi"
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
            :label="saving ? 'Saving...' : 'Save Maintenance'"
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
import { ref, reactive, onMounted } from "vue"
import { useRouter } from "vue-router"

import { useAssets } from "~/composables/useAssets"
import { useAssetMaintenances } from "~/composables/useAssetMaintenances"
import { useAuth } from "~/composables/useAuth"

const router = useRouter()

const { assets, fetchAll: fetchAssets } = useAssets()
const { create } = useAssetMaintenances()

// ⛑️ SAFE AUTH
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
  next_maintenance_date: "",
  created_by: null as number | null
})

onMounted(async () => {
  try {
    await fetchAssets()

    if (user.value?.id) {
      form.created_by = user.value.id
    } else {
      serverError.value = "User belum login"
    }
  } catch (err) {
    console.error(err)
    serverError.value = "Gagal load asset"
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
    await create({
      ...form,
      cost: Number(form.cost || 0)
    })

    router.push("/asset-maintenances")
  } catch (err: any) {
    console.error(err)
    serverError.value = err?.message ?? "Gagal menyimpan maintenance"
  } finally {
    saving.value = false
  }
}
</script>
