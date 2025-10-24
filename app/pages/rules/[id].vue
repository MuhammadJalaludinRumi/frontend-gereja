<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useRules } from '~/composables/useRules'
import { useRoles } from '~/composables/useRoles'
import { useAcls } from '~/composables/useAcls'

const route = useRoute()
const router = useRouter()

// composables
const { fetchById: getRule, update: updateRule } = useRules()
const { roles, fetchAll: fetchRoles } = useRoles()
const { acls, fetchAll: fetchAcls } = useAcls()

// form
const form = ref({
  role_id: null as number | null,
  acl_id: null as number | null,
  permission: false as boolean,
})

const saving = ref(false)
const error = ref<string | null>(null)

// load roles, ACLs, dan data rule
onMounted(async () => {
  try {
    await fetchRoles()
    await fetchAcls()

    const id = route.params.id as string
    const data = await getRule(Number(id))
    if (data) {
      form.value.role_id = data.role_id
      form.value.acl_id = data.acl_id
      form.value.permission = data.permission
    }
  } catch (err) {
    console.error('Gagal load data:', err)
    error.value = 'Gagal memuat data rule'
  }
})

// submit update
const update = async () => {
  if (!form.value.role_id || !form.value.acl_id) {
    error.value = 'Role dan ACL wajib dipilih'
    return
  }

  saving.value = true
  try {
    await updateRule(route.params.id as string, {
      role_id: form.value.role_id,
      acl_id: form.value.acl_id,
      permission: form.value.permission,
    })
    router.push('/rules')
  } catch (err) {
    console.error(err)
    error.value = 'Gagal update rule'
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <div class="p-6 w-full max-w-md mx-auto">
    <h1 class="text-2xl font-bold mb-6">Edit Rule</h1>

    <form @submit.prevent="update" class="space-y-4">
      <!-- Role -->
      <div>
        <label class="block mb-1 font-medium">Role</label>
        <select v-model="form.role_id" class="w-full p-2 border border-gray-300 rounded">
          <option disabled value="">Pilih Role</option>
          <option v-for="role in roles" :key="role.id" :value="role.id">{{ role.name }}</option>
        </select>
      </div>

      <!-- ACL -->
      <div>
        <label class="block mb-1 font-medium">ACL</label>
        <select v-model="form.acl_id" class="w-full p-2 border border-gray-300 rounded">
          <option disabled value="">Pilih ACL</option>
          <option v-for="acl in acls" :key="acl.id" :value="acl.id">{{ acl.name }}</option>
        </select>
      </div>

      <!-- Permission -->
      <div>
        <label class="block mb-1 font-medium">Permission</label>
        <select v-model="form.permission" class="w-full p-2 border border-gray-300 rounded">
          <option :value="true">Yes</option>
          <option :value="false">No</option>
        </select>
      </div>

      <!-- Buttons -->
      <div class="flex gap-3">
        <UButton type="submit" :loading="saving" color="primary" label="Update" />
        <UButton color="gray" variant="soft" label="Batal" @click="router.push('/rules')" />
      </div>

      <!-- Error -->
      <p v-if="error" class="text-red-500 mt-2">{{ error }}</p>
    </form>
  </div>
</template>
