<script setup lang="ts">
definePageMeta({
  middleware: ['role'],
  roles: [1]
})

import { reactive, ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUsers } from '~/composables/useUsers'
import { useRoles } from '~/composables/useRoles'
import { useToast, useCookie } from '#imports'
import { useApiUrl } from '~/composables/useApiUrl'

const route = useRoute()
const router = useRouter()
const toast = useToast()

// composables
const { updateUser } = useUsers()
const { fetchAll: fetchRoles, roles, loading: rolesLoading, error: rolesError } = useRoles()

// form
const form = reactive({
  id: null as number | null,
  username: '' as string,
  password: '' as string,
  name: '' as string,
  is_active: 1 as number,
  role_id: null as number | null
})

const loading = ref(false)
const serverError = ref<string | null>(null)

const selectedRole = computed(() => {
  return roles.value.find(r => r.id === form.role_id)
})

// load user data + roles
onMounted(async () => {
  try {
    const apiBase = useApiUrl()
    const token = useCookie('token').value
    const id = Number(route.params.id)

    const res = await $fetch(`${apiBase}/users/${id}`, {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`
      },
      credentials: 'include'
    })

    form.id = res.id
    form.username = res.username
    form.name = res.name
    form.is_active = res.is_active
    form.role_id = res.role_id

    await fetchRoles()
  } catch (err) {
    console.error('Gagal load user:', err)
    serverError.value = 'Gagal memuat data user atau role.'
  }
})

// update data
const updateData = async () => {
  if (!form.username || !form.name) {
    serverError.value = 'Username dan nama wajib diisi.'
    return
  }

  loading.value = true
  serverError.value = null
  try {
    await updateUser(Number(route.params.id), form)

    toast.add({
      title: 'Berhasil!',
      description: 'Data user berhasil diperbarui.',
      color: 'green'
    })

    router.push('/users')
  } catch (err: any) {
    console.error('Gagal update user:', err)
    serverError.value = err.message || 'Gagal memperbarui user.'
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
        Edit User
      </h1>
      <UButton to="/users" icon="i-heroicons-arrow-left" color="gray" variant="soft" label="Back" />
    </div>

    <!-- Loading -->
    <div v-if="rolesLoading" class="mb-4 text-sm text-gray-400">Loading...</div>

    <!-- Form Card -->
    <UCard v-else :ui="{ body: { padding: 'p-6' } }">
      <form @submit.prevent="updateData" class="space-y-6">
        <!-- Username -->
        <div>
          <label class="block mb-2 text-sm font-semibold" style="color: var(--ui-text-highlighted);">
            Username
          </label>
          <input v-model="form.username" type="text"
            class="w-full px-3 py-2 text-sm rounded-lg"
            style="background: var(--ui-bg); border: 1px solid var(--ui-border); color: var(--ui-text);" />
        </div>

        <!-- Password -->
        <div>
          <label class="block mb-2 text-sm font-semibold" style="color: var(--ui-text-highlighted);">
            Password Baru (Opsional)
          </label>
          <input v-model="form.password" type="password"
            placeholder="Kosongkan jika tidak ingin ubah"
            class="w-full px-3 py-2 text-sm rounded-lg"
            style="background: var(--ui-bg); border: 1px solid var(--ui-border); color: var(--ui-text);" />
        </div>

        <!-- Nama -->
        <div>
          <label class="block mb-2 text-sm font-semibold" style="color: var(--ui-text-highlighted);">
            Nama Lengkap
          </label>
          <input v-model="form.name" type="text"
            class="w-full px-3 py-2 text-sm rounded-lg"
            style="background: var(--ui-bg); border: 1px solid var(--ui-border); color: var(--ui-text);" />
        </div>

        <!-- Role -->
        <div>
          <label class="block mb-2 text-sm font-semibold" style="color: var(--ui-text-highlighted);">
            Role
          </label>
          <select v-model.number="form.role_id" required
            class="w-full px-3 py-2 text-sm rounded-lg transition-colors"
            style="background: var(--ui-bg); border: 1px solid var(--ui-border); color: var(--ui-text);">
            <option value="" disabled>Pilih Role</option>
            <option v-for="role in roles" :key="role.id" :value="role.id">
              {{ role.name }}
            </option>
          </select>
        </div>

        <!-- Selected Role Badge -->
        <div v-if="selectedRole" class="flex items-center gap-2">
          <span class="text-sm" style="color: var(--ui-text-dimmed);">Selected:</span>
          <UBadge color="primary" variant="soft">
            {{ selectedRole.name }}
          </UBadge>
        </div>

        <!-- Status -->
        <div>
          <label class="block mb-2 text-sm font-semibold" style="color: var(--ui-text-highlighted);">
            Status
          </label>
          <select v-model.number="form.is_active"
            class="w-full px-3 py-2 text-sm rounded-lg"
            style="background: var(--ui-bg); border: 1px solid var(--ui-border); color: var(--ui-text);">
            <option :value="1">Active</option>
            <option :value="0">Inactive</option>
          </select>
        </div>

        <!-- Error Alert -->
        <div v-if="serverError" class="px-4 py-3 rounded-lg text-sm"
          style="background: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.3); color: #ef4444;">
          {{ serverError }}
        </div>

        <!-- Action Buttons -->
        <div class="flex items-center gap-3 pt-2">
          <UButton type="submit" :loading="loading" :disabled="loading" color="primary"
            icon="i-heroicons-check-circle"
            :label="loading ? 'Updating...' : 'Update'" />
          <UButton color="gray" variant="soft" icon="i-heroicons-x-mark" label="Cancel"
            @click="router.push('/users')" />
        </div>
      </form>
    </UCard>

    <!-- Info Card -->
    <UCard class="mt-6" :ui="{ body: { padding: 'p-4' } }">
      <div class="flex items-start gap-3">
        <div class="text-sm" style="color: var(--ui-text-dimmed);">
          <p class="font-semibold mb-1" style="color: var(--ui-text);">Note:</p>
          <p>Perubahan pada user akan langsung berlaku pada sistem setelah disimpan.</p>
        </div>
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
