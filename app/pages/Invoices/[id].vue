<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useInvoices, type Invoice } from '~/composables/useInvoices'
import { useRoute, useRouter } from '#app'
import { useApiUrl } from '~/composables/useApiUrl'

const route = useRoute()
const router = useRouter()
const apiBase = useApiUrl()
const { update } = useInvoices() // ✅ sesuaikan sama fungsi di useInvoices.ts

const form = ref<Invoice>({
  organization_id: 0,
  date: '',
  current_expiry: '',
  new_expiry: '',
  total: 0
})

const loading = ref(true)
const saving = ref(false)
const serverError = ref<string | null>(null)
const organizationName = ref('')

// ambil cookie dan header sesuai logic di useInvoices
const getHeaders = () => {
  const xsrfToken = useCookie('XSRF-TOKEN')
  const token = useCookie('token')
  const headers: Record<string, string> = {
    Accept: 'application/json',
    'Content-Type': 'application/json'
  }

  if (token.value) headers['Authorization'] = `Bearer ${token.value}`
  if (xsrfToken.value) headers['X-XSRF-TOKEN'] = xsrfToken.value
  return headers
}

// fetch data invoice
const fetchInvoice = async () => {
  try {
    const res = await $fetch<Invoice>(`/invoices/${route.params.id}`, {
      baseURL: apiBase,
      headers: getHeaders(),
      credentials: 'include'
    })

    form.value = {
      organization_id: res.organization_id,
      date: res.date?.replace(' ', 'T') || '',
      current_expiry: res.current_expiry?.replace(' ', 'T') || '',
      new_expiry: res.new_expiry?.replace(' ', 'T') || '',
      total: res.total
    }

    // ambil nama organization
    try {
      const org = await $fetch(`/organizations/${res.organization_id}`, {
        baseURL: apiBase,
        headers: getHeaders(),
        credentials: 'include'
      })
      organizationName.value = org?.name || `Org #${res.organization_id}`
    } catch {
      organizationName.value = `Org #${res.organization_id}`
    }
  } catch (err) {
    console.error('Fetch invoice error:', err)
    serverError.value = 'Gagal memuat data invoice.'
    router.push('/invoices')
  } finally {
    loading.value = false
  }
}

onMounted(fetchInvoice)

const submit = async () => {
  serverError.value = null
  saving.value = true
  try {
    await update(Number(route.params.id), form.value)
    router.push('/invoices')
  } catch (err: any) {
    console.error('Submit error:', err)
    serverError.value = err.message || 'Gagal memperbarui invoice.'
  } finally {
    saving.value = false
  }
}
</script>


<template>
  <div
    class="p-6 w-full overflow-hidden"
    style="background: var(--ui-bg); color: var(--ui-text);"
  >
    <!-- Header -->
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold" style="color: var(--ui-text-highlighted);">
        Edit Invoice #{{ route.params.id }}
      </h1>
      <UButton
        to="/invoices"
        icon="i-heroicons-arrow-left"
        color="gray"
        variant="soft"
        label="Back"
      />
    </div>

    <!-- Loading -->
    <div v-if="loading" class="text-sm text-gray-400 mb-4">Loading data invoice...</div>

    <!-- Form Card -->
    <UCard v-else :ui="{ body: { padding: 'p-6' } }">
      <form @submit.prevent="submit" class="space-y-6">
        <!-- Organization Name -->
        <div>
          <label
            class="block mb-2 text-sm font-semibold"
            style="color: var(--ui-text-highlighted);"
          >
            Organization
          </label>
          <input
            type="text"
            :value="organizationName"
            readonly
            class="w-full px-3 py-2 text-sm rounded-lg cursor-not-allowed"
            style="background: var(--ui-bg-muted); border: 1px solid var(--ui-border); color: var(--ui-text-dimmed);"
          />
        </div>

        <!-- Invoice Date -->
        <div>
          <label
            class="block mb-2 text-sm font-semibold"
            style="color: var(--ui-text-highlighted);"
          >
            Invoice Date
          </label>
          <input
            v-model="form.date"
            type="datetime-local"
            class="w-full px-3 py-2 text-sm rounded-lg"
            style="background: var(--ui-bg); border: 1px solid var(--ui-border); color: var(--ui-text);"
          />
        </div>

        <!-- Expiry Dates -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label
              class="block mb-2 text-sm font-semibold"
              style="color: var(--ui-text-highlighted);"
            >
              Current Expiry
            </label>
            <input
              v-model="form.current_expiry"
              type="datetime-local"
              class="w-full px-3 py-2 text-sm rounded-lg"
              style="background: var(--ui-bg); border: 1px solid var(--ui-border); color: var(--ui-text);"
            />
          </div>
          <div>
            <label
              class="block mb-2 text-sm font-semibold"
              style="color: var(--ui-text-highlighted);"
            >
              New Expiry
            </label>
            <input
              v-model="form.new_expiry"
              type="datetime-local"
              class="w-full px-3 py-2 text-sm rounded-lg"
              style="background: var(--ui-bg); border: 1px solid var(--ui-border); color: var(--ui-text);"
            />
          </div>
        </div>

        <!-- Total -->
        <div>
          <label
            class="block mb-2 text-sm font-semibold"
            style="color: var(--ui-text-highlighted);"
          >
            Total (Rp)
          </label>
          <input
            v-model.number="form.total"
            type="number"
            step="0.01"
            min="0"
            placeholder="Masukkan total"
            class="w-full px-3 py-2 text-sm rounded-lg"
            style="background: var(--ui-bg); border: 1px solid var(--ui-border); color: var(--ui-text);"
          />
        </div>

        <!-- Error -->
        <div
          v-if="serverError"
          class="px-4 py-3 rounded-lg text-sm"
          style="background: rgba(239,68,68,0.1); border: 1px solid rgba(239,68,68,0.3); color: #ef4444;"
        >
          {{ serverError }}
        </div>

        <!-- Buttons -->
        <div class="flex items-center gap-3 pt-2">
          <UButton
            type="submit"
            :loading="saving"
            :disabled="saving"
            color="primary"
            icon="i-heroicons-check-circle"
            :label="saving ? 'Updating...' : 'Update Invoice'"
          />
          <UButton
            color="gray"
            variant="soft"
            icon="i-heroicons-x-mark"
            label="Cancel"
            @click="router.push('/invoices')"
          />
        </div>
      </form>
    </UCard>

    <!-- Info Card -->
    <UCard class="mt-6" :ui="{ body: { padding: 'p-4' } }">
      <div class="flex items-start gap-3">
        <div class="text-sm" style="color: var(--ui-text-dimmed);">
          <p class="font-semibold mb-1" style="color: var(--ui-text);">Note:</p>
          <p>
            Pastikan tanggal expiry baru sesuai dengan periode yang diinginkan. Perubahan akan langsung tersimpan di sistem.
          </p>
        </div>
      </div>
    </UCard>
  </div>
</template>

<style scoped>
input:focus {
  outline: none;
  border-color: var(--ui-primary);
}
</style>
