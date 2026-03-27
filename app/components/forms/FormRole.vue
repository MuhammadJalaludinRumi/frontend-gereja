<script setup lang="ts">
const props = withDefaults(defineProps<{
  modelValue: RoleForm
  saving?: boolean
  error?: string | null
}>(), {
  saving: false,
  error: null,
})

const { organizations, fetchAll, loading } = useOrganizations()
const selectedOrganization = ref<{ label: string; value: number }>({
  value: 0,
  label: '',
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: RoleForm): void,
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
  if (!selectedOrganization.value.value || !form.value.name.trim()) {
    formError.value = "Semua field harus diisi."
    return
  }

  form.value.organization_id = selectedOrganization.value.value ?? 0

  emit('submit')
}

const organizationOptions = computed(() => 
  organizations.value.map((organization) => ({
    value: organization.id,
    label: organization.name
  }))
)

watch(
  [() => organizations.value, () => form.value.organization_id],
  ([organizationsVal, organizationId]) => {
    if (!organizationsVal.length || !organizationId ) return

    const found = organizationsVal.find(r => r.id === organizationId)

    if (found) {
      selectedOrganization.value = {
        value: Number(found.id),
        label: found.name
      }
    }
  },
  { immediate: true }
)

onMounted(fetchAll)
</script>

<template>
  <form @submit.prevent="submit" class="space-y-6">
    <div>
      <label class="block mb-2 text-sm font-semibold">
        Organisasi <Mandatory/>
      </label>
      <UInputMenu 
        v-model="selectedOrganization"
        :items="organizationOptions"
        :loading="loading"
        class="w-full"
        placeholder="Pilih Organisasi"
        required
      >
        <template #empty>
          Tidak ada data Organisasi
        </template>
      </UInputMenu>
    </div>

    <div>
      <label class="block mb-2 text-sm font-semibold">
        Nama Role <Mandatory/>
      </label>
      <UInput 
        v-model="form.name" 
        type="text" 
        placeholder="Masukkan nama Role" 
        class="w-full" 
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
        :label="saving ? 'Menyimpan...' : 'Simpan Role'"
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