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
  { label: 'Organizations', icon: 'i-lucide-users', to: '/organizations', roles: [1] },
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
  return user.value?.role?.id ?? user.value?.role_id ?? user.value?.role
})

// Filter link berdasarkan role user
const linksFiltered = computed(() => {
  return allLinks.filter(link => link.roles?.includes(userRole.value))
})
</script>

<template>
  <!-- Sidebar fixed yang push content -->
  <aside
    class="fixed left-0 top-0 h-full bg-[var(--ui-bg)] border-r border-[var(--ui-border)] shadow-lg transition-transform duration-300 ease-in-out z-40"
    :class="isOpen ? 'translate-x-0' : '-translate-x-full'"
    style="margin-top: 64px; width: 256px;"
  >
    <div class="flex flex-col h-full">
      <!-- Navigation -->
      <div class="flex-1 overflow-y-auto px-2 py-4">
        <div class="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">
          Navigasi
        </div>
        <UNavigationMenu
          :items="linksFiltered"
          orientation="vertical"
          class="space-y-1"
        />
      </div>

      <!-- Footer -->
      <div class="border-t border-[var(--ui-border)] p-2">
        <UserMenu :collapsed="false" />
      </div>
    </div>
  </aside>
</template>
