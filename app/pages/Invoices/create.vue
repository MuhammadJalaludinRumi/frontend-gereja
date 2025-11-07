<script setup lang="ts">
definePageMeta({
  middleware: ['role'],
  roles: [1]
})

import { ref, onMounted, computed } from 'vue'
import { useInvoices } from '~/composables/useInvoices'
import { useRouter } from '#app'
import { useApiUrl } from '~/composables/useApiUrl'
import { useCookie } from '#app'

const router = useRouter()
const apiBase = useApiUrl()
const { create, loading } = useInvoices()

const form = ref({
  organization_id: null as number | null,
  date: '',
  current_expiry: '',
  new_expiry: '',
  total: 0
})

const organizations = ref<any[]>([])
const orgLoading = ref(true)
const saving = ref(false)
const serverError = ref<string | null>(null)

// 🔹 Ambil token / csrf header dari cookie (sama kaya useInvoices)
const getHeaders = (): Record<string, string> => {
  const headers: Record<string, string> = {
    Accept: 'application/json',
    'Content-Type': 'application/json'
  }

  const xsrfToken = useCookie('XSRF-TOKEN')
  const token = useCookie('token')

  // prod pake XSRF, local pake bearer
  const isProd = process.env.NODE_ENV === 'production'

  if (isProd && xsrfToken.value) {
    headers['X-XSRF-TOKEN'] = xsrfToken.value
  } else if (!isProd && token.value) {
    headers['Authorization'] = `Bearer ${token.value}`
  }

  return headers
}

const selectedOrganization = computed(() =>
  organizations.value.find((org: any) => org.id === Number(form.value.organization_id))
)

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(value)

// 🔹 Load daftar organisasi (dengan header auth yang sama)
onMounted(async () => {
  try {
    const res = await $fetch('/organizations', {
      baseURL: apiBase,
      credentials: 'include',
      headers: getHeaders()
    })
    organizations.value = res || []
  } catch (err) {
    console.error(err)
    serverError.value = 'Gagal memuat data organizations (401 Unauthorized)'
  } finally {
    orgLoading.value = false
  }
})

// 🔹 Submit form
const submit = async () => {
  serverError.value = null

  if (!form.value.organization_id) {
    serverError.value = 'Organization wajib dipilih'
    return
  }
  if (!form.value.date) {
    serverError.value = 'Tanggal invoice wajib diisi'
    return
  }

  saving.value = true
  try {
    await create(form.value)
    router.push('/invoices')
  } catch (err: any) {
    console.error('Submit error:', err)
    serverError.value = err.message || 'Gagal menyimpan data'
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <div class="p-6 w-full overflow-hidden" style="background: var(--ui-bg); color: var(--ui-text);">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold" style="color: var(--ui-text-highlighted);">Tambah Invoice</h1>
      <UButton to="/invoices" icon="i-heroicons-arrow-left" color="gray" variant="soft" label="Back" />
    </div>

    <div v-if="orgLoading" class="text-gray-400 mb-4">Loading...</div>

    <UCard v-else :ui="{ body: { padding: 'p-6' } }">
      <form @submit.prevent="submit" class="space-y-6">
        <!-- Organization -->
        <div>
          <label class="block mb-2 text-sm font-semibold">Organization <span class="text-red-500">*</span></label>
          <select
            v-model.number="form.organization_id"
            class="w-full px-3 py-2 text-sm rounded-lg"
            style="background: var(--ui-bg); border: 1px solid var(--ui-border); color: var(--ui-text);"
          >
            <option :value="null" disabled>Pilih Organization</option>
            <option v-for="org in organizations" :key="org.id" :value="org.id">{{ org.name }}</option>
          </select>
          <UBadge v-if="selectedOrganization" color="blue" variant="soft" class="mt-2">{{ selectedOrganization.name }}</UBadge>
        </div>

        <!-- Date -->
        <div>
          <label class="block mb-2 text-sm font-semibold">Invoice Date <span class="text-red-500">*</span></label>
          <input
            v-model="form.date"
            type="date"
            class="w-full px-3 py-2 text-sm rounded-lg"
            style="background: var(--ui-bg); border: 1px solid var(--ui-border); color: var(--ui-text);"
          />
        </div>

        <!-- Expiries -->
        <div class="grid md:grid-cols-2 gap-4">
          <div>
            <label class="block mb-2 text-sm font-semibold">Current Expiry</label>
            <input v-model="form.current_expiry" type="datetime-local" class="w-full px-3 py-2 text-sm rounded-lg"
              style="background: var(--ui-bg); border: 1px solid var(--ui-border);" />
          </div>
          <div>
            <label class="block mb-2 text-sm font-semibold">New Expiry</label>
            <input v-model="form.new_expiry" type="datetime-local" class="w-full px-3 py-2 text-sm rounded-lg"
              style="background: var(--ui-bg); border: 1px solid var(--ui-border);" />
          </div>
        </div>

        <!-- Total -->
        <div>
          <label class="block mb-2 text-sm font-semibold">Total</label>
          <input v-model.number="form.total" type="number" class="w-full px-3 py-2 text-sm rounded-lg"
            style="background: var(--ui-bg); border: 1px solid var(--ui-border);" />
          <p v-if="form.total > 0" class="text-xs mt-2">Preview: {{ formatCurrency(form.total) }}</p>
        </div>

        <div v-if="serverError" class="p-3 rounded bg-red-100 text-red-500 border border-red-300">{{ serverError }}</div>

        <div class="flex gap-3 pt-2">
          <UButton type="submit" :loading="saving" color="primary" icon="i-heroicons-check-circle"
            :label="saving ? 'Saving...' : 'Save Invoice'" />
          <UButton color="gray" variant="soft" icon="i-heroicons-x-mark" label="Cancel" @click="router.push('/invoices')" />
        </div>
      </form>
    </UCard>
  </div>
</template>
