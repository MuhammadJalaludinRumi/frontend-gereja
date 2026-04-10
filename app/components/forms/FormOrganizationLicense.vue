<script setup lang="ts">
const props = withDefaults(defineProps<{
  modelValue: OrganizationLicenseForm,
  saving?: boolean,
  error?: string | null,
}>(),{
  saving: false,
  error: null,
})

const { organizations, fetchAll: fetchOrganization, loading: loadOrganization } = useOrganizations()
const { licenses, fetchAll: fetchLicenses, loading: loadLicense } = useLicenses()

const selectedOrganization = ref<SelectOption>({
  value: 0,
  label: ''
})
const selectedLicense = ref<SelectOption>({
  value: 0,
  label: ''
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: OrganizationLicenseForm): void
  (e: 'submit'): void
  (e: 'cancel'): void
}>()

const form = computed({
  get: () => props.modelValue,
  set: (val) => emit("update:modelValue", val)
})
const formError = ref<string | null>(null)

const organizationOptions = computed(() => 
  organizations.value.map((org) => ({
    value: org.id,
    label: org.name
  }))
)

const licenseOptions = computed(() => 
  licenses.value.map((license) => ({
    value: license.id,
    label: license.name,
  }))
)

watch(
  [() => organizations.value, () => form.value.organization_id],
  ([orgVal, orgId]) => {
    if (!orgVal.length || !orgId) return

    const found = orgVal.find(o => o.id === orgId)

    if (found) {
      selectedOrganization.value = {
        value: Number(found.id),
        label: found.name
      }
    }
  },
  { immediate: true }
)

watch(
  [() => licenses.value, () => form.value.license_id],
  ([licenseVal, licenseId]) => {
    if (!licenseVal.length || !licenseId) return

    const found = licenseVal.find(o => o.id === licenseId)

    if (found) {
      selectedLicense.value = {
        value: Number(found.id),
        label: found.name
      }
    }
  },
  { immediate: true }
)

const submit = () => {
  form.value.organization_id = selectedOrganization.value.value
  form.value.license_id = selectedLicense.value.value

  const excludedFields = ['is_active']

  const isValid = Object.entries(form.value).every(([key, value]) => {
    if (excludedFields.includes(key)) return true

    if (typeof value === 'string') return value.trim() !== ''

    return value !== null && value !== undefined && value !== 0
  })

  if (!isValid) {
    formError.value = "Semua field harus diisi."
    return
  }

  emit('submit')
}

onMounted( async () => {
  await fetchOrganization()
  await fetchLicenses()
})
</script>

<template>
  <form @submit.prevent="submit" class="space-y-6">
    <div>
      <Label label="Organisasi" mandatory />
      <UInputMenu 
        v-model="selectedOrganization"
        :items="organizationOptions"
        :loading="loadOrganization"
        class="w-full"
        placeholder="Pilih Organisasi"
        required
      />
    </div>

    <div>
      <Label label="Lisensi" mandatory />
      <UInputMenu
        v-model="selectedLicense"
        :items="licenseOptions"
        :loading="loadLicense"
        class="w-full"
        placeholder="Pilih Lisensi"
        required
      />
    </div>

    <div>
      <Label label="Maks. Anggota" mandatory />

      <UInput 
        v-model="form.max_member"
        type="number"
        placeholder="Masukkan Jumlah Maksimal Anggota" 
        class="w-full" 
        min="0" 
        @input="form.max_member = Math.max(0, Number(form.max_member || 0))" 
        @keydown="['-', '+', '.', ','].includes($event.key) && $event.preventDefault()"
        required 
      />
    </div>

    <div>
      <Label label="Tanggal Kedaluwarsa" mandatory />
      <UInput 
        v-model="form.expiry"
        type="date"
        class="w-full"
        required
      />
    </div>

    <div>
      <UCheckbox v-model="form.is_active" label="Aktif" />
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
        :label="saving ? 'Menyimpan...' : 'Simpan Lisensi Organisasi'"
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