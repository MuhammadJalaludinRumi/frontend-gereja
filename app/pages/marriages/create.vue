<script setup lang="ts">
definePageMeta({
  middleware: ["role"],
  roles: [4],
});

import DropdownMember from '~/components/member/DropdownMember.vue';
import DefaultForm from '~/layouts/default-form.vue';

const router = useRouter();
const { memberSelect, fetchMemberSelect } = useMembers()
const { create } = useMarriages();

const loading = ref({
  bride: false,
  groom: false,
  priest: false,
})

const saving = ref(false);
const serverError = ref<string | null>(null);

const brideMembers = ref<{ label: string, value: number }[]>([])
const groomMembers = ref<{ label: string, value: number }[]>([])
const priestMembers = ref<{ label: string, value: number }[]>([])

const isBrideMember = ref(true);
const isGroomMember = ref(true);
const isPriestMember = ref(true);

// Form reactive
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

const fetchBrideMembers = async (search: string) => {
  if (!search || search.length < 3) {
    memberSelect.value = []
    brideMembers.value = []
    return
  }

  loading.value.bride = true
  try {
    await fetchMemberSelect({ search })
    brideMembers.value = memberSelect.value
  } finally {
    loading.value.bride = false
  }
}
const fetchGroomMembers = async (search: string) => {
  if (!search || search.length < 3) {
    memberSelect.value = []
    groomMembers.value = []
    return
  }

  loading.value.groom = true
  try {
    await fetchMemberSelect({ search })
    groomMembers.value = memberSelect.value
  } finally {
    loading.value.groom = false
  }
}
const fetchPriestMembers = async (search: string) => {
  if (!search || search.length < 3) {
    memberSelect.value = []
    groomMembers.value = []
    return
  }

  loading.value.priest = true
  try {
    await fetchMemberSelect({ search })
    priestMembers.value = memberSelect.value
  } finally {
    loading.value.priest = false
  }
}

// SAVE FUNCTION
const save = async () => {
  serverError.value = null;

  // Validasi wajib date & venue
  if (!form.date || !form.venue) {
    serverError.value = "Tanggal & lokasi wajib diisi.";
    return;
  }
  console.log(form)
  // Validasi tambahan kalau user ga pilih anggota tapi kosong
  if (
    !form.bride_name.trim() ||
    !form.groom_name.trim() ||
    !form.priest_name.trim()
  ) {
    serverError.value = "Nama pengantin & pelayan wajib diisi.";
    return;
  }

  saving.value = true;
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
    };

    await create(payload);
    router.push("/marriages");
  } catch (err: any) {
    console.error(err);
    serverError.value = err?.data
      ? JSON.stringify(err.data, null, 2)
      : err.message;
  } finally {
    saving.value = false;
  }
};
</script>

<template>
  <DefaultForm title="Tambah Pernikahan">
    <form @submit.prevent="save" class="space-y-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <!-- Bride -->
        <div>
          <label class="font-medium text-sm mb-2 block">
            Istri
            <span :hidden="isBrideMember">(Bukan Anggota)</span>
          </label>
          <div v-if="isBrideMember" class="flex gap-2 items-center">
            <DropdownMember
              :member-items="brideMembers"
              :loading="loading.bride"
              :selected="form.bride.value"
              @search="fetchBrideMembers"
              @update:selected-object="(member) => {
                form.bride = member
                form.bride_name = member.label
              }"
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
              @click="form.bride = { label: '', value: 0 }; form.bride_name = ''; isBrideMember = true"
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
            <DropdownMember
              :member-items="groomMembers"
              :loading="loading.groom"
              :selected="form.groom.value"
              @search="fetchGroomMembers"
              @update:selected-object="(member) => {
                form.groom = member
                form.groom_name = member.label
              }"
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
          <label class="font-medium text-sm mb-2 block">
            Tanggal Pemberkatan <span class="text-red-500">*</span>
          </label>
          <UInput v-model="form.date" type="date" class="w-full" required />
        </div>
        <div>
          <label class="font-medium text-sm mb-2 block">
            Lokasi Pemberkatan <span class="text-red-500">*</span>
          </label>
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
          <DropdownMember
            :member-items="priestMembers"
            :loading="loading.priest"
            :selected="form.priest.value"
            @search="fetchPriestMembers"
            @update:selected-object="(member) => {
              form.priest = member
              form.priest_name = member.label
            }"
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
      <div
        v-if="serverError"
        class="text-red-500 text-sm whitespace-pre-wrap border border-red-400 p-3 rounded"
        style="background: rgba(239, 68, 68, 0.1)"
      >
        {{ serverError }}
      </div>

      <!-- Action Buttons -->
      <div class="flex gap-3 pt-2 justify-end">
        <UButton
          color="neutral"
          variant="ghost"
          icon="i-heroicons-x-mark"
          label="Batal"
          @click="router.push('/marriages')"
        />
        <UButton
          type="submit"
          :loading="saving"
          :disabled="saving"
          color="primary"
          icon="i-heroicons-check-circle"
          :label="saving ? 'Menyimpan...' : 'Simpan'"
        />
      </div>
    </form>
  </DefaultForm>
</template>
