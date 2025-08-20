<script setup>
import { ref, reactive, onMounted, onUnmounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/stores/userStore.js'
import { quizAPI } from '@/services/api.js'
import BackButton from '@/components/BackButton.vue'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

const lessonId = computed(() => route.params.lessonId)
const topicId = computed(() => route.query.topicId || 1) // Default topicId
const loading = ref(true)
const currentQuestionIndex = ref(0)
const answers = ref({})
const timeLeft = ref(600) // 10 minutes
const showResults = ref(false)
const error = ref(null)

const practice = ref({
  id: 1,
  title: 'Grammar Practice',
  total_questions: 0,
  passing_score: 70,
  points_reward: 25,
  questions: [],
  apiResults: null
})

const currentQuestion = computed(() => practice.value.questions[currentQuestionIndex.value])
const progress = computed(() => (currentQuestionIndex.value / practice.value.total_questions) * 100)

onMounted(async () => {
  await loadPracticeData()
  loading.value = false
})

const loadPracticeData = async () => {
  try {
    loading.value = true
    error.value = null
    
    if (!userStore.user.id) {
      throw new Error('User not authenticated')
    }

    const response = await quizAPI.getGrammarQuizzes(topicId.value, userStore.user.id)
    const quizData = response.data

    if (quizData && Array.isArray(quizData)) {
      practice.value.questions = quizData.map((quiz, index) => ({
        id: quiz.quizId || index + 1,
        quizId: quiz.quizId,
        sectionId: quiz.sectionId,
        sectionType: quiz.sectionType,
        type: quiz.type?.toLowerCase() || 'multiple_choice',
        question: quiz.question,
        correctAnswers: quiz.correctAnswers || [],
        otherAnswers: quiz.otherAnswers || [],
        userAnswers: quiz.userAnswers || [],
        score: quiz.score || 0
      }))
      
      practice.value.total_questions = quizData.length
      practice.value.title = `Grammar Practice - Topic ${topicId.value}`
    } else {
      throw new Error('Invalid quiz data received')
    }
  } catch (err) {
    console.error('Failed to load practice data:', err)
    error.value = err.response?.data?.message || 'Failed to load practice questions'
  } finally {
    loading.value = false
  }
}

const selectAnswer = (answerIndex) => {
  answers.value[currentQuestion.value.id] = answerIndex
}

const selectMultipleAnswers = (answer) => {
  if (!answers.value[currentQuestion.value.id]) {
    answers.value[currentQuestion.value.id] = []
  }
  
  const currentAnswers = answers.value[currentQuestion.value.id]
  const index = currentAnswers.indexOf(answer)
  
  if (index > -1) {
    currentAnswers.splice(index, 1)
  } else {
    currentAnswers.push(answer)
  }
}

const submitAnswer = async () => {
  try {
    const currentQ = currentQuestion.value
    const userAnswer = answers.value[currentQ.id]

    console.log("userAnswer", userAnswer, currentQ, answers.value)
      
    if (!userAnswer || (Array.isArray(userAnswer) && userAnswer.length === 0)) {
      return // Don't submit empty answers
    }

    let selectedAnswers = []
    
    if (currentQ.type === 'fill_blank') {
      // For fill_blank, userAnswer is the direct text input value
      selectedAnswers = userAnswer
    } else if (Array.isArray(userAnswer)) {
      // For order_words and translation, userAnswer is already an array
      selectedAnswers = userAnswer
    } else {
      // For multiple_choice, userAnswer is the index
      const selectedAnswer = currentQ.otherAnswers[userAnswer] || currentQ.correctAnswers[userAnswer]
      selectedAnswers = [selectedAnswer]
    }

    const answerData = {
      quizId: currentQ.quizId,
      userId: userStore.user.id,
      selectedAnswers: selectedAnswers
    }

    await quizAPI.submitGrammarQuiz(answerData)
    console.log('Answer submitted successfully')
  } catch (err) {
    console.error('Failed to submit answer:', err)
    // Continue with the quiz even if submission fails
  }
}

const nextQuestion = async () => {
  // Submit current answer before moving to next question
  await submitAnswer()
  
  if (currentQuestionIndex.value < practice.value.total_questions - 1) {
    currentQuestionIndex.value++
  }
}

const finishPractice = async () => {
  // Submit final answer
  await submitAnswer()
  
  // Get quiz results from API
  try {
    const resultResponse = await quizAPI.getGrammarResult(userStore.user.id, topicId.value)
    console.log('Quiz results from API:', resultResponse.data)
    
    // Store the API results for display
    practice.value.apiResults = resultResponse.data
  } catch (err) {
    console.error('Failed to get quiz results from API:', err)
    // Continue with local results calculation if API fails
  }
  
  showResults.value = true
  calculateResults()
}

const calculateResults = () => {
  let correctAnswers = 0
  practice.value.questions.forEach(question => {
    const userAnswer = answers.value[question.id]
    if (!userAnswer) return

    if (question.type === 'multiple_choice') {
      const selectedAnswer = question.otherAnswers[userAnswer] || question.correctAnswers[userAnswer]
      if (question.correctAnswers.includes(selectedAnswer)) {
        correctAnswers++
      }
    } else if (question.type === 'fill_blank') {
      if (question.correctAnswers.some(correct => 
        userAnswer.toLowerCase().trim() === correct.toLowerCase().trim()
      )) {
        correctAnswers++
      }
    } else if (question.type === 'order_words' || question.type === 'translation') {
      // For array-based answers, check if all correct answers are selected
      const userAnswers = Array.isArray(userAnswer) ? userAnswer : [userAnswer]
      const allCorrect = question.correctAnswers.every(correct => 
        userAnswers.includes(correct)
      )
      if (allCorrect) {
        correctAnswers++
      }
    }
  })
  
  const score = Math.round((correctAnswers / practice.value.total_questions) * 100)
  const passed = score >= practice.value.passing_score
  
  if (passed) {
    userStore.completeLesson(lessonId.value, score)
    userStore.addPoints(practice.value.points_reward)
  }
  
  return { score, passed, correctAnswers }
}

const results = computed(() => {
  if (!showResults.value) return null
  return calculateResults()
})

// Timer functionality
let timer = null

const startTimer = () => {
  timer = setInterval(() => {
    if (timeLeft.value > 0) {
      timeLeft.value--
    } else {
      clearInterval(timer)
      finishPractice()
    }
  }, 1000)
}

const stopTimer = () => {
  if (timer) {
    clearInterval(timer)
    timer = null
  }
}

onMounted(() => {
  startTimer()
})

// Cleanup timer on component unmount
onUnmounted(() => {
  stopTimer()
})
</script>

<template>
  <div class="practice-container">
    <BackButton :fixed="true" />
    
    <div v-if="error" class="error-message">
      <p>{{ error }}</p>
      <button @click="loadPracticeData" class="btn btn-primary">Retry</button>
    </div>

    <div v-else-if="loading" class="loading">
      <div class="spinner"></div>
      <p>Loading practice...</p>
    </div>

    <div v-else-if="showResults" class="results">
      <h1>Practice Results</h1>
      <div class="score-display">
        <div class="score-circle" :class="{ 'passed': results.passed }">
          <span class="score">{{ results.score }}%</span>
          <span class="status">{{ results.passed ? 'PASSED' : 'FAILED' }}</span>
        </div>
      </div>
      <div class="stats">
        <div class="stat">
          <span>Correct: {{ results.correctAnswers }}/{{ practice.total_questions }}</span>
        </div>
        <div class="stat">
          <span>Points: {{ results.passed ? practice.points_reward : 0 }}</span>
        </div>
        <!-- API Results -->
        <div v-if="practice.apiResults" class="api-results">
          <div class="stat">
            <span>Topic: {{ practice.apiResults.topicName }}</span>
          </div>
          <div class="stat">
            <span>Correct Count: {{ practice.apiResults.correctCount }}</span>
          </div>
          <div class="stat">
            <span>Gained Score: {{ practice.apiResults.gainedScore }}</span>
          </div>
        </div>
      </div>
      <div class="actions">
        <button @click="router.push(`/lesson/${lessonId}`)" class="btn btn-secondary">
          Back to Lesson
        </button>
      </div>
    </div>

    <div v-else-if="practice.questions.length === 0" class="no-questions">
      <h2>No questions available</h2>
      <p>There are no questions available for this topic.</p>
      <button @click="router.push(`/lesson/${lessonId}`)" class="btn btn-primary">
        Back to Lesson
      </button>
    </div>

    <div v-else class="practice-content">
      <div class="header">
        <h1>{{ practice.title }}</h1>
        <div class="meta">
          <span>Question {{ currentQuestionIndex + 1 }} of {{ practice.total_questions }}</span>
          <span>Time: {{ Math.floor(timeLeft / 60) }}:{{ (timeLeft % 60).toString().padStart(2, '0') }}</span>
        </div>
        <div class="progress-bar">
          <div class="progress-fill" :style="{ width: progress + '%' }"></div>
        </div>
      </div>

      <div class="question">
        <h2>{{ currentQuestion.question }}</h2>
        
        <!-- Multiple Choice -->
        <div v-if="currentQuestion.type === 'multiple_choice'" class="options">
          <div
            v-for="(option, index) in [...currentQuestion.correctAnswers, ...currentQuestion.otherAnswers]"
            :key="index"
            class="option"
            :class="{ 'selected': answers[currentQuestion.id] === index }"
            @click="selectAnswer(index)"
          >
            <div class="radio"></div>
            <span>{{ option }}</span>
          </div>
        </div>

        <!-- Fill Blank -->
        <div v-else-if="currentQuestion.type === 'fill_blank'" class="fill-blank">
          <input
            v-model="answers[currentQuestion.id]"
            type="text"
            placeholder="Type your answer..."
            class="input"
          />
        </div>

        <!-- Order Words -->
        <div v-else-if="currentQuestion.type === 'order_words'" class="order-words">
          <div class="word-bank">
            <div
              v-for="(word, index) in [...currentQuestion.correctAnswers, ...currentQuestion.otherAnswers]"
              :key="index"
              class="word"
              :class="{ 'selected': answers[currentQuestion.id] && answers[currentQuestion.id].includes(word) }"
              @click="selectMultipleAnswers(word)"
            >
              {{ word }}
            </div>
          </div>
          <div v-if="answers[currentQuestion.id] && answers[currentQuestion.id].length > 0" class="selected-words">
            <h4>Your order:</h4>
            <div class="selected-sequence">
              <span v-for="(word, index) in answers[currentQuestion.id]" :key="index" class="selected-word">
                {{ word }}
              </span>
            </div>
          </div>
        </div>

        <!-- Translation -->
        <div v-else-if="currentQuestion.type === 'translation'" class="translation">
          <div class="translation-options">
            <div
              v-for="(option, index) in [...currentQuestion.correctAnswers, ...currentQuestion.otherAnswers]"
              :key="index"
              class="option"
              :class="{ 'selected': answers[currentQuestion.id] && answers[currentQuestion.id].includes(option) }"
              @click="selectMultipleAnswers(option)"
            >
              <div class="checkbox"></div>
              <span>{{ option }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="navigation">
        <button
          v-if="currentQuestionIndex > 0"
          @click="currentQuestionIndex--"
          class="btn btn-secondary"
        >
          Previous
        </button>
        
        <button
          v-if="currentQuestionIndex < practice.total_questions - 1"
          @click="nextQuestion"
          class="btn btn-primary"
        >
          Next
        </button>
        
        <button
          v-else
          @click="finishPractice"
          class="btn btn-success"
        >
          Finish
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.practice-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}

.error-message {
  text-align: center;
  padding: 2rem;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 0.75rem;
  color: #dc2626;
}

.error-message p {
  margin-bottom: 1rem;
}

.loading {
  text-align: center;
  padding: 4rem;
}

.spinner {
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

.no-questions {
  text-align: center;
  padding: 4rem;
  background: white;
  border-radius: 1rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
}

.practice-content {
  background: white;
  border-radius: 1rem;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
}

.header {
  margin-bottom: 2rem;
}

.header h1 {
  font-size: 1.75rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 1rem;
}

.meta {
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
  color: #64748b;
  font-size: 0.875rem;
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

.question {
  margin-bottom: 2rem;
}

.question h2 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 1.5rem;
}

.options {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.option {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 0.75rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.option:hover {
  border-color: #667eea;
  background: #f8fafc;
}

.option.selected {
  border-color: #667eea;
  background: #eff6ff;
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

.fill-blank {
  margin-top: 1rem;
}

.input {
  width: 100%;
  padding: 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 0.75rem;
  font-size: 1rem;
}

.input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

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
  padding: 0.5rem 1rem;
  background: #f8fafc;
  border: 2px solid #e5e7eb;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
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

.selected-words {
  margin-top: 1rem;
  padding: 1rem;
  background: #f8fafc;
  border-radius: 0.75rem;
}

.selected-words h4 {
  margin-bottom: 0.5rem;
  color: #374151;
}

.selected-sequence {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.selected-word {
  padding: 0.25rem 0.75rem;
  background: #667eea;
  color: white;
  border-radius: 0.5rem;
  font-size: 0.875rem;
}

.translation-options {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.navigation {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
}

.btn {
  padding: 0.875rem 1.5rem;
  font-size: 1rem;
  font-weight: 600;
  border-radius: 0.75rem;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 120px;
}

.btn-secondary {
  background: #f8fafc;
  color: #374151;
  border: 2px solid #e5e7eb;
}

.btn-primary {
  background: #667eea;
  color: white;
}

.btn-success {
  background: #16a34a;
  color: white;
}

.results {
  text-align: center;
  background: white;
  border-radius: 1rem;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
}

.results h1 {
  font-size: 2rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 2rem;
}

.score-display {
  margin-bottom: 2rem;
}

.score-circle {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  border: 8px solid;
}

.score-circle.passed {
  background: #dcfce7;
  border-color: #16a34a;
  color: #16a34a;
}

.score-circle:not(.passed) {
  background: #fef2f2;
  border-color: #dc2626;
  color: #dc2626;
}

.score {
  font-size: 2.5rem;
  font-weight: 800;
}

.status {
  font-size: 0.875rem;
  font-weight: 600;
  text-transform: uppercase;
}

.stats {
  display: flex;
  justify-content: center;
  gap: 2rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}

.stat {
  padding: 1rem;
  background: #f8fafc;
  border-radius: 0.75rem;
  font-weight: 600;
}

.api-results {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
  margin-top: 1rem;
  padding: 1rem;
  background: #eff6ff;
  border-radius: 0.75rem;
  border: 1px solid #dbeafe;
}

.api-results .stat {
  background: white;
  border: 1px solid #e5e7eb;
}

.actions {
  display: flex;
  justify-content: center;
  gap: 1rem;
}

@media (max-width: 768px) {
  .practice-container {
    padding: 1rem;
  }
  
  .meta {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .navigation {
    flex-direction: column;
  }
  
  .stats {
    flex-direction: column;
    gap: 1rem;
  }
  
  .actions {
    flex-direction: column;
  }
  
  .word-bank {
    justify-content: center;
  }
}
</style>
