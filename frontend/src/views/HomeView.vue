<script setup>
import { useAuth } from '@/composables/useAuth'

const { isAuthenticated } = useAuth()
</script>

<template>
  <div class="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100 antialiased min-h-screen flex flex-col">
    <!-- Main Content -->
    <main class="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

      <!-- Hero Section -->
      <div class="flex flex-col items-center justify-center text-center py-20">
        <div class="mb-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-full">
          <span class="material-symbols-outlined text-6xl text-primary">view_kanban</span>
        </div>
        <h1 class="text-4xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white mb-6">
          Atur Pekerjaan,<br/>Capai Tujuan Bersama.
        </h1>
        <p class="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mb-10 leading-relaxed">
          Platform manajemen proyek yang intuitif untuk tim modern. Visualisasikan alur kerja, lacak progres, dan selesaikan tugas lebih cepat dengan Kanban App.
        </p>
        
        <div class="flex flex-col sm:flex-row gap-4">
          <template v-if="!isAuthenticated">
            <router-link to="/register" class="flex items-center justify-center gap-2 rounded-xl h-14 px-8 bg-primary hover:bg-blue-600 text-white text-lg font-bold shadow-xl shadow-primary/20 transition-all hover:-translate-y-1">
              Mulai Sekarang
              <span class="material-symbols-outlined">arrow_forward</span>
            </router-link>
            <router-link to="/login" class="flex items-center justify-center gap-2 rounded-xl h-14 px-8 bg-white dark:bg-surface-dark border border-slate-200 dark:border-slate-700 hover:border-primary text-slate-700 dark:text-slate-200 text-lg font-bold transition-all">
              Masuk ke Akun
            </router-link>
          </template>
          <template v-else>
             <router-link to="/boards" class="flex items-center justify-center gap-2 rounded-xl h-14 px-8 bg-primary hover:bg-blue-600 text-white text-lg font-bold shadow-xl shadow-primary/20 transition-all hover:-translate-y-1">
              Buka Dashboard
              <span class="material-symbols-outlined">dashboard</span>
            </router-link>
          </template>
        </div>

        <!-- Feature Preview Image -->
        <div class="mt-20 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden w-full max-w-4xl bg-slate-100 dark:bg-slate-800 aspect-video relative group">
           <img src="/home.png" alt="Dashboard Preview" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
           <div class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end justify-center pb-8 opacity-0 group-hover:opacity-100 transition-opacity">
             <p class="text-white font-medium">Preview Dashboard</p>
           </div>
        </div>
      </div>
    </main>
  </div>
</template>
