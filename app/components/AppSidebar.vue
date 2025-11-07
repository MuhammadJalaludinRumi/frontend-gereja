<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'
import { useAuth } from '~/composables/useAuth'

const props = defineProps<{
  modelValue: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const { user } = useAuth()

const allLinks: NavigationMenuItem[] = [
  { label: 'Home', icon: 'i-lucide-house', to: '/', roles: [1, 4] },
  { label: 'Acls', icon: 'i-lucide-shield-check', to: '/acls', roles: [1, 4] },
  { label: 'City', icon: 'i-lucide-map-pin', to: '/city', roles: [1] },
  { label: 'Invoice', icon: 'i-lucide-receipt', to: '/invoices', roles: [1] },
  { label: 'License', icon: 'i-lucide-badge-check', to: '/licenses', roles: [1] },
  { label: 'News', icon: 'i-lucide-newspaper', to: '/news', roles: [1] },
  { label: 'Organization License', icon: 'i-lucide-file-badge', to: '/organizationLicense', roles: [1] },
  { label: 'Organizations', icon: 'i-lucide-users', to: '/organizations', roles: [1, 4] },
  { label: 'Provinces', icon: 'i-lucide-map', to: '/province', roles: [1] },
  { label: 'Role management', icon: 'i-lucide-crown', to: '/roles', roles: [1, 4] },
  { label: 'Rules', icon: 'i-lucide-scale', to: '/rules', roles: [1, 4] },
  { label: 'User Authorities', icon: 'i-lucide-shield', to: '/user-authorities', roles: [1] },
  { label: 'User Management', icon: 'i-lucide-user-cog', to: '/users', roles: [1] },
  { label: 'Yayasan', icon: 'i-lucide-building-2', to: '/groups', roles: [1] },
  { label: 'Members', icon: 'i-lucide-users', to: '/members', roles: [4] },
  { label: 'Marriages', icon: 'i-lucide-heart', to: '/marriages', roles: [4] },
  { label: 'Economy', icon: 'i-lucide-scale', to: '/economy', roles: [4] },
  { label: 'Educations', icon: 'i-lucide-receipt', to: '/educations', roles: [4] },
  { label: 'Occupations', icon: 'i-lucide-users', to: '/occupations', roles: [1, 4] },
]

const userRole = computed(() => {
  return user.value?.role?.name ?? user.value?.role ?? user.value?.role_id
})

// Filter link berdasarkan role user
const linksFiltered = computed(() => {
  return allLinks.filter(link => link.roles?.includes(userRole.value))
    .map(link => ({
      ...link,
      onSelect: () => (isOpen.value = false)
    }))
})
</script>

<template>
  <!-- Overlay sidebar -->
  <Transition name="fade">
    <div v-if="isOpen" class="fixed inset-0 z-[9999] flex" style="background-color: rgba(0,0,0,0.5);"
      @click.self="isOpen = false">
      <UDashboardSidebar id="default" open collapsible resizable
        class="bg-[var(--ui-bg)] text-[var(--ui-text)] w-64 h-full border-r border-[var(--ui-border)] shadow-xl"
        :ui="{ footer: 'lg:border-t lg:border-default' }">
        <template #default="{ collapsed }">
          <div v-if="!collapsed" class="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">
            Navigasi
          </div>
          <UNavigationMenu :collapsed="collapsed" :items="linksFiltered" orientation="vertical" tooltip popover />
        </template>
        <template #footer="{ collapsed }">
          <UserMenu :collapsed="collapsed" />
        </template>
      </UDashboardSidebar>
    </div>
  </Transition>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
