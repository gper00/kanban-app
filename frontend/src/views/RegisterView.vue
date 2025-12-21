<script setup>
import { ref } from 'vue'
import { useAuth } from '@/composables/useAuth'
import { useRouter } from 'vue-router'

const router = useRouter()
const { register } = useAuth()

const formData = ref({
  name: '',
  email: '',
  password: '',
  confirmPassword: ''
})

const loading = ref(false)
const error = ref('')
const showPassword = ref(false)
const showConfirmPassword = ref(false)

const handleSubmit = async () => {
  error.value = ''

  // Validasi Password Match
  if (formData.value.password !== formData.value.confirmPassword) {
    error.value = 'Kata sandi dan konfirmasi kata sandi tidak cocok.'
    return
  }

  loading.value = true

  try {
    const { confirmPassword, ...registerData } = formData.value
    const result = await register(registerData)

    if (result.success) {
      router.push('/')
    } else {
      error.value = result.error
    }
  } catch (err) {
    error.value = 'Terjadi kesalahan. Silakan coba lagi.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="relative flex min-h-screen w-full flex-col items-center justify-center font-display bg-background-light dark:bg-background-dark text-[#0e141b] dark:text-gray-200">
    <!-- Top Navigation Bar -->
    <header class="absolute top-0 flex w-full max-w-7xl items-center justify-between whitespace-nowrap px-4 py-5 sm:px-6 lg:px-8">
      <div class="flex items-center gap-4 text-[#0e141b] dark:text-white">
        <div class="size-6">
          <svg fill="currentColor" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
            <path d="M13.8261 17.4264C16.7203 18.1174 20.2244 18.5217 24 18.5217C27.7756 18.5217 31.2797 18.1174 34.1739 17.4264C36.9144 16.7722 39.9967 15.2331 41.3563 14.1648L24.8486 40.6391C24.4571 41.267 23.5429 41.267 23.1514 40.6391L6.64374 14.1648C8.00331 15.2331 11.0856 16.7722 13.8261 17.4264Z"></path>
            <path clip-rule="evenodd" d="M39.998 12.236C39.9944 12.2537 39.9875 12.2845 39.9748 12.3294C39.9436 12.4399 39.8949 12.5741 39.8346 12.7175C39.8168 12.7597 39.7989 12.8007 39.7813 12.8398C38.5103 13.7113 35.9788 14.9393 33.7095 15.4811C30.9875 16.131 27.6413 16.5217 24 16.5217C20.3587 16.5217 17.0125 16.131 14.2905 15.4811C12.0012 14.9346 9.44505 13.6897 8.18538 12.8168C8.17384 12.7925 8.16216 12.767 8.15052 12.7408C8.09919 12.6249 8.05721 12.5114 8.02977 12.411C8.00356 12.3152 8.00039 12.2667 8.00004 12.2612C8.00004 12.261 8 12.2607 8.00004 12.2612C8.00004 12.2359 8.0104 11.9233 8.68485 11.3686C9.34546 10.8254 10.4222 10.2469 11.9291 9.72276C14.9242 8.68098 19.1919 8 24 8C28.8081 8 33.0758 8.68098 36.0709 9.72276C37.5778 10.2469 38.6545 10.8254 39.3151 11.3686C39.9006 11.8501 39.9857 12.1489 39.998 12.236ZM4.95178 15.2312L21.4543 41.6973C22.6288 43.5809 25.3712 43.5809 26.5457 41.6973L43.0534 15.223C43.0709 15.1948 43.0878 15.1662 43.104 15.1371L41.3563 14.1648C43.104 15.1371 43.1038 15.1374 43.104 15.1371L43.1051 15.135L43.1065 15.1325L43.1101 15.1261L43.1199 15.1082C43.1276 15.094 43.1377 15.0754 43.1497 15.0527C43.1738 15.0075 43.2062 14.9455 43.244 14.8701C43.319 14.7208 43.4196 14.511 43.5217 14.2683C43.6901 13.8679 44 13.0689 44 12.2609C44 10.5573 43.003 9.22254 41.8558 8.2791C40.6947 7.32427 39.1354 6.55361 37.385 5.94477C33.8654 4.72057 29.133 4 24 4C18.867 4 14.1346 4.72057 10.615 5.94478C8.86463 6.55361 7.30529 7.32428 6.14419 8.27911C4.99695 9.22255 3.99999 10.5573 3.99999 12.2609C3.99999 13.1275 4.29264 13.9078 4.49321 14.3607C4.60375 14.6102 4.71348 14.8196 4.79687 14.9689C4.83898 15.0444 4.87547 15.1065 4.9035 15.1529C4.91754 15.1762 4.92954 15.1957 4.93916 15.2111L4.94662 15.223L4.95178 15.2312ZM35.9868 18.996L24 38.22L12.0131 18.996C12.4661 19.1391 12.9179 19.2658 13.3617 19.3718C16.4281 20.1039 20.0901 20.5217 24 20.5217C27.9099 20.5217 31.5719 20.1039 34.6383 19.3718C35.082 19.2658 35.5339 19.1391 35.9868 18.996Z" fill-rule="evenodd"></path>
          </svg>
        </div>
        <h2 class="text-lg font-bold leading-tight tracking-[-0.015em] text-[#0e141b] dark:text-white">
          KanbanApp
        </h2>
      </div>
      <router-link
        to="/login"
        class="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-gray-200/80 dark:bg-gray-700/80 text-[#0e141b] dark:text-white text-sm font-bold leading-normal tracking-[0.015em] hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
      >
        <span class="truncate">Masuk</span>
      </router-link>
    </header>

    <main class="flex w-full flex-1 flex-col items-center justify-center px-4 py-20">
      <div class="w-full max-w-md rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800 sm:p-8">
        <!-- Headline Text -->
        <div class="text-center">
          <h1 class="text-3xl font-bold tracking-tight text-[#0e141b] dark:text-white">
            Buat Akun Baru
          </h1>
          <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Mulai kelola proyek Anda dengan mudah.
          </p>
        </div>

        <!-- Error Message -->
        <div v-if="error" class="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p class="text-sm text-red-600 whitespace-pre-line">{{ error }}</p>
        </div>

        <form @submit.prevent="handleSubmit" class="mt-8 space-y-6">
          <!-- Name Field -->
          <div class="flex flex-col">
            <label class="pb-2 text-sm font-medium text-[#0e141b] dark:text-gray-300" for="name">Nama</label>
            <input
              v-model="formData.name"
              id="name"
              name="name"
              placeholder="Masukkan nama Anda"
              type="text"
              required
              class="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg border border-gray-300 bg-background-light p-3 text-base text-[#0e141b] placeholder:text-gray-400 focus:border-primary focus:outline-0 focus:ring-2 focus:ring-primary/30 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-500"
            />
          </div>
          <!-- Email Field -->
          <div class="flex flex-col">
            <label class="pb-2 text-sm font-medium text-[#0e141b] dark:text-gray-300" for="email">Email</label>
            <input
              v-model="formData.email"
              id="email"
              name="email"
              placeholder="Masukkan alamat email Anda"
              type="email"
              required
              class="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg border border-gray-300 bg-background-light p-3 text-base text-[#0e141b] placeholder:text-gray-400 focus:border-primary focus:outline-0 focus:ring-2 focus:ring-primary/30 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-500"
            />
          </div>
          <!-- Password Field -->
          <div class="flex flex-col">
            <label class="pb-2 text-sm font-medium text-[#0e141b] dark:text-gray-300" for="password">Kata Sandi</label>
            <div class="relative flex w-full flex-1 items-stretch">
              <input
                v-model="formData.password"
                :type="showPassword ? 'text' : 'password'"
                id="password"
                name="password"
                placeholder="Masukkan kata sandi Anda"
                required
                class="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-l-lg border border-r-0 border-gray-300 bg-background-light p-3 pr-2 text-base text-[#0e141b] placeholder:text-gray-400 focus:z-10 focus:border-primary focus:outline-0 focus:ring-2 focus:ring-primary/30 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-500"
              />
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="flex items-center justify-center rounded-r-lg border border-l-0 border-gray-300 bg-background-light px-3 text-gray-500 hover:bg-gray-100 focus:z-10 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-400 dark:hover:bg-gray-600"
              >
                <span class="material-symbols-outlined text-xl">{{ showPassword ? 'visibility_off' : 'visibility' }}</span>
              </button>
            </div>
          </div>

          <!-- Confirm Password Field -->
          <div class="flex flex-col">
            <label class="pb-2 text-sm font-medium text-[#0e141b] dark:text-gray-300" for="confirm-password">Konfirmasi Kata Sandi</label>
            <div class="relative flex w-full flex-1 items-stretch">
              <input
                v-model="formData.confirmPassword"
                :type="showConfirmPassword ? 'text' : 'password'"
                id="confirm-password"
                name="confirm-password"
                placeholder="Konfirmasi kata sandi Anda"
                required
                class="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-l-lg border border-r-0 border-gray-300 bg-background-light p-3 pr-2 text-base text-[#0e141b] placeholder:text-gray-400 focus:z-10 focus:border-primary focus:outline-0 focus:ring-2 focus:ring-primary/30 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-500"
              />
              <button
                type="button"
                @click="showConfirmPassword = !showConfirmPassword"
                class="flex items-center justify-center rounded-r-lg border border-l-0 border-gray-300 bg-background-light px-3 text-gray-500 hover:bg-gray-100 focus:z-10 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-400 dark:hover:bg-gray-600"
              >
                <span class="material-symbols-outlined text-xl">{{ showConfirmPassword ? 'visibility_off' : 'visibility' }}</span>
              </button>
            </div>
          </div>

          <!-- Submit Button -->
          <button
            type="submit"
            :disabled="loading"
            class="flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-4 bg-primary text-white text-base font-bold leading-normal tracking-[0.015em] hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <span v-if="!loading" class="truncate">Daftar</span>
            <span v-else class="flex items-center gap-2">
                <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Memproses...
            </span>
          </button>
        </form>

        <!-- Login Link -->
        <div class="mt-6 text-center text-sm">
          <p class="text-gray-600 dark:text-gray-400">
            Sudah punya akun?
            <router-link to="/login" class="font-medium text-primary hover:underline">
              Masuk di sini
            </router-link>
          </p>
        </div>
      </div>
    </main>

    <!-- Footer -->
    <footer class="w-full py-6 px-4 sm:px-6 lg:px-8">
      <div class="mx-auto max-w-md text-center text-xs text-gray-500 dark:text-gray-400">
        <p>
          Dengan mendaftar, Anda menyetujui
          <a class="text-primary hover:underline" href="#">Syarat &amp; Ketentuan</a>
          dan
          <a class="text-primary hover:underline" href="#">Kebijakan Privasi</a>
          kami.
        </p>
      </div>
    </footer>
  </div>
</template>
