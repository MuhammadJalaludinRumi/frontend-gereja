<script setup lang="ts">
definePageMeta({
  ssr: false,
  layout: 'auth'
})

import { ref, onMounted } from 'vue'

import { useAuth } from '~/composables/useAuth'
import { useNews } from '~/composables/useNews'
const { login, requestPasswordReset, verifyOtp, resetPassword } = useAuth()

const showForgotPassword = ref(false)

const username = ref('')
const password = ref('')
const email = ref('')
const message = ref('')
const loading = ref(false)
const error = ref('')
const step = ref("email")
const otp = ref('')
const resetToken = ref('')

const { loginNews, fetchLoginNews } = useNews()

onMounted(() => {
  fetchLoginNews()
})

async function submitLogin() {
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

async function submitForgot() {
  loading.value = true
  message.value = ''
  error.value = ''

  try {
    const res = await requestPasswordReset(email.value)

    resetToken.value = res.token

    step.value = "otp"
    message.value = "Kode OTP telah dikirim ke email Anda."
  } catch (err: any) {
    error.value = err.message || 'Terjadi kesalahan'
  } finally {
    loading.value = false
  }
}

async function submitOtp() {
  loading.value = true
  error.value = ''

  try {
    const res = await verifyOtp(resetToken.value, otp.value)
    step.value = "reset"
    message.value = "OTP berhasil diverifikasi!"
  } catch (err: any) {
    error.value = err.message || 'OTP salah'
  } finally {
    loading.value = false
  }
}

const newPassword = ref('')
const confirmPassword = ref('')

async function submitResetPassword() {
  loading.value = true
  error.value = ''

  try {
    if (newPassword.value !== confirmPassword.value) {
      error.value = "Password tidak sama!"
      return
    }

    await resetPassword(resetToken.value, otp.value, newPassword.value)

    message.value = "Password berhasil diganti! Silakan login."
    showForgotPassword.value = false
    step.value = "email"
    // Reset form
    email.value = ''
    otp.value = ''
    newPassword.value = ''
    confirmPassword.value = ''
    resetToken.value = ''
  } catch (err: any) {
    error.value = err.message || 'Gagal mengganti password'
  } finally {
    loading.value = false
  }
}

</script>

<template>
  <!-- Full screen with white background (changeable to image later) -->
  <div class="min-h-screen w-full flex items-center justify-center bg-white relative p-4">
    <!-- Large container with black opacity background -->
    <div class="w-full max-w-7xl bg-black/60 backdrop-blur-sm rounded-2xl p-4 sm:p-6 md:p-8 lg:p-12 relative">
      <!-- Header: Logo on left, Navigation on right -->
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 sm:mb-12 gap-6 sm:gap-0">
        <!-- Logo -->
        <h1 class="text-xl sm:text-2xl md:text-3xl font-bold text-white">
          GKP AWILIGAR <span class="text-white">ERP</span>
        </h1>

        <!-- Navigation tabs - Hidden on mobile, visible on tablet+ -->
        <div class="hidden md:flex gap-6 lg:gap-12 text-base lg:text-xl">
          <a href="#" class="text-white font-semibold border-b-2 border-white pb-2">Login</a>
          <a href="#" class="text-white hover:text-gray-300 transition">Formulir</a>
          <a href="#" class="text-white hover:text-gray-300 transition">Bantuan</a>
          <a href="https://gkpawiligar.org/contact/" class="text-white hover:text-gray-300 transition">Kontak</a>
        </div>

        <!-- Mobile Navigation Menu (Hamburger) -->
        <div class="flex md:hidden gap-4 text-sm">
          <a href="#" class="text-white font-semibold border-b-2 border-white pb-1">Login</a>
          <a href="#" class="text-white hover:text-gray-300 transition">Bantuan</a>
          <a href="https://gkpawiligar.org/contact/" class="text-white hover:text-gray-300 transition">Kontak</a>
        </div>
      </div>

      <!-- Main content: Left content + Right login form -->
      <div class="flex flex-col lg:flex-row gap-6 lg:gap-8 items-stretch">
        <!-- Left panel: Research info - Hidden on mobile, visible on tablet+ -->
        <!-- News section -->
        <div v-if="loginNews" class="hidden lg:flex flex-1 flex-col">
          <p class="text-xs text-gray-400 mb-4">
            Berita oleh admin · {{ new Date(loginNews.date_post).toLocaleString('id-ID') }}
          </p>

          <h2 class="text-2xl md:text-3xl lg:text-4xl font-bold text-cyan-400 mb-4">
            {{ loginNews.title }}
          </h2>

          <p class="text-sm text-gray-200 leading-relaxed mb-4">
            {{ loginNews.content }}
          </p>

          <a href="#" class="text-cyan-400 text-sm hover:underline flex items-center">
            Baca selengkapnya
            <svg class="w-4 h-4 ml-1" stroke="currentColor" fill="none" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </a>

          <!-- dots -->
          <div class="flex justify-center gap-2 mt-auto pt-12">
            <span class="w-2.5 h-2.5 rounded-full bg-white"></span>
          </div>
        </div>

        <!-- If no news -->
        <div v-else class="hidden lg:flex flex-1 text-gray-400 justify-center items-center">
          Tidak ada berita ditampilkan di halaman login.
        </div>

        <!-- Right panel: Login form with subtle white glow on edges -->
        <!-- Right panel: Login / Forgot Password -->
        <div class="w-full lg:max-w-sm mx-auto lg:mx-0">
          <div class="relative">
            <div class="absolute -inset-1 bg-white/20 rounded-2xl blur-md"></div>

            <div class="relative bg-black rounded-2xl p-6 sm:p-8 shadow-2xl border border-gray-700/50">

              <!-- ================= LOGIN FORM ================= -->
              <template v-if="!showForgotPassword">
                <h2 class="text-2xl sm:text-3xl font-bold text-white mb-2">Selamat Datang</h2>
                <p class="text-gray-400 text-sm mb-6 sm:mb-8">Silakan masukkan username dan password Anda.</p>

                <div v-if="error" class="p-3 bg-red-900/50 border border-red-500 text-red-200 rounded mb-4 text-sm">
                  {{ error }}
                </div>

                <div v-if="message" class="p-3 bg-green-900/50 border border-green-500 text-green-200 rounded mb-4 text-sm">
                  {{ message }}
                </div>

                <form @submit.prevent="submitLogin" class="space-y-4 sm:space-y-5">

                  <input v-model="username" type="text" placeholder="Username (email)" required
                    class="w-full px-4 py-3 bg-gray-800/80 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500 transition" />

                  <input v-model="password" type="password" placeholder="Password" required
                    class="w-full px-4 py-3 bg-gray-800/80 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500 transition" />

                  <button type="submit" :disabled="loading"
                    class="w-full py-3 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg font-semibold disabled:opacity-50 transition">
                    {{ loading ? 'Login...' : 'Login' }}
                  </button>

                  <div class="flex justify-between text-xs sm:text-sm mt-4">
                    <button type="button" @click="showForgotPassword = true"
                      class="text-gray-400 hover:text-cyan-400 transition">
                      Lupa password?
                    </button>
                  </div>
                </form>
              </template>

              <!-- ================= FORGOT PASSWORD FORM ================= -->
              <template v-else>

                <!-- STEP EMAIL -->
                <template v-if="step === 'email'">
                  <h2 class="text-2xl sm:text-3xl font-bold text-white mb-2">Lupa Password</h2>
                  <p class="text-gray-400 text-sm mb-6 sm:mb-8">Masukkan email Anda untuk menerima kode OTP.</p>

                  <div v-if="message" class="p-3 bg-green-900/50 border border-green-500 text-green-200 rounded mb-4 text-sm">
                    {{ message }}
                  </div>
                  <div v-if="error" class="p-3 bg-red-900/50 border border-red-500 text-red-200 rounded mb-4 text-sm">
                    {{ error }}
                  </div>

                  <form @submit.prevent="submitForgot" class="space-y-4 sm:space-y-5">
                    <input v-model="email" type="email" placeholder="Email" required
                      class="w-full px-4 py-3 bg-gray-800/80 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500 transition" />
                    <button type="submit" :disabled="loading"
                      class="w-full py-3 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg font-semibold disabled:opacity-50 transition">
                      {{ loading ? 'Mengirim...' : 'Kirim OTP' }}
                    </button>
                  </form>
                </template>

                <!-- STEP OTP -->
                <template v-else-if="step === 'otp'">
                  <h2 class="text-2xl sm:text-3xl font-bold text-white mb-2">Verifikasi OTP</h2>
                  <p class="text-gray-400 text-sm mb-6 sm:mb-8">Masukkan kode OTP yang dikirim ke email Anda.</p>

                  <div v-if="message" class="p-3 bg-green-900/50 border border-green-500 text-green-200 rounded mb-4 text-sm">
                    {{ message }}
                  </div>
                  <div v-if="error" class="p-3 bg-red-900/50 border border-red-500 text-red-200 rounded mb-4 text-sm">
                    {{ error }}
                  </div>

                  <form @submit.prevent="submitOtp" class="space-y-4 sm:space-y-5">
                    <input v-model="otp" type="text" placeholder="Kode OTP (6 digit)" required maxlength="6"
                      class="w-full px-4 py-3 bg-gray-800/80 border border-gray-700 rounded-lg text-white placeholder-gray-400 text-center text-2xl font-mono tracking-widest focus:outline-none focus:border-cyan-500 transition" />
                    <button type="submit" :disabled="loading"
                      class="w-full py-3 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg font-semibold disabled:opacity-50 transition">
                      {{ loading ? 'Memeriksa...' : 'Verifikasi OTP' }}
                    </button>
                    <p class="text-xs text-gray-500 text-center mt-3">
                      Kode OTP berlaku selama 10 menit
                    </p>
                  </form>
                </template>

                <!-- STEP RESET PASSWORD -->
                <template v-else-if="step === 'reset'">
                  <h2 class="text-2xl sm:text-3xl font-bold text-white mb-2">Ubah Password</h2>
                  <p class="text-gray-400 text-sm mb-6 sm:mb-8">Buat password baru untuk akun Anda.</p>

                  <div v-if="message" class="p-3 bg-green-900/50 border border-green-500 text-green-200 rounded mb-4 text-sm">
                    {{ message }}
                  </div>
                  <div v-if="error" class="p-3 bg-red-900/50 border border-red-500 text-red-200 rounded mb-4 text-sm">
                    {{ error }}
                  </div>

                  <form @submit.prevent="submitResetPassword" class="space-y-4 sm:space-y-5">
                    <input v-model="newPassword" type="password" placeholder="Password Baru" required
                      class="w-full px-4 py-3 bg-gray-800/80 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500 transition" />
                    <input v-model="confirmPassword" type="password" placeholder="Konfirmasi Password" required
                      class="w-full px-4 py-3 bg-gray-800/80 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500 transition" />
                    <button type="submit" :disabled="loading"
                      class="w-full py-3 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg font-semibold disabled:opacity-50 transition">
                      {{ loading ? 'Menyimpan...' : 'Ganti Password' }}
                    </button>
                    <p class="text-xs text-gray-500 text-center mt-3">
                      Password minimal 8 karakter
                    </p>
                  </form>
                </template>

                <!-- BUTTON BACK -->
                <button type="button" @click="showForgotPassword = false; step = 'email'; error = ''; message = ''"
                  class="w-full mt-6 text-sm text-gray-400 hover:text-cyan-400 transition flex items-center justify-center gap-2">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                  </svg>
                  Kembali ke Login
                </button>

              </template>

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

/* Ensure mobile keyboard doesn't break layout */
@media (max-height: 700px) {
  .min-h-screen {
    min-height: 100vh;
    min-height: -webkit-fill-available;
  }
}

/* Additional mobile optimizations */
@media (max-width: 640px) {

  /* Reduce padding on very small screens */
  .bg-black\/60 {
    max-height: 95vh;
    overflow-y: auto;
  }
}
</style>
