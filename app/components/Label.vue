<script setup lang="ts">
const props = withDefaults(defineProps<{
  label: string
  mandatory?: boolean
}>(), {
  mandatory: false
})

</script>

<template>
  <label class="block mb-2 text-sm font-medium">
    {{label}} <Mandatory v-if="mandatory" />
  </label>
</template>