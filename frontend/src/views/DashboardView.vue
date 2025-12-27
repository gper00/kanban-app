<script setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import { useBoard } from '@/composables/useBoard'
import BoardModal from '@/components/BoardModal.vue'
import ConfirmModal from '@/components/ConfirmModal.vue'

const router = useRouter()
const { logout, user } = useAuth()
const { boards, publicBoards, fetchBoards, fetchPublicBoards, createBoard, updateBoard, deleteBoard } = useBoard()

const showBoardModal = ref(false)
const selectedBoard = ref(null)
const activeMenuBoardId = ref(null)

const confirmState = ref({
  isOpen: false,
  title: '',
  message: '',
  confirmText: 'Ya',
  isDestructive: false,
  action: null
})

onMounted(async () => {
  await fetchBoards()
  await fetchPublicBoards()
})

const handleLogout = () => {
  confirmState.value = {
    isOpen: true,
    title: 'Konfirmasi Keluar',
    message: 'Apakah Anda yakin ingin keluar dari aplikasi?',
    confirmText: 'Keluar',
    isDestructive: true,
    action: () => {
      logout()
      window.location.reload()
    }
  }
}

const handleDeleteBoardRequest = (board) => {
  confirmState.value = {
    isOpen: true,
    title: 'Hapus Board',
    message: `Apakah Anda yakin ingin menghapus board "${board.title}"? Semua list dan kartu di dalamnya akan hilang permanen.`,
    confirmText: 'Hapus',
    isDestructive: true,
    action: async () => {
      try {
        await deleteBoard(board.id)
      } catch (error) {
        alert('Gagal menghapus board.')
      }
    }
  }
}

const handleConfirmAction = async () => {
  if (confirmState.value.action) {
    await confirmState.value.action()
  }
  confirmState.value.isOpen = false
}

const handleBoardClick = (boardId) => {
  router.push(`/board/${boardId}`)
}

const openBoardModal = (board = null) => {
  selectedBoard.value = board
  showBoardModal.value = true
  activeMenuBoardId.value = null 
}

const handleBoardSubmit = async (payload) => {
  try {
    if (selectedBoard.value) {
      // Update
      await updateBoard(payload.id, payload)
    } else {
      // Create
      const newBoard = await createBoard(payload.title, payload.description, payload.isPrivate)
      // Optional: Redirect to new board immediately? Or stay on dashboard.
      // Staying on dashboard to see the new board is fine.
    }
    showBoardModal.value = false
  } catch (error) {
    alert('Gagal menyimpan board.')
  }
}

const toggleBoardMenu = (boardId, event) => {
  event.stopPropagation() 
  if (activeMenuBoardId.value === boardId) {
    activeMenuBoardId.value = null
  } else {
    activeMenuBoardId.value = boardId
  }
}

const closeMenu = () => {
  activeMenuBoardId.value = null
}
</script>

<template>
  <div class="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100 antialiased min-h-screen flex flex-col" @click="closeMenu">
  <nav class="sticky top-0 z-30 w-full bg-white/90 dark:bg-surface-dark/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
    <div class="h-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
      <div class="flex items-center gap-2">
        <span class="material-symbols-outlined text-primary text-3xl">view_kanban</span>
        <span class="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
          Kanban App
        </span>
      </div>

      <div class="flex items-center gap-6">
        <div class="flex items-center gap-3 pl-6 border-l border-slate-200 dark:border-slate-700">
          <div class="hidden md:flex flex-col items-end">
            <p class="text-sm font-semibold text-slate-900 dark:text-white">
              {{ user?.name || 'User' }}
            </p>
            <p class="text-xs text-slate-500 dark:text-slate-400">
              {{ user?.email }}
            </p>
          </div>

          <div
            @click="handleLogout"
            class="relative cursor-pointer hover:opacity-90 transition-opacity"
            title="Logout"
          >
            <div class="flex items-center justify-center bg-primary text-white rounded-full size-9 ring-2 ring-slate-100 dark:ring-slate-700">
              <span class="material-symbols-outlined text-lg">logout</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </nav>

    <main class="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <!-- Header Section -->
      <div class="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <h1 class="text-3xl font-black tracking-tight text-slate-900 dark:text-white mb-2">Dashboard</h1>
          <p class="text-slate-500 dark:text-slate-400 text-base max-w-2xl">
            Selamat datang kembali, {{ user?.name }}!
          </p>
        </div>
      </div>

      <div class="flex flex-col sm:flex-row gap-4 mb-8">
        <div class="relative flex-1 max-w-md">
          <span class="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
            <span class="material-symbols-outlined">search</span>
          </span>
          <input class="w-full h-11 pl-10 pr-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-surface-dark text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-primary focus:border-transparent shadow-sm text-sm" placeholder="Cari belum jalan..." type="text"/>
        </div>
      </div>

      <!-- My Boards Section -->
      <div class="mb-10">
        <div class="flex items-center gap-4 mb-4">
          <h2 class="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span class="material-symbols-outlined text-primary">person</span>
            Papan Saya
          </h2>

          <button
            @click="openBoardModal()"
            class="flex items-center gap-2 h-9 px-4 rounded-lg bg-primary hover:bg-blue-600 text-white text-sm font-semibold transition-all active:scale-95"
          >
            <span class="material-symbols-outlined text-base">add</span>
            Buat Papan Baru
          </button>
        </div>


        <div v-if="boards.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <!-- Create New Placeholder Card -->
          <button @click="openBoardModal()" class="group flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-800/50 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-6 hover:border-primary hover:bg-primary/5 transition-all cursor-pointer min-h-[220px]">
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
              <div class="flex justify-between items-start mb-2 relative">
                <h3 class="text-slate-900 dark:text-white text-lg font-bold group-hover:text-primary transition-colors line-clamp-1 pr-6">{{ board.title }}</h3>

                <!-- Dropdown Trigger -->
                <button
                  @click="toggleBoardMenu(board.id, $event)"
                  class="absolute top-0 right-0 p-1 -mr-2 -mt-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                >
                  <span class="material-symbols-outlined text-xl">more_horiz</span>
                </button>

                <!-- Dropdown Menu -->
                <div
                  v-if="activeMenuBoardId === board.id"
                  class="absolute top-6 right-0 w-40 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-slate-200 dark:border-slate-700 z-10 overflow-hidden"
                  @click.stop
                >
                  <button @click="openBoardModal(board); closeMenu()" class="w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-2">
                    <span class="material-symbols-outlined text-lg">edit</span>
                    Edit
                  </button>
                  <button @click="handleDeleteBoardRequest(board); closeMenu()" class="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2">
                    <span class="material-symbols-outlined text-lg">delete</span>
                    Hapus
                  </button>
                </div>
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

        <div v-else class="flex flex-col items-center justify-center py-10 text-center border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50/50 dark:bg-slate-800/20">
          <p class="text-gray-500 mb-4 text-sm">Anda belum memiliki papan proyek.</p>
          <button @click="openBoardModal()" class="text-primary hover:underline font-medium text-sm">Buat Papan Pertama</button>
        </div>
      </div>

      <div v-if="publicBoards.length > 0" class="mb-10">
        <h2 class="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <span class="material-symbols-outlined text-orange-500">public</span>
          Komunitas
        </h2>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <div
            v-for="board in publicBoards"
            :key="board.id"
            @click="handleBoardClick(board.id)"
            class="group relative flex flex-col bg-white dark:bg-surface-dark border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden hover:shadow-xl hover:shadow-slate-200/50 dark:hover:shadow-black/30 hover:border-orange-400/50 transition-all cursor-pointer min-h-[220px]"
          >
            <div class="h-3 w-full" :style="{ backgroundColor: board.backgroundColor || '#197fe6' }"></div>
            <div class="p-5 flex flex-col flex-1">
              <div class="flex justify-between items-start mb-2">
                <h3 class="text-slate-900 dark:text-white text-lg font-bold group-hover:text-primary transition-colors line-clamp-1">{{ board.title }}</h3>
              </div>
              <p class="text-slate-500 dark:text-slate-400 text-sm mb-6 line-clamp-3 leading-relaxed">{{ board.description || 'Tidak ada deskripsi.' }}</p>
              <div class="mt-auto flex items-center justify-between border-t border-slate-100 dark:border-slate-700/50 pt-4">
                <div class="flex items-center gap-2">
                  <div class="size-6 rounded-full bg-orange-500 text-white flex items-center justify-center text-xs font-bold ring-1 ring-slate-200 dark:ring-slate-700">
                    {{ board.owner?.name?.charAt(0).toUpperCase() || 'U' }}
                  </div>
                  <span class="text-xs text-slate-500 font-medium">{{ board.owner?.name || 'Unknown' }}</span>
                </div>
                <div class="flex items-center gap-1 text-slate-400" title="Public Board">
                  <span class="material-symbols-outlined text-sm">public</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Modals -->
    <BoardModal
      :is-open="showBoardModal"
      :board="selectedBoard"
      @close="showBoardModal = false"
      @create="handleBoardSubmit"
      @update="handleBoardSubmit"
    />
    <ConfirmModal
      :is-open="confirmState.isOpen"
      :title="confirmState.title"
      :message="confirmState.message"
      :confirm-text="confirmState.confirmText"
      cancel-text="Batal"
      :is-destructive="confirmState.isDestructive"
      @close="confirmState.isOpen = false"
      @confirm="handleConfirmAction"
    />
  </div>
</template>
