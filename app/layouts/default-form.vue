<script setup lang="ts">
withDefaults(defineProps<{
  title: string
  loading?: boolean
}>(), {
  title: 'Data',
  loading: false
})

const router = useRouter()
</script>

<template>
  <div class="p-6 w-full overflow-hidden" style="color: var(--ui-text); background: var(--ui-bg);">
    <Header
      :title="`${title}`"
    >
      <UButton 
        label="Kembali"
        icon="i-heroicons-arrow-left" 
        @click="router.back()" 
        size="md"
        color="neutral" 
        variant="ghost"
        class="cursor-pointer"
      />
    </Header>
    
    <UCard>
      <Loader v-if="loading" label="form" />
      <slot v-else/>
    </UCard>

    <UCard class="mt-6">
      <div class="flex items-center gap-3">
        <UIcon name="i-heroicons-exclamation-circle" class="size-8 text-primary" />
        <div>
          <p class="text-md font-semibold mb-1">Informasi:</p>
          <p class="text-sm">
            Field dengan <Mandatory/> wajib diisi.
            Pastikan semua data sudah benar sebelum menyimpan.
          </p>
        </div>
      </div>
    </UCard>

  </div>
</template>