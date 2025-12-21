<script setup>
import { ref, onMounted, watch } from 'vue'
import KanbanList from '@/components/KanbanList.vue'
import CreateListModal from '@/components/CreateListModal.vue'
import CreateCardModal from '@/components/CreateCardModal.vue'
import CreateBoardModal from '@/components/CreateBoardModal.vue'
import CardDetailModal from '@/components/CardDetailModal.vue'
import ConfirmModal from '@/components/ConfirmModal.vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import { useBoard } from '@/composables/useBoard'

const router = useRouter()
const route = useRoute()
const { logout } = useAuth()
const { currentBoard, lists, loading, fetchBoardDetail, createList, createCard, updateCard, deleteCard, moveCard } = useBoard()

const showCreateListModal = ref(false)
const showCreateCardModal = ref(false)
const showCreateBoardModal = ref(false)
const showLogoutModal = ref(false)
const showCardDetailModal = ref(false)
const preselectedListId = ref('')
const selectedCard = ref({})

// Fetch data berdasarkan ID di URL
const loadBoardData = async () => {
  const boardId = route.params.id
  if (boardId) {
    await fetchBoardDetail(boardId)
  }
}

onMounted(loadBoardData)

// Watch jika ID berubah (opsional, jika ada navigasi antar board)
watch(() => route.params.id, loadBoardData)

const handleLogout = () => {
  showLogoutModal.value = true
}

const confirmLogout = () => {
  logout()
  router.push('/login')
  showLogoutModal.value = false
}

const handleCreateList = async (listData) => {
  try {
    await createList(listData.title)
    showCreateListModal.value = false
  } catch (error) {
    alert('Gagal membuat daftar baru.')
  }
}

const handleCreateCard = async (cardData) => {
  try {
    await createCard(cardData.listId, {
        title: cardData.title,
        description: cardData.description,
        dueDate: cardData.dueDate
    })
    showCreateCardModal.value = false
  } catch (error) {
    alert('Gagal membuat kartu baru.')
  }
}

const handleCreateBoard = () => {
  showCreateBoardModal.value = true
}

const confirmCreateBoard = async (boardData) => {
  try {
    const newBoard = await createBoard(boardData.title, boardData.description)
    if (newBoard) {
      await fetchBoardDetail(newBoard.id)
      showCreateBoardModal.value = false
    }
  } catch (error) {
    alert('Gagal membuat board baru.')
  }
}

const handleOpenCardDetail = (card) => {
  selectedCard.value = card
  showCardDetailModal.value = true
}

const handleUpdateCard = async (updatedCard) => {
  try {
    // Optimistic update di local state (untuk UI responsif di modal)
    selectedCard.value = { ...selectedCard.value, ...updatedCard }

    // Panggil API
    await updateCard(updatedCard.id, updatedCard.listId, updatedCard)
    
    // Refresh board untuk sinkronisasi list jika perlu (misal status done berubah warna)
    await fetchBoardDetail(route.params.id)
  } catch (error) {
    console.error('Update failed', error)
  }
}

const handleMoveCard = async ({ cardId, fromListId, toListId }) => {
    try {
        // Hitung posisi baru (paling akhir di list tujuan)
        const targetList = lists.value.find(l => l.id === toListId)
        const newPosition = targetList ? targetList.cards.length + 1 : 1
        
        await moveCard(cardId, fromListId, toListId, newPosition)
        
        // Update selected card listId agar UI modal tahu kartu sudah pindah
        selectedCard.value.listId = toListId
    } catch (error) {
        console.error('Move failed', error)
    }
}

const handleDeleteCard = async (cardId) => {
  try {
    await deleteCard(cardId, selectedCard.value.listId)
    showCardDetailModal.value = false
  } catch (error) {
    alert('Gagal menghapus kartu.')
  }
}

const goHome = () => {
  router.push('/')
}

const addList = () => {
  showCreateListModal.value = true
}

const addCard = () => {
  preselectedListId.value = ''
  showCreateCardModal.value = true
}

const openCreateCardModal = (listId) => {
  preselectedListId.value = listId
  showCreateCardModal.value = true
}
</script>

<template>
  <div class="flex h-screen w-full flex-col bg-background-light dark:bg-background-dark text-text-light-primary dark:text-text-dark-primary font-display">
    <!-- Top Nav Bar -->
    <header class="flex shrink-0 items-center justify-between border-b border-solid border-border-light dark:border-border-dark px-6 py-3 bg-surface-light dark:bg-surface-dark">
      <div class="flex items-center gap-4">
        <button @click="goHome" class="p-2 -ml-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-500" title="Kembali ke Dashboard">
          <span class="material-symbols-outlined">arrow_back</span>
        </button>
        <span class="material-symbols-outlined text-primary text-2xl">view_kanban</span>
        <h1 class="text-lg font-bold">
          {{ currentBoard ? currentBoard.title : 'Memuat Board...' }}
        </h1>
      </div>
      <div class="flex flex-1 items-center justify-end gap-6">
        <div class="flex items-center gap-4">
           <router-link to="/pomodoro" class="flex items-center gap-1.5 text-sm font-medium hover:text-primary transition-colors">
            <span class="material-symbols-outlined text-xl">timer</span>
            Pomodoro
          </router-link>
          
          <a class="flex items-center gap-1.5 text-sm font-medium cursor-pointer" @click="handleLogout">
            <span class="material-symbols-outlined text-xl">logout</span>
            Logout
          </a>
        </div>
        <div class="flex items-center gap-2">
          <button @click="addCard" class="flex min-w-[84px] cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-lg h-10 px-4 bg-primary text-white text-sm font-bold hover:bg-blue-600 transition-colors">
            <span class="material-symbols-outlined text-xl">add</span>
            <span class="truncate">Add Card</span>
          </button>
          <div class="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10" data-alt="User avatar image" style='background-image: url("https://lh3.googleusercontent.com/aida-public/AB6AXuBioUz4Q_8eUxXVY-nd0lzF58HBCIz287j2f9IYCqd3lTi8P4P3g5x32m-FQcAyiWVAaFvaxtdGZmhcmoDlpEB_u8Kv_trZ6NBXltPBOJ7jZO4APxQNQSVPhIOoE1ttGyUTzCaPVl3HRnZdnaYilAwxLzdN8vuERM2VbazaNNmF69U1LLUBABjPdJw9G5in3v60GUw4Y7TnNNPuffmvHZkNHHfMYOC8VyE22LA6O4ajyWlQYcBvxmDmGjb2poI_weIcgC1xNdyRNtMk");'></div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="flex flex-1 flex-col overflow-x-hidden">
      <!-- Loading Indicator -->
      <div v-if="loading" class="flex flex-1 items-center justify-center">
        <svg class="animate-spin h-8 w-8 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>

      <!-- Error / Not Found State -->
      <div v-else-if="!currentBoard" class="flex flex-1 flex-col items-center justify-center text-center p-8">
        <span class="material-symbols-outlined text-6xl text-gray-300 mb-4">error_outline</span>
        <h2 class="text-xl font-bold text-gray-700 dark:text-gray-300">Board Tidak Ditemukan</h2>
        <p class="text-gray-500 mb-6">Board yang Anda cari mungkin telah dihapus atau Anda tidak memiliki akses.</p>
        <button @click="goHome" class="bg-primary text-white px-4 py-2 rounded-lg font-bold hover:bg-blue-600 transition-colors">
          Kembali ke Dashboard
        </button>
      </div>

      <template v-else>
        <!-- Chips/Filters Bar -->
        <div class="shrink-0 border-b border-solid border-border-light dark:border-border-dark px-6 py-3 bg-surface-light/50 dark:bg-surface-dark/50 backdrop-blur-sm">
          <div class="flex gap-3 items-center">
            <button class="flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-lg bg-primary/10 dark:bg-primary/20 pl-4 pr-2 text-primary">
              <p class="text-sm font-medium leading-normal">All tasks</p>
              <span class="material-symbols-outlined text-base">expand_more</span>
            </button>
            <button class="flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-lg bg-border-light dark:bg-border-dark pl-4 pr-2 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
              <p class="text-sm font-medium leading-normal">UI Design</p>
              <span class="material-symbols-outlined text-base">expand_more</span>
            </button>
            <button class="flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-lg bg-border-light dark:bg-border-dark pl-4 pr-2 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
              <p class="text-sm font-medium leading-normal">Urgent</p>
              <span class="material-symbols-outlined text-base">expand_more</span>
            </button>
          </div>
        </div>

        <!-- Kanban Board -->
        <div class="flex flex-1 gap-6 p-6 overflow-x-auto">
          <KanbanList 
            v-for="list in lists" 
            :key="list.id" 
            :list="list" 
            @add-card="openCreateCardModal"
            @open-card-detail="handleOpenCardDetail"
          />
          
          <!-- Add a list button -->
          <div class="w-80 shrink-0">
            <button @click="addList" class="flex w-full items-center justify-center gap-2 rounded-xl bg-black/5 dark:bg-white/5 h-12 text-sm font-medium text-text-light-secondary dark:text-text-dark-secondary hover:bg-black/10 dark:hover:bg-white/10 transition-colors">
              <span class="material-symbols-outlined text-xl">add</span>
              Add another list
            </button>
          </div>
        </div>
      </template>

      <!-- Modals -->
      <CreateListModal 
        :is-open="showCreateListModal"
        @close="showCreateListModal = false"
        @create="handleCreateList"
      />
      <CreateCardModal
        :is-open="showCreateCardModal"
        :lists="lists"
        :preselected-list-id="preselectedListId"
        @close="showCreateCardModal = false"
        @create="handleCreateCard"
      />
      <CreateBoardModal
        :is-open="showCreateBoardModal"
        @close="showCreateBoardModal = false"
        @create="confirmCreateBoard"
      />
      <CardDetailModal
        :is-open="showCardDetailModal"
        :card="selectedCard"
        :lists="lists"
        @close="showCardDetailModal = false"
        @update="handleUpdateCard"
        @move="handleMoveCard"
        @delete="handleDeleteCard"
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
    </main>
  </div>
</template>