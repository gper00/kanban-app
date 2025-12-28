<script setup>
import { ref } from 'vue'
import KanbanCard from './KanbanCard.vue'
import ConfirmModal from './ConfirmModal.vue'
import draggable from 'vuedraggable'

const props = defineProps({
  list: {
    type: Object,
    required: true
  },
  readOnly: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['add-card', 'open-card-detail', 'edit-list', 'card-moved', 'delete-list'])

const isMenuOpen = ref(false)
const showConfirmDelete = ref(false)

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

const handleEditList = () => {
  closeMenu()
  emit('edit-list', props.list)
}

const handleCardClick = (card) => {
  emit('open-card-detail', card)
}

const confirmDeleteList = () => {
  closeMenu()
  showConfirmDelete.value = true
}

const executeDeleteList = async () => {
  emit('delete-list', props.list.id)
  showConfirmDelete.value = false
}

const handleChange = (event) => {
  if (props.readOnly) return
  if (event.added || event.moved) {
    const item = event.added || event.moved
    emit('card-moved', {
      cardId: item.element.id,
      toListId: props.list.id,
      newIndex: item.newIndex
    })
  }
}
</script>

<template>
  <div class="flex w-80 shrink-0 flex-col rounded-xl bg-white dark:bg-slate-900 h-full max-h-full border border-slate-200 dark:border-slate-700 shadow-[0_2px_4px_rgba(0,0,0,0.02)]">
    
    <div class="flex items-center justify-between px-4 pt-4 pb-2 shrink-0 relative group">
      <div class="flex items-center gap-2">
        <h2 class="text-sm font-bold text-slate-800 dark:text-white">
          {{ list.title }} 
        </h2>
        <span class="text-xs font-medium text-slate-400 dark:text-slate-500">
          {{ list.cards ? list.cards.length : 0 }}
        </span>
      </div>
      
      <div v-if="!readOnly" class="relative opacity-0 group-hover:opacity-100 transition-opacity focus-within:opacity-100">
        <button 
          @click.stop="toggleMenu"
          class="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          <span class="material-symbols-outlined text-lg">more_horiz</span>
        </button>

        <div 
          v-if="isMenuOpen"
          class="absolute right-0 top-full mt-1 w-48 bg-white dark:bg-[#1e2732] rounded-lg shadow-xl border border-slate-200 dark:border-slate-700 z-50 overflow-hidden py-1"
        >
          <button @click="handleAddCard" class="w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2">
            <span class="material-symbols-outlined text-lg">add</span>
            Tambah Kartu
          </button>
          <button @click="handleEditList" class="w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2">
            <span class="material-symbols-outlined text-lg">edit</span>
            Edit Daftar
          </button>
          <div class="h-px bg-slate-100 dark:bg-slate-700 my-1"></div>
          <button @click="confirmDeleteList" class="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2">
            <span class="material-symbols-outlined text-lg">delete</span>
            Hapus Daftar
          </button>
        </div>
      </div>
      <div v-if="isMenuOpen" @click="closeMenu" class="fixed inset-0 z-40 bg-transparent cursor-default"></div>
    </div>
    
    <div class="flex-1 overflow-y-auto px-3 pb-3 custom-scrollbar">
      <draggable 
        :list="list.cards"
        group="kanban-cards" 
        item-key="id"
        class="flex flex-col gap-3"
        ghost-class="opacity-50"
        drag-class="rotate-3"
        :disabled="readOnly"
        @change="handleChange"
      >
        <template #item="{ element }">
          <KanbanCard 
            :card="element" 
            @click="handleCardClick"
          />
        </template>
      </draggable>

      <div v-if="!readOnly" class="mt-3">
        <button 
          @click="handleAddCard"
          class="flex w-full items-center gap-2 rounded-lg py-2 px-2 text-sm font-medium text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-left"
        >
          <span class="material-symbols-outlined text-lg">add</span>
          Tambah Kartu
        </button>
      </div>
    </div>

    <ConfirmModal
      :is-open="showConfirmDelete"
      title="Hapus Daftar"
      message="Apakah Anda yakin ingin menghapus daftar ini? Semua kartu di dalamnya akan ikut terhapus permanen."
      confirm-text="Hapus"
      cancel-text="Batal"
      :is-destructive="true"
      @close="showConfirmDelete = false"
      @confirm="executeDeleteList"
    />
  </div>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: transparent;
  border-radius: 20px;
}
.custom-scrollbar:hover::-webkit-scrollbar-thumb {
  background-color: rgba(254, 254, 255, 0.5);
}
</style>