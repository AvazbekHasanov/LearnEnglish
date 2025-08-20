<template>
  <div class="quiz-container">
    <!-- Quiz Selection -->
    <div v-if="!currentQuiz" class="quiz-selection">
      <h2 class="quiz-title">{{ $t('quiz.select_quiz') }}</h2>
      
      <div class="quiz-types">
        <div class="quiz-type-card" @click="selectQuizType('grammar')">
          <div class="quiz-icon">
            <i class="fas fa-language"></i>
          </div>
          <h3>{{ $t('quiz.grammar_quiz') }}</h3>
          <p>{{ $t('quiz.grammar_description') }}</p>
        </div>
        
        <div class="quiz-type-card" @click="selectQuizType('vocabulary')">
          <div class="quiz-icon">
            <i class="fas fa-book"></i>
          </div>
          <h3>{{ $t('quiz.vocabulary_quiz') }}</h3>
          <p>{{ $t('quiz.vocabulary_description') }}</p>
        </div>
      </div>

      <!-- Topic Selection -->
      <div v-if="selectedQuizType" class="topic-selection">
        <h3>{{ $t('quiz.select_topic') }}</h3>
        
        <div v-if="selectedQuizType === 'grammar'" class="topic-grid">
          <div 
            v-for="topic in grammarTopics" 
            :key="topic.id"
            class="topic-card"
            @click="startQuiz(topic.id)"
          >
            <h4>{{ topic.title }}</h4>
            <p>{{ topic.description }}</p>
          </div>
        </div>
        
        <div v-if="selectedQuizType === 'vocabulary'" class="topic-grid">
          <div 
            v-for="category in vocabularyCategories" 
            :key="category.id"
            class="topic-card"
            @click="startQuiz(category.id)"
          >
            <h4>{{ category.title }}</h4>
            <p>{{ $t('quiz.vocabulary_words') }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Quiz Interface -->
    <div v-else-if="currentQuestion && !quizResults" class="quiz-interface">
      <!-- Progress Bar -->
      <div class="progress-container">
        <div class="progress-bar">
          <div class="progress-fill" :style="{ width: progress + '%' }"></div>
        </div>
        <span class="progress-text">{{ currentQuestionIndex + 1 }} / {{ totalQuestions }}</span>
      </div>

      <!-- Question -->
      <div class="question-container">
        <h2 class="question-text">{{ currentQuestion.question }}</h2>
        
        <!-- Answer Options -->
        <div class="answer-options">
          <div 
            v-for="answer in shuffledAnswers" 
            :key="answer"
            class="answer-option"
            :class="{ 
              'selected': userAnswers[currentQuestionIndex] === answer,
              'correct': showResults && isAnswerCorrect(currentQuestion, answer),
              'incorrect': showResults && userAnswers[currentQuestionIndex] === answer && !isAnswerCorrect(currentQuestion, answer)
            }"
            @click="selectAnswer(answer)"
          >
            <span class="answer-text">{{ answer }}</span>
            <div v-if="showResults" class="answer-indicator">
              <i v-if="isAnswerCorrect(currentQuestion, answer)" class="fas fa-check"></i>
              <i v-else-if="userAnswers[currentQuestionIndex] === answer && !isAnswerCorrect(currentQuestion, answer)" class="fas fa-times"></i>
            </div>
          </div>
        </div>
      </div>

      <!-- Navigation -->
      <div class="quiz-navigation">
        <button 
          v-if="currentQuestionIndex > 0" 
          class="btn btn-secondary"
          @click="previousQuestion"
        >
          <i class="fas fa-arrow-left"></i>
          {{ $t('quiz.previous') }}
        </button>
        
        <button 
          v-if="!isLastQuestion" 
          class="btn btn-primary"
          :disabled="!userAnswers[currentQuestionIndex]"
          @click="nextQuestion"
        >
          {{ $t('quiz.next') }}
          <i class="fas fa-arrow-right"></i>
        </button>
        
        <button 
          v-if="isLastQuestion" 
          class="btn btn-success"
          :disabled="!canSubmit"
          @click="submitQuiz"
        >
          <i class="fas fa-check"></i>
          {{ $t('quiz.submit') }}
        </button>
      </div>
    </div>

    <!-- Quiz Results -->
    <div v-else-if="quizResults" class="quiz-results">
      <div class="results-container">
        <h2 class="results-title">{{ $t('quiz.results') }}</h2>
        
        <div class="score-display">
          <div class="score-circle">
            <span class="score-number">{{ getScore() }}%</span>
            <span class="score-label">{{ $t('quiz.correct') }}</span>
          </div>
        </div>
        
        <div class="results-details">
          <div class="result-item">
            <span class="result-label">{{ $t('quiz.total_questions') }}:</span>
            <span class="result-value">{{ totalQuestions }}</span>
          </div>
          <div class="result-item">
            <span class="result-label">{{ $t('quiz.correct_answers') }}:</span>
            <span class="result-value">{{ getCorrectCount() }}</span>
          </div>
          <div class="result-item">
            <span class="result-label">{{ $t('quiz.incorrect_answers') }}:</span>
            <span class="result-value">{{ totalQuestions - getCorrectCount() }}</span>
          </div>
        </div>
        
        <div class="results-actions">
          <button class="btn btn-primary" @click="retakeQuiz">
            <i class="fas fa-redo"></i>
            {{ $t('quiz.retake') }}
          </button>
          <button class="btn btn-secondary" @click="goBack">
            <i class="fas fa-home"></i>
            {{ $t('quiz.back_to_menu') }}
          </button>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="loading-state">
      <div class="loading-spinner"></div>
      <p>{{ $t('quiz.loading') }}</p>
    </div>

    <!-- Error State -->
    <div v-if="error" class="error-state">
      <i class="fas fa-exclamation-triangle"></i>
      <p>{{ error }}</p>
      <button class="btn btn-primary" @click="goBack">
        {{ $t('quiz.try_again') }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useQuiz } from '@/composables/useQuiz.js'
import { useGrammar } from '@/composables/useGrammar.js'
import { useVocabulary } from '@/composables/useVocabulary.js'

const {
  currentQuiz,
  currentQuestion,
  currentQuestionIndex,
  userAnswers,
  quizResults,
  isLoading,
  error,
  totalQuestions,
  progress,
  isLastQuestion,
  canSubmit,
  loadGrammarQuizzes,
  loadVocabularyQuizzes,
  startQuiz: startQuizComposable,
  selectAnswer,
  nextQuestion,
  previousQuestion,
  submitQuiz: submitQuizComposable,
  resetQuiz,
  getShuffledAnswers,
  isAnswerCorrect,
  getScore
} = useQuiz()

const { grammarLevels } = useGrammar()
const { categories: vocabularyCategories } = useVocabulary()

const selectedQuizType = ref(null)
const showResults = ref(false)

// Mock data for topics (replace with actual API calls)
const grammarTopics = ref([
  { id: 1, title: 'Present Simple', description: 'Basic present tense usage' },
  { id: 2, title: 'Past Simple', description: 'Basic past tense usage' },
  { id: 3, title: 'Future Simple', description: 'Basic future tense usage' }
])

const selectQuizType = (type) => {
  selectedQuizType.value = type
}

const startQuiz = async (topicId) => {
  try {
    let quizzes
    if (selectedQuizType.value === 'grammar') {
      quizzes = await loadGrammarQuizzes(topicId)
    } else {
      quizzes = await loadVocabularyQuizzes(topicId)
    }
    
    if (quizzes && quizzes.length > 0) {
      startQuizComposable(quizzes, selectedQuizType.value)
    } else {
      error.value = 'No quizzes available for this topic'
    }
  } catch (err) {
    console.error('Failed to start quiz:', err)
  }
}

const submitQuiz = async () => {
  try {
    showResults.value = true
    await submitQuizComposable(selectedQuizType.value)
  } catch (err) {
    console.error('Failed to submit quiz:', err)
  }
}

const retakeQuiz = () => {
  showResults.value = false
  resetQuiz()
  selectedQuizType.value = null
}

const goBack = () => {
  resetQuiz()
  selectedQuizType.value = null
}

const getCorrectCount = () => {
  if (!currentQuiz.value || Object.keys(userAnswers.value).length === 0) return 0
  
  let correctCount = 0
  currentQuiz.value.forEach((question, index) => {
    const userAnswer = userAnswers.value[index]
    if (userAnswer && isAnswerCorrect(question, userAnswer)) {
      correctCount++
    }
  })
  
  return correctCount
}

const shuffledAnswers = computed(() => {
  return getShuffledAnswers(currentQuestion.value)
})

onMounted(async () => {
  // Load initial data
  try {
    await Promise.all([
      // Load grammar levels and vocabulary categories
    ])
  } catch (err) {
    console.error('Failed to load initial data:', err)
  }
})
</script>

<style scoped>
.quiz-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}

.quiz-selection {
  text-align: center;
}

.quiz-title {
  font-size: 2rem;
  font-weight: 800;
  margin-bottom: 2rem;
  color: #1e293b;
}

.quiz-types {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.quiz-type-card {
  background: white;
  border: 2px solid #e5e7eb;
  border-radius: 16px;
  padding: 2rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.quiz-type-card:hover {
  border-color: #667eea;
  transform: translateY(-4px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
}

.quiz-icon {
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem;
  color: white;
  font-size: 1.5rem;
}

.quiz-type-card h3 {
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: #1e293b;
}

.quiz-type-card p {
  color: #64748b;
  line-height: 1.6;
}

.topic-selection {
  margin-top: 2rem;
}

.topic-selection h3 {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: #1e293b;
}

.topic-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.topic-card {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 1.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.topic-card:hover {
  border-color: #667eea;
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}

.topic-card h4 {
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #1e293b;
}

.topic-card p {
  color: #64748b;
  font-size: 0.875rem;
}

.quiz-interface {
  background: white;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}

.progress-container {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
}

.progress-bar {
  flex: 1;
  height: 8px;
  background: #e5e7eb;
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(135deg, #667eea, #764ba2);
  transition: width 0.3s ease;
}

.progress-text {
  font-weight: 600;
  color: #64748b;
  min-width: 60px;
}

.question-container {
  margin-bottom: 2rem;
}

.question-text {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 2rem;
  color: #1e293b;
  line-height: 1.4;
}

.answer-options {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.answer-option {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.5rem;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  background: white;
}

.answer-option:hover {
  border-color: #667eea;
  background: #f8fafc;
}

.answer-option.selected {
  border-color: #667eea;
  background: #eff6ff;
}

.answer-option.correct {
  border-color: #10b981;
  background: #ecfdf5;
}

.answer-option.incorrect {
  border-color: #ef4444;
  background: #fef2f2;
}

.answer-text {
  font-size: 1rem;
  font-weight: 500;
  color: #1e293b;
}

.answer-indicator {
  color: #10b981;
  font-size: 1.25rem;
}

.answer-option.incorrect .answer-indicator {
  color: #ef4444;
}

.quiz-navigation {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 2rem;
}

.quiz-results {
  text-align: center;
}

.results-container {
  background: white;
  border-radius: 16px;
  padding: 3rem;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}

.results-title {
  font-size: 2rem;
  font-weight: 800;
  margin-bottom: 2rem;
  color: #1e293b;
}

.score-display {
  margin-bottom: 2rem;
}

.score-circle {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea, #764ba2);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  color: white;
}

.score-number {
  font-size: 2.5rem;
  font-weight: 800;
  line-height: 1;
}

.score-label {
  font-size: 0.875rem;
  opacity: 0.9;
}

.results-details {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}

.result-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.result-label {
  font-size: 0.875rem;
  color: #64748b;
}

.result-value {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1e293b;
}

.results-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.loading-state,
.error-state {
  text-align: center;
  padding: 3rem;
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

.btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
}

.btn-primary {
  background: #667eea;
  color: white;
}

.btn-primary:hover {
  background: #5a67d8;
}

.btn-secondary {
  background: #e5e7eb;
  color: #374151;
}

.btn-secondary:hover {
  background: #d1d5db;
}

.btn-success {
  background: #10b981;
  color: white;
}

.btn-success:hover {
  background: #059669;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .quiz-container {
    padding: 1rem;
  }
  
  .quiz-types {
    grid-template-columns: 1fr;
  }
  
  .topic-grid {
    grid-template-columns: 1fr;
  }
  
  .quiz-navigation {
    flex-direction: column;
    gap: 1rem;
  }
  
  .results-actions {
    flex-direction: column;
  }
}
</style>
