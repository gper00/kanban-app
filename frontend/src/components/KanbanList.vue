<script setup>
import { ref } from 'vue'
import KanbanCard from './KanbanCard.vue'
import ConfirmModal from './ConfirmModal.vue'
import { useBoard } from '@/composables/useBoard'

const props = defineProps({
  list: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['add-card', 'open-card-detail'])
const { archiveList, moveList } = useBoard()

const isMenuOpen = ref(false)
const showConfirmArchive = ref(false)

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
}

const closeMenu = () => {
  isMenuOpen.value = false
}

const handleAddCard = () => {
  closeMenu()
  emit('add-card', props.list.id)
}

const handleCardClick = (card) => {
  emit('open-card-detail', card)
}

const confirmArchiveList = () => {
  closeMenu()
  showConfirmArchive.value = true
}

const executeArchiveList = async () => {
  await archiveList(props.list.id)
  showConfirmArchive.value = false
}

const handleMoveList = async () => {
  const newPos = prompt('Masukkan posisi baru (angka):', props.list.position)
  if (newPos && !isNaN(newPos)) {
    closeMenu()
    await moveList(props.list.id, parseInt(newPos))
  }
}
</script>

<template>
  <div class="flex w-80 shrink-0 flex-col rounded-xl bg-background-light dark:bg-surface-dark h-full max-h-full">
    <!-- Header -->
    <div class="flex items-center justify-between px-4 pb-3 pt-5 shrink-0 relative">
      <h2 class="text-base font-bold text-text-light-primary dark:text-text-dark-primary">
        {{ list.title }} 
        <span class="ml-2 rounded-full bg-border-light dark:bg-border-dark px-2 py-0.5 text-xs font-medium text-text-light-secondary dark:text-text-dark-secondary">
          {{ list.cards ? list.cards.length : 0 }}
        </span>
      </h2>
      
      <!-- Dropdown Menu Trigger -->
      <div class="relative">
        <button 
          @click.stop="toggleMenu"
          class="text-text-light-secondary dark:text-text-dark-secondary hover:text-text-light-primary dark:hover:text-text-dark-primary transition-colors p-1 rounded-md hover:bg-black/5 dark:hover:bg-white/5"
        >
          <span class="material-symbols-outlined text-xl">more_horiz</span>
        </button>

        <!-- Dropdown Menu -->
        <div 
          v-if="isMenuOpen"
          v-click-outside="closeMenu" 
          class="absolute right-0 top-full mt-1 w-48 bg-white dark:bg-[#1e2732] rounded-lg shadow-xl border border-slate-200 dark:border-slate-700 z-50 overflow-hidden py-1"
        >
          <button @click="handleAddCard" class="w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-2">
            <span class="material-symbols-outlined text-lg">add</span>
            Tambah Kartu
          </button>
          <button @click="handleMoveList" class="w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-2">
            <span class="material-symbols-outlined text-lg">low_priority</span>
            Ubah Posisi
          </button>
          <div class="h-px bg-slate-100 dark:bg-slate-700 my-1"></div>
          <button @click="confirmArchiveList" class="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2">
            <span class="material-symbols-outlined text-lg">archive</span>
            Arsipkan
          </button>
        </div>
      </div>
      
      <!-- Click Outside Overlay (Simple implementation) -->
      <div v-if="isMenuOpen" @click="closeMenu" class="fixed inset-0 z-40 bg-transparent cursor-default"></div>
    </div>
    
    <!-- Cards Container & Add Button -->
    <div class="flex flex-col gap-4 px-4 pb-4 overflow-y-auto min-h-0 flex-1">
      <KanbanCard 
        v-for="card in list.cards" 
        :key="card.id" 
        :card="card" 
        @click="handleCardClick"
      />
      
      <!-- Button Add Card (Inside scrollable area) -->
      <button 
        @click="handleAddCard"
        class="flex w-full items-center gap-2 rounded-lg p-2 text-sm font-medium text-text-light-secondary dark:text-text-dark-secondary hover:bg-black/5 dark:hover:bg-white/5 hover:text-text-light-primary dark:hover:text-text-dark-primary transition-colors shrink-0"
      >
        <span class="material-symbols-outlined text-xl">add</span>
        Tambah Kartu
      </button>
    </div>

    <!-- Confirm Modal for Archive -->
    <ConfirmModal
      :is-open="showConfirmArchive"
      title="Arsipkan Daftar"
      message="Apakah Anda yakin ingin mengarsipkan daftar ini? Kartu di dalamnya juga akan ikut terarsip."
      confirm-text="Arsipkan"
      cancel-text="Batal"
      :is-destructive="true"
      @close="showConfirmArchive = false"
      @confirm="executeArchiveList"
    />
  </div>
</template>