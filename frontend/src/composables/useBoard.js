import { ref } from 'vue'
import { boardService } from '@/services/boardService'

export function useBoard() {
  const boards = ref([])
  const currentBoard = ref(null)
  const lists = ref([])
  const loading = ref(false)
  const error = ref(null)

  // --- Board Actions ---
  const fetchBoards = async () => {
    loading.value = true
    try {
      const response = await boardService.getBoards()
      if (response.success) {
        boards.value = response.data
      }
    } catch (err) {
      error.value = 'Gagal memuat daftar board'
      console.error(err)
    } finally {
      loading.value = false
    }
  }

  const fetchBoardDetail = async (boardId) => {
    loading.value = true
    try {
      // 1. Ambil detail board
      const boardRes = await boardService.getBoardDetail(boardId)
      if (boardRes.success) {
        currentBoard.value = boardRes.data
        
        // 2. Ambil lists untuk board ini
        const listsRes = await boardService.getLists(boardId)
        if (listsRes.success) {
          // Inisialisasi cards sebagai array kosong untuk setiap list
          const initializedLists = listsRes.data.map(list => ({ ...list, cards: [] }))
          
          // Sort lists berdasarkan posisi
          lists.value = initializedLists.sort((a, b) => a.position - b.position)
          
          // 3. Ambil cards untuk setiap list (Parallel requests)
          await Promise.all(lists.value.map(async (list) => {
            try {
              const cardsRes = await boardService.getCards(list.id)
              if (cardsRes.success && Array.isArray(cardsRes.data)) {
                list.cards = cardsRes.data.sort((a, b) => a.position - b.position)
              }
            } catch (e) {
              console.error(`Failed to fetch cards for list ${list.id}`, e)
              list.cards = []
            }
          }))
        } else {
            lists.value = []
        }
      }
    } catch (err) {
      error.value = 'Gagal memuat detail board'
      console.error(err)
    } finally {
      loading.value = false
    }
  }

  const createBoard = async (title, description, isPrivate = true) => {
    try {
      const res = await boardService.createBoard({ 
        title, 
        description, 
        isPrivate,
        backgroundColor: '#197fe6' // Default color
      })
      if (res.success) {
        boards.value.push(res.data)
        return res.data
      }
    } catch (err) {
      console.error(err)
      throw err
    }
  }

  // --- List Actions ---
  const createList = async (title) => {
    if (!currentBoard.value) return
    
    // Hitung posisi baru (paling akhir)
    const position = lists.value.length + 1

    try {
      const res = await boardService.createList({
        title,
        boardId: currentBoard.value.id,
        position
      })
      if (res.success) {
        const newList = { ...res.data, cards: [] }
        lists.value.push(newList)
      }
    } catch (err) {
      console.error(err)
      throw err
    }
  }

  const archiveList = async (listId) => {
    try {
      const res = await boardService.updateList(listId, { isArchived: true })
      if (res.success) {
        // Hapus dari state lokal
        lists.value = lists.value.filter(l => l.id !== listId)
      }
    } catch (err) {
      console.error(err)
      throw err
    }
  }

  const moveList = async (listId, newPosition) => {
    try {
      const res = await boardService.moveList(listId, newPosition)
      if (res.success) {
        // Refresh seluruh board untuk memastikan urutan sinkron (opsi paling aman)
        // Atau update manual array lokal jika backend mengembalikan array lists terurut
        if (currentBoard.value) {
            await fetchBoardDetail(currentBoard.value.id)
        }
      }
    } catch (err) {
        console.error(err)
        throw err
    }
  }

  // --- Card Actions ---
  const createCard = async (listId, cardData) => {
    // Cari list di state lokal
    const list = lists.value.find(l => l.id === listId)
    if (!list) return

    // Hitung posisi
    const position = list.cards ? list.cards.length + 1 : 1

    try {
      const res = await boardService.createCard({
        ...cardData,
        listId,
        position
      })
      if (res.success) {
        if (!list.cards) list.cards = []
        list.cards.push(res.data)
      }
    } catch (err) {
      console.error(err)
      throw err
    }
  }

  const updateCard = async (cardId, listId, updateData) => {
    try {
      const res = await boardService.updateCard(cardId, updateData)
      if (res.success) {
        // Update local state
        const list = lists.value.find(l => l.id === listId)
        if (list) {
          const index = list.cards.findIndex(c => c.id === cardId)
          if (index !== -1) {
            list.cards[index] = { ...list.cards[index], ...res.data }
          }
        }
        return res.data
      }
    } catch (err) {
      console.error(err)
      throw err
    }
  }

  const updateCardCompletion = async (cardId, listId) => {
     try {
        const res = await boardService.toggleCardCompletion(cardId)
        if (res.success) {
            // Update local state
            const list = lists.value.find(l => l.id === listId)
            if (list) {
                const card = list.cards.find(c => c.id === cardId)
                if (card) {
                    card.isCompleted = res.data.isCompleted
                }
            }
        }
     } catch (err) {
         console.error(err)
     }
  }

  const deleteCard = async (cardId, listId) => {
    try {
      const res = await boardService.deleteCard(cardId)
      if (res.success) {
        const list = lists.value.find(l => l.id === listId)
        if (list) {
          list.cards = list.cards.filter(c => c.id !== cardId)
        }
      }
    } catch (err) {
      console.error(err)
      throw err
    }
  }

  const moveCard = async (cardId, fromListId, toListId, newPosition) => {
      try {
          const res = await boardService.moveCard(cardId, toListId, newPosition)
          if(res.success) {
              // Untuk simplifikasi, refresh board saat pindah kartu agar urutan sinkron
              if (currentBoard.value) {
                  await fetchBoardDetail(currentBoard.value.id)
              }
          }
      } catch (err) {
          console.error(err)
          throw err
      }
  }

  return {
    boards,
    currentBoard,
    lists,
    loading,
    error,
    fetchBoards,
    fetchBoardDetail,
    createBoard,
    createList,
    archiveList,
    moveList,
    createCard,
    updateCard,
    updateCardCompletion,
    deleteCard,
    moveCard
  }
}
