<script setup lang="ts">
const props = withDefaults(defineProps<{
  modelValue: OrganizationForm,
  saving?: boolean
  error?: string | null
  logoPreview?: string | null
  isEdit?: boolean
}>(), {
  saving: false,
  error: null,
  logoPreview: null,
  isEdit: false,
})

const { cities, fetchAll: fetchCities, loading: loadingCity } = useCities()
const { groups, fetchAll: fetchGroups, loading: loadingGroup } = useGroups()

const selectedCity = ref<{ label: string; value: number }>({
  value: 0,
  label: '',
})

const selectedGroup = ref<{ label: string; value: number }>({
  value: 0,
  label: '',
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: OrganizationForm): void
  (e: 'submit'): void
  (e: 'cancel'): void
}>()

const form = computed({
  get: () => props.modelValue,
  set: (val) => emit("update:modelValue", val)
})

const formError = ref<string | null>(null)

const cityOptions = computed(() => 
  cities.value.map((city) => ({
    value: city.id,
    label: `${city.name}, ${city.province_name}`
  }))
)

const groupOptions = computed(() => 
  groups.value.map((group) => ({
    value: group.id,
    label: group.name
  }))
)

watch(
  [() => cities.value, () => form.value.city],
  ([citiesVal, cityId]) => {
    if (!citiesVal.length || !cityId ) return

    const found = citiesVal.find(c => c.id === cityId)

    if (found) {
      selectedCity.value = {
        value: Number(found.id),
        label: `${found.name}, ${found.province_name}`
      }
    }
  },
  { immediate: true }
)

watch(
  [() => groups.value, () => form.value.group_id],
  ([groupsVal, groupId]) => {
    if (!groupsVal.length || !groupId ) return

    const found = groupsVal.find(g => g.id === groupId)

    if (found) {
      selectedGroup.value = {
        value: Number(found.id),
        label: found.name
      }
    }
  },
  { immediate: true }
)

const logoPreview = shallowRef<string | null>(null)
const onFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files ? target.files[0] : null

  if (file) {
    form.value.logo = file as unknown as string

    const reader = new FileReader()
    reader.onload = (e) => {
      logoPreview.value = e.target?.result as string
    }
    reader.readAsDataURL(file)
  }
}

watch(() => props.logoPreview, (oldLogo) => {
  if (typeof oldLogo === 'string' && oldLogo.startsWith('http')) {
    logoPreview.value = oldLogo
  }
}, { immediate: true })

const submit = () => {
  if (selectedCity.value.value) {
    form.value.city = selectedCity.value.value
  }
  if (selectedGroup.value.value) {
    form.value.group_id = selectedGroup.value.value
  }

  emit('submit')
}

onMounted(async () => {
  await fetchCities()
  await fetchGroups()
})
</script>

<template>
  <form @submit.prevent="submit" class="space-y-6">
    <!-- Name & Abbreviation -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label class="block mb-2 text-sm font-medium">
          Nama <Mandatory />
        </label>
        <UInput
          v-model="form.name"
          type="text"
          placeholder="Masukkan nama organisasi"
          class="w-full"
          required
        />
      </div>
      <div>
        <label class="block mb-2 text-sm font-medium">
          Singkatan <Mandatory />
        </label>
        <UInput
          v-model="form.abbreviation"
          type="text"
          placeholder="Masukkan nama singkatan organisasi"
          class="w-full"
          required
        />
      </div>
    </div>

    <!-- Address -->
    <div>
      <label class="block mb-2 text-sm font-medium">
        Alamat <Mandatory />
      </label>
      <UTextarea
        v-model="form.address"
        placeholder="Masukkan alamat"
        :rows="3"
        class="w-full"
      ></UTextarea>
    </div>

    <!-- City -->
    <div>
      <label class="block mb-2 text-sm font-medium">
        Kota <Mandatory />
      </label>
      <UInputMenu
        v-model="selectedCity" 
        :items="cityOptions"
        :loading="loadingCity"
        class="w-full"
        placeholder="Pilih Kota"
        required
      />
    </div>

    <!-- Lat & Long -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label class="block mb-2 text-sm font-medium">
          Latitude <Mandatory />
        </label>
        <UInput
          v-model="form.latitude"
          type="text"
          placeholder="-6.200000"
          class="w-full"
          required
        />
      </div>
      <div>
        <label class="block mb-2 text-sm font-medium">
          Longitude <Mandatory />
        </label>
        <UInput
          v-model="form.longitude"
          type="text"
          placeholder="106.816666"
          class="w-full"
          required
        />
      </div>
    </div>

    <!-- Phone & Email -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label class="block mb-2 text-sm font-medium">
          Telepon <Mandatory />
        </label>
        <UInput
          v-model="form.phone"
          type="tel"
          placeholder="08123456789"
          class="w-full"
          required
        />
      </div>
      <div>
        <label class="block mb-2 text-sm font-medium">
          Email <Mandatory />
        </label>
        <UInput
          v-model="form.email"
          type="email"
          placeholder="email@example.com"
          class="w-full"
          required
        />
      </div>
    </div>

    <!-- Group -->
    <div>
      <label class="block mb-2 text-sm font-medium">
        Yayasan <Mandatory />
      </label>
      <UInputMenu 
        v-model="selectedGroup"
        :items="groupOptions"
        :loading="loadingGroup"
        class="w-full"
        placeholder="Pilih Yayasan"
        required
      />
    </div>

    <!-- Website -->
    <div>
      <label class="block mb-2 text-sm font-medium">
        Website <Mandatory />
      </label>
      <UInput
        v-model="form.website"
        type="text"
        placeholder="https://example.com"
        class="w-full"
        required
      />
    </div>

    <!-- Logo -->
    <div>
      <label class="block mb-2 text-sm font-medium">
        Logo <Mandatory />
      </label>
      <UInput
        type="file"
        accept="image/*"
        @change="onFileChange"
        class="w-full"
        placeholder="Masukkan logo organisasi"
        :required="!isEdit"
      />
      <div v-if="logoPreview" class="mt-3">
        <img
          :src="logoPreview"
          alt="Logo Preview"
          class="h-20 w-auto rounded border"
        />
      </div>
    </div>

    <!-- Founded & Legal -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label class="block mb-2 text-sm font-medium">
          Tanggal Berdiri <Mandatory />
        </label>
        <UInput
          v-model="form.founded"
          type="date"
          class="w-full"
          :disabled="props.isEdit"
          required
        />
        <small v-if="isEdit">Tanggal berdiri organisasi tidak dapat diubah</small>
      </div>
      <div>
        <label class="block mb-2 text-sm font-medium">
          Legalitas <Mandatory />
        </label>
        <UInput
          v-model="form.legal"
          type="text"
          placeholder="Legalitas organisasi"
          class="w-full"
          required
        />
      </div>
    </div>

    <div class="flex justify-end items-center gap-3 pt-4">
      <UButton
        color="neutral"
        variant="ghost"
        icon="i-heroicons-x-mark"
        label="Batal"
        @click="$emit('cancel')"
      />
      <UButton
        type="submit"
        :loading="saving"
        :disabled="saving"
        color="primary"
        icon="i-heroicons-check-circle"
        :label="saving ? 'Menyimpan...' : 'Simpan Organisasi'"
      />
    </div>

    <!-- Error -->
    <div
      v-if="formError || error"
      class="px-4 py-3 rounded-lg text-sm"
      style="background: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.3); color: #ef4444;"
    >
      {{ formError ?? error }}
    </div>    
  </form>
</template>