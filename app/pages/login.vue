<script setup lang="ts">
definePageMeta({
  ssr: false,
  layout: 'auth'
})
import { ref } from 'vue'
const username = ref('')
const password = ref('')
const { login } = useAuth()
const loading = ref(false)
const error = ref('')
async function submit() {
  loading.value = true
  error.value = ''
  try {
    await login(username.value, password.value)
    await navigateTo('/')
  } catch (err: any) {
    error.value = err.message || 'Username atau password salah'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <!-- Full screen with white background (changeable to image later) -->
  <div class="min-h-screen w-full flex items-center justify-center bg-white relative p-4">
    <!-- Large container with black opacity background -->
    <div class="w-full max-w-7xl bg-black/60 backdrop-blur-sm rounded-2xl p-8 md:p-12 relative">
      <!-- Header: Logo on left, Navigation on right -->
      <div class="flex justify-between items-start mb-12">
        <!-- Logo -->
        <h1 class="text-2xl md:text-3xl font-bold text-white">
          GKP AWILIGAR <span class="text-white">ERP</span>
        </h1>

        <!-- Navigation tabs on the right, aligned with form - BIGGER SIZE -->
        <div class="flex gap-12 text-xl pt-1">
          <a href="#" class="text-white font-semibold border-b-2 border-white pb-2">Login</a>
          <a href="#" class="text-white hover:text-gray-300">Formulir</a>
          <a href="#" class="text-white hover:text-gray-300">Bantuan</a>
          <a href="#" class="text-white hover:text-gray-300">Kontak</a>
        </div>
      </div>

      <!-- Main content: Left content + Right login form -->
      <div class="flex gap-8 items-start">
        <!-- Left panel: Research info -->
        <div class="flex-1">
          <p class="text-xs text-gray-400 mb-4">Berita oleh admin, 10/10/2025 13:20</p>

          <h2 class="text-3xl md:text-4xl font-bold text-cyan-400 mb-4">
            Religion and Relationship Quality
          </h2>

          <p class="text-sm text-gray-300 mb-4">
            Penelitian oleh Wilcox dkk. (2008)
          </p>

          <p class="text-sm text-gray-200 leading-relaxed mb-4">
            Penelitian ini menguji keluarga di lingkungan urban, memeriksa apakah
            partisipasi keagamaan (khususnya kehadiran gereja) terkait dengan perasaan,
            perilaku, dan kualitas hubungan antar pasangan. Hasilnya menunjukkan
            bahwa pasangan di mana kedua mitra sering menghadiri gereja menunjukkan
            lebih banyak nilai-nilai tradisional, norma "code of decency", dan perilaku
            pendukung dalam hubungan — dan unsur-unsur ini diasumsikan mendukung
            kebahagiaan relasional. Penelitian ini mengontrol variabel demografis seperti
            usia, pendidikan, status perkawinan, dan struktur keluarga saat masa remaja
            agar mengurangi kemungkinan adanya variabel perantara (spuriousness).
          </p>

          <a href="#" class="text-cyan-400 text-sm hover:underline inline-flex items-center">
            Baca selengkapnya
            <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </a>

          <!-- Carousel dots -->
          <div class="flex justify-center gap-2 mt-12">
            <span class="w-2.5 h-2.5 rounded-full bg-white"></span>
            <span class="w-2.5 h-2.5 rounded-full bg-gray-600"></span>
            <span class="w-2.5 h-2.5 rounded-full bg-gray-600"></span>
            <span class="w-2.5 h-2.5 rounded-full bg-gray-600"></span>
            <span class="w-2.5 h-2.5 rounded-full bg-gray-600"></span>
            <span class="w-2.5 h-2.5 rounded-full bg-gray-600"></span>
            <span class="w-2.5 h-2.5 rounded-full bg-gray-600"></span>
            <span class="w-2.5 h-2.5 rounded-full bg-gray-600"></span>
            <span class="w-2.5 h-2.5 rounded-full bg-gray-600"></span>
          </div>
        </div>

        <!-- Right panel: Login form with subtle white glow on edges -->
        <div class="w-full max-w-sm">
          <!-- Outer glow wrapper -->
          <div class="relative">
            <!-- Subtle white glow behind form - smaller -->
            <div class="absolute -inset-1 bg-white/20 rounded-2xl blur-md"></div>

            <!-- Solid black form -->
            <div class="relative bg-black rounded-2xl p-8 shadow-2xl border border-gray-700/50">
              <h2 class="text-3xl font-bold text-white mb-2">Selamat Datang</h2>
              <p class="text-gray-400 text-sm mb-8">
                Silakan masukkan username<br />dan password Anda.
              </p>

              <form @submit.prevent="submit" class="space-y-5">
                <!-- Error -->
                <div v-if="error" class="p-3 bg-red-900/50 border border-red-500 text-red-200 rounded-lg text-sm">
                  {{ error }}
                </div>

                <!-- Username -->
                <div>
                  <input
                    v-model="username"
                    type="text"
                    placeholder="Username (email)"
                    required
                    class="w-full px-4 py-3 bg-gray-800/80 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition"
                  />
                </div>

                <!-- Password -->
                <div>
                  <input
                    v-model="password"
                    type="password"
                    placeholder="Password"
                    required
                    class="w-full px-4 py-3 bg-gray-800/80 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition"
                  />
                </div>

                <!-- Submit button -->
                <button
                  type="submit"
                  :disabled="loading"
                  class="w-full py-3 bg-cyan-500 hover:bg-cyan-600 text-white font-semibold rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-cyan-500/20"
                >
                  {{ loading ? 'Login...' : 'Login' }}
                </button>

                <!-- Links -->
                <div class="flex justify-between mt-6 text-sm">
                  <a href="#" class="text-gray-400 hover:text-cyan-400 transition">Lupa password?</a>
                  <a href="#" class="text-gray-400 hover:text-cyan-400 transition">Buat akun</a>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Add background image later by uncommenting and adding image URL */

.bg-white {
  background-image: url('/pages/background.png');
  background-size: cover;
  background-position: center;
}

</style>
