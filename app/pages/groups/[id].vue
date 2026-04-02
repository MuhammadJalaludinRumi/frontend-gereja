<script setup lang="ts">
definePageMeta({
  middleware: ['role'],
  roles: [1]
})

const route = useRoute()
const router = useRouter()

const { group, fetchById, update, saving, loading, error } = useGroups()

const form = reactive<GroupForm>({
  name: '',
  address: '',
  city: '' as string | number,
  phone: '',
  email: '',
  website: '',
  founded: '',
  legal: ''
})

onMounted(async () => {
  const id = Number(route.params.id)
  if (id) await fetchById(id)
})

watch(group, (grp) => {
  if (!grp) return

  form.name = grp.name
  form.address = grp.address
  form.city = grp.city.id
  form.phone = grp.phone
  form.email = grp.email
  form.website = grp.website
  form.founded = $formatDateForInput(grp.founded)
  form.legal = grp.legal
  console.log('Group data loaded into form:', form) // Debug log
})

const submit = async () => {
  await update(Number(route.params.id), objectToFormData(form))
  router.push("/groups")
}

const cancel = () => {
  router.push("/groups")
}
</script>

<template>
  <DefaultForm title="Edit Yayasan" :loading="loading" :error="error">
    <FormGroup 
      v-model="form"
      :saving="saving"
      :error="error"
      :logo-preview="group?.logo"
      @submit="submit"
      @cancel="cancel"
      is-edit
    />
  </DefaultForm>
</template>
