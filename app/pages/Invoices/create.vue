<script setup lang="ts">
definePageMeta({
  middleware: ['role'],
  roles: [1]
})

const router = useRouter()
const { create, saving, error } = useInvoices()

const form = ref<InvoiceForm>({
  organization_id: 0,
  date: '',
  current_expiry: '',
  new_expiry: '',
  total: 0
})

const submit = async () => {
  await create(form.value)
  router.push("/invoices")
}

const cancel = () => {
  router.push("/invoices")
}
</script>

<template>
  <DefaultForm title="Tambah Invoice">
    <FormInvoice 
      v-model="form"
      :saving="saving"
      @submit="submit"
      @cancel="cancel"
    />
  </DefaultForm>
</template>
