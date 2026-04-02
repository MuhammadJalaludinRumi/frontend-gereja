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
// console.log("USER:", user.value)

const organizationId = computed(() => {
  return user.value?.role?.organization_id
})

const allLinks: NavigationMenuItem[] = [
  // HOME
  {
    label: 'Beranda',
    icon: 'i-lucide-house',
    to: '/',
    roles: [1, 4]
  },

  // =======================
  // MEMBER DATA (DROPDOWN)
  // =======================
  {
    label: 'Data Anggota',
    icon: 'i-lucide-users',
    children: [
      { label: 'Anggota', to: '/members', roles: [4] },
      { label: 'Pernikahan', to: '/marriages', roles: [4] },
      { label: 'Ekonomi', to: '/economy', roles: [4] },
      { label: 'Pendidikan', to: '/educations', roles: [4] },
      { label: 'Pekerjaan', to: '/occupations', roles: [4] }
    ]
  },

  // =======================
  // ADMINISTRATION (DROPDOWN)
  // =======================
  {
    label: 'Administrasi',
    icon: 'i-lucide-shield-check',
    children: [
      { label: 'Acls', to: '/acls', roles: [1, 4] },
      { label: 'Manajemen Role', to: '/roles', roles: [1, 4] },
      { label: 'Rules', to: '/rules', roles: [1, 4] },
      {
        label: 'Organisasi',
        to: () => `/organizations/${organizationId.value}`,
        roles: [4]
      }
    ]
  },

  {
    label: 'Lokasi', 
    icon: 'i-lucide-map-pin',
    children: [
      { label: 'Provinsi', to: '/province', roles: [1] },
      { label: 'Kota', to: '/city', roles: [1] }
    ], 
  },

  { 
    label: 'Pengguna',
    icon: 'i-lucide-user',
    children: [
      { label: 'Manajemen Pengguna', to: '/users', roles: [1] },
      { label: 'Otoritas Pengguna', to: '/user-authorities', roles: [1] },
    ]
  },

  { label: 'Yayasan', icon: 'i-lucide-building-2', to: '/groups', roles: [1] },
  { label: 'Organisasi', icon: 'i-lucide-users', to: '/organizations', roles: [1] },

  // =======================
  // ASSET MANAGEMENT (DROPDOWN) - UPDATED
  // =======================
  {
    label: 'Manajemen Aset',
    icon: 'i-lucide-package',
    children: [
      { label: 'Aset', to: '/assets', roles: [4] },
      { label: 'Kategori Aset', to: '/asset-categories', roles: [4] },
      { label: 'Lokasi', to: '/locations', roles: [1, 4] },
      { label: 'Gambar Aset', to: '/asset-images', roles: [1, 4] },
      { label: 'Peminjaman Aset', to: '/asset-loans', roles: [1, 4] },
      { label: 'Pemeliharaan Aset', to: '/asset-maintenances', roles: [1, 4] },
      { label: 'Perpindahan Aset', to: '/asset-movements', roles: [1, 4] },
      { label: 'Penghapusan Aset', to: '/asset-disposals', roles: [1, 4] },
      { label: 'Dokumen Aset', to: '/asset-documents', roles: [1, 4] }
    ]
  },

  { 
    label: 'Data Lisensi', 
    icon: 'i-lucide-award', 
    children: [
      { label: 'Lisensi', to: '/licenses', roles: [1] },
      { label: 'Lisensi Organisasi', to: '/organizationLicense', roles: [1] },
    ] 
  },

  { label: 'Agenda', icon: 'i-lucide-calendar-check', to: '/events', roles: [4] },
  { label: 'Invoice', icon: 'i-lucide-receipt', to: '/invoices', roles: [1] },
  { label: 'Berita', icon: 'i-lucide-newspaper', to: '/news', roles: [1] },
  { label: 'Pengumuman', icon: 'i-lucide-megaphone', to: '/announcement', roles: [1, 4] },
  { label: 'Renungan', icon: 'i-lucide-book-alert', to: '/reflection', roles: [1, 4] },
]

// Detect user role
const userRole = computed(() => {
  return user.value?.role?.id ?? user.value?.role_id ?? user.value?.role
})

// Role Filter (support nested children)
const linksFiltered = computed(() => {
  return allLinks
    .map(item => {
      if (item.children) {
        const filteredChildren = item.children
          .map(c => {
            // khusus Organization → build link pake orgId
            if (c.label === 'Organization') {
              return {
                ...c,
                to: `/organizations/${organizationId.value}`
              }
            }
            return c
          })
          .filter(c => c.roles.includes(userRole.value))

        if (!filteredChildren.length) return null

        return { ...item, children: filteredChildren }
      }

      return item.roles?.includes(userRole.value) ? item : null
    })
    .filter(Boolean) as NavigationMenuItem[]
})
</script>

<template>
  <aside
    class="fixed left-0 top-0 h-full bg-default border-r border-default shadow-lg transition-transform duration-300 ease-in-out z-40"
    :class="isOpen ? 'translate-x-0' : '-translate-x-full'" style="margin-top: 64px; width: 256px;">
    <div class="flex flex-col h-full">
      <!-- Navigation -->
      <div class="flex-1 overflow-y-auto px-2 py-4">
        <div class="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">
          Navigasi
        </div>

        <!-- Dropdown Navigation Menu -->
        <UNavigationMenu :items="linksFiltered" orientation="vertical" class="space-y-1" />
      </div>

      <!-- Footer -->
      <div class="border-t border-default p-2">
        <UserMenu :collapsed="false" />
      </div>
    </div>
  </aside>
</template>
