<script setup lang="ts">
const props = withDefaults(defineProps<{
  modelValue: UserForm
  saving?: boolean
  error?: string | null
  isEdit?: boolean
}>(), {
  saving: false,
  error: null,
  isEdit: false
})

const { roles, fetchAll, loading } = useRoles()
const selectedRole = ref<{ label: string; value: number }>({
  value: 0,
  label: '',
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: UserForm): void,
  (e: 'submit'): void
  (e: 'cancel'): void
}>()

const form = ref({ ...props.modelValue })
const formError = ref<string | null>(null)

watch(
  () => props.modelValue,
  (val) => {
    form.value = { ...val }
  },
  { deep: true }
)

watch(
  form,
  (val) => {
    emit("update:modelValue", val)
  },
  { deep: true }
)

const submit = () => {
  const isValid = Object.entries(form.value).every(([key, value]) => {

    if (key === 'password' && props.isEdit) return true

    if (typeof value === 'string') return value.trim() !== ''
    return value !== null && value !== undefined
  })

  if (!isValid) {
    formError.value = "Semua field harus diisi."
    return
  }

  form.value.role_id = selectedRole.value.value ?? 0

  emit("submit")
}

const roleOptions = computed(() => 
  roles.value.map((role) => ({
    value: role.id,
    label: role.name
  }))
)

watch(
  [() => roles.value, () => form.value.role_id],
  ([rolesVal, roleId]) => {
    if (!rolesVal.length || !roleId || !props.isEdit) return

    const found = rolesVal.find(r => r.id === roleId)

    if (found) {
      selectedRole.value = {
        value: found.id,
        label: found.name
      }
    }
  },
  { immediate: true }
)

onMounted(async () => await fetchAll())
</script>

<template>
  <form @submit.prevent="submit" class="space-y-5">
    <!-- Username -->
    <div>
      <label class="block mb-1 font-medium text-sm">Username <Mandatory /></label>
      <UInput
        v-model="form.username"
        type="text"
        class="w-full"
        autocomplete="new-username"
        required
      />
    </div>

    <!-- Password -->
    <div>
      <label class="block mb-1 font-medium text-sm">Password <span :hidden="!isEdit">Baru (Opsional)</span> <Mandatory :hidden="isEdit"/></label>
      <UInput
        v-model="form.password"
        type="password"
        class="w-full"
        autocomplete="new-password"
        :required="!isEdit"
      />
    </div>

    <!-- Nama Lengkap -->
    <div>
      <label class="block mb-1 font-medium text-sm">Nama Lengkap <Mandatory /></label>
      <UInput
        v-model="form.name"
        type="text"
        class="w-full"
        required
      />
    </div>

    <!-- Role -->
    <div>
      <label class="block mb-1 font-medium text-sm">Role <Mandatory /></label>
      <UInputMenu 
        v-model="selectedRole"
        :items="roleOptions"
        :loading="loading"
        class="w-full"
        placeholder="Pilih Role"
        required
      >
        <template #empty>
          Tidak ada data Role
        </template>
      </UInputMenu>
    </div>

    <!-- Status -->
    <div>
      <label class="block mb-1 font-medium text-sm">Status <Mandatory /></label>
      <USelect 
        v-model="form.is_active"
        :items="[
          { label: 'Aktif', value: true },
          { label: 'Nonaktif', value: false }
        ]"
      />
    </div>

    <!-- Action -->
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
        icon="i-heroicons-check-circle"
        color="primary"
        :loading="saving"
        :disabled="saving"
        :label="saving ? 'Menyimpan...' : 'Simpan User'"
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