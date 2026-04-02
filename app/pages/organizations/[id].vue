<script setup lang="ts">
definePageMeta({
  middleware: ['role'],
  roles: [1, 4]
})

const route = useRoute()
const router = useRouter()

const { organization, fetchById, update, saving, loading, error } = useOrganizations()

const form = ref<OrganizationForm>({
  name: '',
  abbreviation: '',
  address: '',
  city: '' as string | number,
  latitude: 0,
  longitude: 0,
  phone: '',
  email: '',
  group_id: '' as string | number,
  website: '',
  founded: '',
  legal: '',
})

onMounted(async () => {
  const id = Number(route.params.id)
  if (id) await fetchById(id)
})

watch(organization, (org) => {
  if (!org) return

  form.value.name = org.name
  form.value.abbreviation = org.abbreviation
  form.value.address = org.address
  form.value.city = org.city.id
  form.value.latitude = org.latitude
  form.value.longitude = org.longitude
  form.value.phone = org.phone
  form.value.email = org.email
  form.value.group_id = org.group_id
  form.value.website = org.website
  form.value.founded = $formatDateForInput(org.founded)
  form.value.legal = org.legal
})

const submit = async () => {
  await update(Number(route.params.id), objectToFormData(form.value))
  router.push("/organizations")
}

const cancel = () => {
  router.push("/organizations")
}

</script>

<template>
  <DefaultForm title="Edit Organisasi" :loading="loading">
    <FormOrganization 
      v-model="form"
      :saving="saving"
      :error="error"
      :logo-preview="organization?.logo"
      @submit="submit"
      @cancel="cancel"
      is-edit
    />
  </DefaultForm>
</template>
