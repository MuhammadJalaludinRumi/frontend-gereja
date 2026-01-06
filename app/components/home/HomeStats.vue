<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useAuth } from '~/composables/useAuth'
import { useApiUrl } from '~/composables/useApiUrl'

const apiBase = useApiUrl()
const { token, user, isLoggedIn } = useAuth()
const isProd = process.env.NODE_ENV === 'production'

const loading = ref(true)
const error = ref('')

const stats = reactive({
  members: 0,
  kk: 0,
  pelayanan: 0,
  keuangan: 0,
})

// Format currency helper
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0
  }).format(value)
}

// Fetch data from API
const fetchDashboardData = async () => {
  try {
    loading.value = true
    error.value = ''

    // Check if user is logged in
    if (!isLoggedIn.value) {
      await navigateTo('/login')
      return
    }

    // Prepare headers
    const headers: Record<string, string> = {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }

    // Add auth header for non-production
    if (!isProd && token.value) {
      headers['Authorization'] = `Bearer ${token.value}`
    }

    const fetchOptions = {
      baseURL: apiBase,
      headers,
      credentials: isProd ? 'include' as RequestCredentials : undefined
    }

    console.log('Fetching dashboard data...') // Debug

    // Fetch members data
    const membersResponse = await $fetch('/members', fetchOptions)
    const membersData = Array.isArray(membersResponse)
      ? membersResponse
      : (membersResponse as any).data || []

    console.log('Members data:', membersData) // Debug

    // Fetch economies data
    const economiesResponse = await $fetch('/economies', fetchOptions)
    const economiesData = Array.isArray(economiesResponse)
      ? economiesResponse
      : (economiesResponse as any).data || []

    console.log('Economies data:', economiesData) // Debug

    // Calculate statistics
    stats.members = membersData.length

    // Count unique KK (Kartu Keluarga)
    const uniqueKK = new Set()
    membersData.forEach((member: any) => {
      if (member.kk || member.family_number || member.no_kk) {
        uniqueKK.add(member.kk || member.family_number || member.no_kk)
      }
    })
    stats.kk = uniqueKK.size

    // Count active pelayanan (sesuaikan dengan field di database)
    stats.pelayanan = membersData.filter((m: any) =>
      m.service_status === 'active' ||
      m.is_active === true ||
      m.status === 'active' ||
      m.pelayanan_aktif === true
    ).length

    // Calculate total keuangan
    stats.keuangan = economiesData.reduce((total: number, economy: any) => {
      const amount = parseFloat(
        economy.amount ||
        economy.total ||
        economy.nominal ||
        economy.jumlah ||
        0
      )
      return total + amount
    }, 0)

    console.log('Stats calculated:', stats) // Debug

  } catch (err: any) {
    console.error('Error fetching dashboard data:', err)
    error.value = err.data?.message || err.message || 'Gagal memuat data dashboard'

    // If unauthorized, redirect to login
    if (err.statusCode === 401 || err.status === 401) {
      await navigateTo('/login')
    }
  } finally {
    loading.value = false
  }
}

// Stats cards configuration
const statsCards = computed(() => [
  {
    icon: 'i-lucide-users',
    label: 'Total Jemaat',
    value: stats.members,
    color: 'primary' as const
  },
  {
    icon: 'i-lucide-home',
    label: 'Total Keluarga (KK)',
    value: stats.kk,
    color: 'success' as const
  },
  {
    icon: 'i-lucide-mic',
    label: 'Pelayanan Aktif',
    value: stats.pelayanan,
    color: 'warning' as const
  },
  {
    icon: 'i-lucide-wallet',
    label: 'Total Keuangan',
    value: formatCurrency(stats.keuangan),
    color: 'info' as const
  }
])

// Fetch data on component mount
onMounted(() => {
  fetchDashboardData()
})
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-highlighted">
          Dashboard Gereja
        </h1>
        <p v-if="user" class="text-sm text-muted mt-1">
          Selamat datang, {{ user.name || user.username }}
        </p>
      </div>
      <UButton
        v-if="!loading"
        icon="i-lucide-refresh-cw"
        color="neutral"
        variant="ghost"
        @click="fetchDashboardData"
      >
        Refresh
      </UButton>
    </div>

    <!-- Loading State -->
    <UCard v-if="loading">
      <div class="flex flex-col items-center justify-center py-12">
        <UIcon name="i-lucide-loader-2" class="size-8 animate-spin text-primary mb-4" />
        <p class="text-sm text-muted">
          Memuat data dashboard...
        </p>
      </div>
    </UCard>

    <!-- Error State -->
    <UAlert
      v-if="error && !loading"
      icon="i-lucide-alert-circle"
      color="error"
      variant="subtle"
      :title="error"
      :close-button="{
        variant: 'ghost',
        color: 'error'
      }"
      @close="error = ''"
    >
      <template #actions>
        <UButton
          color="error"
          variant="ghost"
          @click="fetchDashboardData"
        >
          Coba Lagi
        </UButton>
      </template>
    </UAlert>

    <!-- Stats Grid -->
    <div v-if="!loading" class="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      <UCard
        v-for="(stat, index) in statsCards"
        :key="index"
        :ui="{
          root: 'hover:bg-elevated/50 transition-colors cursor-default',
          body: 'space-y-3'
        }"
      >
        <div class="flex items-start justify-between">
          <div class="flex-1">
            <p class="text-xs text-muted uppercase tracking-wider mb-1.5">
              {{ stat.label }}
            </p>
            <p class="text-2xl font-bold text-highlighted">
              {{ stat.value }}
            </p>
          </div>
          <div
            class="shrink-0 p-2.5 rounded-lg"
            :class="{
              'bg-primary/10': stat.color === 'primary',
              'bg-success/10': stat.color === 'success',
              'bg-warning/10': stat.color === 'warning',
              'bg-info/10': stat.color === 'info'
            }"
          >
            <UIcon
              :name="stat.icon"
              class="size-5"
              :class="{
                'text-primary': stat.color === 'primary',
                'text-success': stat.color === 'success',
                'text-warning': stat.color === 'warning',
                'text-info': stat.color === 'info'
              }"
            />
          </div>
        </div>
      </UCard>
    </div>

    <!-- Chart Card -->
    <UCard v-if="!loading" :ui="{ body: 'space-y-4' }">
      <template #header>
        <div>
          <h2 class="text-lg font-semibold text-highlighted">
            Statistik Gereja
          </h2>
          <p class="text-xs text-muted mt-0.5">
            Ringkasan data jemaat, keluarga, pelayanan, dan keuangan
          </p>
        </div>
      </template>

      <!-- Simple Bar Chart using CSS -->
      <div class="space-y-4">
        <div
          v-for="(stat, index) in statsCards"
          :key="index"
          class="space-y-2"
        >
          <div class="flex items-center justify-between text-sm">
            <div class="flex items-center gap-2">
              <UIcon
                :name="stat.icon"
                class="size-4"
                :class="{
                  'text-primary': stat.color === 'primary',
                  'text-success': stat.color === 'success',
                  'text-warning': stat.color === 'warning',
                  'text-info': stat.color === 'info'
                }"
              />
              <span class="text-muted">{{ stat.label }}</span>
            </div>
            <span class="font-medium text-highlighted">{{ stat.value }}</span>
          </div>
          <div class="h-2 bg-elevated rounded-full overflow-hidden">
            <div
              class="h-full rounded-full transition-all duration-500"
              :class="{
                'bg-primary': stat.color === 'primary',
                'bg-success': stat.color === 'success',
                'bg-warning': stat.color === 'warning',
                'bg-info': stat.color === 'info'
              }"
              :style="{
                width: `${Math.min((typeof stat.value === 'number' ? stat.value : 0) / Math.max(stats.members, stats.kk, stats.pelayanan, 100) * 100, 100)}%`
              }"
            />
          </div>
        </div>
      </div>
    </UCard>

    <!-- Quick Stats Summary -->
    <UCard v-if="!loading" :ui="{ body: 'divide-y divide-default' }">
      <template #header>
        <h2 class="text-lg font-semibold text-highlighted">
          Ringkasan Cepat
        </h2>
      </template>

      <div class="grid sm:grid-cols-2 gap-4 py-4">
        <div class="flex items-center gap-3">
          <div class="p-2 rounded-lg bg-primary/10">
            <UIcon name="i-lucide-trending-up" class="size-5 text-primary" />
          </div>
          <div>
            <p class="text-xs text-muted">
              Rata-rata per KK
            </p>
            <p class="text-lg font-semibold text-highlighted">
              {{ stats.kk > 0 ? (stats.members / stats.kk).toFixed(1) : '0' }} orang
            </p>
          </div>
        </div>

        <div class="flex items-center gap-3">
          <div class="p-2 rounded-lg bg-success/10">
            <UIcon name="i-lucide-percent" class="size-5 text-success" />
          </div>
          <div>
            <p class="text-xs text-muted">
              % Pelayanan Aktif
            </p>
            <p class="text-lg font-semibold text-highlighted">
              {{ stats.members > 0 ? ((stats.pelayanan / stats.members) * 100).toFixed(1) : '0' }}%
            </p>
          </div>
        </div>
      </div>
    </UCard>
  </div>
</template>

<style scoped>
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}
</style>
