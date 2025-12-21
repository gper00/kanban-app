import api from './api'

export const boardService = {
  // --- Boards ---
  async getBoards() {
    const response = await api.get('/boards')
    return response.data
  },

  async createBoard(boardData) {
    const response = await api.post('/boards', boardData)
    return response.data
  },

  async getBoardDetail(boardId) {
    const response = await api.get(`/boards/${boardId}`)
    return response.data
  },

  async updateBoard(boardId, boardData) {
    const response = await api.put(`/boards/${boardId}`, boardData)
    return response.data
  },

  async deleteBoard(boardId) {
    const response = await api.delete(`/boards/${boardId}`)
    return response.data
  },

  // --- Lists ---
  async getLists(boardId) {
    const response = await api.get(`/lists?boardId=${boardId}`)
    return response.data
  },

  async createList(listData) {
    const response = await api.post('/lists', listData)
    return response.data
  },

  async updateList(listId, listData) {
    const response = await api.put(`/lists/${listId}`, listData)
    return response.data
  },

  async moveList(listId, position) {
    const response = await api.put(`/lists/${listId}/move`, { position })
    return response.data
  },

  async deleteList(listId) {
    const response = await api.delete(`/lists/${listId}`)
    return response.data
  },

  // --- Cards ---
  async getCards(listId) {
    const response = await api.get(`/cards?listId=${listId}`)
    return response.data
  },

  async createCard(cardData) {
    const response = await api.post('/cards', cardData)
    return response.data
  },

  async getCardDetail(cardId) {
    const response = await api.get(`/cards/${cardId}`)
    return response.data
  },

  async updateCard(cardId, cardData) {
    const response = await api.put(`/cards/${cardId}`, cardData)
    return response.data
  },

  async moveCard(cardId, listId, position) {
    const response = await api.put(`/cards/${cardId}/move`, { listId, position })
    return response.data
  },

  async toggleCardCompletion(cardId) {
    const response = await api.put(`/cards/${cardId}/complete`)
    return response.data
  },

  async deleteCard(cardId) {
    const response = await api.delete(`/cards/${cardId}`)
    return response.data
  }
}
