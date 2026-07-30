import axios from 'axios'

const api = axios.create({
  baseURL: 'https://trendlens-1.onrender.com/api',
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use((config) => {
  const token = window.localStorage.getItem('trendlens-access-token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// If a request fails with 401, clear stale credentials so the app
// routes the user back to login instead of looping on bad requests.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      window.localStorage.removeItem('trendlens-access-token')
      window.localStorage.removeItem('trendlens-refresh-token')
    }
    return Promise.reject(error)
  }
)

export default api
