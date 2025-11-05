<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useProfiles } from '~/composables/useProfiles'

const { profile, fetchProfile, updateProfile, loading, error, successMsg } = useProfiles()

const form = ref({
  name: '',
  username: '',
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const localError = ref('')

onMounted(async () => {
  await fetchProfile()
  if (profile.value) {
    form.value.name = profile.value.name
    form.value.username = profile.value.username
  }
})

const handleSave = async () => {
  localError.value = ''
  successMsg.value = ''

  if (!form.value.oldPassword) {
    localError.value = 'Password lama wajib diisi.'
    return
  }

  if (form.value.newPassword && form.value.newPassword !== form.value.confirmPassword) {
    localError.value = 'Konfirmasi password baru tidak cocok.'
    return
  }

  const payload: Record<string, string> = {
    username: form.value.username,
    old_password: form.value.oldPassword
  }

  if (form.value.newPassword) payload.password = form.value.newPassword

  await updateProfile(payload)
  if (!error.value) {
    form.value.oldPassword = ''
    form.value.newPassword = ''
    form.value.confirmPassword = ''
  }
}
</script>

<template>
  <div class="p-6 max-w-lg mx-auto space-y-6">
    <h1 class="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">
      My Profile
    </h1>

    <UCard :ui="{ body: { padding: 'p-5' } }">
      <div class="space-y-4">
        <!-- Nama -->
        <div>
          <label class="text-sm font-medium">Full Name</label>
          <input
            v-model="form.name"
            disabled
            class="w-full border rounded-lg px-3 py-2 text-sm opacity-70 cursor-not-allowed bg-gray-100 dark:bg-gray-800"
          />
        </div>

        <!-- Username -->
        <div>
          <label class="text-sm font-medium">Username</label>
          <input
            v-model="form.username"
            placeholder="Masukkan username baru..."
            class="w-full border rounded-lg px-3 py-2 text-sm bg-gray-50 dark:bg-gray-900"
          />
        </div>

        <!-- Password lama -->
        <div>
          <label class="text-sm font-medium">Password Lama</label>
          <input
            v-model="form.oldPassword"
            type="password"
            placeholder="Masukkan password lama..."
            class="w-full border rounded-lg px-3 py-2 text-sm bg-gray-50 dark:bg-gray-900"
          />
        </div>

        <!-- Password baru -->
        <div>
          <label class="text-sm font-medium">Password Baru</label>
          <input
            v-model="form.newPassword"
            type="password"
            placeholder="Masukkan password baru..."
            class="w-full border rounded-lg px-3 py-2 text-sm bg-gray-50 dark:bg-gray-900"
          />
        </div>

        <!-- Konfirmasi password baru -->
        <div>
          <label class="text-sm font-medium">Konfirmasi Password Baru</label>
          <input
            v-model="form.confirmPassword"
            type="password"
            placeholder="Ulangi password baru..."
            class="w-full border rounded-lg px-3 py-2 text-sm bg-gray-50 dark:bg-gray-900"
          />
        </div>

        <!-- Alert -->
        <div v-if="localError" class="text-red-500 text-sm font-medium">
          ⚠️ {{ localError }}
        </div>
        <div v-if="error" class="text-red-500 text-sm font-medium">
          ⚠️ {{ error }}
        </div>
        <div v-if="successMsg" class="text-green-500 text-sm font-medium">
          ✅ {{ successMsg }}
        </div>

        <!-- Tombol -->
        <UButton
          color="primary"
          :loading="loading"
          icon="i-heroicons-check-circle"
          label="Simpan Perubahan"
          class="w-full"
          @click="handleSave"
        />
      </div>
    </UCard>
  </div>
</template>
