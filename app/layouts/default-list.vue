<script setup lang="ts">
withDefaults(defineProps<{
  title?: string
  showAddButton?: boolean
}>(), {
  title: 'Data',
  showAddButton: true
})

const route = useRoute()
</script>

<template>
  <div class="p-6 w-full overflow-hidden" style="color: var(--ui-text); background: var(--ui-bg);">
    <Header
      :title="`Daftar ${title}`"
    >
      <UButton v-if="showAddButton" :to="`${route.path}/create`" icon="i-heroicons-plus-circle" size="md" color="primary" :label="`Tambah ${title}`" />
    </Header>
    <slot/>
  </div>
</template>