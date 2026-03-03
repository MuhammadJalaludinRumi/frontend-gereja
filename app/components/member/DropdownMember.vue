<script setup lang="ts">
const selectedMember = ref({label: '', value: ''})

</script>

<template>
  <UInputMenu
    v-model="selectedMember"
  />
</template>