<script setup lang="ts">

definePageMeta({
  middleware: ['role'],
  roles: [1, 4]
})

const router = useRouter()
const { create, saving } = useAcls()

const form = ref<AclForm>({ name: '' })

const submit = async () => {
  await create(form.value as Acl)
  router.push('/acls')
}

const cancel = () => {
  router.push('/acls')
}
</script>

<template>
  <DefaultForm title="Tambah ACL">
    <FormAcl 
      v-model="form"
      :saving="saving"
      @submit="submit"
      @cancel="cancel"
    />
  </DefaultForm>
</template>
