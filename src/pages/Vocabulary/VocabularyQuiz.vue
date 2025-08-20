<template>
  <DefaultLayout>
    <div class="vocabulary-quiz-container">
      <!-- Header Section -->
      <section class="header-section">
        <div class="container">
          <div class="header-content">
            <BackButton />
            <div class="header-info">
              <h1 class="page-title">Vocabulary Quiz</h1>
              <p class="page-subtitle">
                Test your vocabulary knowledge
              </p>
            </div>
          </div>
        </div>
      </section>

      <!-- Loading State -->
      <div v-if="loading" class="loading-section">
        <div class="loading-spinner"></div>
        <p>Loading quiz questions...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="error-section">
        <div class="error-content">
          <i class="fas fa-exclamation-triangle"></i>
          <h3>Failed to load quiz</h3>
          <p>{{ error }}</p>
          <button @click="loadQuiz" class="btn btn-primary">Try Again</button>
        </div>
      </div>

      <!-- Quiz Content -->
      <section v-else-if="questions.length > 0" class="quiz-section">
        <div class="container">
          <!-- Quiz Header -->
          <div class="quiz-header">
            <div class="quiz-info">
              <h2>Question {{ currentQuestionIndex + 1 }} of {{ questions.length }}</h2>
              <div class="timer">
                <i class="fas fa-clock"></i>
                <span>{{ formatTime(timeLeft) }}</span>
              </div>
            </div>
            <div class="progress-bar">
              <div 
                class="progress-fill" 
                :style="{ width: ((currentQuestionIndex + 1) / questions.length) * 100 + '%' }"
              ></div>
            </div>
          </div>

          <!-- Current Question -->
          <div class="question-card">
            <div class="question-header">
              <div class="question-type" :class="currentQuestion.type">
                {{ getQuestionTypeLabel(currentQuestion.type) }}
              </div>
            </div>

            <div class="question-content">
              <h3 class="question-text">{{ currentQuestion.question }}</h3>

              <!-- Multiple Choice -->
              <div v-if="currentQuestion.type === 'MULTIPLE_CHOICE'" class="options">
                <div
                  v-for="(option, index) in [...currentQuestion.correctAnswers, ...currentQuestion.otherAnswers]"
                  :key="index"
                  class="option"
                  :class="{ 
                    'selected': isOptionSelected(index),
                    'chosen': userAnswers[currentQuestion.quizId] && userAnswers[currentQuestion.quizId].includes(index)
                  }"
                  @click="selectOption(index)"
                >
                  <div class="option-content">
                    <div class="radio"></div>
                    <span class="option-text">{{ option }}</span>
                  </div>
                  <div v-if="isOptionSelected(index)" class="selected-indicator">
                    <i class="fas fa-check"></i>
                  </div>
                </div>
              </div>

              <!-- Fill Blank -->
              <div v-else-if="currentQuestion.type === 'FILL_BLANK'" class="fill-blank">
                <input
                  v-model="userAnswers[currentQuestion.quizId]"
                  type="text"
                  placeholder="Type your answer..."
                  class="answer-input"
                  @input="onAnswerInput"
                />
              </div>

              <!-- Order Words -->
              <div v-else-if="currentQuestion.type === 'ORDER_WORDS'" class="order-words">
                <div class="word-bank">
                  <div
                    v-for="(word, index) in [...currentQuestion.correctAnswers, ...currentQuestion.otherAnswers]"
                    :key="index"
                    class="word"
                    :class="{ 
                      'selected': isWordSelected(word),
                      'chosen': userAnswers[currentQuestion.quizId] && userAnswers[currentQuestion.quizId].includes(word)
                    }"
                    @click="selectWord(word)"
                  >
                    {{ word }}
                  </div>
                </div>
                <div v-if="getSelectedWords().length > 0" class="selected-sequence">
                  <h4>Your order:</h4>
                  <div class="sequence-display">
                    <span 
                      v-for="(word, index) in getSelectedWords()" 
                      :key="index" 
                      class="sequence-word"
                    >
                      {{ word }}
                    </span>
                  </div>
                </div>
              </div>

              <!-- Translation -->
              <div v-else-if="currentQuestion.type === 'TRANSLATION'" class="translation">
                <div class="translation-options">
                  <div
                    v-for="(option, index) in [...currentQuestion.correctAnswers, ...currentQuestion.otherAnswers]"
                    :key="index"
                    class="option"
                    :class="{ 
                      'selected': isTranslationSelected(option),
                      'chosen': userAnswers[currentQuestion.quizId] && userAnswers[currentQuestion.quizId].includes(option)
                    }"
                    @click="selectTranslation(option)"
                  >
                    <div class="option-content">
                      <div class="checkbox"></div>
                      <span class="option-text">{{ option }}</span>
                    </div>
                    <div v-if="isTranslationSelected(option)" class="selected-indicator">
                      <i class="fas fa-check"></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Navigation -->
          <div class="quiz-navigation">
            <button
              v-if="currentQuestionIndex > 0"
              @click="previousQuestion"
              class="btn btn-secondary"
            >
              <i class="fas fa-arrow-left"></i>
              Previous
            </button>
            
            <button
              v-if="currentQuestionIndex < questions.length - 1"
              @click="nextQuestion"
              class="btn btn-primary"
              :disabled="!hasAnswer"
            >
              Next
              <i class="fas fa-arrow-right"></i>
            </button>
            
            <button
              v-else
              @click="finishQuiz"
              class="btn btn-success"
              :disabled="!hasAnswer"
            >
              <i class="fas fa-check"></i>
              Finish Quiz
            </button>
          </div>
        </div>
      </section>

      <!-- No Questions State -->
      <div v-else class="no-questions">
        <div class="no-questions-content">
          <i class="fas fa-question-circle"></i>
          <h3>No questions available</h3>
          <p>There are no vocabulary questions available for this topic.</p>
          <button @click="$router.go(-1)" class="btn btn-primary">
            Go Back
          </button>
        </div>
      </div>
    </div>
  </DefaultLayout>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/stores/userStore.js'
import { quizAPI } from '@/services/api.js'
import DefaultLayout from '@/components/DefaultLayout.vue'
import BackButton from '@/components/BackButton.vue'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

const topicId = computed(() => route.params.topicId)
const loading = ref(true)
const error = ref(null)
const questions = ref([])
const currentQuestionIndex = ref(0)
const userAnswers = ref({})
const timeLeft = ref(600) // 10 minutes
let timer = null

const currentQuestion = computed(() => questions.value[currentQuestionIndex.value])

const hasAnswer = computed(() => {
  if (!currentQuestion.value) return false
  const answer = userAnswers.value[currentQuestion.value.quizId]
  return answer && (Array.isArray(answer) ? answer.length > 0 : answer.trim() !== '')
})

onMounted(async () => {
  await loadQuiz()
  startTimer()
})

onUnmounted(() => {
  if (timer) {
    clearInterval(timer)
  }
})

const loadQuiz = async () => {
  try {
    loading.value = true
    error.value = null
    
    if (!userStore.user.id) {
      throw new Error('User not authenticated')
    }

    const response = await quizAPI.getVocabularyQuizzes(topicId.value, userStore.user.id)
    questions.value = response.data || []
    
  } catch (err) {
    console.error('Failed to load vocabulary quiz:', err)
    error.value = err.response?.data?.message || 'Failed to load quiz questions'
  } finally {
    loading.value = false
  }
}

const startTimer = () => {
  timer = setInterval(() => {
    if (timeLeft.value > 0) {
      timeLeft.value--
    } else {
      clearInterval(timer)
      finishQuiz()
    }
  }, 1000)
}

const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

const getQuestionTypeLabel = (type) => {
  const labels = {
    'MULTIPLE_CHOICE': 'Multiple Choice',
    'FILL_BLANK': 'Fill in the Blank',
    'ORDER_WORDS': 'Order Words',
    'TRANSLATION': 'Translation'
  }
  return labels[type] || type
}

// Multiple Choice
const selectOption = (index) => {
  const quizId = currentQuestion.value.quizId
  userAnswers.value[quizId] = [index]
  submitAnswer()
}

const isOptionSelected = (index) => {
  const quizId = currentQuestion.value.quizId
  return userAnswers.value[quizId] && userAnswers.value[quizId].includes(index)
}

// Fill Blank
const onAnswerInput = () => {
  submitAnswer()
}

// Order Words
const selectWord = (word) => {
  const quizId = currentQuestion.value.quizId
  if (!userAnswers.value[quizId]) {
    userAnswers.value[quizId] = []
  }
  
  const index = userAnswers.value[quizId].indexOf(word)
  if (index > -1) {
    userAnswers.value[quizId].splice(index, 1)
  } else {
    userAnswers.value[quizId].push(word)
  }
  submitAnswer()
}

const isWordSelected = (word) => {
  const quizId = currentQuestion.value.quizId
  return userAnswers.value[quizId] && userAnswers.value[quizId].includes(word)
}

const getSelectedWords = () => {
  const quizId = currentQuestion.value.quizId
  return userAnswers.value[quizId] || []
}

// Translation
const selectTranslation = (option) => {
  const quizId = currentQuestion.value.quizId
  if (!userAnswers.value[quizId]) {
    userAnswers.value[quizId] = []
  }
  
  const index = userAnswers.value[quizId].indexOf(option)
  if (index > -1) {
    userAnswers.value[quizId].splice(index, 1)
  } else {
    userAnswers.value[quizId].push(option)
  }
  submitAnswer()
}

const isTranslationSelected = (option) => {
  const quizId = currentQuestion.value.quizId
  return userAnswers.value[quizId] && userAnswers.value[quizId].includes(option)
}

const submitAnswer = async () => {
  try {
    const quizId = currentQuestion.value.quizId
    const answer = userAnswers.value[quizId]
    
    if (!answer || (Array.isArray(answer) && answer.length === 0)) {
      return
    }

    let selectedAnswers = []
    
    if (currentQuestion.value.type === 'FILL_BLANK') {
      selectedAnswers = [answer]
    } else if (Array.isArray(answer)) {
      selectedAnswers = answer
    } else {
      selectedAnswers = [answer]
    }

    const answerData = {
      quizId: quizId,
      userId: userStore.user.id,
      selectedAnswers: selectedAnswers
    }

    await quizAPI.submitVocabQuiz(answerData)
    console.log('Vocabulary answer submitted successfully')
  } catch (err) {
    console.error('Failed to submit vocabulary answer:', err)
  }
}

const nextQuestion = async () => {
  if (currentQuestionIndex.value < questions.value.length - 1) {
    currentQuestionIndex.value++
  }
}

const previousQuestion = () => {
  if (currentQuestionIndex.value > 0) {
    currentQuestionIndex.value--
  }
}

const finishQuiz = async () => {
  // Submit final answer
  await submitAnswer()
  
  // Navigate to results or back to vocabulary
  router.push('/vocabulary')
}
</script>

<style scoped>
.vocabulary-quiz-container {
  min-height: 100vh;
  background: #f8fafc;
}

/* Header Section */
.header-section {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 2rem 0;
}

.header-content {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.header-info {
  flex: 1;
}

.page-title {
  font-size: 2.5rem;
  font-weight: 800;
  margin-bottom: 0.5rem;
}

.page-subtitle {
  font-size: 1.1rem;
  opacity: 0.9;
}

/* Loading and Error States */
.loading-section,
.error-section {
  text-align: center;
  padding: 4rem 2rem;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #e5e7eb;
  border-top: 4px solid #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error-content {
  max-width: 400px;
  margin: 0 auto;
}

.error-content i {
  font-size: 3rem;
  color: #ef4444;
  margin-bottom: 1rem;
}

/* Quiz Section */
.quiz-section {
  padding: 3rem 0;
}

.quiz-header {
  margin-bottom: 2rem;
}

.quiz-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.quiz-info h2 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
}

.timer {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.1rem;
  font-weight: 600;
  color: #dc2626;
}

.progress-bar {
  width: 100%;
  height: 8px;
  background: #e5e7eb;
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #667eea, #764ba2);
  transition: width 0.3s ease;
}

/* Question Card */
.question-card {
  background: white;
  border-radius: 1rem;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  margin-bottom: 2rem;
}

.question-header {
  margin-bottom: 1.5rem;
}

.question-type {
  display: inline-block;
  padding: 0.5rem 1rem;
  border-radius: 0.75rem;
  font-size: 0.875rem;
  font-weight: 600;
  text-transform: uppercase;
}

.question-type.MULTIPLE_CHOICE {
  background: #dbeafe;
  color: #1e40af;
}

.question-type.FILL_BLANK {
  background: #fef3c7;
  color: #92400e;
}

.question-type.ORDER_WORDS {
  background: #dcfce7;
  color: #166534;
}

.question-type.TRANSLATION {
  background: #fecaca;
  color: #991b1b;
}

.question-content {
  margin-bottom: 1.5rem;
}

.question-text {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 1.5rem;
  line-height: 1.6;
}

/* Options */
.options {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.option {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 0.75rem;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
}

.option:hover {
  border-color: #667eea;
  background: #f8fafc;
}

.option.selected {
  border-color: #667eea;
  background: #eff6ff;
}

.option.chosen {
  border-color: #16a34a;
  background: #f0fdf4;
}

.option-content {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex: 1;
}

.radio {
  width: 16px;
  height: 16px;
  border: 2px solid #d1d5db;
  border-radius: 50%;
  transition: all 0.2s ease;
}

.option.selected .radio {
  border-color: #667eea;
  background: #667eea;
  position: relative;
}

.option.selected .radio::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 6px;
  height: 6px;
  background: white;
  border-radius: 50%;
}

.checkbox {
  width: 16px;
  height: 16px;
  border: 2px solid #d1d5db;
  border-radius: 4px;
  transition: all 0.2s ease;
}

.option.selected .checkbox {
  border-color: #667eea;
  background: #667eea;
  position: relative;
}

.option.selected .checkbox::after {
  content: '✓';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  font-size: 12px;
  font-weight: bold;
}

.option-text {
  font-size: 1rem;
  color: #374151;
}

.selected-indicator {
  color: #16a34a;
  font-size: 1.1rem;
}

/* Fill Blank */
.fill-blank {
  margin-top: 1rem;
}

.answer-input {
  width: 100%;
  padding: 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 0.75rem;
  font-size: 1rem;
}

.answer-input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

/* Order Words */
.order-words {
  margin-top: 1rem;
}

.word-bank {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.word {
  padding: 0.75rem 1rem;
  background: #f8fafc;
  border: 2px solid #e5e7eb;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: 500;
}

.word:hover {
  border-color: #667eea;
  background: #eff6ff;
}

.word.selected {
  border-color: #667eea;
  background: #667eea;
  color: white;
}

.word.chosen {
  border-color: #16a34a;
  background: #16a34a;
  color: white;
}

.selected-sequence {
  margin-top: 1rem;
  padding: 1rem;
  background: #f8fafc;
  border-radius: 0.75rem;
}

.selected-sequence h4 {
  margin-bottom: 0.5rem;
  color: #374151;
}

.sequence-display {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.sequence-word {
  padding: 0.5rem 0.75rem;
  background: #667eea;
  color: white;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 600;
}

/* Translation */
.translation-options {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

/* Quiz Navigation */
.quiz-navigation {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
}

/* No Questions */
.no-questions {
  text-align: center;
  padding: 4rem 2rem;
}

.no-questions-content {
  max-width: 400px;
  margin: 0 auto;
}

.no-questions-content i {
  font-size: 3rem;
  color: #94a3b8;
  margin-bottom: 1rem;
}

/* Buttons */
.btn {
  padding: 0.875rem 1.5rem;
  font-size: 1rem;
  font-weight: 600;
  border-radius: 0.75rem;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  text-decoration: none;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-primary {
  background: #667eea;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: #5a67d8;
  transform: translateY(-1px);
}

.btn-secondary {
  background: #f8fafc;
  color: #374151;
  border: 2px solid #e5e7eb;
}

.btn-secondary:hover {
  background: #f1f5f9;
}

.btn-success {
  background: #16a34a;
  color: white;
}

.btn-success:hover:not(:disabled) {
  background: #15803d;
  transform: translateY(-1px);
}

/* Responsive Design */
@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    text-align: center;
    gap: 1rem;
  }
  
  .page-title {
    font-size: 2rem;
  }
  
  .quiz-info {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
  
  .quiz-navigation {
    flex-direction: column;
  }
  
  .word-bank {
    justify-content: center;
  }
}
</style>
