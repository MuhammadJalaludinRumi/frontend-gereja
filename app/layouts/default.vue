<script setup lang="ts">
const toast = useToast()
const route = useRoute()

// Default TERBUKA saat pertama load / refresh
const sidebarOpen = ref(true)

// Auto close sidebar saat pindah route
watch(() => route.path, () => {
  // Uncomment kalau mau tetap buka saat pindah route
  // sidebarOpen.value = true

  // Atau kalau mau auto close di mobile saja:
  // if (window.innerWidth < 768) {
  //   sidebarOpen.value = false
  // }
})

const toggleSidebar = () => {
  sidebarOpen.value = !sidebarOpen.value
}

onMounted(async () => {
  const cookie = useCookie('cookie-consent')
  if (cookie.value === 'accepted') return

  toast.add({
    title: 'We use first-party cookies to enhance your experience on our website.',
    duration: 0,
    close: false,
    actions: [
      {
        label: 'Accept',
        color: 'neutral',
        variant: 'outline',
        onClick: () => {
          cookie.value = 'accepted'
        }
      },
      {
        label: 'Opt out',
        color: 'neutral',
        variant: 'ghost'
      }
    ]
  })
})
</script>

<template>
  <div class="min-h-screen bg-[var(--ui-bg)] text-[var(--ui-text)]">
    <!-- Navbar Fixed -->
    <AppNavbar
      class="fixed top-0 left-0 right-0 z-50 border-b"
      style="background: var(--ui-bg); border-color: var(--ui-border);"
      @toggle-sidebar="toggleSidebar"
    />

    <!-- Sidebar Fixed -->
    <AppSidebar v-model="sidebarOpen" />

    <!-- Main Content - Cuma PUSH tanpa ubah ukuran -->
    <main
      class="pt-16 transition-all duration-300 ease-in-out"
      :style="{
        marginLeft: sidebarOpen ? '256px' : '0px'
      }"
    >
      <slot />
    </main>

    <NotificationsSlideover />
  </div>
</template>
