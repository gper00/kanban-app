<script setup>
import { onMounted, ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import { useBoard } from '@/composables/useBoard'
import CreateBoardModal from '@/components/CreateBoardModal.vue'
import ConfirmModal from '@/components/ConfirmModal.vue'

const router = useRouter()
const { logout, user, isAuthenticated } = useAuth()
const { boards, fetchBoards, createBoard } = useBoard()

const showCreateBoardModal = ref(false)
const showLogoutModal = ref(false)

onMounted(async () => {
  if (isAuthenticated.value) {
    await fetchBoards()
  }
})

const handleLogout = () => {
  showLogoutModal.value = true
}

const confirmLogout = () => {
  logout()
  // Refresh page or manually reset state if needed, but router push is usually enough
  // Here we stay on home but state changes to guest
  showLogoutModal.value = false
  window.location.reload() 
}

const handleBoardClick = (boardId) => {
  router.push(`/board/${boardId}`)
}

const handleCreateBoard = () => {
  if (!isAuthenticated.value) {
    router.push('/login')
    return
  }
  showCreateBoardModal.value = true
}

const confirmCreateBoard = async (boardData) => {
  try {
    const newBoard = await createBoard(boardData.title, boardData.description)
    if (newBoard) {
      showCreateBoardModal.value = false
      router.push(`/board/${newBoard.id}`)
    }
  } catch (error) {
    alert('Gagal membuat board baru.')
  }
}
</script>

<template>
  <div class="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100 antialiased min-h-screen flex flex-col">
    <!-- Navbar -->
    <nav class="sticky top-0 z-30 w-full bg-white/90 dark:bg-surface-dark/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <div class="flex items-center justify-center size-9 rounded-lg bg-primary text-white shadow-md shadow-primary/20">
          <span class="material-symbols-outlined text-xl">view_kanban</span>
        </div>
        <span class="text-lg font-bold tracking-tight text-slate-900 dark:text-white">Kanban App</span>
      </div>
      <div class="flex items-center gap-6">
        <template v-if="isAuthenticated">
          <div class="flex items-center gap-3 pl-6 border-l border-slate-200 dark:border-slate-700">
            <div class="hidden md:flex flex-col items-end">
              <p class="text-sm font-semibold text-slate-900 dark:text-white">{{ user?.name || 'User' }}</p>
              <p class="text-xs text-slate-500 dark:text-slate-400">{{ user?.email }}</p>
            </div>
            <div @click="handleLogout" class="relative cursor-pointer hover:opacity-90 transition-opacity" title="Logout">
              <div class="flex items-center justify-center bg-primary text-white rounded-full size-9 ring-2 ring-slate-100 dark:ring-slate-700">
                <span class="material-symbols-outlined text-lg">logout</span>
              </div>
            </div>
          </div>
        </template>
        <template v-else>
          <router-link to="/login" class="text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-primary transition-colors">
            Masuk
          </router-link>
          <router-link to="/register" class="bg-primary hover:bg-blue-600 text-white text-sm font-bold px-4 py-2 rounded-lg transition-colors shadow-sm">
            Daftar Gratis
          </router-link>
        </template>
      </div>
    </nav>

    <!-- Main Content -->
    <main class="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      <!-- Guest View (Hero Section) -->
      <div v-if="!isAuthenticated" class="flex flex-col items-center justify-center text-center py-20">
        <div class="mb-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-full">
          <span class="material-symbols-outlined text-6xl text-primary">rocket_launch</span>
        </div>
        <h1 class="text-4xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white mb-6">
          Atur Pekerjaan,<br/>Capai Tujuan Bersama.
        </h1>
        <p class="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mb-10 leading-relaxed">
          Platform manajemen proyek yang intuitif untuk tim modern. Visualisasikan alur kerja, lacak progres, dan selesaikan tugas lebih cepat dengan Kanban App.
        </p>
        <div class="flex flex-col sm:flex-row gap-4">
          <router-link to="/register" class="flex items-center justify-center gap-2 rounded-xl h-14 px-8 bg-primary hover:bg-blue-600 text-white text-lg font-bold shadow-xl shadow-primary/20 transition-all hover:-translate-y-1">
            Mulai Sekarang - Gratis
            <span class="material-symbols-outlined">arrow_forward</span>
          </router-link>
          <router-link to="/login" class="flex items-center justify-center gap-2 rounded-xl h-14 px-8 bg-white dark:bg-surface-dark border border-slate-200 dark:border-slate-700 hover:border-primary text-slate-700 dark:text-slate-200 text-lg font-bold transition-all">
            Masuk ke Akun
          </router-link>
        </div>
        
        <!-- Feature Preview Image Placeholder -->
        <div class="mt-20 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden w-full max-w-4xl bg-slate-100 dark:bg-slate-800 aspect-video flex items-center justify-center relative group">
           <div class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end justify-center pb-8 opacity-0 group-hover:opacity-100 transition-opacity">
             <p class="text-white font-medium">Preview Dashboard</p>
           </div>
           <span class="material-symbols-outlined text-6xl text-slate-300 dark:text-slate-600">image</span>
        </div>
      </div>

      <!-- Authenticated View (Dashboard) -->
      <div v-else>
        <div class="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <h1 class="text-3xl font-black tracking-tight text-slate-900 dark:text-white mb-2">Papan Saya</h1>
            <p class="text-slate-500 dark:text-slate-400 text-base max-w-2xl">
              Kelola semua proyek Anda. Pilih papan untuk mulai bekerja.
            </p>
          </div>
          <button @click="handleCreateBoard" class="flex items-center justify-center gap-2 rounded-lg h-11 px-6 bg-primary hover:bg-blue-600 text-white text-sm font-bold shadow-lg shadow-primary/20 transition-all active:scale-95 whitespace-nowrap">
            <span class="material-symbols-outlined text-xl">add</span>
            <span>Buat Papan Baru</span>
          </button>
        </div>

        <div class="flex flex-col sm:flex-row gap-4 mb-8">
          <div class="relative flex-1 max-w-md">
            <span class="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
              <span class="material-symbols-outlined">search</span>
            </span>
            <input class="w-full h-11 pl-10 pr-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-surface-dark text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-primary focus:border-transparent shadow-sm text-sm" placeholder="Cari berdasarkan judul..." type="text"/>
          </div>
          <div class="flex gap-2 overflow-x-auto pb-2 sm:pb-0">
            <button class="flex h-11 items-center justify-center px-5 rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-sm font-medium shadow-sm whitespace-nowrap transition-colors">
              Semua
            </button>
            <button class="flex h-11 items-center justify-center px-5 rounded-lg bg-white dark:bg-surface-dark text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-sm font-medium whitespace-nowrap transition-colors">
              <span class="material-symbols-outlined text-base mr-2">star</span> Favorit
            </button>
          </div>
        </div>

        <!-- Board Grid -->
        <div v-if="boards.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <!-- Create New Placeholder Card -->
          <button @click="handleCreateBoard" class="group flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-800/50 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-6 hover:border-primary hover:bg-primary/5 transition-all cursor-pointer min-h-[220px]">
            <div class="size-14 rounded-full bg-white dark:bg-slate-800 flex items-center justify-center mb-4 shadow-sm group-hover:scale-110 transition-transform">
              <span class="material-symbols-outlined text-primary text-3xl">add</span>
            </div>
            <h3 class="text-slate-900 dark:text-white text-lg font-bold">Buat Papan</h3>
            <p class="text-slate-500 dark:text-slate-400 text-xs mt-1 text-center">Mulai proyek baru dari awal</p>
          </button>

          <!-- Board Cards -->
          <div 
            v-for="board in boards" 
            :key="board.id"
            @click="handleBoardClick(board.id)"
            class="group relative flex flex-col bg-white dark:bg-surface-dark border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden hover:shadow-xl hover:shadow-slate-200/50 dark:hover:shadow-black/30 hover:border-primary/50 transition-all cursor-pointer min-h-[220px]"
          >
            <div class="h-3 w-full" :style="{ backgroundColor: board.backgroundColor || '#197fe6' }"></div>
            <div class="p-5 flex flex-col flex-1">
              <div class="flex justify-between items-start mb-2">
                <h3 class="text-slate-900 dark:text-white text-lg font-bold group-hover:text-primary transition-colors line-clamp-1">{{ board.title }}</h3>
                <span class="material-symbols-outlined text-slate-400 text-xl cursor-pointer hover:text-slate-600">more_horiz</span>
              </div>
              <p class="text-slate-500 dark:text-slate-400 text-sm mb-6 line-clamp-3 leading-relaxed">{{ board.description || 'Tidak ada deskripsi.' }}</p>
              <div class="mt-auto flex items-center justify-between border-t border-slate-100 dark:border-slate-700/50 pt-4">
                <div class="flex items-center gap-2">
                  <div class="size-6 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold ring-1 ring-slate-200 dark:ring-slate-700">
                    {{ user?.name?.charAt(0).toUpperCase() || 'U' }}
                  </div>
                  <span class="text-xs text-slate-500 font-medium">Owner</span>
                </div>
                <div class="flex items-center gap-1 text-slate-400" :title="board.isPrivate ? 'Private' : 'Public'">
                  <span class="material-symbols-outlined text-sm">{{ board.isPrivate ? 'lock' : 'public' }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty State (Authenticated but no boards) -->
        <div v-else class="flex flex-col items-center justify-center py-20 text-center border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50/50 dark:bg-slate-800/20">
          <span class="material-symbols-outlined text-6xl text-slate-300 dark:text-slate-600 mb-4">dashboard_customize</span>
          <h3 class="text-xl font-bold text-gray-700 dark:text-gray-300 mb-2">Belum ada Board</h3>
          <p class="text-gray-500 mb-6 max-w-md">Anda belum memiliki papan proyek. Buat yang pertama untuk mulai mengorganisir tugas Anda.</p>
          <button @click="handleCreateBoard" class="text-primary hover:underline font-medium">Buat Papan Pertama</button>
        </div>
      </div>
    </main>

    <!-- Modals -->
    <CreateBoardModal
      :is-open="showCreateBoardModal"
      @close="showCreateBoardModal = false"
      @create="confirmCreateBoard"
    />
    <ConfirmModal
      :is-open="showLogoutModal"
      title="Konfirmasi Keluar"
      message="Apakah Anda yakin ingin keluar dari aplikasi?"
      confirm-text="Keluar"
      cancel-text="Batal"
      :is-destructive="true"
      @close="showLogoutModal = false"
      @confirm="confirmLogout"
    />
  </div>
</template>