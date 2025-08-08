import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', () => {
  // User data
  const user = ref({
    id: null,
    username: '',
    email: '',
    full_name: '',
    learning_level: 'beginner', // beginner, intermediate, advanced
    avatar: null,
    points: 0,
    streak_days: 0,
    total_study_time: 0,
    lessons_completed: 0,
    tests_passed: 0,
    created_at: null,
    last_login: null
  })

  // Learning progress
  const progress = ref({
    grammar: {
      completed_lessons: [],
      current_lesson: 1,
      total_score: 0
    },
    vocabulary: {
      completed_sets: [],
      current_set: 1,
      total_words_learned: 0
    },
    games: {
      games_played: 0,
      high_scores: {},
      achievements_unlocked: []
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
  const isAuthenticated = computed(() => !!user.value.id)
  const totalPoints = computed(() => user.value.points)
  const unlockedAchievements = computed(() => 
    achievements.value.filter(a => a.unlocked)
  )
  const totalAchievements = computed(() => achievements.value.length)
  const unlockedAchievementsCount = computed(() => unlockedAchievements.value.length)

  // Actions
  function setUserData(newUserData) {
    user.value = { ...user.value, ...newUserData }
  }

  function updateProgress(category, data) {
    progress.value[category] = { ...progress.value[category], ...data }
  }

  function addPoints(points) {
    user.value.points += points
    checkAchievements()
  }

  function completeLesson(lessonId, score) {
    if (!progress.value.grammar.completed_lessons.includes(lessonId)) {
      progress.value.grammar.completed_lessons.push(lessonId)
      progress.value.grammar.total_score += score
      user.value.lessons_completed += 1
      addPoints(score)
    }
  }

  function learnVocabulary(wordSet, wordsLearned) {
    if (!progress.value.vocabulary.completed_sets.includes(wordSet)) {
      progress.value.vocabulary.completed_sets.push(wordSet)
      progress.value.vocabulary.total_words_learned += wordsLearned
      addPoints(wordsLearned * 2)
    }
  }

  function updateStreak() {
    const today = new Date().toDateString()
    const lastStudy = studyHistory.value[studyHistory.value.length - 1]
    
    if (!lastStudy || lastStudy.date !== today) {
      user.value.streak_days += 1
      studyHistory.value.push({
        date: today,
        duration: 0,
        lessons_completed: 0
      })
      checkAchievements()
    }
  }

  function checkAchievements() {
    // Check streak achievements
    if (user.value.streak_days >= 5 && !achievements.value.find(a => a.id === 'streak_5')?.unlocked) {
      unlockAchievement('streak_5')
    }
    if (user.value.streak_days >= 10 && !achievements.value.find(a => a.id === 'streak_10')?.unlocked) {
      unlockAchievement('streak_10')
    }

    // Check points achievements
    if (user.value.points >= 100 && !achievements.value.find(a => a.id === 'points_100')?.unlocked) {
      unlockAchievement('points_100')
    }

    // Check lesson completion achievements
    if (user.value.lessons_completed >= 1 && !achievements.value.find(a => a.id === 'first_lesson')?.unlocked) {
      unlockAchievement('first_lesson')
    }

    // Check grammar completion
    if (progress.value.grammar.completed_lessons.length >= 20 && !achievements.value.find(a => a.id === 'grammar_master')?.unlocked) {
      unlockAchievement('grammar_master')
    }

    // Check vocabulary completion
    if (progress.value.vocabulary.total_words_learned >= 500 && !achievements.value.find(a => a.id === 'vocabulary_expert')?.unlocked) {
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
      full_name: '',
      learning_level: 'beginner',
      avatar: null,
      points: 0,
      streak_days: 0,
      total_study_time: 0,
      lessons_completed: 0,
      tests_passed: 0,
      created_at: null,
      last_login: null
    }
    progress.value = {
      grammar: {
        completed_lessons: [],
        current_lesson: 1,
        total_score: 0
      },
      vocabulary: {
        completed_sets: [],
        current_set: 1,
        total_words_learned: 0
      },
      games: {
        games_played: 0,
        high_scores: {},
        achievements_unlocked: []
      }
    }
    studyHistory.value = []
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

    if (userInfo) {
      user.value = JSON.parse(userInfo)
    }
    if (userProgress) {
      progress.value = JSON.parse(userProgress)
    }
    if (userAchievements) {
      achievements.value = JSON.parse(userAchievements)
    }
    if (history) {
      studyHistory.value = JSON.parse(history)
    }
  }

  return {
    user,
    progress,
    achievements,
    studyHistory,
    isAuthenticated,
    totalPoints,
    unlockedAchievements,
    totalAchievements,
    unlockedAchievementsCount,
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
