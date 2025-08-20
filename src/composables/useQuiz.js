import { ref, computed } from 'vue'
import { quizAPI } from '@/services/api.js'
import { useUserStore } from '@/stores/userStore.js'

export function useQuiz() {
  const userStore = useUserStore()
  
  // State
  const grammarQuizzes = ref([])
  const vocabularyQuizzes = ref([])
  const currentQuiz = ref(null)
  const currentQuestionIndex = ref(0)
  const userAnswers = ref({})
  const quizResults = ref(null)
  const isLoading = ref(false)
  const error = ref(null)

  // Computed
  const currentQuestion = computed(() => {
    if (!currentQuiz.value || currentQuiz.value.length === 0) return null
    return currentQuiz.value[currentQuestionIndex.value]
  })

  const totalQuestions = computed(() => {
    return currentQuiz.value ? currentQuiz.value.length : 0
  })

  const progress = computed(() => {
    if (totalQuestions.value === 0) return 0
    return Math.round(((currentQuestionIndex.value + 1) / totalQuestions.value) * 100)
  })

  const isLastQuestion = computed(() => {
    return currentQuestionIndex.value === totalQuestions.value - 1
  })

  const canSubmit = computed(() => {
    if (!currentQuiz.value) return false
    return currentQuiz.value.every((_, index) => userAnswers.value[index] !== undefined)
  })

  // Methods
  const loadGrammarQuizzes = async (topicId) => {
    try {
      isLoading.value = true
      error.value = null
      const response = await quizAPI.getGrammarQuizzes()
      grammarQuizzes.value = response.data
      return response.data
    } catch (err) {
      error.value = 'Failed to load grammar quizzes'
      console.error('Failed to load grammar quizzes:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const loadVocabularyQuizzes = async (topicId) => {
    try {
      isLoading.value = true
      error.value = null
      const response = await quizAPI.getVocabularyQuizzes()
      vocabularyQuizzes.value = response.data
      return response.data
    } catch (err) {
      error.value = 'Failed to load vocabulary quizzes'
      console.error('Failed to load vocabulary quizzes:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const startQuiz = (quizzes, quizType = 'grammar') => {
    currentQuiz.value = quizzes
    currentQuestionIndex.value = 0
    userAnswers.value = {}
    quizResults.value = null
    error.value = null
  }

  const selectAnswer = (answer) => {
    userAnswers.value[currentQuestionIndex.value] = answer
  }

  const nextQuestion = () => {
    if (currentQuestionIndex.value < totalQuestions.value - 1) {
      currentQuestionIndex.value++
    }
  }

  const previousQuestion = () => {
    if (currentQuestionIndex.value > 0) {
      currentQuestionIndex.value--
    }
  }

  const submitQuiz = async (quizType = 'grammar') => {
    if (!canSubmit.value) {
      throw new Error('Please answer all questions before submitting')
    }

    try {
      isLoading.value = true
      error.value = null
      
      const userId = userStore.isAuthenticated ? userStore.user.id : 1
      const quizData = {
        quizId: currentQuiz.value[0]?.quizId || 1,
        userId: userId,
        selectedAnswers: Object.values(userAnswers.value)
      }

      let response
      if (quizType === 'grammar') {
        response = await quizAPI.submitGrammarQuiz(quizData)
      } else {
        response = await quizAPI.submitVocabQuiz(quizData)
      }

      quizResults.value = response.data
      return response.data
    } catch (err) {
      error.value = 'Failed to submit quiz'
      console.error('Failed to submit quiz:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const getGrammarResult = async (grammarTopicId) => {
    try {
      isLoading.value = true
      error.value = null
      const response = await quizAPI.getGrammarResult()
      return response.data
    } catch (err) {
      error.value = 'Failed to get quiz result'
      console.error('Failed to get quiz result:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const resetQuiz = () => {
    currentQuiz.value = null
    currentQuestionIndex.value = 0
    userAnswers.value = {}
    quizResults.value = null
    error.value = null
  }

  const getShuffledAnswers = (question) => {
    if (!question) return []
    const allAnswers = [...(question.correctAnswers || []), ...(question.otherAnswers || [])]
    return allAnswers.sort(() => Math.random() - 0.5)
  }

  const isAnswerCorrect = (question, selectedAnswer) => {
    if (!question || !selectedAnswer) return false
    return question.correctAnswers?.includes(selectedAnswer) || false
  }

  const getScore = () => {
    if (!currentQuiz.value || Object.keys(userAnswers.value).length === 0) return 0
    
    let correctCount = 0
    currentQuiz.value.forEach((question, index) => {
      const userAnswer = userAnswers.value[index]
      if (userAnswer && isAnswerCorrect(question, userAnswer)) {
        correctCount++
      }
    })
    
    return Math.round((correctCount / totalQuestions.value) * 100)
  }

  return {
    // State
    grammarQuizzes,
    vocabularyQuizzes,
    currentQuiz,
    currentQuestionIndex,
    userAnswers,
    quizResults,
    isLoading,
    error,
    
    // Computed
    currentQuestion,
    totalQuestions,
    progress,
    isLastQuestion,
    canSubmit,
    
    // Methods
    loadGrammarQuizzes,
    loadVocabularyQuizzes,
    startQuiz,
    selectAnswer,
    nextQuestion,
    previousQuestion,
    submitQuiz,
    getGrammarResult,
    resetQuiz,
    getShuffledAnswers,
    isAnswerCorrect,
    getScore
  }
}
