<script setup>
import { ref, onUnmounted, computed } from 'vue'
import { useRoute } from 'vue-router' 

const route = useRoute()

// timer buat pomodoro
const modes = {
  POMODORO: { label: 'Focus', time: 25 * 60, color: 'from-red-50 to-orange-100', accent: 'bg-orange-600' },
  SHORT_BREAK: { label: 'Short Break', time: 5 * 60, color: 'from-blue-50 to-cyan-100', accent: 'bg-blue-600' },
  LONG_BREAK: { label: 'Long Break', time: 15 * 60, color: 'from-indigo-50 to-purple-100', accent: 'bg-indigo-600' }
}

const currentMode = ref('POMODORO')
const timeLeft = ref(modes.POMODORO.time)
const isRunning = ref(false)
let timerInterval = null

// musik masi pake assets sendiri (bukan url)
const audioPlayer = ref(null)
const isPlaying = ref(false)
const volume = ref(0.5)

// daftar lagu baru 3 di public/audio/
const playlist = [
  '../public/audio/good-night-lofi-cozy-chill-music-160166.mp3',
  '../public/audio/good-night-lofi-cozy-chill-music-160166.mp3',
  '../public/audio/lofi-girl-lofi-ambient-music-365952.mp3'
]

const currentTrackIndex = ref(0)

// random biar bisa musicnya beda tiap button diteken
const getRandomTrackIndex = () => {
  if (playlist.length <= 1) return 0
  let randomIndex
  do {
    randomIndex = Math.floor(Math.random() * playlist.length)
  } while (randomIndex === currentTrackIndex.value)
  return randomIndex
}

const toggleMusic = () => {
  if (isPlaying.value) {
    audioPlayer.value.pause()
    isPlaying.value = false
  } else {
    currentTrackIndex.value = getRandomTrackIndex()
    setTimeout(() => {
      audioPlayer.value.play()
      isPlaying.value = true
    }, 0)
  }
}

const nextTrack = () => {
  currentTrackIndex.value = getRandomTrackIndex()
  if (isPlaying.value) {
    setTimeout(() => audioPlayer.value.play(), 0)
  }
}

const updateVolume = () => {
  if (audioPlayer.value) {
    audioPlayer.value.volume = volume.value
  }
}

// buat timernya
const minutes = computed(() => Math.floor(timeLeft.value / 60).toString().padStart(2, '0'))
const seconds = computed(() => (timeLeft.value % 60).toString().padStart(2, '0'))

const toggleTimer = () => {
  if (isRunning.value) {
    clearInterval(timerInterval)
  } else {
    timerInterval = setInterval(() => {
      if (timeLeft.value > 0) {
        timeLeft.value--
      } else {
        stopTimer()
        alert(`${modes[currentMode.value].label} selesai!`)
      }
    }, 1000)
  }
  isRunning.value = !isRunning.value
}

const stopTimer = () => {
  clearInterval(timerInterval)
  isRunning.value = false
}

const setMode = (mode) => {
  stopTimer()
  currentMode.value = mode
  timeLeft.value = modes[mode].time
}

const resetTimer = () => {
  stopTimer()
  timeLeft.value = modes[currentMode.value].time
}

onUnmounted(() => {
  stopTimer()
  if (audioPlayer.value) audioPlayer.value.pause()
})

const backLink = computed(() => {
  const boardId = route.query.fromBoard
  return boardId ? `/board/${boardId}` : '/boards'
})
</script>

<template>
  <div :class="`min-h-screen flex flex-col items-center justify-center bg-gradient-to-br ${modes[currentMode].color} p-4 transition-colors duration-700 text-slate-800`, font-display">
    <router-link :to="backLink" class="absolute top-8 left-8 flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors font-medium">
      <span class="material-symbols-outlined">arrow_back</span>
      <span>{{ route.query.fromBoard ? 'Kembali ke Board' : 'Kembali ke Dashboard' }}</span>
    </router-link>

    <div class="bg-white/70 backdrop-blur-xl rounded-[3rem] p-8 md:p-12 shadow-2xl border border-white/50 text-center w-full max-w-md relative overflow-hidden">
      <h1 class="text-xl font-bold text-gray-500 uppercase tracking-[0.2em] mb-8">Pomodoro</h1>
      
      <div class="flex gap-2 justify-center mb-10 bg-gray-200/50 p-1.5 rounded-2xl">
        <button 
          v-for="(config, key) in modes" 
          :key="key"
          @click="setMode(key)"
          class="flex-1 py-2 text-xs font-bold rounded-xl transition-all duration-300"
          :class="currentMode === key ? `${config.accent} text-white shadow-md` : 'text-gray-500 hover:bg-white/50'"
        >
          {{ config.label }}
        </button>
      </div>

      <div class="text-[7rem] font-black leading-none mb-10 tracking-tighter tabular-nums">
        {{ minutes }}:{{ seconds }}
      </div>

      <div class="flex flex-col gap-4">
        <button 
          @click="toggleTimer"
          :class="`w-full py-6 px-8 ${modes[currentMode].accent} hover:brightness-110 text-white text-2xl font-black rounded-3xl transition-all transform active:scale-95 shadow-2xl shadow-gray-200 uppercase tracking-widest`"
        >
          {{ isRunning ? 'Pause' : 'Start' }}
        </button>
        
        <button 
          @click="resetTimer"
          class="text-gray-400 hover:text-gray-600 font-bold transition-colors tracking-widest text-xs"
        >
          RESET TIMER
        </button>
      </div>
    </div>

    <div class="fixed bottom-8 bg-white/80 backdrop-blur-lg px-6 py-4 rounded-3xl shadow-xl border border-white/50 flex items-center gap-6 animate-bounce-subtle">
      <audio ref="audioPlayer" :src="playlist[currentTrackIndex]" loop @play="isPlaying = true" @pause="isPlaying = false"></audio>
      
      <div class="flex items-center gap-2">
        <button 
          @click="toggleMusic" 
          :class="`w-12 h-12 flex items-center justify-center rounded-full text-white transition-all ${isPlaying ? 'bg-gray-800' : modes[currentMode].accent}`"
        >
          <span class="material-symbols-outlined text-2xl">
            {{ isPlaying ? 'pause' : 'play_arrow' }}
          </span>
        </button>

        <button 
          @click="nextTrack"
          class="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
        >
          <span class="material-symbols-outlined text-xl">shuffle</span>
        </button>
      </div>

      <div class="flex flex-col gap-1 min-w-[120px]">
        <span class="text-[10px] font-black text-gray-400 uppercase tracking-[0.1em]">Lofi Track {{ currentTrackIndex + 1 }}</span>
        <input 
          type="range" 
          min="0" 
          max="1" 
          step="0.01" 
          v-model="volume" 
          @input="updateVolume"
          class="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-slate-800"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes bounce-subtle {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-5px); }
}
.animate-bounce-subtle {
  animation: bounce-subtle 4s ease-in-out infinite;
}

input[type='range']::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 12px;
  height: 12px;
  background: #1e293b;
  border-radius: 50%;
  cursor: pointer;
}
</style>