import axios from 'axios'

const apiUrl = import.meta.env.VITE_API_URL

const api = axios.create({
  baseURL: apiUrl,
  withCredentials: true,
})

api.interceptors.response.use(
    (response) => response,
    (error) => {
        const status = error.response?.status
        const url = error.config?.url || ''
        const ehLogin = url.includes('/auth/login')

        // 401 em qualquer rota (menos no próprio login) = sessão expirada
        if (status === 401 && !ehLogin) {
            localStorage.removeItem('user')
            window.location.href = '/login'
        }
        return Promise.reject(error)
    }
)

export default api