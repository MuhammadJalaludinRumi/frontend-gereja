<script setup lang="ts">
definePageMeta({
  middleware: ['role'],
  roles: [4],
})

import { ref, reactive, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useMembers } from '~/composables/useMembers'
import { useMarriages } from '~/composables/useMarriages'
import { f } from 'vue-router/dist/router-CWoNjPRp.mjs'

const router = useRouter()
const route = useRoute()

const { members, fetchAll: fetchMembers } = useMembers()
const { marriage, fetchById, update, loading: loadingMarriage, error: marriageError } = useMarriages()

const loading = ref(true)
const saving = ref(false)
const serverError = ref<string | null>(null)

const isBrideMember = ref(true);
const isGroomMember = ref(true);
const isPriestMember = ref(true);

const form = reactive({
  bride: { label: '', value: 0 },
  bride_name: '',
  groom: { label: '', value: 0 },
  groom_name: '',
  date: '',
  venue: '',
  priest: { label: '', value: 0 },
  priest_name: '',
  is_active: 1,
})

// Load members & marriage detail
const loadData = async () => {
  loading.value = true
  serverError.value = null

  try {
    await fetchMembers()
    const id = Number(route.params.id)
    await fetchById(id)
    if (marriage.value) {
      form.bride.value = marriage.value.bride ?? 0
      form.bride.label = members.value.find(m => m.id === marriage.value?.bride)?.name || ''
      form.bride_name = marriage.value.bride_name
      
      form.groom.value = marriage.value.groom ?? 0
      form.groom.label = members.value.find(m => m.id === marriage.value?.groom)?.name || ''
      form.groom_name = marriage.value.groom_name

      form.priest.value = marriage.value.priest ?? 0
      form.priest_name = marriage.value.priest_name
      form.priest.label = members.value.find(m => m.id === marriage.value?.priest)?.name || ''

      form.date = $formatDateForInput(marriage.value.date)
      form.venue = marriage.value.venue ?? ''
      form.is_active = Number(marriage.value.is_active) ?? 1

      console.log('Form', form)
    }

    isBrideMember.value = !!marriage.value?.bride
    isGroomMember.value = !!marriage.value?.groom
    isPriestMember.value = !!marriage.value?.priest
  } catch (err) {
    console.error('Gagal load data marriage:', err)
    serverError.value = 'Gagal load data marriage.'
  } finally {
    loading.value = false
  }
}

const memberOptions = computed<{ label: string; value: number }[]>(() =>
  members.value
    .filter(m => typeof m.id === 'number')
    .map(m => ({
      label: m.name,
      value: m.id!
    }))
)

onMounted(loadData)

// SAVE / UPDATE FUNCTION
const save = async () => {
  serverError.value = null

  if (!form.date || !form.venue) {
    serverError.value = 'Tanggal & lokasi wajib diisi.'
    return
  }

  if (!form.bride_name.trim() || !form.groom_name.trim() || !form.priest_name.trim()) {
    serverError.value = 'Nama pengantin & pelayan wajib diisi.'
    return
  }

  saving.value = true
  try {
    const payload = {
      bride: form.bride.value || null,
      bride_name: form.bride_name.trim(),
      groom: form.groom.value || null,
      groom_name: form.groom_name.trim(),
      priest: form.priest.value || null,
      priest_name: form.priest_name.trim(),
      date: form.date,
      venue: form.venue,
      is_active: form.is_active,
    }
    await update(Number(route.params.id), payload)
    router.push('/marriages')
  } catch (err: any) {
    console.error(err)
    serverError.value = err?.message || 'Gagal update pernikahan'
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <div class="p-6" style="background: var(--ui-bg); color: var(--ui-text)">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold" style="color: var(--ui-text-highlighted)">
        Edit Pernikahan
      </h1>
      <UButton to="/marriages" icon="i-heroicons-arrow-left" color="neutral" variant="link" label="Kembali" />
    </div>

    <div v-if="loading" class="text-sm opacity-70 mb-4">Loading data...</div>

    <UCard v-else >
      <form @submit.prevent="save" class="space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <!-- Bride -->
          <div>
            <label class="font-medium text-sm mb-2 block">
              Istri
              <span :hidden="isBrideMember">(Bukan Anggota)</span>
            </label>
            <div v-if="isBrideMember" class="flex gap-2 items-center">
              <UInputMenu
                v-model="form.bride"
                :items="memberOptions"
                :loading="loading"
                @change="form.bride_name = form.bride.label"
                placeholder="Pilih anggota (kalau istri anggota)"
                class="w-full"
              />

              <UButton
                type="button"
                color="primary"
                variant="outline"
                @click="form.bride = { label: '', value: 0 }; form.bride_name = ''; isBrideMember = false"
                label="Anggota"
              />
            </div>
            <div v-else class="flex gap-2">
              <UInput
                v-model="form.bride_name"
                type="text"
                class="w-full"
                placeholder="Nama istri jika orang luar"
              />
              <UButton
                type="button"
                color="primary"
                variant="outline"
                @click="form.bride = { label: marriage?.bride_name || '', value: marriage?.bride || 0 }; form.bride_name = ''; isBrideMember = true"
                label="Bukan Anggota"
              />
            </div>
            <div class="text-end w-full text-sm italic mt-1">
              <small>Click tombol untuk memilih anggota atau bukan anggota</small>
            </div>
          </div>

          <!-- Groom -->
          <div>
            <label class="font-medium text-sm mb-2 block">
              Suami 
              <span :hidden="isGroomMember">(Bukan Anggota)</span>
            </label>
            <div v-if="isGroomMember" class="flex gap-2 items-center">
              <UInputMenu
                v-model="form.groom"
                :items="memberOptions"
                :loading="loading"
                @change="form.groom_name = form.groom.label"
                placeholder="Pilih anggota (kalau suami anggota)"
                class="w-full"
              />

              <UButton
                type="button"
                color="primary"
                variant="outline"
                @click="form.groom = { label: '', value: 0 }; form.groom_name = ''; isGroomMember = false"
                label="Anggota"
              />
            </div>

            <div v-else class="flex gap-2 items-center">
              <UInput
                v-model="form.groom_name"
                type="text"
                class="w-full"
                placeholder="Nama suami jika orang luar"
              />
              <UButton
                type="button"
                color="primary"
                variant="outline"
                @click="form.groom = { label: '', value: 0 }; form.groom_name = ''; isGroomMember = true"
                label="Bukan Anggota"
              />
            </div>

            <div class="text-end w-full text-sm italic mt-1">
              <small>Click tombol untuk memilih anggota atau bukan anggota</small>
            </div>
          </div>
        </div>

        <!-- Date + Venue -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="font-semibold text-sm mb-2 block">Tanggal Pemberkatan <span class="text-red-500">*</span></label>
            <UInput v-model="form.date" type="date" class="w-full" required />
          </div>
          <div>
            <label class="font-semibold text-sm mb-2 block">Lokasi Pemberkatan <span class="text-red-500">*</span></label>
            <UInput
              v-model="form.venue"
              type="text"
              placeholder="Gereja / Lokasi"
              class="w-full"
              required
            />
          </div>
        </div>

        <!-- Priest -->
        <div>
          <label class="font-medium text-sm mb-2 block">
            Pelayan Pemberkatan
            <span :hidden="isPriestMember">(Bukan Anggota)</span>
          </label>
          <div v-if="isPriestMember" class="flex gap-2 items-center">
            <UInputMenu
              v-model="form.priest"
              :items="memberOptions"
              :loading="loading"
              @change="form.priest_name = form.priest.label"
              placeholder="Pilih pelayan (kalau anggota)"
              class="w-full"
            />
            <UButton
              type="button"
              color="primary"
              variant="outline"
              @click="form.priest = { label: '', value: 0 }; form.priest_name = ''; isPriestMember = false"
              label="Anggota"
            />
          </div>
          <div v-else class="flex gap-2 items-center">
            <UInput
              v-model="form.priest_name"
              type="text"
              placeholder="Nama pelayan jika orang luar"
              class="w-full"
            />

            <UButton
              type="button"
              color="primary"
              variant="outline"
              @click="form.priest = { label: '', value: 0 }; form.priest_name = ''; isPriestMember = true"
              label="Bukan Anggota"
            />
          </div>
          <div class="text-end w-full text-sm italic mt-1">
            <small>Click tombol untuk memilih anggota atau bukan anggota</small>
          </div>
        </div>


        <!-- Status -->
        <div>
          <label class="font-medium text-sm mb-2 block">Status Pernikahan</label>
          <USelect
            v-model.number="form.is_active"
            :items="[
              { label: 'Pasangan Saat Ini', value: 1 },
              { label: 'Cerai Hidup / Cerai Mati', value: 0 },
            ]"
            class="w-full"
          />
        </div>

        <!-- Error Message -->
        <div v-if="serverError" class="text-red-500 text-sm whitespace-pre-wrap border border-red-400 p-3 rounded">
          {{ serverError }}
        </div>

        <!-- Action Buttons -->
        <div class="flex gap-3 pt-2 justify-end">
          <UButton color="neutral" variant="ghost" icon="i-heroicons-x-mark" label="Batal"
            @click="router.push('/marriages')" />
          <UButton type="submit" :loading="saving" :disabled="saving" color="primary"
            icon="i-heroicons-check-circle" :label="saving ? 'Menyimpan...' : 'Simpan'" />
        </div>
      </form>
    </UCard>
  </div>
</template>
