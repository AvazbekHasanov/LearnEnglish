import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { authAPI, userAPI, levelAPI } from '../services/api'

export const useUserStore = defineStore('user', () => {
  // User data
  const user = ref({
    id: null,
    username: '',
    email: '',
    fullName: '',
    langLevel: 'beginner',
    imageUrl: null,
    points: 0,
    streakDays: 0,
    totalStudyTime: 0,
    lessonsCompleted: 0,
    testsPassed: 0,
    createdAt: null,
    lastLogin: null
  })

  // Authentication state
  const isAuthenticated = ref(false)
  const isLoading = ref(false)
  const error = ref(null)

  // Learning progress
  const progress = ref({
    grammar: {
      completedLessons: [],
      currentLesson: 1,
      totalScore: 0
    },
    vocabulary: {
      completedSets: [],
      currentSet: 1,
      totalWordsLearned: 0
    },
    games: {
      gamesPlayed: 0,
      highScores: {},
      achievementsUnlocked: []
    }
  })

  // Achievements
  const achievements = ref([
    {
      id: 'first_lesson',
      name: 'First Steps',
      description: 'Complete your first lesson',
      icon: '🎯',
      unlocked: false,
      points: 10
    },
    {
      id: 'streak_5',
      name: 'Consistent Learner',
      description: 'Study for 5 days in a row',
      icon: '🔥',
      unlocked: false,
      points: 25
    },
    {
      id: 'streak_10',
      name: 'Dedicated Student',
      description: 'Study for 10 days in a row',
      icon: '⚡',
      unlocked: false,
      points: 50
    },
    {
      id: 'points_100',
      name: 'Point Collector',
      description: 'Earn 100 points',
      icon: '💎',
      unlocked: false,
      points: 20
    },
    {
      id: 'grammar_master',
      name: 'Grammar Master',
      description: 'Complete all grammar lessons',
      icon: '📚',
      unlocked: false,
      points: 100
    },
    {
      id: 'vocabulary_expert',
      name: 'Vocabulary Expert',
      description: 'Learn 500 words',
      icon: '📖',
      unlocked: false,
      points: 100
    }
  ])

  // Study history
  const studyHistory = ref([])

  // Computed properties
  const totalPoints = computed(() => user.value.points)
  const unlockedAchievements = computed(() => 
    achievements.value.filter(a => a.unlocked)
  )
  const totalAchievements = computed(() => achievements.value.length)
  const unlockedAchievementsCount = computed(() => unlockedAchievements.value.length)

  // Authentication actions
  async function signIn(credentials) {
    try {
      isLoading.value = true
      error.value = null
      
      const response = await authAPI.signIn(credentials)
      const { accessToken } = response.data
      
      localStorage.setItem('accessToken', accessToken)
      isAuthenticated.value = true
      
      // Extract user ID from token or response
      // For now, we'll need to get user info from the response or make a separate call
      // This depends on your backend implementation
      if (response.data.userId) {
        user.value.id = response.data.userId
        await loadUserProfile()
      }
      
      return response
    } catch (err) {
      error.value = err.response?.data?.message || 'Login failed'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  async function signUp(userData) {
    try {
      isLoading.value = true
      error.value = null
      
      const response = await authAPI.signUp(userData)
      return response
    } catch (err) {
      error.value = err.response?.data?.message || 'Registration failed'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  async function verifyOTP(otpData) {
    try {
      isLoading.value = true
      error.value = null
      
      const response = await authAPI.verifyOTP(otpData)
      return response
    } catch (err) {
      error.value = err.response?.data?.message || 'OTP verification failed'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  async function resendOtp(emailData) {
    try {
      isLoading.value = true
      error.value = null
      
      const response = await authAPI.resendOtp(emailData)
      return response
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to resend OTP'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  async function forgotPassword(email) {
    try {
      isLoading.value = true
      error.value = null
      
      const response = await authAPI.forgotPassword(email)
      return response
    } catch (err) {
      error.value = err.response?.data?.message || 'Password reset failed'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  async function resetPassword(email, newPassword) {
    try {
      isLoading.value = true
      error.value = null
      
      const response = await authAPI.resetPassword(email, newPassword)
      return response
    } catch (err) {
      error.value = err.response?.data?.message || 'Password reset failed'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  async function loadUserProfile() {
    try {
      if (!user.value.id) return
      
      const response = await userAPI.getProfile(user.value.id)
      const profileData = response.data
      
      user.value = {
        ...user.value,
        fullName: profileData.fullName,
        email: profileData.email,
        langLevel: profileData.langLevel,
        imageUrl: profileData.imageUrl
      }
      
      saveToLocalStorage()
    } catch (err) {
      console.error('Failed to load user profile:', err)
    }
  }

  async function loadUserProgress() {
    try {
      if (!user.value.id) return
      
      const response = await userAPI.getProgress(user.value.id)
      const progressData = response.data
      
      // Process progress data from backend
      progressData.forEach(item => {
        if (item.sectionType === 'GRAMMAR') {
          progress.value.grammar.totalScore += item.score
        } else if (item.sectionType === 'VOCABULARY') {
          progress.value.vocabulary.totalWordsLearned += item.score
        }
      })
      
      saveToLocalStorage()
    } catch (err) {
      console.error('Failed to load user progress:', err)
    }
  }

  async function uploadProfileImage(file) {
    try {
      if (!user.value.id) return
      
      const response = await userAPI.uploadImage(user.value.id, file)
      
      // Reload user profile to get updated image URL
      await loadUserProfile()
      
      return response
    } catch (err) {
      error.value = err.response?.data?.message || 'Image upload failed'
      throw err
    }
  }

  async function levelUp(nextLevel) {
    try {
      if (!user.value.id) return
      
      const response = await levelAPI.levelUp(user.value.id, nextLevel)
      
      // Update user level
      user.value.langLevel = nextLevel
      saveToLocalStorage()
      
      return response
    } catch (err) {
      error.value = err.response?.data?.message || 'Level up failed'
      throw err
    }
  }

  // Actions
  function setUserData(newUserData) {
    user.value = { ...user.value, ...newUserData }
    saveToLocalStorage()
  }

  function updateProgress(category, data) {
    progress.value[category] = { ...progress.value[category], ...data }
    saveToLocalStorage()
  }

  function addPoints(points) {
    user.value.points += points
    checkAchievements()
    saveToLocalStorage()
  }

  function completeLesson(lessonId, score) {
    if (!progress.value.grammar.completedLessons.includes(lessonId)) {
      progress.value.grammar.completedLessons.push(lessonId)
      progress.value.grammar.totalScore += score
      user.value.lessonsCompleted += 1
      addPoints(score)
    }
  }

  function learnVocabulary(wordSet, wordsLearned) {
    if (!progress.value.vocabulary.completedSets.includes(wordSet)) {
      progress.value.vocabulary.completedSets.push(wordSet)
      progress.value.vocabulary.totalWordsLearned += wordsLearned
      addPoints(wordsLearned * 2)
    }
  }

  function updateStreak() {
    const today = new Date().toDateString()
    const lastStudy = studyHistory.value[studyHistory.value.length - 1]
    
    if (!lastStudy || lastStudy.date !== today) {
      user.value.streakDays += 1
      studyHistory.value.push({
        date: today,
        duration: 0,
        lessonsCompleted: 0
      })
      checkAchievements()
      saveToLocalStorage()
    }
  }

  function checkAchievements() {
    // Check streak achievements
    if (user.value.streakDays >= 5 && !achievements.value.find(a => a.id === 'streak_5')?.unlocked) {
      unlockAchievement('streak_5')
    }
    if (user.value.streakDays >= 10 && !achievements.value.find(a => a.id === 'streak_10')?.unlocked) {
      unlockAchievement('streak_10')
    }

    // Check points achievements
    if (user.value.points >= 100 && !achievements.value.find(a => a.id === 'points_100')?.unlocked) {
      unlockAchievement('points_100')
    }

    // Check lesson completion achievements
    if (user.value.lessonsCompleted >= 1 && !achievements.value.find(a => a.id === 'first_lesson')?.unlocked) {
      unlockAchievement('first_lesson')
    }

    // Check grammar completion
    if (progress.value.grammar.completedLessons.length >= 20 && !achievements.value.find(a => a.id === 'grammar_master')?.unlocked) {
      unlockAchievement('grammar_master')
    }

    // Check vocabulary completion
    if (progress.value.vocabulary.totalWordsLearned >= 500 && !achievements.value.find(a => a.id === 'vocabulary_expert')?.unlocked) {
      unlockAchievement('vocabulary_expert')
    }
  }

  function unlockAchievement(achievementId) {
    const achievement = achievements.value.find(a => a.id === achievementId)
    if (achievement && !achievement.unlocked) {
      achievement.unlocked = true
      addPoints(achievement.points)
      // You could add a notification system here
    }
  }

  function logOut() {
    user.value = {
      id: null,
      username: '',
      email: '',
      fullName: '',
      langLevel: 'beginner',
      imageUrl: null,
      points: 0,
      streakDays: 0,
      totalStudyTime: 0,
      lessonsCompleted: 0,
      testsPassed: 0,
      createdAt: null,
      lastLogin: null
    }
    progress.value = {
      grammar: {
        completedLessons: [],
        currentLesson: 1,
        totalScore: 0
      },
      vocabulary: {
        completedSets: [],
        currentSet: 1,
        totalWordsLearned: 0
      },
      games: {
        gamesPlayed: 0,
        highScores: {},
        achievementsUnlocked: []
      }
    }
    studyHistory.value = []
    isAuthenticated.value = false
    localStorage.removeItem('accessToken')
    localStorage.removeItem('userInfo')
    localStorage.removeItem('userProgress')
    localStorage.removeItem('userAchievements')
  }

  function saveToLocalStorage() {
    localStorage.setItem('userInfo', JSON.stringify(user.value))
    localStorage.setItem('userProgress', JSON.stringify(progress.value))
    localStorage.setItem('userAchievements', JSON.stringify(achievements.value))
    localStorage.setItem('studyHistory', JSON.stringify(studyHistory.value))
  }

  function loadFromLocalStorage() {
    const userInfo = localStorage.getItem('userInfo')
    const userProgress = localStorage.getItem('userProgress')
    const userAchievements = localStorage.getItem('userAchievements')
    const history = localStorage.getItem('studyHistory')
    const token = localStorage.getItem('accessToken')

    if (token) {
      isAuthenticated.value = true
    }

    if (userInfo) {
      try {
        user.value = JSON.parse(userInfo)
      } catch (error) {
        console.error('Failed to parse user info:', error)
      }
    }
    if (userProgress) {
      try {
        progress.value = JSON.parse(userProgress)
      } catch (error) {
        console.error('Failed to parse user progress:', error)
        // Reset to default progress structure
        progress.value = {
          grammar: {
            completedLessons: [],
            currentLesson: 1,
            totalScore: 0
          },
          vocabulary: {
            completedSets: [],
            currentSet: 1,
            totalWordsLearned: 0
          },
          games: {
            gamesPlayed: 0,
            highScores: {},
            achievementsUnlocked: []
          }
        }
      }
    }
    if (userAchievements) {
      try {
        achievements.value = JSON.parse(userAchievements)
      } catch (error) {
        console.error('Failed to parse user achievements:', error)
      }
    }
    if (history) {
      try {
        studyHistory.value = JSON.parse(history)
      } catch (error) {
        console.error('Failed to parse study history:', error)
      }
    }
  }

  // Initialize store on creation
  loadFromLocalStorage()

  return {
    user,
    progress,
    achievements,
    studyHistory,
    isAuthenticated,
    isLoading,
    error,
    totalPoints,
    unlockedAchievements,
    totalAchievements,
    unlockedAchievementsCount,
    signIn,
    signUp,
    verifyOTP,
    resendOtp,
    forgotPassword,
    resetPassword,
    loadUserProfile,
    loadUserProgress,
    uploadProfileImage,
    levelUp,
    setUserData,
    updateProgress,
    addPoints,
    completeLesson,
    learnVocabulary,
    updateStreak,
    unlockAchievement,
    logOut,
    saveToLocalStorage,
    loadFromLocalStorage
  }
})
