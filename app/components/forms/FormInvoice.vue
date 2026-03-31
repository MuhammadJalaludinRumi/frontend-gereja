<script setup lang="ts">
const props = withDefaults(defineProps<{
  modelValue: InvoiceForm,
  saving?: boolean
  error?: string | null
}>(), {
  saving: false,
  error: null,
})

const { organizations, fetchAll: fetchOrganizations, loading: loadingOrganizations } = useOrganizations()
const selectedOrganization = ref<{ label: string; value: number }>({
  value: 0,
  label: '',
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: InvoiceForm): void
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

watch(
  [() => organizations.value, () => form.value.organization_id],
  ([orgsVal, orgId]) => {
    if (!orgsVal.length || !orgId ) return

    const found = orgsVal.find(o => o.id === orgId)

    if (found) {
      selectedOrganization.value = {
        value: Number(found.id),
        label: found.name
      }
    }
  },
  { immediate: true }
)

const submit = () => {
  form.value.organization_id = selectedOrganization.value.value

  if (!form.value.organization_id) {
    formError.value = 'Organisasi harus dipilih.'
    return
  }

  if (!form.value.date) {
    formError.value = 'Tanggal Invoice harus diisi.'
    return
  }

  if (form.value.total === null || form.value.total === undefined) {
    formError.value = 'Total Invoice harus diisi.'
    return
  }

  emit('submit')
}

onMounted(fetchOrganizations)

</script>
<template>
  <form @submit.prevent="submit" class="space-y-6">
    <!-- Organization -->
    <div>
      <label class="block mb-2 text-sm font-medium">
        Organisasi <Mandatory />
      </label>
      <UInputMenu 
        v-model="selectedOrganization"
        :items="organizationOptions"
        :loading="loadingOrganizations"
        class="w-full"
        placeholder="Pilih Organisasi"
        required
      >
        <template #empty>
          Tidak ada data Organisasi
        </template>
      </UInputMenu>
    </div>

    <!-- Date -->
    <div>
      <label class="block mb-2 text-sm font-medium">Invoice Date <span class="text-red-500">*</span></label>
      <UInput
        v-model="form.date"
        type="date"
        class="w-full"
      />
    </div>

    <!-- Expiries -->
    <div class="grid md:grid-cols-2 gap-4">
      <div>
        <label class="block mb-2 text-sm font-medium">
          Kadaluarsa Saat Ini
        </label>
        <UInput 
          v-model="form.current_expiry" 
          type="date" 
          class="w-full"
        />
      </div>
      <div>
        <label class="block mb-2 text-sm font-medium">
          Kadaluarsa Baru
        </label>
        <UInput 
          v-model="form.new_expiry" 
          type="date" 
          class="w-full"
        />
      </div>
    </div>

    <!-- Total -->
    <div>
      <label class="block mb-2 text-sm font-medium">
        Total <Mandatory />
      </label>
      <UInput 
        v-model="form.total" 
        placeholder="Masukkan Total Invoice" 
        class="w-full" 
        type="number" 
        min="0" 
        @input="form.total = Math.max(0, Number(form.total || 0))" 
        @keydown="['-', '+', '.', ','].includes($event.key) && $event.preventDefault()"
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
        :label="saving ? 'Menyimpan...' : 'Simpan Invoice'"
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