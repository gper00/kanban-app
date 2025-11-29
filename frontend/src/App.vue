<script setup>
import Header from "./components/Header.vue"
import Ref from "./components/Ref.vue"
import { ref } from "vue"

const newTask = ref("")
const tasks = ref([
  { id: 1, text: "Belajar Vue.js", completed: true },
  { id: 2, text: "Setup Tailwind CSS", completed: false },
  { id: 3, text: "Ujian Chunin", completed: false }
])

const addTask = () => { // nambah task
  if (newTask.value.trim() === "") return

  tasks.value.push({
    id: Date.now(),
    text: newTask.value,
    completed: false
  })

  newTask.value = ""
}

const removeTask = (id) => { // ngapus task
  tasks.value = tasks.value.filter((t) => t.id !== id)
}

const toggleComplete = (task) => { // ngubah status task
  task.completed = !task.completed
}
</script>

<template>
  <Header name="Umam" age="20" />
  <Ref />

  <div class="min-h-screen bg-gray-100 flex items-center justify-center p-5">
    <div class="bg-white w-full max-w-md rounded-xl shadow-lg overflow-hidden">

      <div class="bg-indigo-600 p-6">
        <h1 class="text-white text-2xl font-bold text-center">My Todo List</h1>
        <p class="text-indigo-200 text-center text-sm mt-1">
          Kelola tugas harianmu
        </p>
      </div>

      <div class="p-6">
        <form @submit.prevent="addTask" class="flex gap-2">
          <input
            v-model="newTask"
            type="text"
            placeholder="Tambahkan tugas baru..."
            class="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indifo-500"
          />
          <button
            type="submit"
            class="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition font-semibold"
          >
            Tambah
          </button>
        </form>

        <ul class="my-6 space-y-3">
          <li
            v-for="task in tasks"
            :key="task.id"
            class="flex items-center justify-between bg-gray-50 p-3 rounded-lg border border-gray-100 shadow-sm"
          >
            <div
              class="flex items-center gap-3 cursor-pinter"
              @click="toggleComplete(task)"
            >
              <div
                class="w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors"
                :class="
                  task.completed
                    ? 'bg-green-500 border-green-500'
                    : 'border-gray-300'
                "
              >
                <span v-if="task.completed" class="text-white text-xs">✓</span>
              </div>

              <span
                class="text-gray-800 transition-all"
                :class="{ 'line-through text-gray-400': task.completed }"
              >
                {{ task.text }}
              </span>
            </div>

            <button
              @click="removeTask(task.id)"
              class="task-red-400 hover:text-red-600 p-2 rounded-md hover:bg-red-50 transition"
            >
                Hapus
            </button>
          </li>
        </ul>

        <!-- saat daftar kosong -->
        <p v-if="!tasks.length" class="text-center text-gray-400 mt-5 italic">
          Tidak ada tugas saat ini.
        </p>

      </div>
    </div>
  </div>
</template>

<!-- <style scoped></style> -->
