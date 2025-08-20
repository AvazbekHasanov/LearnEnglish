import { ref, computed } from 'vue'
import { grammarAPI } from '@/services/api.js'
import { useUserStore } from '@/stores/userStore.js'
import axios from 'axios'

export function useGrammar() {
  const userStore = useUserStore()
  
  // Simple public API client for fallback
  const publicApiClient = () => {
    return axios.create({
      baseURL: 'https://desired-fit-parakeet.ngrok-free.app/api',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'ACCEPT-LANGUAGE': localStorage.getItem('locale') || 'en'
      },
      timeout: 15000
    })
  }
  
  // State
  const grammarLevels = ref([])
  const grammarLessons = ref([])
  const myLessons = ref([])
  const topicList = ref([])
  const isLoading = ref(false)
  const error = ref(null)

  // Computed
  const completedLessons = computed(() => {
    return myLessons.value.filter(lesson => lesson.ended)
  })

  const totalScore = computed(() => {
    return myLessons.value.reduce((total, lesson) => total + (lesson.score || 0), 0)
  })

  const lessonsByLevel = computed(() => {
    const grouped = {}
    grammarLevels.value.forEach(level => {
      grouped[level.id] = {
        level,
        lessons: grammarLessons.value.filter(lesson => lesson.levels?.id === level.id),
        completed: myLessons.value.filter(lesson => 
          lesson.levels?.id === level.id && lesson.ended
        ).length
      }
    })
    return grouped
  })

  const progressByLevel = computed(() => {
    const progress = {}
    Object.keys(lessonsByLevel.value).forEach(levelId => {
      const levelData = lessonsByLevel.value[levelId]
      const totalLessons = levelData.lessons.length
      const completedLessons = levelData.completed
      progress[levelId] = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0
    })
    return progress
  })

  // Methods
  const loadGrammarLevels = async () => {
    try {
      isLoading.value = true
      error.value = null
      console.log('Loading grammar levels...')
      
      const response = await grammarAPI.getLevels()
      console.log('Grammar levels response:', response)
      grammarLevels.value = response.data
    } catch (err) {
      console.error('Failed to load grammar levels:', err)
      console.error('Error details:', {
        message: err.message,
        status: err.response?.status,
        statusText: err.response?.statusText,
        data: err.response?.data
      })
      
             // Fallback: Try direct axios call
       try {
         console.log('Trying fallback direct axios call for levels...')
         const fallbackResponse = await fetch('https://desired-fit-parakeet.ngrok-free.app/api/grammar/levels')
         if (fallbackResponse.ok) {
           const data = await fallbackResponse.json()
           grammarLevels.value = data
           console.log('Levels fallback successful:', data)
         } else {
           throw new Error(`Levels fallback failed: ${fallbackResponse.status}`)
         }
       } catch (fallbackErr) {
        console.error('Levels fallback also failed:', fallbackErr)
        error.value = 'Failed to load grammar levels'
        
        // Use mock data as final fallback
        grammarLevels.value = [
          { id: 1, level: "beginner" },
          { id: 2, level: "elementary" },
          { id: 3, level: "intermediate" },
          { id: 4, level: "advanced" }
        ]
      }
    } finally {
      isLoading.value = false
    }
  }

  const loadGrammarLessons = async () => {
    try {
      isLoading.value = true
      error.value = null
      console.log('Loading grammar lessons...')
      
      // Try with the API service first
      const response = await grammarAPI.getLessons()
      console.log('Grammar lessons response:', response)
      grammarLessons.value = response.data
    } catch (err) {
      console.error('Failed to load grammar lessons:', err)
      console.error('Error details:', {
        message: err.message,
        status: err.response?.status,
        statusText: err.response?.statusText,
        data: err.response?.data
      })
      
             // Fallback: Try direct axios call
       try {
         console.log('Trying fallback direct axios call...')
         const fallbackResponse = await fetch('https://desired-fit-parakeet.ngrok-free.app/api/grammar/lessons')
         if (fallbackResponse.ok) {
           const data = await fallbackResponse.json()
           grammarLessons.value = data
           console.log('Fallback successful:', data)
         } else {
           throw new Error(`Fallback failed: ${fallbackResponse.status}`)
         }
       } catch (fallbackErr) {
        console.error('Fallback also failed:', fallbackErr)
        error.value = 'Failed to load grammar lessons'
        
        // Use mock data as final fallback
        grammarLessons.value = [
          {
            id: 1,
            title: "Greetings in English",
            description: "Learn how to greet people in English.",
            videoUrl: "https://www.youtube.com/watch?v=WdA1yztH9cw",
            rules: "Use Hello, Hi, Good morning depending on time.",
            example: "Hello, how are you?",
            ended: false,
            levels: { id: 1, level: "beginner" },
            assignment: "Practice greeting 5 people today.",
            score: 5
          },
          {
            id: 2,
            title: "Introducing Yourself",
            description: "Learn how to introduce yourself in English.",
            videoUrl: "https://www.youtube.com/watch?v=SDdG0Wc3XGM",
            rules: "Say your name, where you are from, and one fact about you.",
            example: "My name is Anna, I'm from Spain.",
            ended: false,
            levels: { id: 1, level: "beginner" },
            assignment: "Write 3 sentences to introduce yourself.",
            score: 5
          }
        ]
      }
    } finally {
      isLoading.value = false
    }
  }

  const loadMyLessons = async () => {
    // If user is not authenticated, try with a default user ID (2) for testing
    const userId = userStore.isAuthenticated && userStore.user.id ? userStore.user.id : 2

    try {
      isLoading.value = true
      error.value = null
      
      console.log('Loading my lessons for user:', userId)
      console.log('Available levels:', grammarLevels.value)
      
      // Load lessons for all levels
      const allMyLessons = []
      for (const level of grammarLevels.value) {
        try {
          console.log(`Loading lessons for level ${level.id} (${level.level})...`)
          const response = await grammarAPI.getMyLessons(userId, level.id)
          console.log(`Level ${level.id} response:`, response.data)
          allMyLessons.push(...response.data)
        } catch (err) {
          console.error(`Failed to load lessons for level ${level.id}:`, err)
          // If authentication fails, try without auth
          try {
            console.log(`Trying public call for level ${level.id}...`)
            const publicResponse = await publicApiClient().get(`/grammar/my-lessons?userId=${userId}&levelId=${level.id}`)
            console.log(`Public call successful for level ${level.id}:`, publicResponse.data)
            allMyLessons.push(...publicResponse.data)
          } catch (publicErr) {
            console.error(`Public call also failed for level ${level.id}:`, publicErr)
          }
        }
      }
      
      console.log('All my lessons loaded:', allMyLessons)
      myLessons.value = allMyLessons
    } catch (err) {
      error.value = 'Failed to load your lessons'
      console.error('Failed to load my lessons:', err)
    } finally {
      isLoading.value = false
    }
  }

  const loadTopicList = async () => {
    try {
      isLoading.value = true
      error.value = null
      const response = await grammarAPI.getTopicList()
      topicList.value = response.data
    } catch (err) {
      error.value = 'Failed to load topic list'
      console.error('Failed to load topic list:', err)
    } finally {
      isLoading.value = false
    }
  }

  const loadAllData = async () => {
    await Promise.all([
      loadGrammarLevels(),
      loadGrammarLessons(),
      loadTopicList()
    ])
    await loadMyLessons()
  }

  const endLesson = async (topicId) => {
    if (!userStore.isAuthenticated || !userStore.user.id) {
      throw new Error('User not authenticated')
    }

    try {
      error.value = null
      const response = await grammarAPI.endLesson(userStore.user.id, topicId)
      
      // Update local state
      const lessonIndex = myLessons.value.findIndex(lesson => lesson.id === topicId)
      if (lessonIndex !== -1) {
        myLessons.value[lessonIndex].ended = true
      } else {
        // Add to my lessons if not already there
        const lesson = grammarLessons.value.find(l => l.id === topicId)
        if (lesson) {
          myLessons.value.push({
            ...lesson,
            ended: true
          })
        }
      }
      
      return response.data
    } catch (err) {
      error.value = 'Failed to end lesson'
      console.error('Failed to end lesson:', err)
      throw err
    }
  }

  const addLessons = async (lessons) => {
    try {
      isLoading.value = true
      error.value = null
      const response = await grammarAPI.addList(lessons)
      
      // Reload lessons to get updated data
      await loadGrammarLessons()
      
      return response.data
    } catch (err) {
      error.value = 'Failed to add lessons'
      console.error('Failed to add lessons:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const getLessonById = async (lessonId) => {
    try {
      isLoading.value = true
      error.value = null
      const response = await grammarAPI.getLessonById(lessonId)
      return response.data
    } catch (err) {
      error.value = 'Failed to load lesson'
      console.error('Failed to load lesson:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const getLessonByIdLocal = (lessonId) => {
    return grammarLessons.value.find(lesson => lesson.id === lessonId)
  }

  const isLessonCompleted = (lessonId) => {
    return myLessons.value.some(lesson => lesson.id === lessonId && lesson.ended)
  }

  const getLessonProgress = (lessonId) => {
    const lesson = myLessons.value.find(l => l.id === lessonId)
    return lesson ? (lesson.ended ? 100 : 0) : 0
  }

  const getLevelProgress = (levelId) => {
    return progressByLevel.value[levelId] || 0
  }

  const getLessonsForLevel = (levelId) => {
    return lessonsByLevel.value[levelId]?.lessons || []
  }

  const getCompletedLessonsForLevel = (levelId) => {
    return myLessons.value.filter(lesson => 
      lesson.levels?.id === levelId && lesson.ended
    )
  }

  return {
    // State
    grammarLevels,
    grammarLessons,
    myLessons,
    topicList,
    isLoading,
    error,
    
    // Computed
    completedLessons,
    totalScore,
    lessonsByLevel,
    progressByLevel,
    
    // Methods
    loadGrammarLevels,
    loadGrammarLessons,
    loadMyLessons,
    loadTopicList,
    loadAllData,
    endLesson,
    addLessons,
    getLessonById,
    getLessonByIdLocal,
    isLessonCompleted,
    getLessonProgress,
    getLevelProgress,
    getLessonsForLevel,
    getCompletedLessonsForLevel
  }
}
