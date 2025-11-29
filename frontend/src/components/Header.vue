<script setup>

defineProps({
  name: String,
  age: Number
})

</script>

<template>
    <header>
      <div class="text-blue" :id="name">Nama: {{ name }}</div>
      <div class="text-green">Nama: {{ age }}</div>
    </header>
</template>
