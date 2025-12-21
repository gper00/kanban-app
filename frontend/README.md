# Vue.js Kanban Board

Aplikasi manajemen proyek berbasis Kanban yang dibangun menggunakan Vue 3 dan Vite. Aplikasi ini memungkinkan pengguna untuk membuat papan proyek, daftar tugas, dan kartu tugas secara interaktif dengan antarmuka yang bersih dan responsif.

## Fitur Utama

- Autentikasi Pengguna (Login & Register).
- Dashboard Manajemen Board (Buat, Lihat Board).
- Kanban Board Interaktif (Buat List, Buat Card).
- Manajemen Kartu (Edit Judul, Deskripsi, Tanggal, Status Selesai).
- Fitur Pindah Kartu antar List dan Arsip List.
- Tampilan Responsif dengan dukungan Dark Mode (via Tailwind).

## Teknologi

Project ini dibangun dengan teknologi web modern:
- **Vue 3** (Composition API)
- **Vite** (Build tool)
- **Tailwind CSS** (Styling)
- **Axios** (HTTP Client)
- **Vue Router** (Routing)

## Cara Menjalankan

Pastikan Node.js (v20+) sudah terinstal di komputer Anda.

1.  Instal dependensi proyek:
    ```bash
    npm install
    ```

2.  Jalankan server pengembangan:
    ```bash
    npm run dev
    ```

3.  Buka browser dan akses `http://localhost:5173`.

> **Catatan:** Pastikan backend API sudah berjalan di `http://localhost:3000` agar fitur autentikasi dan data board berfungsi dengan baik. Konfigurasi proxy ada di `vite.config.js`.

## Struktur Direktori

- `src/views`: Halaman utama aplikasi (Home, Board, Login, Register).
- `src/components`: Komponen UI yang dapat digunakan kembali (Modal, KanbanList, KanbanCard).
- `src/composables`: Logika state management (useAuth, useBoard).
- `src/services`: Konfigurasi API dan endpoint.
