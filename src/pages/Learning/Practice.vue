<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/stores/userStore.js'
import BackButton from '@/components/BackButton.vue'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

const lessonId = computed(() => route.params.lessonId)
const loading = ref(true)
const currentQuestionIndex = ref(0)
const answers = ref({})
const timeLeft = ref(600) // 10 minutes
const showResults = ref(false)

const practice = ref({
  id: 1,
  title: 'Present Simple Practice',
  total_questions: 10,
  passing_score: 70,
  points_reward: 25,
  questions: [
    {
      id: 1,
      type: 'multiple_choice',
      question: 'Which sentence uses the Present Simple correctly?',
      options: ['I am working in a bank.', 'I work in a bank.', 'I working in a bank.'],
      correct_answer: 1
    },
    {
      id: 2,
      type: 'fill_blank',
      question: 'Complete: "She _____ English every day."',
      correct_answer: 'studies'
    }
  ]
})

const currentQuestion = computed(() => practice.value.questions[currentQuestionIndex.value])
const progress = computed(() => (currentQuestionIndex.value / practice.value.total_questions) * 100)

onMounted(async () => {
  await loadPracticeData()
  loading.value = false
})

const loadPracticeData = async () => {
  await new Promise(resolve => setTimeout(resolve, 1000))
}

const selectAnswer = (answerIndex) => {
  answers.value[currentQuestion.value.id] = answerIndex
}

const nextQuestion = () => {
  if (currentQuestionIndex.value < practice.value.total_questions - 1) {
    currentQuestionIndex.value++
  }
}

const finishPractice = () => {
  showResults.value = true
  calculateResults()
}

const calculateResults = () => {
  let correctAnswers = 0
  practice.value.questions.forEach(question => {
    const userAnswer = answers.value[question.id]
    if (question.type === 'multiple_choice') {
      if (userAnswer === question.correct_answer) correctAnswers++
    } else if (question.type === 'fill_blank') {
      if (userAnswer?.toLowerCase().trim() === question.correct_answer.toLowerCase()) correctAnswers++
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
</script>

<template>
  <div class="practice-container">
    <BackButton :fixed="true" />
    <div v-if="loading" class="loading">
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
      </div>
      <div class="actions">
        <button @click="router.push(`/lesson/${lessonId}`)" class="btn btn-secondary">
          Back to Lesson
        </button>
        <button @click="showResults = false; currentQuestionIndex = 0; answers = {}" class="btn btn-primary">
          Retake
        </button>
      </div>
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
        
        <div v-if="currentQuestion.type === 'multiple_choice'" class="options">
          <div
            v-for="(option, index) in currentQuestion.options"
            :key="index"
            class="option"
            :class="{ 'selected': answers[currentQuestion.id] === index }"
            @click="selectAnswer(index)"
          >
            <div class="radio"></div>
            <span>{{ option }}</span>
          </div>
        </div>

        <div v-else-if="currentQuestion.type === 'fill_blank'" class="fill-blank">
          <input
            v-model="answers[currentQuestion.id]"
            type="text"
            placeholder="Type your answer..."
            class="input"
          />
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
}

.stat {
  padding: 1rem;
  background: #f8fafc;
  border-radius: 0.75rem;
  font-weight: 600;
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
}
</style>
