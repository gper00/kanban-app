<script setup>
import { ref, watch, computed } from 'vue'

const props = defineProps({
  isOpen: Boolean,
  card: {
    type: Object,
    default: () => ({})
  },
  lists: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['close', 'update', 'delete', 'move'])

const localCard = ref({})
const isEditingDesc = ref(false)
const descriptionBuffer = ref('')

// Initialize local state from props
watch(() => props.card, (newCard) => {
  if (newCard) {
    localCard.value = JSON.parse(JSON.stringify(newCard)) // Deep copy
    descriptionBuffer.value = localCard.value.description || ''
  }
}, { immediate: true })

const currentListName = computed(() => {
  const list = props.lists.find(l => l.id === localCard.value.listId)
  return list ? list.title : 'Unknown List'
})

const formattedDueDate = computed(() => {
  if (!localCard.value.dueDate) return ''
  return new Date(localCard.value.dueDate).toISOString().split('T')[0]
})

const handleTitleUpdate = () => {
  if (localCard.value.title !== props.card.title) {
    emit('update', { ...localCard.value })
  }
}

const handleDescriptionSave = () => {
  localCard.value.description = descriptionBuffer.value
  isEditingDesc.value = false
  if (localCard.value.description !== props.card.description) {
    emit('update', { ...localCard.value })
  }
}

const toggleCompletion = () => {
  localCard.value.isCompleted = !localCard.value.isCompleted
  emit('update', { ...localCard.value })
}

const handleDateChange = (e) => {
  const newDate = e.target.value
  localCard.value.dueDate = newDate ? new Date(newDate).toISOString() : null
  emit('update', { ...localCard.value })
}

const handleListChange = (newListId) => {
  if (newListId !== localCard.value.listId) {
    emit('move', { cardId: localCard.value.id, fromListId: localCard.value.listId, toListId: newListId })
    // Optimistic update locally
    localCard.value.listId = newListId
  }
}

const handleDelete = () => {
  if (confirm('Apakah Anda yakin ingin menghapus kartu ini?')) {
    emit('delete', localCard.value.id)
  }
}
</script>

<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8 overflow-y-auto">
    <!-- Backdrop -->
    <div @click="$emit('close')" class="fixed inset-0 bg-slate-900/40 dark:bg-black/60 backdrop-blur-sm transition-opacity"></div>
    
    <!-- Modal Container -->
    <div class="relative w-full max-w-[900px] bg-white dark:bg-[#1E2936] rounded-xl shadow-2xl flex flex-col md:flex-row overflow-hidden border border-gray-100 dark:border-gray-700 animate-in fade-in zoom-in-95 duration-200">
      
      <!-- Close Button -->
      <button @click="$emit('close')" class="absolute top-4 right-4 z-20 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
        <span class="material-symbols-outlined">close</span>
      </button>

      <!-- Main Content (Left) -->
      <div class="flex-1 p-6 sm:p-8 lg:p-10 flex flex-col gap-6 overflow-y-auto max-h-[85vh]">
        <!-- Breadcrumbs -->
        <div class="flex flex-col gap-1">
          <div class="flex flex-wrap items-center gap-2 text-sm">
            <span class="material-symbols-outlined text-[#4e7397] text-[20px]">view_kanban</span>
            <span class="text-[#4e7397] font-medium leading-normal">Board</span>
            <span class="text-[#4e7397] font-medium leading-normal">/</span>
            <span class="text-primary font-bold leading-normal">{{ currentListName }}</span>
          </div>
        </div>

        <!-- Headline (Title) -->
        <div class="flex flex-col gap-2">
          <input 
            v-model="localCard.title" 
            @blur="handleTitleUpdate"
            class="text-[#0e141b] dark:text-white tracking-tight text-2xl md:text-3xl font-bold leading-tight text-left bg-transparent border-none focus:ring-0 focus:outline-none p-0 w-full"
            type="text"
          />
        </div>

        <!-- Description Section -->
        <div class="flex flex-col gap-3">
          <div class="flex items-center justify-between">
            <h3 class="text-[#0e141b] dark:text-white text-lg font-bold leading-tight tracking-[-0.015em] flex items-center gap-3">
              <span class="material-symbols-outlined text-[#4e7397]">description</span>
              Deskripsi
            </h3>
            <button 
              v-if="!isEditingDesc" 
              @click="isEditingDesc = true" 
              class="text-primary text-sm font-medium hover:bg-primary/10 px-3 py-1 rounded transition-colors"
            >
              Edit
            </button>
          </div>
          <div class="pl-8">
            <div v-if="isEditingDesc">
              <textarea 
                v-model="descriptionBuffer"
                class="w-full min-h-[120px] p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm focus:ring-2 focus:ring-primary focus:border-primary resize-y"
                placeholder="Tambahkan deskripsi yang lebih detail..."
              ></textarea>
              <div class="flex gap-2 mt-2">
                <button @click="handleDescriptionSave" class="bg-primary text-white px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors">Simpan</button>
                <button @click="isEditingDesc = false" class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 px-3 py-1.5 text-sm font-medium">Batal</button>
              </div>
            </div>
            <div 
              v-else 
              @click="isEditingDesc = true"
              class="text-[#0e141b] dark:text-gray-300 text-base font-normal leading-relaxed bg-background-light dark:bg-black/20 p-4 rounded-lg border border-transparent hover:border-gray-200 dark:hover:border-gray-600 transition-colors cursor-pointer min-h-[60px]"
            >
              <p v-if="localCard.description" class="whitespace-pre-line">{{ localCard.description }}</p>
              <p v-else class="text-gray-400 italic">Belum ada deskripsi.</p>
            </div>
          </div>
        </div>

        <!-- Activity (Placeholder for now) -->
        <div class="flex flex-col gap-4 mt-4 opacity-50 pointer-events-none">
          <h3 class="text-[#0e141b] dark:text-white text-lg font-bold leading-tight tracking-[-0.015em] flex items-center gap-3">
            <span class="material-symbols-outlined text-[#4e7397]">list</span>
            Aktivitas (Coming Soon)
          </h3>
        </div>
      </div>

      <!-- Sidebar (Right) -->
      <div class="w-full md:w-[300px] bg-gray-50 dark:bg-[#151e29] border-l border-gray-100 dark:border-gray-700 p-6 flex flex-col gap-6 shrink-0 overflow-y-auto max-h-[85vh]">
        <!-- Action Toolbar -->
        <div class="flex flex-col gap-2">
          <span class="text-xs font-bold text-[#4e7397] uppercase tracking-wider mb-1">Actions</span>
          <button 
            @click="toggleCompletion"
            class="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors w-full text-left"
            :class="localCard.isCompleted ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' : 'text-[#0e141b] dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'"
          >
            <span class="material-symbols-outlined text-[20px]">{{ localCard.isCompleted ? 'check_box' : 'check_box_outline_blank' }}</span>
            {{ localCard.isCompleted ? 'Selesai' : 'Tandai Selesai' }}
          </button>
          <button @click="handleDelete" class="flex items-center gap-3 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors w-full text-left">
            <span class="material-symbols-outlined text-[20px]">delete</span>
            Hapus Kartu
          </button>
        </div>

        <!-- Move Section -->
        <div class="flex flex-col gap-2">
          <span class="text-xs font-bold text-[#4e7397] uppercase tracking-wider">Pindah ke Daftar</span>
          <div class="relative w-full">
            <select 
              :value="localCard.listId" 
              @change="handleListChange($event.target.value)"
              class="w-full appearance-none bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2.5 shadow-sm hover:border-primary transition-all text-sm font-semibold text-[#0e141b] dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              <option v-for="list in lists" :key="list.id" :value="list.id">{{ list.title }}</option>
            </select>
            <div class="absolute right-0 top-0 bottom-0 flex items-center pr-3 pointer-events-none">
              <span class="material-symbols-outlined text-[#4e7397]">expand_more</span>
            </div>
          </div>
        </div>

        <!-- Dates -->
        <div class="flex flex-col gap-2">
          <span class="text-xs font-bold text-[#4e7397] uppercase tracking-wider">Tanggal Jatuh Tempo</span>
          <div class="relative">
            <input 
              type="date" 
              :value="formattedDueDate"
              @change="handleDateChange"
              class="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 shadow-sm hover:border-primary transition-all text-sm font-medium text-[#0e141b] dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
