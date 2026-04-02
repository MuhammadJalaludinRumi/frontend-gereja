<script setup lang="ts">
definePageMeta({
  middleware: ['role'],
  roles: [1]
})

const route = useRoute()
const router = useRouter()

const { invoice, fetchById, update, saving, loading, error } = useInvoices()

const form = ref<InvoiceForm>({
  organization_id: 0,
  date: '',
  current_expiry: '',
  new_expiry: '',
  total: 0
})

onMounted(async () => {
  const id = Number(route.params.id)
  if (id) await fetchById(id)
})

watch(invoice, (invoice) => {
  if (!invoice) return

  form.value = {
    organization_id: invoice.organization_id,
    date: $formatDateForInput(invoice.date),
    current_expiry: $formatDateForInput(invoice.current_expiry),
    new_expiry: $formatDateForInput(invoice.new_expiry),
    total: Number(invoice.total)
  }
})

const submit = async () => {
  await update(Number(route.params.id), form.value)

  router.push('/invoices')
}

const cancel = () => {
  router.push('/invoices')
}

</script>


<template>
  <DefaultForm title="Edit Invoice" :loading="loading">
    <FormInvoice 
      v-model="form"
      :saving="saving"
      :error="error"
      @submit="submit"
      @cancel="cancel"
    />

    <div class="text-sm text-end w-full mt-3">
      <p>
        Note: Pastikan tanggal expiry baru sesuai dengan periode yang diinginkan. Perubahan akan langsung tersimpan di sistem.
      </p>
    </div>
  </DefaultForm>


</template>
