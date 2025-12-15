<script setup lang="ts">
import { ref, reactive, onMounted } from "vue"
import { useRoute, useRouter } from "vue-router"

import { useAssetMovements } from "@/composables/useAssetMovements"
import { useAssets } from "@/composables/useAssets"
import { useLocations } from "@/composables/useLocations"
import { useUsers } from "@/composables/useUsers"

const route = useRoute()
const router = useRouter()

const movementId = route.params.id

const { fetchById, update, remove, movement } = useAssetMovements()

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
  moved_by: "",
  moved_at: "",
  notes: ""
})

onMounted(async () => {
  try {
    await Promise.all([
      fetchAssets(),
      fetchLocations(),
      fetchUsers(),
      fetchById(movementId)
    ])

    if (movement.value) {
      form.asset_id = movement.value.asset_id
      form.from_location_id = movement.value.from_location_id
      form.to_location_id = movement.value.to_location_id
      form.moved_by = movement.value.moved_by
      form.moved_at = movement.value.moved_at
        ? movement.value.moved_at.replace(" ", "T").slice(0, 16)
        : ""
      form.notes = movement.value.notes
    }

  } catch (err) {
    console.error(err)
    serverError.value = "Gagal memuat data."
  } finally {
    loading.value = false
  }
})

const save = async () => {
  serverError.value = null

  saving.value = true

  try {
    await update(movementId, {
      ...form,
      moved_at: form.moved_at
        ? form.moved_at.replace("T", " ") + ":00"
        : null
    })

    router.push("/asset-movements")
  } catch (err: any) {
    console.error("Update error:", err)
    serverError.value = err.message || "Gagal update asset movement."
  } finally {
    saving.value = false
  }
}

const deleteMovement = async () => {
  if (!confirm("Yakin mau hapus data ini bro?")) return

  try {
    await remove(movementId)
    router.push("/asset-movements")
  } catch (err: any) {
    serverError.value = err.message || "Gagal menghapus data."
  }
}
</script>


<template>
  <div class="p-6 w-full" style="background: var(--ui-bg); color: var(--ui-text)">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold" style="color: var(--ui-text-highlighted)">
        Edit Asset Movement
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

        <!-- From Location -->
        <div>
          <label class="block mb-2 text-sm font-semibold">From Location</label>
          <select
            v-model="form.from_location_id"
            class="w-full px-3 py-2 rounded-lg text-sm"
            style="background: var(--ui-bg); border:1px solid var(--ui-border)"
          >
            <option value="">Pilih Lokasi Asal</option>
            <option v-for="l in locations" :key="l.id" :value="l.id">
              {{ l.name }}
            </option>
          </select>
        </div>

        <!-- To Location -->
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

        <!-- Moved By -->
        <div>
          <label class="block mb-2 text-sm font-semibold">Moved By</label>
          <input
            type="text"
            class="w-full px-3 py-2 rounded-lg text-sm bg-gray-100"
            :value="users.find(u => u.id == form.moved_by)?.name || ''"
            disabled
          />
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
            :label="saving ? 'Saving...' : 'Update Movement'"
          />

          <UButton
            color="red"
            variant="soft"
            icon="i-heroicons-trash"
            label="Delete"
            @click="deleteMovement"
          />
        </div>

      </form>
    </UCard>
  </div>
</template>
