<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUsers } from '~/composables/useUsers'
import { useApiUrl } from '~/composables/useApiUrl'
import { useCookie, useRuntimeConfig } from '#app'
import { useToast } from '#imports'

const router = useRouter()
const toast = useToast()
const { createUser } = useUsers()
const apiBase = useApiUrl()

const config = useRuntimeConfig()
const isProd = config.public.sessionSecureCookie === 'true'
const xsrfToken = useCookie('XSRF-TOKEN').value
const token = useCookie('token').value

const getHeaders = () => {
  const headers: Record<string, string> = {
    Accept: 'application/json',
    'Content-Type': 'application/json'
  }
  if (isProd && xsrfToken) headers['X-XSRF-TOKEN'] = xsrfToken
  if (!isProd && token) headers['Authorization'] = `Bearer ${token}`
  return headers
}

const user = ref({
  username: '',
  password: '',
  name: '',
  is_active: true,
  role_id: ''
})

const roles = ref<any[]>([])
const loading = ref(false)
const error = ref<string | null>(null)

onMounted(async () => {
  try {
    const res = await $fetch('/roles', {
      baseURL: apiBase,
      headers: getHeaders(),
      credentials: 'include'
    })
    roles.value = Array.isArray(res) ? res : []
  } catch (err) {
    console.error('Gagal fetch roles:', err)
    error.value = 'Gagal memuat daftar role'
  }
})

const save = async () => {
  error.value = null
  loading.value = true

  try {
    if (!user.value.role_id) {
      error.value = 'Pilih role terlebih dahulu'
      loading.value = false
      return
    }

    const payload = {
      username: user.value.username,
      password: user.value.password,
      name: user.value.name,
      is_active: Boolean(user.value.is_active),
      role_id: Number(user.value.role_id)
    }

    await createUser(payload)
    toast.add({
      title: 'Berhasil!',
      description: 'User baru berhasil ditambahkan.',
      color: 'green'
    })
    router.push('/users')
  } catch (err: any) {
    console.error('Gagal menambahkan user:', err)
    error.value = err?.data?.message || 'Gagal menambahkan user'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="p-6 w-full overflow-hidden" style="background: var(--ui-bg); color: var(--ui-text);">
    <!-- Header -->
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold" style="color: var(--ui-text-highlighted);">
        Tambah Pengguna
      </h1>
      <UButton
        to="/users"
        icon="i-heroicons-arrow-left"
        color="gray"
        variant="soft"
        label="Kembali"
      />
    </div>

    <!-- Form Card -->
    <UCard :ui="{ body: { padding: 'p-6' } }">
      <form @submit.prevent="save" class="space-y-6">
        <!-- Username -->
        <div>
          <label class="block mb-2 text-sm font-semibold" style="color: var(--ui-text-highlighted);">Username</label>
          <input
            v-model="user.username"
            type="text"
            required
            class="w-full px-3 py-2 text-sm rounded-lg"
            style="background: var(--ui-bg); border: 1px solid var(--ui-border); color: var(--ui-text);"
          />
        </div>

        <!-- Password -->
        <div>
          <label class="block mb-2 text-sm font-semibold" style="color: var(--ui-text-highlighted);">Password</label>
          <input
            v-model="user.password"
            type="password"
            required
            class="w-full px-3 py-2 text-sm rounded-lg"
            style="background: var(--ui-bg); border: 1px solid var(--ui-border); color: var(--ui-text);"
          />
        </div>

        <!-- Nama Lengkap -->
        <div>
          <label class="block mb-2 text-sm font-semibold" style="color: var(--ui-text-highlighted);">Nama Lengkap</label>
          <input
            v-model="user.name"
            type="text"
            required
            class="w-full px-3 py-2 text-sm rounded-lg"
            style="background: var(--ui-bg); border: 1px solid var(--ui-border); color: var(--ui-text);"
          />
        </div>

        <!-- Role -->
        <div>
          <label class="block mb-2 text-sm font-semibold" style="color: var(--ui-text-highlighted);">Role</label>
          <select
            v-model="user.role_id"
            required
            class="w-full px-3 py-2 text-sm rounded-lg"
            style="background: var(--ui-bg); border: 1px solid var(--ui-border); color: var(--ui-text);"
            :disabled="roles.length === 0"
          >
            <option value="" disabled>Pilih Role</option>
            <option v-for="role in roles" :key="role.id" :value="role.id">
              {{ role.name }}
            </option>
          </select>
          <p v-if="roles.length === 0" class="text-xs text-gray-400 mt-1">Memuat daftar role...</p>
        </div>

        <!-- Status -->
        <div>
          <label class="block mb-2 text-sm font-semibold" style="color: var(--ui-text-highlighted);">Status</label>
          <select
            v-model="user.is_active"
            class="w-full px-3 py-2 text-sm rounded-lg"
            style="background: var(--ui-bg); border: 1px solid var(--ui-border); color: var(--ui-text);"
          >
            <option :value="true">Active</option>
            <option :value="false">Inactive</option>
          </select>
        </div>

        <!-- Error -->
        <div
          v-if="error"
          class="px-4 py-3 rounded-lg text-sm"
          style="background: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.3); color: #ef4444;"
        >
          {{ error }}
        </div>

        <!-- Action -->
        <div class="flex items-center gap-3 pt-2">
          <UButton
            type="submit"
            :loading="loading"
            :disabled="loading"
            color="primary"
            icon="i-heroicons-check-circle"
            :label="loading ? 'Menyimpan...' : 'Simpan'"
          />
          <UButton
            color="gray"
            variant="soft"
            icon="i-heroicons-x-mark"
            label="Batal"
            @click="router.push('/users')"
          />
        </div>
      </form>
    </UCard>

    <!-- Info -->
    <UCard class="mt-6" :ui="{ body: { padding: 'p-4' } }">
      <div class="text-sm" style="color: var(--ui-text-dimmed);">
        <p class="font-semibold mb-1" style="color: var(--ui-text);">Note:</p>
        <p>User baru akan langsung aktif berdasarkan role dan status yang dipilih.</p>
      </div>
    </UCard>
  </div>
</template>

<style scoped>
select:focus,
input:focus {
  outline: none;
  border-color: var(--ui-primary);
}
</style>
