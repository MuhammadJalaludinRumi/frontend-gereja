<script setup lang="ts">
definePageMeta({
  middleware: ['role'],
  roles: [1]
})

const router = useRouter()
const { create, saving, error } = useOrganizationLicenses()

const form = ref<OrganizationLicenseForm>({
  organization_id: 0,
  license_id: 0,
  is_active: true,
  max_member: 0,
  expiry: ''
})

const submit = async () => {
  await create(form.value)
  router.push('/organizationLicense')
}

const cancel = () => {
  router.push('/organizationLicense')
}

</script>

<template>
  <DefaultForm title="Tambah Lisensi Organisasi">
    <FormOrganizationLicense 
      v-model="form"
      :saving="saving"
      :error="error"
      @submit="submit"
      @cancel="cancel"
    />
  </DefaultForm>
</template>
