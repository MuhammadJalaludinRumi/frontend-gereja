<script setup lang="ts">
definePageMeta({
  middleware: ['role'],
  roles: [1, 4]
})

import { reactive, ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useRoles } from '~/composables/useRoles'
import { useOrganizations } from '~/composables/useOrganizations'

const router = useRouter()
const { create: createRole, fetchAll: fetchRoles, loading: rolesLoading, error: rolesError } = useRoles()
const { organizations, fetchAll: fetchOrganizations, loading: orgsLoading, error: orgsError } = useOrganizations()

const form = reactive({
  organization_id: null as number | null,
  name: ''
})

const saving = ref(false)
const serverError = ref<string | null>(null)

// ambil data organizations saat mounted
onMounted(async () => {
  await fetchOrganizations()
})

// submit form
const save = async () => {
  serverError.value = null

  if (!form.organization_id || !form.name.trim()) {
    serverError.value = 'Organization dan Nama Role wajib diisi.'
    return
  }

  saving.value = true
  try {
    await createRole({
      organization_id: Number(form.organization_id),
      name: form.name.trim()
    })
    await fetchRoles() // refresh list role setelah create
    router.push('/roles')
  } catch (err: any) {
    console.error('create failed', err)
    serverError.value = err.message || 'Server error'
  } finally {
    saving.value = false
  }
}

// watch error dari composable
watch([rolesError, orgsError], ([rErr, oErr]) => {
  if (rErr) serverError.value = rErr
  if (oErr) serverError.value = oErr
})
</script>

<template>
  <div
    class="p-6 w-full overflow-hidden"
    style="background: var(--ui-bg); color: var(--ui-text);"
  >
    <!-- Header -->
    <div class="flex justify-between items-center mb-6">
      <h1
        class="text-2xl font-bold"
        style="color: var(--ui-text-highlighted);"
      >
        Tambah Role
      </h1>
      <UButton
        to="/roles"
        icon="i-heroicons-arrow-left"
        color="gray"
        variant="soft"
        label="Back"
      />
    </div>

    <!-- Loading -->
    <div v-if="loading" class="mb-4 text-sm text-gray-400">Loading...</div>

    <!-- Form Card -->
    <UCard v-else :ui="{ body: { padding: 'p-6' } }">
      <form @submit.prevent="save" class="space-y-6">
        <!-- Organization Select -->
        <div>
          <label
            class="block mb-2 text-sm font-semibold"
            style="color: var(--ui-text-highlighted);"
          >
            Organization
          </label>
          <select
            v-model.number="form.organization_id"
            required
            class="w-full px-3 py-2 text-sm rounded-lg transition-colors"
            style="background: var(--ui-bg); border: 1px solid var(--ui-border); color: var(--ui-text);"
          >
            <option value="" disabled>Pilih Organization</option>
            <option
              v-for="org in organizations"
              :key="org.id"
              :value="org.id"
            >
              {{ org.name }}
            </option>
          </select>
        </div>

        <!-- Role Name -->
        <div>
          <label
            class="block mb-2 text-sm font-semibold"
            style="color: var(--ui-text-highlighted);"
          >
            Role Name
          </label>
          <input
            v-model="form.name"
            type="text"
            placeholder="Nama Role"
            class="w-full px-3 py-2 text-sm rounded-lg transition-colors"
            style="background: var(--ui-bg); border: 1px solid var(--ui-border); color: var(--ui-text);"
          />
        </div>

        <!-- Error -->
        <div
          v-if="serverError"
          class="px-4 py-3 rounded-lg text-sm"
          style="background: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.3); color: #ef4444;"
        >
          {{ serverError }}
        </div>

        <!-- Action Buttons -->
        <div class="flex items-center gap-3 pt-2">
          <UButton
            type="submit"
            :loading="saving"
            :disabled="saving"
            color="primary"
            icon="i-heroicons-check-circle"
            :label="saving ? 'Saving...' : 'Save'"
          />
          <UButton
            color="gray"
            variant="soft"
            icon="i-heroicons-x-mark"
            label="Cancel"
            @click="router.push('/roles')"
          />
        </div>
      </form>
    </UCard>
  </div>
</template>

<style scoped>
select:focus, input:focus {
  outline: none;
  border-color: var(--ui-primary);
}
</style>
