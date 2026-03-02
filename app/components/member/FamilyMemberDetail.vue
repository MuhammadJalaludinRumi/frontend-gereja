<script setup lang="ts">
const props = defineProps<{
  modelValue: boolean
  data: Member
  related: Member
}>()

const emit = defineEmits(['update:modelValue'])

const localOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

</script>

<template>
  <UModal
    v-model:open="localOpen"
    :portal="false"
    :dismissible="true"
    :modal="true"
    :close="true"
    :transition="true"
    :ui="{ 
      content: 'max-w-3xl', 
      footer: 'justify-end'
    }"
  >
    <template #body>
      <section class="flex flex-col w-full gap-6">
        <section class="flex flex-col items-center w-full">
          <p class="text-muted text-sm">{{ data.id_local }}</p>
          <h1 class="text-2xl font-bold capitalize">{{ data.name }}</h1>
          <UAvatar :src="data.photo" size="3xl" class="my-4 h-32 w-32" />
        </section>

        <section class="flex flex-col w-full gap-2">
          <h2 class="text-lg font-semibold">Detail Anggota Keluarga</h2>

          <div class="space-y-4">
            <div class="w-full grid grid-cols-3 gap-2">
              <div>
                <p class="text-muted text-sm">Nomor Induk</p>
                <h1 class="text-md font-medium">{{ data.id_local }}</h1>
              </div>
              <div>
                <p class="text-muted text-sm">Jenis ID</p>
                <h1 class="text-md font-medium">{{ data.id_type }}</h1>
              </div>
              <div>
                <p class="text-muted text-sm">Nomor ID</p>
                <h1 class="text-md font-medium">{{ data.id_number }}</h1>
              </div>
            </div>
            
            <div class="w-full grid grid-cols-3 gap-2">
              <div>
                <p class="text-muted text-sm">Nama Lengkap</p>
                <h1 class="text-md font-medium capitalize">{{ data.name }}</h1>
              </div>
              <div>
                <p class="text-muted text-sm">Tempat</p>
                <h1 class="text-md font-medium capitalize">{{ data.pob }}</h1>
              </div>
              <div>
                <p class="text-muted text-sm">Tanggal Lahir</p>
                <h1 class="text-md font-medium">{{ $formatDate(data.dob) }}</h1>
              </div>
              <div>
                <p class="text-muted text-sm">Jenis Kelamin</p>
                <h1 class="text-md font-medium capitalize">{{ data.sex }}</h1>
              </div>
              <div>
                <p class="text-muted text-sm">Agama</p>
                <h1 class="text-md font-medium capitalize">{{ data.religion }}</h1>
              </div>
              <div>
                <p class="text-muted text-sm">Golongan Darah</p>
                <h1 class="text-md font-medium capitalize">{{ data.blood }}</h1>
              </div>
            </div>
            
            <div class="w-full grid grid-cols-3 gap-2">
              <div>
                <p class="text-muted text-sm">Warga Negara</p>
                <h1 class="text-md font-medium capitalize">{{ data.nationality }}</h1>
              </div>
              <div>
                <p class="text-muted text-sm">Suku</p>
                <h1 class="text-md font-medium capitalize">{{ data.ethnic }}</h1>
              </div>
            </div>
          </div>
        </section>

        <section class="flex flex-col w-full gap-2">
          <h2 class="text-lg font-semibold">Anggota Keluarga dari</h2>

          <UCard variant="outline">
            <div class="flex justify-between items-center">
              <div class="flex items-center gap-4">
                <UAvatar :src="related.photo" size="lg" class="h-12 w-12" />
                <div>
                  <h3 class="text-lg font-medium capitalize">{{ related.name }}</h3>
                  <p class="text-sm text-muted">{{ related.family_relation }}</p>
                </div>
              </div>
              <UButton 
                color="neutral" 
                variant="ghost" 
                label="Kembali" 
                icon="i-heroicons-arrow-left"
                @click="localOpen = false"
              />
            </div>
          </UCard>
        </section>
      </section>
    </template>
  </UModal>
</template>