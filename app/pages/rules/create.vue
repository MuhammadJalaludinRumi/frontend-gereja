<script setup lang="ts">
definePageMeta({
  middleware: ['role'],
  roles: [1, 4]
})

import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useRules } from '~/composables/useRules'
import { useRoles } from '~/composables/useRoles'
import { useAcls } from '~/composables/useAcls'

const router = useRouter()

// composables
const { create: createRule } = useRules()
const { roles, fetchAll: fetchRoles } = useRoles()
const { acls, fetchAll: fetchAcls } = useAcls()

// form reactive
const form = ref({
  role_id: null as number | null,
  acl_id: null as number | null,
  permission: true as boolean,
})

const saving = ref(false)
const error = ref<string | null>(null)

// load roles & acls saat mounted
onMounted(async () => {
  try {
    await fetchRoles()
    await fetchAcls()
  } catch (err) {
    console.error('Gagal load roles atau ACLs:', err)
  }
})

// submit form
const save = async () => {
  error.value = null
  if (!form.value.role_id || !form.value.acl_id) {
    error.value = 'Role dan ACL wajib dipilih'
    return
  }

  saving.value = true
  try {
    await createRule({
      role_id: form.value.role_id,
      acl_id: form.value.acl_id,
      permission: form.value.permission,
    })
    router.push('/rules')
  } catch (err) {
    console.error(err)
    error.value = 'Gagal menyimpan rule'
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <div class="p-6 w-full max-w-md mx-auto">
    <h1 class="text-2xl font-bold mb-6">Tambah Rule Baru</h1>

    <form @submit.prevent="save" class="space-y-4">
      <!-- Role Select -->
      <div>
        <label class="block mb-1 font-medium">Role</label>
        <select v-model="form.role_id" class="w-full p-2 border border-gray-300 rounded">
          <option disabled value="">Pilih Role</option>
          <option v-for="role in roles" :key="role.id" :value="role.id">{{ role.name }}</option>
        </select>
      </div>

      <!-- ACL Select -->
      <div>
        <label class="block mb-1 font-medium">ACL</label>
        <select v-model="form.acl_id" class="w-full p-2 border border-gray-300 rounded">
          <option disabled value="">Pilih ACL</option>
          <option v-for="acl in acls" :key="acl.id" :value="acl.id">{{ acl.name }}</option>
        </select>
      </div>

      <!-- Permission Select -->
      <div>
        <label class="block mb-1 font-medium">Permission</label>
        <select v-model="form.permission" class="w-full p-2 border border-gray-300 rounded">
          <option :value="true">Yes</option>
          <option :value="false">No</option>
        </select>
      </div>

      <!-- Buttons -->
      <div class="flex gap-3">
        <UButton type="submit" :loading="saving" color="primary" label="Simpan" />
        <UButton color="gray" variant="soft" label="Batal" @click="router.push('/rules')" />
      </div>

      <!-- Error -->
      <p v-if="error" class="text-red-500 mt-3">{{ error }}</p>
    </form>
  </div>
</template>
