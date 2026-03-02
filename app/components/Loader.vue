<script setup lang="ts">
withDefaults(defineProps<{
  label?: string
}>(),{
  label: ''
})
</script>

<template>
  <div class="flex flex-col items-center justify-center py-12">
    <UIcon name="i-lucide-loader-2" class="size-8 animate-spin text-primary mb-4" />
    <p class="text-sm text-muted">
      {{ `Memuat data ${label}...` }}
    </p>
  </div>
</template>