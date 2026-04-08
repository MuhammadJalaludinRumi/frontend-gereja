<script setup lang="ts">
const props = withDefaults(defineProps<{
  modelValue: UserAuthorityForm
  data?: UserAuthority | null
  saving?: boolean
  error?: string | null
  isEdit?: boolean
}>(), {
  saving: false,
  error: null,
  isEdit: false
})

const { roles, fetchAll: fetchRoles, loading: loadingRoles } = useRoles()

const selectedRole = ref<SelectOption>({
  value: 0,
  label: '',
})
const selectedUser = ref<SelectOption>({
  value: 0,
  label: '',
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: UserAuthorityForm): void,
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

watch(
  () => props.modelValue,
  (val) => {
    form.value = { ...val }
  },
  { deep: true }
)

watch(
  [() => props.data, () => props.isEdit],
  ([data, isEdit]) => {
    if (!data || !isEdit) return

    const ua = data as UserAuthority
    selectedUser.value = {
      value: ua.user_id,
      label: ua.user.name
    }
    selectedRole.value = {
      value: ua.role_id,
      label: ua.role.name
    }
  },
  { immediate: true }
)

const submit = () => {
  form.value.role_id = selectedRole.value.value ?? 0
  form.value.user_id = selectedUser.value.value ?? 0
  
  const isValid = Object.entries(form.value).every(([key, value]) => {
    if (typeof value === 'string') return value.trim() !== ''
    return value !== null && value !== undefined && value !== 0
  })

  if (!isValid) {
    formError.value = "Semua field harus diisi."
    return
  }

  emit("submit")
}

onMounted(fetchRoles)
</script>

<template>
  <form @submit.prevent="submit" class="space-y-4">

    <div>
      <label class="block mb-2 text-sm font-medium">
        User <Mandatory />
      </label>

      <DropdownUser 
        v-model="selectedUser"
        :disabled="props.isEdit"
      />
    </div>

    <div>
      <label class="block mb-2 text-sm font-medium">
        Role <Mandatory />
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
        :label="saving ? 'Menyimpan...' : 'Simpan Otoritas Pengguna'"
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