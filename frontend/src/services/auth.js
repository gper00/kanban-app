import api from './api'

export const authService = {
  async register(userData) {
    const response = await api.post('/auth/register', userData)
    
    const token = response.data.token || response.data.accessToken || (response.data.data && response.data.data.token)
    const user = response.data.user || (response.data.data && response.data.data.user)

    if (token) {
      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(user))
    }
    return response.data
  },

  async login(credentials) {
    const response = await api.post('/auth/login', credentials)
    
    // Pastikan token ada, sesuaikan jika struktur respons berbeda (misal response.data.data.token)
    const token = response.data.token || response.data.accessToken || (response.data.data && response.data.data.token)
    const user = response.data.user || (response.data.data && response.data.data.user)

    if (token) {
      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(user))
    }
    return response.data
  },

  logout() {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  },

  getCurrentUser() {
    const userStr = localStorage.getItem('user')
    try {
      return userStr ? JSON.parse(userStr) : null
    } catch (e) {
      return null
    }
  },

  isAuthenticated() {
    const token = localStorage.getItem('token')
    return !!token
  }
}
