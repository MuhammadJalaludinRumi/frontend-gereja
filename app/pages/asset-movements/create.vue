<script setup lang="ts">
import { ref, reactive, computed, onMounted } from "vue"
import { useRouter } from "vue-router"

import { useAssetMovements } from "@/composables/useAssetMovements"
import { useAssets } from "@/composables/useAssets"
import { useLocations } from "@/composables/useLocations"
import { useUsers } from "@/composables/useUsers"

const router = useRouter()
const { create } = useAssetMovements()

// Relasi data
const { assets, fetchAll: fetchAssets } = useAssets()
const { locations, fetchAll: fetchLocations } = useLocations()
const { users, fetchUsers } = useUsers()

const loading = ref(true)
const saving = ref(false)
const serverError = ref<string | null>(null)

const form = reactive({
  asset_id: "",
  from_location_id: "",
  to_location_id: "",
  moved_by: "",    // auto-fill here
  moved_at: "",
  notes: ""
})

onMounted(async () => {
  try {
    await Promise.all([
      fetchAssets(),
      fetchLocations(),
      fetchUsers()
    ])

    // isi moved_by otomatis (tanpa dropdown)
    if (users.value.length > 0) {
      form.moved_by = users.value[0].id
    }

  } catch (err) {
    console.error(err)
    serverError.value = "Gagal memuat data relasi."
  } finally {
    loading.value = false
  }
})

const save = async () => {
  serverError.value = null

  if (!form.asset_id) {
    serverError.value = "Aset wajib dipilih."
    return
  }

  saving.value = true

  try {
    await create({
      ...form,
      moved_at: form.moved_at
        ? form.moved_at.replace("T", " ") + ":00"
        : null
    })

    router.push("/asset-movements")
  } catch (err: any) {
    console.error("Submit error:", err)
    serverError.value = err.message || "Gagal menyimpan data perpindahan aset."
  } finally {
    saving.value = false
  }
}
</script>


<template>
  <div class="p-6 w-full" style="background: var(--ui-bg); color: var(--ui-text)">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold" style="color: var(--ui-text-highlighted)">
        Buat Asset Movement
      </h1>
      <UButton
        to="/asset-movements"
        icon="i-heroicons-arrow-left"
        color="gray"
        variant="soft"
        label="Back"
      />
    </div>

    <div v-if="loading" class="text-sm mb-4">Loading...</div>

    <UCard v-else :ui="{ body: { padding: 'p-6' } }">
      <form @submit.prevent="save" class="space-y-6">

        <!-- Asset -->
        <div>
          <label class="block mb-2 text-sm font-semibold">Asset</label>
          <select
            v-model="form.asset_id"
            class="w-full px-3 py-2 rounded-lg text-sm"
            style="background: var(--ui-bg); border:1px solid var(--ui-border)"
          >
            <option value="">Pilih Asset</option>
            <option v-for="a in assets" :key="a.id" :value="a.id">
              {{ a.name }}
            </option>
          </select>
        </div>

        <!-- From -->
        <div>
          <label class="block mb-2 text-sm font-semibold">From Location</label>
          <select
            v-model="form.from_location_id"
            class="w-full px-3 py-2 text-sm rounded-lg"
            style="background: var(--ui-bg); border:1px solid var(--ui-border)"
          >
            <option value="">Pilih Lokasi Asal</option>
            <option v-for="l in locations" :key="l.id" :value="l.id">
              {{ l.name }}
            </option>
          </select>
        </div>

        <!-- To -->
        <div>
          <label class="block mb-2 text-sm font-semibold">To Location</label>
          <select
            v-model="form.to_location_id"
            class="w-full px-3 py-2 text-sm rounded-lg"
            style="background: var(--ui-bg); border:1px solid var(--ui-border)"
          >
            <option value="">Pilih Lokasi Tujuan</option>
            <option v-for="l in locations" :key="l.id" :value="l.id">
              {{ l.name }}
            </option>
          </select>
        </div>

        <!-- Moved By (AUTO) -->
        <div>
          <label class="block mb-2 text-sm font-semibold">Moved By</label>

          <input
            type="text"
            class="w-full px-3 py-2 rounded-lg text-sm bg-gray-100"
            :value="users.length ? users[0].name : ''"
            disabled
          />

          <p class="text-xs mt-1 opacity-60">
            Otomatis: user yang sedang login
          </p>
        </div>

        <!-- Moved At -->
        <div>
          <label class="block mb-2 text-sm font-semibold">Moved At</label>
          <input
            v-model="form.moved_at"
            type="datetime-local"
            class="w-full px-3 py-2 text-sm rounded-lg"
            style="background: var(--ui-bg); border:1px solid var(--ui-border)"
          />
        </div>

        <!-- Notes -->
        <div>
          <label class="block mb-2 text-sm font-semibold">Notes</label>
          <textarea
            v-model="form.notes"
            rows="3"
            class="w-full px-3 py-2 rounded-lg text-sm"
            style="background: var(--ui-bg); border:1px solid var(--ui-border)"
          ></textarea>
        </div>

        <!-- Error -->
        <div
          v-if="serverError"
          class="px-4 py-3 rounded text-sm"
          style="background: rgba(239,68,68,0.1); border:1px solid rgba(239,68,68,0.3); color:#ef4444"
        >
          {{ serverError }}
        </div>

        <!-- Buttons -->
        <div class="flex items-center gap-3">
          <UButton
            type="submit"
            :loading="saving"
            :disabled="saving"
            color="primary"
            icon="i-heroicons-check-circle"
            :label="saving ? 'Saving...' : 'Save Movement'"
          />
          <UButton
            color="gray"
            variant="soft"
            label="Cancel"
            icon="i-heroicons-x-mark"
            @click="router.push('/asset-movements')"
          />
        </div>

      </form>
    </UCard>
  </div>
</template>
