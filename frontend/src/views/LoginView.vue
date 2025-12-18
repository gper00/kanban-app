<script setup>
import { ref } from 'vue'
import { useAuth } from '@/composables/useAuth'
import { useRouter } from 'vue-router'

const router = useRouter()
const { login } = useAuth()

const formData = ref({
  email: '',
  password: ''
})

const loading = ref(false)
const error = ref('')
const showPassword = ref(false)

const handleSubmit = async () => {
  error.value = ''
  loading.value = true

  try {
    const result = await login(formData.value)

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
  <div class="relative flex min-h-screen w-full flex-col bg-background-light dark:bg-background-dark group/design-root font-display">
    <div class="flex flex-1">
      <div class="flex w-full flex-col lg:flex-row">
        <!-- Left Column -->
        <div class="relative hidden w-full flex-col items-center justify-center bg-[#197fe6]/10 p-8 dark:bg-background-dark lg:flex lg:w-1/2">
          <div class="absolute inset-0">
            <img
              alt="Tim kolaborasi sedang bekerja di kantor modern"
              class="h-full w-full object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBV54L2WWbMPBVw5oAul17GMdjlxYmFmAY1z_OhH1MvkSlFUnIo2NcQvwgNLZ-GbO0hlaLLnT0X5wHzfZy9G9-uvVAiDjyAUrRfw4x0hqy5ClGrjH521xQYpSnuEKOV8fMrn7JSs68ezwz_Ltgf0jKXONJBb5m5zSKQvTHpCKKVF50td9zp2RyNM1Cl17GuHIBJcPdCBRSFIjGJQAtTx6ZsptEDPGyRSA0aqAGa-NvkpbIY9vC5QTVxuWn_tOyKPoARkO500GTl54oT"
            />
            <div class="absolute inset-0 bg-primary/70 dark:bg-background-dark/80"></div>
          </div>
          <div class="relative z-10 flex max-w-md flex-col items-start text-white">
            <div class="mb-6 flex items-center gap-4">
              <span class="material-symbols-outlined text-4xl text-white">dashboard</span>
              <span class="text-3xl font-bold">Kanban App</span>
            </div>
            <h2 class="text-4xl font-bold leading-tight mb-4">
              Atur proyek Anda, capai tujuan Anda.
            </h2>
            <p class="text-lg opacity-80">
              Platform manajemen proyek kami membantu Anda dan tim Anda tetap
              terorganisir dan fokus pada hal yang paling penting.
            </p>
          </div>
        </div>
        <!-- Right Column -->
        <div class="flex w-full flex-col items-center justify-center bg-background-light p-4 dark:bg-background-dark lg:w-1/2">
          <div class="flex w-full max-w-sm flex-col items-start justify-center">
            <div class="mb-8 w-full text-left">
              <h1 class="text-slate-900 dark:text-slate-50 text-[32px] font-bold tracking-tight leading-tight">
                Selamat Datang Kembali
              </h1>
              <p class="text-slate-600 dark:text-slate-400 mt-2">
                Silakan masukkan detail Anda untuk melanjutkan.
              </p>
            </div>

            <!-- Error Message -->
            <div v-if="error" class="w-full mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p class="text-sm text-red-600">{{ error }}</p>
            </div>

            <form @submit.prevent="handleSubmit" class="flex w-full flex-col gap-4">
              <label class="flex flex-col flex-1 w-full">
                <p class="text-slate-900 dark:text-slate-50 text-base font-medium leading-normal pb-2">
                  Email
                </p>
                <div class="flex w-full flex-1 items-stretch rounded-lg">
                  <input
                    v-model="formData.email"
                    type="email"
                    required
                    class="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-slate-900 dark:text-slate-50 focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-slate-300 dark:border-slate-700 bg-background-light dark:bg-slate-800 h-14 placeholder:text-slate-400 dark:placeholder:text-slate-500 p-[15px] pr-2 text-base font-normal leading-normal"
                    placeholder="Masukkan email Anda"
                  />
                </div>
              </label>
              <label class="flex flex-col flex-1 w-full">
                <p class="text-slate-900 dark:text-slate-50 text-base font-medium leading-normal pb-2">
                  Kata Sandi
                </p>
                <div class="flex w-full flex-1 items-stretch rounded-lg">
                  <input
                    v-model="formData.password"
                    :type="showPassword ? 'text' : 'password'"
                    required
                    class="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-slate-900 dark:text-slate-50 focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-slate-300 dark:border-slate-700 bg-background-light dark:bg-slate-800 h-14 placeholder:text-slate-400 dark:placeholder:text-slate-500 p-[15px] rounded-r-none border-r-0 pr-2 text-base font-normal leading-normal"
                    placeholder="Masukkan kata sandi Anda"
                  />
                  <div class="text-slate-500 dark:text-slate-400 flex border border-slate-300 dark:border-slate-700 bg-background-light dark:bg-slate-800 items-center justify-center pr-[15px] rounded-r-lg border-l-0">
                    <button type="button" @click="showPassword = !showPassword" class="focus:outline-none">
                        <span class="material-symbols-outlined cursor-pointer">{{ showPassword ? 'visibility_off' : 'visibility' }}</span>
                    </button>
                  </div>
                </div>
              </label>

              <div class="w-full text-right mt-2">
                <a href="#" class="text-primary hover:underline text-sm font-normal leading-normal cursor-pointer">
                  Lupa Kata Sandi?
                </a>
              </div>

              <div class="flex w-full py-3 justify-center mt-4">
                <button
                  type="submit"
                  :disabled="loading"
                  class="flex min-w-[84px] w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-5 flex-1 bg-primary text-slate-50 text-base font-bold leading-normal tracking-[0.015em] hover:bg-primary/90 focus:ring-4 focus:ring-primary/30 dark:focus:ring-primary/50 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span v-if="!loading" class="truncate">Masuk</span>
                  <span v-else class="flex items-center gap-2">
                    <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Memproses...
                  </span>
                </button>
              </div>
            </form>

            <div class="w-full text-center mt-4">
              <p class="text-slate-600 dark:text-slate-400 text-sm font-normal leading-normal">
                Belum punya akun?
                <router-link to="/register" class="font-medium text-primary hover:underline">
                  Daftar di sini
                </router-link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
