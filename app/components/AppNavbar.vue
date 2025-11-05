<script setup lang="ts">
import type { DropdownMenuItem } from '@nuxt/ui'
import { useCookie } from '#app'

const emit = defineEmits<{ toggleSidebar: [] }>()
const route = useRoute()
const router = useRouter()

// Fungsi logout
const logout = () => {
  console.log('Logout clicked')

  // Hapus token di localStorage
  localStorage.removeItem('token')

  // Kalau lo pake cookie, bisa bersihin juga:
  useCookie('token').value = null
  useCookie('XSRF-TOKEN').value = null

  // Optional: hapus user data dari store/composable auth kalau ada
  // useAuth().clearUser()

  // Redirect ke login
  router.push('/login')
}

// Items untuk dropdown profile
const profileItems: DropdownMenuItem[][] = [
  [
    {
      label: 'Setting Profile',
      icon: 'i-lucide-settings',
      onSelect: () => {
        router.push('/profile')
      }
    }
  ],
  [
    {
      label: 'Logout',
      icon: 'i-lucide-log-out',
      onSelect: logout
    }
  ]
]

// data buat dropdown "Go to"
const groups = computed(() => [
  {
    id: 'links',
    label: 'Go to',
    items: [
      { label: 'Home', icon: 'i-lucide-house', to: '/' },
      { label: 'Acls', icon: 'i-lucide-shield-check', to: '/acls' },
      { label: 'City', icon: 'i-lucide-map-pin', to: '/city' },
      { label: 'Invoice', icon: 'i-lucide-receipt', to: '/invoices' },
      { label: 'License', icon: 'i-lucide-badge-check', to: '/licenses' },
      { label: 'News', icon: 'i-lucide-newspaper', to: '/news' },
      { label: 'Organization License', icon: 'i-lucide-file-badge', to: '/organizationLicense' },
      { label: 'Organizations', icon: 'i-lucide-users', to: '/organizations' },
      { label: 'Provinces', icon: 'i-lucide-map', to: '/province' },
      { label: 'Role management', icon: 'i-lucide-crown', to: '/roles' },
      { label: 'Rules', icon: 'i-lucide-scale', to: '/rules' },
      { label: 'User Authorities', icon: 'i-lucide-shield', to: '/user-authorities' },
      { label: 'User Management', icon: 'i-lucide-user-cog', to: '/users' },
      { label: 'Yayasan', icon: 'i-lucide-building-2', to: '/groups' }
    ]
  }
])
</script>

<template>
  <UDashboardNavbar
    class="fixed top-0 left-0 right-0 z-50 border-b"
    style="background: var(--ui-bg); border-color: var(--ui-border); color: var(--ui-text);"
  >
    <!-- Kiri -->
    <template #left>
      <UButton
        icon="i-lucide-menu"
        color="gray"
        variant="ghost"
        @click="emit('toggleSidebar')"
      />
    </template>

    <!-- Tengah -->
    <template #center>
      <UDashboardSearch :groups="groups" />
    </template>

    <!-- Kanan -->
    <template #right>
      <div class="flex items-center gap-2">
        <!-- Notifikasi -->
        <UTooltip text="Notifications">
          <UButton icon="i-lucide-bell" color="gray" variant="ghost" />
        </UTooltip>

        <!-- Dropdown Profile -->
        <UDropdownMenu :items="profileItems">
          <UButton
            icon="i-lucide-user-circle"
            color="gray"
            variant="ghost"
            class="!text-gray-700 dark:!text-gray-200"
            aria-label="Profile menu"
          />
        </UDropdownMenu>
      </div>
    </template>
  </UDashboardNavbar>

  <!-- Spacer biar konten gak ketiban navbar -->
  <div class="h-[64px]"></div>
</template>
