<script setup>
import { ref } from "vue"

// Membuat reactive state
const count = ref(0)
const message = ref("Halo Vue!")

// Function untuk mengubah state
const increment = () => {
  count.value++ // Akses dengan .value di script
}

const decrement = () => {
  count.value--
}

const reset = () => {
  count.value = 0
}
</script>

<template>
  <div>
    <h2>{{ message }}</h2>
    <h1>Count: {{ count }}</h1>
    <!-- Akses tanpa .value di template -->

    <button @click="increment">+ Tambah</button>
    <button @click="decrement">- Kurang</button>
    <button @click="reset">🔄 Reset</button>
  </div>
</template>
