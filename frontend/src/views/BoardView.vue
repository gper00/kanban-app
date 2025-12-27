<script setup>
import { ref, onMounted, watch, computed } from 'vue'
import KanbanList from '@/components/KanbanList.vue'
import ListModal from '@/components/ListModal.vue'
import CreateCardModal from '@/components/CreateCardModal.vue'
import CardDetailModal from '@/components/CardDetailModal.vue'
import ConfirmModal from '@/components/ConfirmModal.vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import { useBoard } from '@/composables/useBoard'

const router = useRouter()
const route = useRoute()
const { logout, user } = useAuth()
const { currentBoard, lists, loading, fetchBoardDetail, createList, updateList, moveList, createCard, updateCard, updateCardCompletion, deleteCard, moveCard } = useBoard()

const showListModal = ref(false)
const showCreateCardModal = ref(false)
const showLogoutModal = ref(false)
const showCardDetailModal = ref(false)
const preselectedListId = ref('')
const selectedCard = ref({})
const selectedList = ref(null)

const isOwner = computed(() => {
  return currentBoard.value?.ownerId === user.value?.id
})

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

const openListModal = (list = null) => {
  selectedList.value = list
  showListModal.value = true
}

const handleListCreate = async (listData) => {
  try {
    await createList(listData.title)
    showListModal.value = false
  } catch (error) {
    alert('Gagal membuat daftar baru.')
  }
}

const handleListUpdate = async (listData) => {
  try {
    await updateList(listData.id, { 
        title: listData.title, 
        description: listData.description 
    })

    const currentList = lists.value.find(l => l.id === listData.id)
    if (currentList && listData.position !== undefined && listData.position !== currentList.position) {
        await moveList(listData.id, listData.position)
    }

    showListModal.value = false
  } catch (error) {
    alert('Gagal mengupdate daftar.')
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

const handleOpenCardDetail = (card) => {
  selectedCard.value = card
  showCardDetailModal.value = true
}

const handleUpdateCard = async (updatedCard) => {
  try {
    selectedCard.value = { ...selectedCard.value, ...updatedCard }

    await updateCard(updatedCard.id, updatedCard.listId, updatedCard)

    await fetchBoardDetail(route.params.id)
  } catch (error) {
    console.error('Update failed', error)
  }
}

const handleToggleComplete = async (card) => {
  try {
    selectedCard.value = { ...selectedCard.value, isCompleted: card.isCompleted }
    
    await updateCardCompletion(card.id, card.listId)
  } catch (error) {
    console.error('Toggle completion failed', error)
  }
}

const handleDragMove = async ({ cardId, toListId, newIndex }) => {
  try {
    await moveCard(cardId, null, toListId, newIndex + 1)
  } catch (error) {
    console.error('Gagal memindahkan kartu:', error)
    await fetchBoardDetail(route.params.id)
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
  router.push('/boards')
}

const addList = () => {
  openListModal()
}

const openCreateCardModal = (listId) => {
  preselectedListId.value = listId
  showCreateCardModal.value = true
}

</script>

<template>
  <div class="flex h-screen w-full flex-col bg-background-light dark:bg-background-dark text-text-light-primary dark:text-text-dark-primary font-display">
    <header class="flex shrink-0 items-center justify-between border-b border-solid border-border-light dark:border-border-dark px-6 py-3 bg-surface-light dark:bg-surface-dark">
      <div class="flex items-center gap-4">
        <button @click="goHome" class="p-2 -ml-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-500" title="Kembali ke Dashboard">
          <span class="material-symbols-outlined">arrow_back</span>
        </button>
        <div class="flex flex-col">
          <div class="flex items-center gap-2">
            <h1 class="text-lg font-bold truncate max-w-[200px] sm:max-w-md">
              {{ currentBoard ? currentBoard.title : 'Memuat Board...' }}
            </h1>
            <div v-if="currentBoard && !isOwner" class="px-2 py-0.5 rounded-full bg-orange-100 text-orange-700 text-xs font-bold border border-orange-200 whitespace-nowrap">
              View Only
            </div>
          </div>
        </div>
      </div>

      <div class="flex flex-1 items-center justify-end gap-4 sm:gap-6">
        <router-link 
          :to="{ path: '/pomodoro', query: { fromBoard: currentBoard?.id } }" 
          class="flex items-center gap-1.5 text-sm font-medium hover:text-primary transition-colors" 
          title="Buka Timer Pomodoro"
        >
          <span class="material-symbols-outlined text-xl">timer</span>
          <span class="hidden sm:inline">Pomodoro</span>
        </router-link>


        <div class="flex items-center gap-3 pl-4 border-l border-slate-200 dark:border-slate-700">
          <div class="hidden md:flex flex-col items-end">
            <p class="text-sm font-semibold text-slate-900 dark:text-white">{{ user?.name || 'User' }}</p>
            <p class="text-xs text-slate-500 dark:text-slate-400">{{ user?.email }}</p>
          </div>
          <div @click="handleLogout" class="relative cursor-pointer hover:opacity-90 transition-opacity" title="Logout">
            <div class="flex items-center justify-center bg-primary text-white rounded-full size-9 ring-2 ring-slate-100 dark:ring-slate-700 shadow-md">
              <span class="material-symbols-outlined text-lg">logout</span>
            </div>
          </div>
        </div>

      </div>
    </header>

    <main class="flex flex-1 flex-col overflow-x-hidden">
      <div v-if="loading" class="flex flex-1 items-center justify-center">
        <svg class="animate-spin h-8 w-8 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>

      <div v-else-if="!currentBoard" class="flex flex-1 flex-col items-center justify-center text-center p-8">
        <span class="material-symbols-outlined text-6xl text-gray-300 mb-4">error_outline</span>
        <h2 class="text-xl font-bold text-gray-700 dark:text-gray-300">Board Tidak Ditemukan</h2>
        <p class="text-gray-500 mb-6">Board yang Anda cari mungkin telah dihapus atau Anda tidak memiliki akses.</p>
        <button @click="goHome" class="bg-primary text-white px-4 py-2 rounded-lg font-bold hover:bg-blue-600 transition-colors">
          Kembali ke Dashboard
        </button>
      </div>

      <template v-else>
        <div class="flex flex-1 gap-6 p-6 overflow-x-auto">
          <KanbanList
            v-for="list in lists"
            :key="list.id"
            :list="list"
            :read-only="!isOwner"
            @add-card="openCreateCardModal"
            @edit-list="openListModal"
            @open-card-detail="handleOpenCardDetail"
            @card-moved="handleDragMove"
          />

          <div v-if="isOwner" class="w-80 shrink-0">
            <button @click="addList" class="flex w-full items-center justify-center gap-2 rounded-xl bg-black/5 dark:bg-white/5 h-12 text-sm font-medium text-text-light-secondary dark:text-text-dark-secondary hover:bg-black/10 dark:hover:bg-white/10 transition-colors border border-dashed border-slate-300 dark:border-slate-700">
              <span class="material-symbols-outlined text-xl">add</span>
              Daftar Baru
            </button>
          </div>
        </div>
      </template>

      <ListModal
        :is-open="showListModal"
        :list="selectedList"
        @close="showListModal = false"
        @create="handleListCreate"
        @update="handleListUpdate"
      />
      <CreateCardModal
        :is-open="showCreateCardModal"
        :lists="lists"
        :preselected-list-id="preselectedListId"
        @close="showCreateCardModal = false"
        @create="handleCreateCard"
      />
      <CardDetailModal
        :is-open="showCardDetailModal"
        :card="selectedCard"
        :lists="lists"
        :read-only="!isOwner"
        @close="showCardDetailModal = false"
        @update="handleUpdateCard"
        @toggle-complete="handleToggleComplete"
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