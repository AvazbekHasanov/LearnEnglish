import axios from 'axios'

export const BASE_URL = 'http://16.170.158.74:8081'

const apiClient = (customConfig = {}) => {
  const instance = axios.create({
    baseURL: customConfig.baseURL || BASE_URL,
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
        if (window.location.pathname !== '/auth/login') {
          localStorage.removeItem('accessToken')
          localStorage.removeItem('userInfo')
          window.location.href = '/auth/login'
        }
      }

      // Reject the promise for other errors
      return Promise.reject(error)
    }
  )

  return instance
}

// Auth API
export const authAPI = {
  signUp: (data) => apiClient().post('/api/auth/sign-up', data),
  signIn: (data) => apiClient().post('/api/auth/sign-in', data),
  verifyOTP: ({ email, code }) =>
    apiClient().post(`/api/auth/verify?email=${email}&code=${encodeURIComponent(code)}`),
  forgotPassword: (email) => apiClient().post(`/api/auth/forgot-password?email=${email}`),
  resetPassword: (email, newPassword) => apiClient().post(`/api/auth/reset-password?email=${email}&newPassword=${newPassword}`),
  resendOtp: (data) => apiClient().post('/api/auth/resend-code', data)
}

// User API
export const userAPI = {
  getProfile: (userId) => apiClient().get(`/api/user/profile?userId=${userId}`),
  getProgress: (userId) => apiClient().get(`/api/user/progress?userId=${userId}`),
  uploadImage: (userId, file) => {
    const formData = new FormData()
    formData.append('file', file)
    return apiClient({
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }).post(`/api/user/upload-image?userId=${userId}`, formData)
  },
  getProfileImage: (userId) => apiClient().get(`/api/user/profile-image/${userId}`)
}

// Level API
export const levelAPI = {
  getLevels: () => apiClient().get('/api/level'),
  addLevel: (level) => apiClient().post(`/api/level/add?level=${level}`),
  levelUp: (userId, nextLevel) => apiClient().put(`/api/level/up?userId=${userId}&nextLevel=${nextLevel}`)
}

// Grammar API
export const grammarAPI = {
  getLevels: () => apiClient().get('/api/grammar/levels'),
  getLessons: () => apiClient().get('/api/grammar/lessons'),
  getMyLessons: (userId) => apiClient().get(`/api/grammar/my-lessons?userId=${userId}`),
  endLesson: (userId, topicId) => apiClient().post(`/api/grammar/end-lesson?userId=${userId}&topicId=${topicId}`)
}

// Vocabulary API
export const vocabularyAPI = {
  getCategories: () => apiClient().get('/api/vocabulary/category'),
  getWords: (groupId) => apiClient().get(`/api/vocabulary/words?groupId=${groupId}`)
}

// Quiz API
export const quizAPI = {
  getGrammarQuizzes: (topicId) => apiClient().get(`/api/quiz/grammar?topicId=${topicId}`),
  getVocabularyQuizzes: (topicId) => apiClient().get(`/api/quiz/vocabulary?topicId=${topicId}`),
  answerGrammarQuiz: (data) => apiClient().post('/api/quiz/grammar', data),
  getGrammarQuizResult: (userId, grammarTopicId) => apiClient().get(`/api/quiz/grammar-result?userId=${userId}&grammarTopiId=${grammarTopicId}`)
}

export const api = {
  get: (url, config = {}) => apiClient(config).get(url, config),
  post: (url, data, config = {}) => apiClient(config).post(url, data, config),
  put: (url, data, config = {}) => apiClient(config).put(url, data, config),
  delete: (url, config = {}) => apiClient(config).delete(url, config),
}
