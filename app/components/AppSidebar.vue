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
  // HOME
  {
    label: 'Home',
    icon: 'i-lucide-house',
    to: '/',
    roles: [1, 4]
  },

  // =======================
  // MEMBER DATA (DROPDOWN)
  // =======================
  {
    label: 'Member Data',
    icon: 'i-lucide-users',
    children: [
      { label: 'Members', to: '/members', roles: [4] },
      { label: 'Marriages', to: '/marriages', roles: [4] },
      { label: 'Economy', to: '/economy', roles: [4] },
      { label: 'Educations', to: '/educations', roles: [4] },
      { label: 'Occupations', to: '/occupations', roles: [1, 4] }
    ]
  },

  // =======================
  // ADMINISTRATION (DROPDOWN)
  // =======================
  {
    label: 'Administration',
    icon: 'i-lucide-shield-check',
    children: [
      { label: 'Acls', to: '/acls', roles: [1, 4] },
      { label: 'Role Management', to: '/roles', roles: [1, 4] },
      { label: 'Rules', to: '/rules', roles: [1, 4] }
    ]
  },

  // =======================
  // ADMIN LIST (NO DROPDOWN)
  // =======================
  { label: 'City', icon: 'i-lucide-map-pin', to: '/city', roles: [1] },
  { label: 'Invoice', icon: 'i-lucide-receipt', to: '/invoices', roles: [1] },
  { label: 'License', icon: 'i-lucide-badge-check', to: '/licenses', roles: [1] },
  { label: 'News', icon: 'i-lucide-newspaper', to: '/news', roles: [1] },
  { label: 'Organization License', icon: 'i-lucide-file-badge', to: '/organizationLicense', roles: [1] },
  { label: 'Organizations', icon: 'i-lucide-users', to: '/organizations', roles: [1] },
  { label: 'Provinces', icon: 'i-lucide-map', to: '/province', roles: [1] },
  { label: 'User Authorities', icon: 'i-lucide-shield', to: '/user-authorities', roles: [1] },
  { label: 'User Management', icon: 'i-lucide-user-cog', to: '/users', roles: [1] },
  { label: 'Yayasan', icon: 'i-lucide-building-2', to: '/groups', roles: [1] }
]

// Detect user role
const userRole = computed(() => {
  return user.value?.role?.id ?? user.value?.role_id ?? user.value?.role
})

// Role Filter (support nested children)
const linksFiltered = computed(() => {
  return allLinks
    .map(item => {
      // jika group menu
      if (item.children) {
        const filteredChildren = item.children.filter(c =>
          c.roles.includes(userRole.value)
        )
        if (filteredChildren.length === 0) return null
        return { ...item, children: filteredChildren }
      }

      // normal menu
      return item.roles?.includes(userRole.value) ? item : null
    })
    .filter(Boolean) as NavigationMenuItem[]
})
</script>

<template>
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

        <!-- Dropdown Navigation Menu -->
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
