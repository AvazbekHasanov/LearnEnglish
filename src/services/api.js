import axios from 'axios'


export const BASE_URL = 'https://enrollapp.uwed.uz/api'


const apiClient = (customConfig = {}) => {
  const instance = axios.create({
    baseURL: customConfig.baseURL || 'https://enrollapp.uwed.uz/api',
    headers: {
      'Content-Type': 'application/json',
      'ACCEPT-LANGUAGE': localStorage.getItem('locale') || 'en',
      'Authorization': 'Bearer ' + localStorage.getItem('accessToken'),
      ...customConfig.headers
    },
    timeout: 10000,
  })

  // Add a response interceptor
  instance.interceptors.response.use(
    response => response, // Simply return response if successful
    error => {
      if (error.response && error.response.status === 401) {
        if (window.location.pathname !== '/auth-login') {
          localStorage.removeItem('accessToken');

          window.location.href = '/auth-login';
        }
      }

      // Reject the promise for other errors
      return Promise.reject(error)
    }
  )

  return instance
}

export default {
  get: (url, config = {}) => apiClient(config).get(url, config),
  post: (url, data, config = {}) => apiClient(config).post(url, data, config),
  put: (url, data, config = {}) => apiClient(config).put(url, data, config),
  delete: (url, config = {}) => apiClient(config).delete(url, config),
}
