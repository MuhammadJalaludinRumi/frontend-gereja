<script setup lang="ts">
definePageMeta({
  middleware: ['role'],
  roles: [1]
})

const router = useRouter()
const route = useRoute()
const { orgLicense, fetchById, update, loading, saving, error } = useOrganizationLicenses()

const form = ref<OrganizationLicenseForm>({
  organization_id: 0,
  license_id: 0,
  is_active: true,
  max_member: 0,
  expiry: ''
})

watch(
  orgLicense,
  (newVal) => {
    if (newVal) {
      form.value = {
        organization_id: newVal.organization_id,
        license_id: newVal.license_id,
        is_active: Boolean(newVal.is_active),
        max_member: newVal.max_member,
        expiry: $formatDateForInput(newVal.expiry),
      }
    }
  },
  { immediate: true }
)

const submit = async () => {
  if (!orgLicense.value) return

  await update(orgLicense.value.id, form.value)
  router.push('/organizationLicense')
}

onMounted(async () => {
  const id = Number(route.params.id)
  await fetchById(id)
})
</script>

<template>
  <DefaultForm title="Edit Lisensi Organisasi" :loading="loading">
    <FormOrganizationLicense 
      v-model="form"
      :saving="saving"
      :error="error"
      @submit="submit"
      @cancel="router.push('/organizationLicense')"
    />
  </DefaultForm>
</template>
