<script setup lang="ts">
definePageMeta({
  middleware: ['role'],
  roles: [1]
})

const router = useRouter()
const { create, saving, error } = useOrganizations()

const form = reactive<OrganizationForm>({
  name: '',
  abbreviation: '',
  address: '',
  city: '' as string | number, // backend mungkin expect string
  latitude: 0,
  longitude: 0,
  phone: '',
  email: '',
  group_id: '' as string | number, // backend mungkin expect string
  website: '',
  founded: '',
  legal: '',
})

const submit = async () => {
  await create(objectToFormData(form))
  router.push("/organizations")
}

const cancel = () => {
  router.push("/organizations")
}
</script>

<template>
  <DefaultForm title="Tambah Organisasi">
    <FormOrganization 
      v-model="form"
      :saving="saving"
      :error="error"
      @submit="submit"
      @cancel="cancel"
    />
  </DefaultForm>
</template>
