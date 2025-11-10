<script setup lang="ts">
definePageMeta({
  middleware: ['role'],
  roles: [4]
})

import { ref, reactive, onMounted } from "vue"
import { useRouter } from "vue-router"
import { useMembers } from "~/composables/useMembers"
import { useMarriages } from "~/composables/useMarriages"

const router = useRouter()
const { members, fetchAll: fetchMembers } = useMembers()
const { create } = useMarriages()

const loading = ref(true)
const saving = ref(false)
const serverError = ref<string | null>(null)

// Form reactive
const form = reactive({
  bride: null as number | null,
  bride_name: "",
  groom: null as number | null,
  groom_name: "",
  date: "",
  venue: "",
  priest: null as number | null,
  priest_name: "",
  is_active: 1,
})

// Otomatis set nama saat anggota dipilih
const onBrideChange = (e: Event) => {
  const id = Number((e.target as HTMLSelectElement).value) || null
  form.bride = id
  form.bride_name = id ? members.value.find(x => x.id === id)?.name || "" : ""
}

const onGroomChange = (e: Event) => {
  const id = Number((e.target as HTMLSelectElement).value) || null
  form.groom = id
  form.groom_name = id ? members.value.find(x => x.id === id)?.name || "" : ""
}

const onPriestChange = (e: Event) => {
  const id = Number((e.target as HTMLSelectElement).value) || null
  form.priest = id
  form.priest_name = id ? members.value.find(x => x.id === id)?.name || "" : ""
}

// Fetch member saat mounted
onMounted(async () => {
  try {
    await fetchMembers()
  } catch (err) {
    console.error("Gagal load member:", err)
    serverError.value = "Gagal load data member."
  } finally {
    loading.value = false
  }
})

// SAVE FUNCTION
const save = async () => {
  serverError.value = null

  // Validasi wajib date & venue
  if (!form.date || !form.venue) {
    serverError.value = "Tanggal & lokasi wajib diisi."
    return
  }

  // Pastikan semua nama terisi (dari anggota atau input manual)
  if (form.bride) form.bride_name = members.value.find(x => x.id === form.bride)?.name || ""
  if (form.groom) form.groom_name = members.value.find(x => x.id === form.groom)?.name || ""
  if (form.priest) form.priest_name = members.value.find(x => x.id === form.priest)?.name || ""

  // Validasi tambahan kalau user ga pilih anggota tapi kosong
  if (!form.bride_name.trim() || !form.groom_name.trim() || !form.priest_name.trim()) {
    serverError.value = "Nama pengantin & pelayan wajib diisi."
    return
  }

  saving.value = true
  try {
    const payload = {
      bride: form.bride || null,
      bride_name: form.bride_name.trim(),
      groom: form.groom || null,
      groom_name: form.groom_name.trim(),
      priest: form.priest || null,
      priest_name: form.priest_name.trim(),
      date: form.date,
      venue: form.venue,
      is_active: form.is_active,
    }

    await create(payload)  // pastikan create() menerima object bukan FormData
    router.push("/marriages")
  } catch (err: any) {
    console.error(err)
    serverError.value = err?.data ? JSON.stringify(err.data, null, 2) : err.message
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <div class="p-6" style="background: var(--ui-bg); color: var(--ui-text);">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold" style="color: var(--ui-text-highlighted);">
        Tambah Pernikahan
      </h1>
      <UButton to="/marriages" icon="i-heroicons-arrow-left" color="gray" variant="soft" label="Kembali" />
    </div>

    <div v-if="loading" class="text-sm opacity-70 mb-4">Loading data member...</div>

    <UCard v-else :ui="{ body: { padding: 'p-6' } }">
      <form @submit.prevent="save" class="space-y-6">

        <!-- Bride -->
        <div>
          <label class="font-semibold text-sm mb-2 block">Istri</label>
          <select
            :value="form.bride || ''"
            @change="onBrideChange"
            class="w-full px-3 py-2 text-sm rounded-lg"
            style="background: var(--ui-bg); border: 1px solid var(--ui-border); color: var(--ui-text);"
          >
            <option value="">Pilih anggota (kalau istri anggota)</option>
            <option v-for="m in members" :key="m.id" :value="m.id">
              {{ m.name }}
            </option>
          </select>
          <div class="text-xs opacity-70 mt-2">Kalau bukan anggota → isi field di bawah.</div>
          <input
            v-model="form.bride_name"
            type="text"
            placeholder="Nama istri jika orang luar"
            class="w-full px-3 py-2 text-sm rounded-lg mt-2"
            style="background: var(--ui-bg); border: 1px solid var(--ui-border); color: var(--ui-text);"
          />
        </div>

        <!-- Groom -->
        <div>
          <label class="font-semibold text-sm mb-2 block">Suami</label>
          <select
            :value="form.groom || ''"
            @change="onGroomChange"
            class="w-full px-3 py-2 text-sm rounded-lg"
            style="background: var(--ui-bg); border: 1px solid var(--ui-border); color: var(--ui-text);"
          >
            <option value="">Pilih anggota (kalau suami anggota)</option>
            <option v-for="m in members" :key="m.id" :value="m.id">
              {{ m.name }}
            </option>
          </select>
          <div class="text-xs opacity-70 mt-2">Kalau bukan anggota → isi field di bawah.</div>
          <input
            v-model="form.groom_name"
            type="text"
            placeholder="Nama suami jika orang luar"
            class="w-full px-3 py-2 text-sm rounded-lg mt-2"
            style="background: var(--ui-bg); border: 1px solid var(--ui-border); color: var(--ui-text);"
          />
        </div>

        <!-- Date + Venue -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="font-semibold text-sm mb-2 block">
              Tanggal Pemberkatan <span class="text-red-500">*</span>
            </label>
            <input
              type="date"
              v-model="form.date"
              required
              class="w-full px-3 py-2 text-sm rounded-lg"
              style="background: var(--ui-bg); border: 1px solid var(--ui-border); color: var(--ui-text);"
            />
          </div>
          <div>
            <label class="font-semibold text-sm mb-2 block">
              Lokasi Pemberkatan <span class="text-red-500">*</span>
            </label>
            <input
              v-model="form.venue"
              type="text"
              placeholder="Gereja / Lokasi"
              required
              class="w-full px-3 py-2 text-sm rounded-lg"
              style="background: var(--ui-bg); border: 1px solid var(--ui-border); color: var(--ui-text);"
            />
          </div>
        </div>

        <!-- Priest -->
        <div>
          <label class="font-semibold text-sm mb-2 block">Pelayan Pemberkatan</label>
          <select
            :value="form.priest || ''"
            @change="onPriestChange"
            class="w-full px-3 py-2 text-sm rounded-lg"
            style="background: var(--ui-bg); border: 1px solid var(--ui-border); color: var(--ui-text);"
          >
            <option value="">Pilih pelayan (kalau anggota)</option>
            <option v-for="m in members" :key="m.id" :value="m.id">
              {{ m.name }}
            </option>
          </select>
          <div class="text-xs opacity-70 mt-2">Kalau bukan anggota → isi field di bawah.</div>
          <input
            v-model="form.priest_name"
            type="text"
            placeholder="Nama pelayan jika orang luar"
            class="w-full px-3 py-2 text-sm rounded-lg mt-2"
            style="background: var(--ui-bg); border: 1px solid var(--ui-border); color: var(--ui-text);"
          />
        </div>

        <!-- Status -->
        <div>
          <label class="font-semibold text-sm mb-2 block">Status Pernikahan</label>
          <select
            v-model.number="form.is_active"
            class="w-full px-3 py-2 text-sm rounded-lg"
            style="background: var(--ui-bg); border: 1px solid var(--ui-border); color: var(--ui-text);"
          >
            <option :value="1">Pasangan Saat Ini</option>
            <option :value="0">Cerai Hidup / Cerai Mati</option>
          </select>
        </div>

        <!-- Error Message -->
        <div
          v-if="serverError"
          class="text-red-500 text-sm whitespace-pre-wrap border border-red-400 p-3 rounded"
          style="background: rgba(239,68,68,0.1);"
        >
          {{ serverError }}
        </div>

        <!-- Action Buttons -->
        <div class="flex gap-3 pt-2">
          <UButton
            type="submit"
            :loading="saving"
            :disabled="saving"
            color="primary"
            icon="i-heroicons-check-circle"
            :label="saving ? 'Menyimpan...' : 'Simpan'"
          />
          <UButton
            color="gray"
            variant="soft"
            icon="i-heroicons-x-mark"
            label="Batal"
            @click="router.push('/marriages')"
          />
        </div>

      </form>
    </UCard>
  </div>
</template>
