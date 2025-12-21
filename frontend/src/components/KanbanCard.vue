<script setup>
import { computed } from 'vue'

const props = defineProps({
  card: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['click'])

const formattedDate = computed(() => {
  if (!props.card.dueDate) return null
  const date = new Date(props.card.dueDate)
  return date.toLocaleDateString('id-ID', { month: 'short', day: 'numeric' })
})

const tagColorClass = computed(() => {
  const colors = {
    blue: 'text-blue-500 bg-blue-500/10',
    purple: 'text-purple-500 bg-purple-500/10',
    green: 'text-green-500 bg-green-500/10',
    red: 'text-red-500 bg-red-500/10',
    orange: 'text-orange-500 bg-orange-500/10'
  }
  return colors[props.card.tagColor] || 'text-gray-500 bg-gray-500/10'
})
</script>

<template>
  <div 
    @click="$emit('click', card)"
    class="flex flex-col rounded-lg shadow-[0_1px_3px_rgba(0,0,0,0.07)] bg-surface-light dark:bg-background-dark border border-transparent dark:border-border-dark cursor-pointer hover:shadow-md transition-shadow" 
    :class="{ 'opacity-70': card.completed }"
  >
    
    <!-- Cover Image -->
    <div v-if="card.coverImage" class="aspect-video w-full rounded-t-lg bg-cover bg-center" :style="{ backgroundImage: `url('${card.coverImage}')` }"></div>
    
    <div class="flex w-full flex-col gap-2 p-4">
      <!-- Tag -->
      <span v-if="card.tag" class="text-xs font-medium rounded-full px-2 py-0.5 w-fit" :class="tagColorClass">
        {{ card.tag }}
      </span>

      <!-- Title -->
      <p class="text-base font-bold text-text-light-primary dark:text-text-dark-primary" :class="{ 'line-through': card.completed }">
        {{ card.title }}
      </p>

      <!-- Description -->
      <p v-if="card.description" class="text-sm text-text-light-secondary dark:text-text-dark-secondary line-clamp-2">
        {{ card.description }}
      </p>

      <!-- Footer -->
      <div class="mt-2 flex items-center justify-between">
        <!-- Date / Status -->
        <div class="flex items-center gap-2 text-sm" :class="[
          card.isUrgent ? 'text-red-500' : 
          card.completed ? 'text-green-600 dark:text-green-500' : 
          'text-text-light-secondary dark:text-text-dark-secondary'
        ]">
          <template v-if="card.completed">
             <span class="material-symbols-outlined text-lg">task_alt</span>
             <span>Selesai</span>
          </template>
          <template v-else-if="formattedDate">
             <span class="material-symbols-outlined text-lg">calendar_today</span>
             <span>{{ formattedDate }}</span>
          </template>
        </div>

        <!-- Avatars -->
        <div class="flex -space-x-2" v-if="card.avatars && card.avatars.length">
          <div 
            v-for="(avatar, index) in card.avatars" 
            :key="index"
            class="size-6 rounded-full bg-cover ring-2 ring-surface-light dark:ring-surface-dark" 
            :style="{ backgroundImage: `url('${avatar}')` }"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>