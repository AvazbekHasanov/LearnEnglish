import axios from 'axios'

export const BASE_URL = import.meta.env.DEV ? '/api' : 'http://16.170.158.74:8081/api'

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

// Public API client for endpoints that don't require authentication
const publicApiClient = (customConfig = {}) => {
  const instance = axios.create({
    baseURL: customConfig.baseURL || BASE_URL,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'ACCEPT-LANGUAGE': localStorage.getItem('locale') || 'en',
      ...customConfig.headers
    },
    timeout: 15000,
  })

  // Add response interceptor for debugging
  instance.interceptors.response.use(
    response => {
      console.log('API Response:', response.config.url, response.status)
      return response
    },
    error => {
      console.error('API Error:', error.config?.url, error.response?.status, error.message)
      return Promise.reject(error)
    }
  )

  return instance
}

// Auth API
export const authAPI = {
  signUp: (data) => apiClient().post('/auth/sign-up', data),
  signIn: (data) => apiClient().post('/auth/sign-in', data),
  verifyOTP: ({ email, code }) =>
    apiClient().post(`/auth/verify?email=${email}&code=${encodeURIComponent(code)}`),
  forgotPassword: (email) => apiClient().post(`/auth/forgot-password?email=${email}`),
  resetPassword: (email, newPassword) => apiClient().post(`/auth/reset-password?email=${email}&newPassword=${newPassword}`),
  resendOtp: (data) => apiClient().post('/auth/resend-code', data)
}

// User API
export const userAPI = {
  getProfile: (userId) => apiClient().get(`/user/profile?userId=${userId}`),
  getProgress: (userId) => apiClient().get(`/user/progress?userId=${userId}`),
  uploadImage: (userId, file) => {
    const formData = new FormData()
    formData.append('file', file)
    return apiClient({
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }).post(`/user/upload-image/${userId}`, formData)
  },
  getProfileImage: (userId) => apiClient().get(`/user/profile-image/${userId}`)
}

// Level API
export const levelAPI = {
  getLevels: () => apiClient().get('/level'),
  addLevel: (level) => apiClient().post(`/level/add?level=${level}`),
  levelUp: (userId, nextLevel) => apiClient().put(`/level/up?userId=${userId}&nextLevel=${nextLevel}`)
}

// Grammar API
export const grammarAPI = {
  getLevels: () => publicApiClient().get('/grammar/levels'),
  getLessons: () => publicApiClient().get('/grammar/lessons'),
  getMyLessons: (userId, levelId) => {
    // Try with authentication first, fallback to public if needed
    const token = localStorage.getItem('accessToken')
    if (token) {
      return apiClient().get(`/grammar/my-lessons?userId=${userId}&levelId=${levelId}`)
    } else {
      return publicApiClient().get(`/grammar/my-lessons?userId=${userId}&levelId=${levelId}`)
    }
  },
  endLesson: (userId, topicId) => apiClient().post(`/grammar/end-lesson?userId=${userId}&topicId=${topicId}`),
  addList: (lessons) => apiClient().post('/grammar/add-list', lessons),
  getTopicList: () => publicApiClient().get('/grammar/topic-list')
}

// Vocabulary API
export const vocabularyAPI = {
  // Public GET endpoints
  getCategories: () => publicApiClient().get('/vocabulary/category'),
  getWords: (groupId) => publicApiClient().get(`/vocabulary/words?groupId=${groupId}`),
  // Admin/secured POST endpoints
  addCategories: (categories) => apiClient().post('/vocabulary/add-categories', categories),
  addWords: (categoryId, words) => apiClient().post(`/vocabulary/add-words/${categoryId}`, words)
}

// Quiz API
export const quizAPI = {
  // Get quizzes
  getGrammarQuizzes: (topicId, userId) => apiClient().get(`/quiz/grammar?topicId=${topicId}&userId=${userId}`),
  getVocabularyQuizzes: (topicId, userId) => apiClient().get(`/quiz/vocabulary?topicId=${topicId}&userId=${userId}`),
  getGrammarResult: (userId, grammarTopicId) => apiClient().get(`/quiz/grammar-result?userId=${userId}&grammarTopiId=${grammarTopicId}`),
  
  // Submit quiz answers
  submitVocabQuiz: (quizData) => apiClient().post('/quiz/vocab', quizData),
  submitGrammarQuiz: (quizData) => apiClient().post('/quiz/grammar', quizData),
  
  // Add new quizzes (admin)
  addVocabQuiz: (groupId, score, quizData) => apiClient().post(`/quiz/add-vocab/${groupId}/${score}`, quizData),
  addGrammarQuiz: (topicId, score, quizData) => apiClient().post(`/quiz/add-grammar/${topicId}/${score}`, quizData)
}

export const api = {
  get: (url, config = {}) => apiClient(config).get(url, config),
  post: (url, data, config = {}) => apiClient(config).post(url, data, config),
  put: (url, data, config = {}) => apiClient(config).put(url, data, config),
  delete: (url, config = {}) => apiClient(config).delete(url, config),
}
