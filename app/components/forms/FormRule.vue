<script setup lang="ts">
const props = withDefaults(defineProps<{
  modelValue: RuleForm,
  saving?: boolean
  error?: string | null
}>(), {
  saving: false,
  error: null,
})

const { roles, fetchAll: fetchRoles, loading: loadingRoles } = useRoles()
const { acls, fetchAll: fetchAcls, loading: loadingAcls } = useAcls()

const selectedRole = ref<{ label: string; value: number }>({
  value: 0,
  label: '',
})

const selectedAcl = ref<{ label: string; value: number }>({
  value: 0,
  label: '',
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: RuleForm): void
  (e: 'submit'): void
  (e: 'cancel'): void
}>()

const form = computed({
  get: () => props.modelValue,
  set: (val) => emit("update:modelValue", val)
})
const formError = ref<string | null>(null)

const roleOptions = computed(() => 
  roles.value.map((role) => ({
    value: role.id,
    label: role.name
  }))
)

const aclOptions = computed(() => 
  acls.value.map((acl) => ({
    value: acl.id,
    label: acl.name
  }))
)

watch(
  [() => roles.value, () => form.value.role_id],
  ([rolesVal, roleId]) => {
    if (!rolesVal.length || !roleId ) return

    const found = rolesVal.find(r => r.id === roleId)

    if (found) {
      selectedRole.value = {
        value: Number(found.id),
        label: found.name
      }
    }
  },
  { immediate: true }
)

watch(
  [() => acls.value, () => form.value.acl_id],
  ([aclsVal, aclId]) => {
    if (!aclsVal.length || !aclId ) return

    const found = aclsVal.find(r => r.id === aclId)

    if (found) {
      selectedAcl.value = {
        value: Number(found.id),
        label: found.name
      }
    }
  },
  { immediate: true }
)

const submit = () => {
  if (!selectedRole.value.value || !selectedAcl.value.value || form.value.permission === undefined) {
    formError.value = "Semua field harus diisi."
    return
  }

  form.value.role_id = selectedRole.value.value ?? 0
  form.value.acl_id = selectedAcl.value.value ?? 0

  emit('submit')
}

onMounted(async () => {
  await fetchRoles()
  await fetchAcls()
})

</script>

<template>
  <form @submit.prevent="submit" class="space-y-6">
    <div>
      <label class="block mb-2 text-sm font-semibold">
        Role <Mandatory/>
      </label>
      <UInputMenu 
        v-model="selectedRole"
        :items="roleOptions"
        :loading="loadingRoles"
        class="w-full"
        placeholder="Pilih Role"
        required
      >
        <template #empty>
          Tidak ada data Role
        </template>
      </UInputMenu>
    </div>

    <div>
      <label class="block mb-2 text-sm font-semibold">
        ACL <Mandatory/>
      </label>
      <UInputMenu 
        v-model="selectedAcl"
        :items="aclOptions"
        :loading="loadingAcls"
        class="w-full"
        placeholder="Pilih ACL"
        required
      >
        <template #empty>
          Tidak ada data ACL
        </template>
      </UInputMenu>
    </div>

    <div>
      <label class="block mb-2 text-sm font-semibold">
        Permission <Mandatory/>
      </label>
      <USelect 
        v-model="form.permission"
        :items="[
          { value: true, label: 'Ya' },
          { value: false, label: 'Tidak' }
        ]"
        class="w-full"
        placeholder="Pilih Permission"
        required
      />      
    </div>

    <div class="flex justify-end items-center gap-3 pt-4">
      <UButton
        color="neutral"
        variant="ghost"
        icon="i-heroicons-x-mark"
        label="Batal"
        @click="$emit('cancel')"
      />
      <UButton
        type="submit"
        :loading="saving"
        :disabled="saving"
        color="primary"
        icon="i-heroicons-check-circle"
        :label="saving ? 'Menyimpan...' : 'Simpan Rule'"
      />
    </div>

    <!-- Error -->
    <div
      v-if="formError || error"
      class="px-4 py-3 rounded-lg text-sm"
      style="background: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.3); color: #ef4444;"
    >
      {{ formError ?? error }}
    </div>
  </form>
</template>