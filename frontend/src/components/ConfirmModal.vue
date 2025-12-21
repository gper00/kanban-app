<script setup>
defineProps({
  isOpen: Boolean,
  title: {
    type: String,
    default: 'Konfirmasi'
  },
  message: {
    type: String,
    default: 'Apakah Anda yakin?'
  },
  confirmText: {
    type: String,
    default: 'Ya'
  },
  cancelText: {
    type: String,
    default: 'Batal'
  },
  isDestructive: {
    type: Boolean,
    default: false
  }
})

defineEmits(['close', 'confirm'])
</script>

<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4">
    <!-- Backdrop -->
    <div @click="$emit('close')" class="absolute inset-0 bg-slate-900/40 dark:bg-black/60 backdrop-blur-sm transition-opacity"></div>
    
    <!-- Modal -->
    <div class="relative w-full max-w-[400px] bg-surface-light dark:bg-surface-dark rounded-xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
      <div class="p-6 text-center">
        <div v-if="isDestructive" class="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
          <span class="material-symbols-outlined text-red-600 dark:text-red-500 text-2xl">warning</span>
        </div>
        <div v-else class="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
          <span class="material-symbols-outlined text-blue-600 dark:text-blue-500 text-2xl">info</span>
        </div>
        
        <h3 class="text-lg font-bold text-slate-900 dark:text-white mb-2">{{ title }}</h3>
        <p class="text-sm text-slate-500 dark:text-slate-400">{{ message }}</p>
      </div>

      <div class="flex items-center gap-3 px-6 pb-6 pt-2 justify-center">
        <button 
          @click="$emit('close')"
          class="flex-1 px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-200"
        >
          {{ cancelText }}
        </button>
        <button 
          @click="$emit('confirm')"
          :class="[
            'flex-1 px-4 py-2.5 rounded-lg text-white font-medium shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-slate-900',
            isDestructive 
              ? 'bg-red-600 hover:bg-red-700 focus:ring-red-500' 
              : 'bg-primary hover:bg-blue-600 focus:ring-primary'
          ]"
        >
          {{ confirmText }}
        </button>
      </div>
    </div>
  </div>
</template>
