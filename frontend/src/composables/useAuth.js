import { ref, computed } from 'vue'
import { authService } from '@/services/auth'

const user = ref(authService.getCurrentUser())
const isAuthenticated = computed(() => !!user.value)

export function useAuth() {
  const login = async (credentials) => {
    try {
      const data = await authService.login(credentials)
      user.value = data.user
      return { success: true, data }
    } catch (error) {
      console.error('Login Error:', error)
      let errorMessage = 'Login gagal'

      if (error.response) {
        // Server responded with a status code outside 2xx
        errorMessage = error.response.data?.error || error.response.data?.message || `Error: ${error.response.status}`
      } else if (error.request) {
        console.log("tes");
        // Request was made but no response received (Network Error/CORS)
        errorMessage = 'Tidak dapat menghubungi server. Pastikan server berjalan.'
      } else {
        errorMessage = error.message
      }

      return {
        success: false,
        error: errorMessage
      }
    }
  }

  const register = async (userData) => {
    try {
      const data = await authService.register(userData)
      user.value = data.user
      return { success: true, data }
    } catch (error) {
      console.error('Register Error:', error)
      let errorMessage = 'Registrasi gagal'

      if (error.response) {
        errorMessage = error.response.data?.error || error.response.data?.message || `Error: ${error.response.status}`
      } else if (error.request) {
        errorMessage = 'Tidak dapat menghubungi server. Pastikan server berjalan.'
      } else {
        errorMessage = error.message
      }

      return {
        success: false,
        error: errorMessage
      }
    }
  }

  const logout = () => {
    authService.logout()
    user.value = null
  }

  return {
    user,
    isAuthenticated,
    login,
    register,
    logout
  }
}
