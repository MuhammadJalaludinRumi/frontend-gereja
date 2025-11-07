<script setup lang="ts">
definePageMeta({
  middleware: ['role'],
  roles: [1]
})

import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useLicenses } from '~/composables/useLicenses'

const route = useRoute()
const router = useRouter()
const { fetchById, update, license, error } = useLicenses()

const form = ref({
  name: '',
  price: 0
})

const saving = ref(false)

onMounted(async () => {
  try {
    await fetchById(Number(route.params.id))
    if (license.value) {
      form.value.name = license.value.name || ''
      form.value.price = Number(license.value.price || 0)
    }
  } catch (err) {
    console.error('❌ Gagal memuat data license:', err)
  }
})

const save = async () => {
  if (!form.value.name || !form.value.price) {
    alert('Nama dan harga wajib diisi!')
    return
  }

  saving.value = true
  try {
    await update(Number(route.params.id), {
      name: form.value.name,
      price: Number(form.value.price)
    })
    router.push('/licenses')
  } catch (err) {
    console.error('❌ Error update license:', err)
    alert('Gagal memperbarui license.')
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <div class="p-6 w-full" style="color: var(--ui-text); background: var(--ui-bg);">
    <h1 class="text-2xl font-bold mb-6" style="color: var(--ui-text-highlighted);">
      Edit Lisensi
    </h1>

    <UCard class="max-w-md">
      <form @submit.prevent="save" class="space-y-4">
        <div>
          <label class="block mb-1 font-medium">Nama Lisensi</label>
          <UInput v-model="form.name" placeholder="Masukkan nama lisensi" />
        </div>

        <div>
          <label class="block mb-1 font-medium">Harga (Rp)</label>
          <UInput v-model="form.price" type="number" placeholder="Masukkan harga" />
        </div>

        <div class="flex gap-3">
          <UButton
            type="submit"
            :loading="saving"
            color="primary"
            label="Perbarui"
          />
          <UButton
            color="gray"
            variant="soft"
            label="Kembali"
            @click="router.push('/licenses')"
          />
        </div>

        <p v-if="error" class="text-red-500 text-sm">{{ error }}</p>
      </form>
    </UCard>
  </div>
</template>
