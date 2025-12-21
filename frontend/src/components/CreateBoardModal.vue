<script setup>
import { ref } from 'vue'

const props = defineProps({
  isOpen: Boolean
})

const emit = defineEmits(['close', 'create'])

const title = ref('')
const description = ref('')
const loading = ref(false)

const handleSubmit = () => {
  if (!title.value.trim()) return
  
  loading.value = true
  emit('create', { title: title.value, description: description.value })
  
  // Reset
  title.value = ''
  description.value = ''
  loading.value = false
}
</script>

<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4">
    <!-- Backdrop -->
    <div @click="$emit('close')" class="absolute inset-0 bg-slate-900/40 dark:bg-black/60 backdrop-blur-sm transition-opacity"></div>
    
    <!-- Modal -->
    <div class="relative w-full max-w-[480px] bg-surface-light dark:bg-surface-dark rounded-xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
      <!-- Modal Header -->
      <div class="flex items-center justify-between px-6 pt-6 pb-2">
        <h2 class="text-[#0e141b] dark:text-white text-xl font-bold leading-tight tracking-tight">Buat Board Baru</h2>
        <button @click="$emit('close')" class="group p-2 -mr-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50">
          <span class="material-symbols-outlined text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200 text-xl font-medium">close</span>
        </button>
      </div>

      <!-- Modal Content -->
      <div class="px-6 py-2 flex flex-col gap-5">
        <!-- Input: Nama Board -->
        <div class="flex flex-col gap-2">
          <label class="text-slate-900 dark:text-slate-100 text-sm font-medium leading-normal" for="board-title">
            Nama Board <span class="text-red-500">*</span>
          </label>
          <input 
            v-model="title"
            autofocus 
            class="form-input flex w-full rounded-lg border border-[#d0dbe7] dark:border-slate-600 bg-slate-50 dark:bg-slate-800 text-[#0e141b] dark:text-white placeholder:text-[#4e7397] dark:placeholder:text-slate-500 px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm" 
            id="board-title" 
            placeholder="Misal: Project Alpha" 
            type="text"
            @keyup.enter="handleSubmit"
          />
        </div>
        <!-- Input: Deskripsi -->
        <div class="flex flex-col gap-2">
          <label class="text-slate-900 dark:text-slate-100 text-sm font-medium leading-normal" for="board-desc">
            Deskripsi <span class="text-slate-400 font-normal text-xs">(Opsional)</span>
          </label>
          <textarea 
            v-model="description"
            class="form-textarea flex w-full min-h-[100px] resize-none rounded-lg border border-[#d0dbe7] dark:border-slate-600 bg-slate-50 dark:bg-slate-800 text-[#0e141b] dark:text-white placeholder:text-[#4e7397] dark:placeholder:text-slate-500 px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm" 
            id="board-desc" 
            placeholder="Deskripsikan tujuan board ini..."
          ></textarea>
        </div>
      </div>

      <!-- Modal Footer -->
      <div class="px-6 py-6 mt-2 flex justify-end items-center gap-3 bg-slate-50/50 dark:bg-slate-800/30 border-t border-slate-100 dark:border-slate-700/50">
        <button 
          @click="$emit('close')"
          class="px-5 py-2.5 rounded-lg text-slate-600 dark:text-slate-300 text-sm font-semibold hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-200 dark:focus:ring-slate-700"
        >
          Batal
        </button>
        <button 
          @click="handleSubmit"
          :disabled="loading || !title.trim()"
          class="px-6 py-2.5 rounded-lg bg-primary hover:bg-blue-600 text-white text-sm font-semibold shadow-md shadow-blue-500/20 transition-all focus:outline-none focus:ring-2 focus:ring-primary/40 focus:ring-offset-1 dark:focus:ring-offset-slate-800 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {{ loading ? 'Memproses...' : 'Buat Board' }}
        </button>
      </div>
    </div>
  </div>
</template>
