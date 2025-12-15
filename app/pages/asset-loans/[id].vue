<template>
  <div class="p-6 w-full" style="background: var(--ui-bg); color: var(--ui-text);">

    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">Edit Peminjaman Asset</h1>
      <UButton to="/asset-loans" color="gray" variant="soft" icon="i-heroicons-arrow-left" label="Back" />
    </div>

    <UCard :ui="{ body: { padding: 'p-6' } }">
      <form @submit.prevent="save" class="space-y-6">

        <!-- Asset -->
        <div>
          <label class="block mb-2 text-sm font-semibold">Asset *</label>
          <select v-model="form.asset_id" required
                  class="w-full px-3 py-2 rounded-lg border text-sm"
                  style="background: var(--ui-bg); border-color: var(--ui-border);">
            <option value="">Pilih Asset</option>
            <option v-for="a in assets" :value="a.id" :key="a.id">{{ a.name }}</option>
          </select>
        </div>

        <!-- Borrower -->
        <div>
          <label class="block mb-2 text-sm font-semibold">Nama Peminjam *</label>
          <input v-model="form.borrower_name" required
                 class="w-full px-3 py-2 rounded-lg border text-sm"
                 style="background: var(--ui-bg); border-color: var(--ui-border);" />
        </div>

        <div>
          <label class="block mb-2 text-sm font-semibold">Tipe Peminjam</label>
          <select v-model="form.borrower_type" required
                  class="w-full px-3 py-2 rounded-lg border text-sm"
                  style="background: var(--ui-bg); border-color: var(--ui-border);">
            <option value="">-- pilih --</option>
            <option value="jemaat">Jemaat</option>
            <option value="komisi">Komisi</option>
            <option value="internal">Internal</option>
          </select>
        </div>

        <!-- Dates -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block mb-2 text-sm font-semibold">Tanggal Pinjam</label>
            <input type="date" v-model="form.loan_date"
                   class="w-full px-3 py-2 rounded-lg border text-sm"
                   style="background: var(--ui-bg); border-color: var(--ui-border);" />
          </div>

          <div>
            <label class="block mb-2 text-sm font-semibold">Tanggal Kembali (Ekspektasi)</label>
            <input type="date" v-model="form.expected_return_date"
                   class="w-full px-3 py-2 rounded-lg border text-sm"
                   style="background: var(--ui-bg); border-color: var(--ui-border);" />
          </div>
        </div>

        <div>
          <label class="block mb-2 text-sm font-semibold">Tanggal Kembali Aktual</label>
          <input type="date" v-model="form.actual_return_date"
                 class="w-full px-3 py-2 rounded-lg border text-sm"
                 style="background: var(--ui-bg); border-color: var(--ui-border);" />
        </div>

        <!-- Notes -->
        <div>
          <label class="block mb-2 text-sm font-semibold">Catatan</label>
          <textarea v-model="form.notes" rows="3"
                    class="w-full px-3 py-2 rounded-lg border text-sm"
                    style="background: var(--ui-bg); border-color: var(--ui-border);"></textarea>
        </div>

        <!-- Status -->
        <div>
          <label class="block mb-2 text-sm font-semibold">Status *</label>
          <select v-model="form.status" required
                  class="w-full px-3 py-2 rounded-lg border text-sm"
                  style="background: var(--ui-bg); border-color: var(--ui-border);">
            <option value="borrowed">Borrowed</option>
            <option value="returned">Returned</option>
            <option value="late">Late</option>
          </select>
        </div>

        <div class="flex gap-3 pt-4">
          <UButton type="submit" color="primary" :loading="saving" label="Update" />
          <UButton to="/asset-loans" color="gray" variant="soft" label="Cancel" />
        </div>

      </form>
    </UCard>

  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue"
import { useRoute, useRouter } from "vue-router"
import { useAssetLoans } from "~/composables/useAssetLoans"
import { useAssets } from "~/composables/useAssets"

const route = useRoute()
const router = useRouter()

const { loan, fetchById, update } = useAssetLoans()
const { assets, fetchAll: fetchAssets } = useAssets()

const saving = ref(false)

const form = reactive({
  asset_id: "",
  borrower_name: "",
  borrower_type: "",
  loan_date: "",
  expected_return_date: "",
  actual_return_date: "",
  status: "",
  notes: ""
})

onMounted(async () => {
  await fetchAssets()
  await fetchById(route.params.id)

  if (loan.value) Object.assign(form, loan.value)
})

const save = async () => {
  saving.value = true
  await update(route.params.id, form)
  router.push("/asset-loans")
}
</script>
