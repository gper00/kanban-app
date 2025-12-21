import { ref, computed } from 'vue'
import { authService } from '@/services/auth'

const user = ref(authService.getCurrentUser())
const isAuthenticated = computed(() => !!user.value)

export function useAuth() {
  const login = async (credentials) => {
    try {
      const data = await authService.login(credentials)
      user.value = data.user || (data.data && data.data.user)
      return { success: true, data }
    } catch (error) {
      // Hanya log error sistem (bukan salah password/401)
      if (error.response?.status !== 401) {
        console.error('Login Error:', error)
      }
      
      let errorMessage = 'Login gagal'

      if (error.response) {
        const responseData = error.response.data
        // Jika ada array errors dari validasi, gabungkan menjadi satu string
        if (responseData.errors && Array.isArray(responseData.errors)) {
          errorMessage = responseData.errors.join('\n')
        } else {
          errorMessage = responseData?.error || responseData?.message || `Error: ${error.response.status}`
        }
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

  const register = async (userData) => {
    try {
      const data = await authService.register(userData)
      user.value = data.user || (data.data && data.data.user)
      return { success: true, data }
    } catch (error) {
      console.error('Register Error:', error)
      let errorMessage = 'Registrasi gagal'

      if (error.response) {
        const responseData = error.response.data
        // Jika ada array errors dari validasi, gabungkan menjadi satu string
        if (responseData.errors && Array.isArray(responseData.errors)) {
          errorMessage = responseData.errors.join('\n')
        } else {
          errorMessage = responseData?.error || responseData?.message || `Error: ${error.response.status}`
        }
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
