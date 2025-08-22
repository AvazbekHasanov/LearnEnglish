<template>
  <div class="word-matching-game">
    <div class="game-header">
      <div class="header-top">
        <h2 class="game-title">{{ $t('games.word_matching_game') }}</h2>
      </div>
      <div class="game-stats">
        <div class="stat">
          <span class="stat-label">{{ $t('games.score') }}:</span>
          <span class="stat-value">{{ score }}</span>
        </div>
        <div class="stat">
          <span class="stat-label">{{ $t('games.time') }}:</span>
          <span class="stat-value">{{ formatTime(timeLeft) }}</span>
        </div>
        <div class="stat">
          <span class="stat-label">{{ $t('leaderboard.level') }}:</span>
          <span class="stat-value">{{ currentLevel }}</span>
        </div>
      </div>
    </div>

    <div class="game-content" v-if="!gameOver">
      <div class="word-container">
        <h3 class="word-title">{{ currentWord.word }}</h3>
        <p class="word-hint">{{ $t('games.word_matching_description') }}</p>
      </div>

      <div class="options-container">
        <button
          v-for="option in shuffledOptions"
          :key="option.id"
          class="option-btn"
          :class="{ 
            'selected': selectedOption === option.id,
            'correct': showResult && option.id === correctAnswer,
            'incorrect': showResult && selectedOption === option.id && option.id !== correctAnswer
          }"
          @click="selectOption(option.id)"
          :disabled="showResult"
        >
          {{ option.meaning }}
        </button>
      </div>

      <div class="game-actions">
        <button 
          v-if="!showResult" 
          class="btn btn-primary" 
          @click="checkAnswer"
          :disabled="!selectedOption"
        >
          {{ $t('quiz.submit') }}
        </button>
        <button 
          v-else 
          class="btn btn-primary" 
          @click="nextQuestion"
        >
          {{ isLastQuestion ? $t('games.play_now') : $t('quiz.next') }}
        </button>
      </div>

      <div v-if="showResult" class="result-message">
        <div v-if="isCorrect" class="correct-message">
          <i class="fas fa-check-circle"></i>
          <span>{{ $t('quiz.correct') }}! Well done!</span>
        </div>
        <div v-else class="incorrect-message">
          <i class="fas fa-times-circle"></i>
          <span>{{ $t('quiz.incorrect_answers') }}. The correct answer is: {{ getCorrectMeaning() }}</span>
        </div>
      </div>
    </div>

    <div v-else class="game-over">
      <div class="game-over-content">
        <h3 class="game-over-title">{{ $t('games.play_now') }}!</h3>
        <div class="final-stats">
          <div class="final-stat">
            <span class="stat-label">{{ $t('games.score') }}:</span>
            <span class="stat-value">{{ score }}</span>
          </div>
          <div class="final-stat">
            <span class="stat-label">{{ $t('quiz.correct_answers') }}:</span>
            <span class="stat-value">{{ correctAnswers }}/{{ totalQuestions }}</span>
          </div>
          <div class="final-stat">
            <span class="stat-label">Accuracy:</span>
            <span class="stat-value">{{ accuracy }}%</span>
          </div>
        </div>
        <div class="game-over-actions">
          <button class="btn btn-primary" @click="restartGame">
            <i class="fas fa-redo"></i>
            {{ $t('games.play_now') }}
          </button>
          <button class="btn btn-secondary" @click="$emit('close')">
            <i class="fas fa-home"></i>
            {{ $t('common.back') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

const emit = defineEmits(['close', 'gameComplete'])

// Game state
const score = ref(0)
const timeLeft = ref(300) // 5 minutes
const currentLevel = ref(1)
const currentQuestionIndex = ref(0)
const selectedOption = ref(null)
const showResult = ref(false)
const gameOver = ref(false)
const correctAnswers = ref(0)
const totalQuestions = ref(0)

// Timer
let timer = null

// Word data with meanings
const wordData = [
  { word: 'Serendipity', meaning: 'A pleasant surprise; finding something good without looking for it' },
  { word: 'Ephemeral', meaning: 'Lasting for a very short time; temporary' },
  { word: 'Ubiquitous', meaning: 'Present, appearing, or found everywhere' },
  { word: 'Mellifluous', meaning: 'Sweet or musical; pleasant to hear' },
  { word: 'Serene', meaning: 'Calm, peaceful, and untroubled' },
  { word: 'Eloquent', meaning: 'Fluent or persuasive in speaking or writing' },
  { word: 'Resilient', meaning: 'Able to withstand or recover quickly from difficult conditions' },
  { word: 'Persistent', meaning: 'Continuing firmly or obstinately in a course of action' },
  { word: 'Authentic', meaning: 'Genuine or real; not copied or false' },
  { word: 'Innovative', meaning: 'Featuring new methods or ideas; creative' },
  { word: 'Diligent', meaning: 'Having or showing care and conscientiousness in one\'s work' },
  { word: 'Ambitious', meaning: 'Having a strong desire for success or achievement' },
  { word: 'Compassionate', meaning: 'Feeling or showing sympathy and concern for others' },
  { word: 'Optimistic', meaning: 'Hopeful and confident about the future' },
  { word: 'Versatile', meaning: 'Able to adapt or be adapted to many different functions' },
  { word: 'Tenacious', meaning: 'Tending to keep a firm hold of something; persistent' },
  { word: 'Charismatic', meaning: 'Exercising a compelling charm that inspires devotion in others' },
  { word: 'Analytical', meaning: 'Relating to or using analysis or logical reasoning' },
  { word: 'Empathetic', meaning: 'Showing an ability to understand and share the feelings of others' },
  { word: 'Resourceful', meaning: 'Having the ability to find quick and clever ways to overcome difficulties' }
]

// Shuffle and select questions
const shuffledWords = ref([])
const currentWord = ref({})
const shuffledOptions = ref([])
const correctAnswer = ref(null)

const isLastQuestion = computed(() => {
  return currentQuestionIndex.value === totalQuestions - 1
})

const accuracy = computed(() => {
  return totalQuestions.value > 0 ? Math.round((correctAnswers.value / totalQuestions.value) * 100) : 0
})

const initializeGame = () => {
  // Shuffle words and select 10 for the game
  shuffledWords.value = [...wordData].sort(() => Math.random() - 0.5).slice(0, 10)
  totalQuestions.value = shuffledWords.value.length
  currentQuestionIndex.value = 0
  score.value = 0
  correctAnswers.value = 0
  timeLeft.value = 300
  gameOver.value = false
  loadQuestion()
  startTimer()
}

const loadQuestion = () => {
  const currentWordData = shuffledWords.value[currentQuestionIndex.value]
  currentWord.value = currentWordData
  
  // Create options: 1 correct + 3 random incorrect
  const otherWords = wordData.filter(w => w.word !== currentWordData.word)
  const randomOptions = [...otherWords].sort(() => Math.random() - 0.5).slice(0, 3)
  
  const allOptions = [
    { id: 'correct', meaning: currentWordData.meaning },
    ...randomOptions.map((word, index) => ({
      id: `incorrect-${index}`,
      meaning: word.meaning
    }))
  ]
  
  // Shuffle options
  shuffledOptions.value = allOptions.sort(() => Math.random() - 0.5)
  correctAnswer.value = 'correct'
  selectedOption.value = null
  showResult.value = false
}

const selectOption = (optionId) => {
  if (!showResult.value) {
    selectedOption.value = optionId
  }
}

const checkAnswer = () => {
  if (!selectedOption.value) return
  
  showResult.value = true
  const isCorrect = selectedOption.value === correctAnswer.value
  
  if (isCorrect) {
    score.value += 10
    correctAnswers.value++
  }
}

const isCorrect = computed(() => {
  return selectedOption.value === correctAnswer.value
})

const nextQuestion = () => {
  if (isLastQuestion.value) {
    endGame()
  } else {
    currentQuestionIndex.value++
    loadQuestion()
  }
}

const getCorrectMeaning = () => {
  return currentWord.value.meaning
}

const startTimer = () => {
  timer = setInterval(() => {
    timeLeft.value--
    if (timeLeft.value <= 0) {
      endGame()
    }
  }, 1000)
}

const endGame = () => {
  clearInterval(timer)
  gameOver.value = true
  emit('gameComplete', {
    score: score.value,
    correctAnswers: correctAnswers.value,
    totalQuestions: totalQuestions.value,
    accuracy: accuracy.value
  })
}

const restartGame = () => {
  initializeGame()
}

const formatTime = (seconds) => {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
}

onMounted(() => {
  initializeGame()
})

onUnmounted(() => {
  if (timer) {
    clearInterval(timer)
  }
})
</script>

<style scoped>
.word-matching-game {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  background: white;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.game-header {
  text-align: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #f1f5f9;
}

.header-top {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 1rem;
}

.game-title {
  font-size: 2rem;
  font-weight: 800;
  color: #1e293b;
  margin: 0;
}

.game-stats {
  display: flex;
  justify-content: center;
  gap: 2rem;
  flex-wrap: wrap;
}

.stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
}

.stat-label {
  font-size: 0.875rem;
  color: #64748b;
  font-weight: 600;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 800;
  color: #667eea;
}

.game-content {
  text-align: center;
}

.word-container {
  margin-bottom: 2rem;
  padding: 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 15px;
  color: white;
}

.word-title {
  font-size: 2.5rem;
  font-weight: 800;
  margin-bottom: 0.5rem;
}

.word-hint {
  font-size: 1.1rem;
  opacity: 0.9;
}

.options-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}

.option-btn {
  padding: 1.5rem;
  border: 2px solid #e2e8f0;
  background: white;
  border-radius: 12px;
  font-size: 1rem;
  text-align: left;
  cursor: pointer;
  transition: all 0.3s ease;
  min-height: 80px;
  display: flex;
  align-items: center;
}

.option-btn:hover:not(:disabled) {
  border-color: #667eea;
  background: #f8fafc;
  transform: translateY(-2px);
}

.option-btn.selected {
  border-color: #667eea;
  background: #eff6ff;
  color: #667eea;
}

.option-btn.correct {
  border-color: #10b981;
  background: #d1fae5;
  color: #065f46;
}

.option-btn.incorrect {
  border-color: #ef4444;
  background: #fee2e2;
  color: #991b1b;
}

.option-btn:disabled {
  cursor: not-allowed;
}

.game-actions {
  margin-bottom: 2rem;
}

.btn {
  padding: 1rem 2rem;
  border: none;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.btn-secondary {
  background: #f1f5f9;
  color: #64748b;
  border: 2px solid #e2e8f0;
}

.btn-secondary:hover {
  background: #e2e8f0;
  color: #475569;
}

.result-message {
  padding: 1rem;
  border-radius: 10px;
  font-weight: 600;
  font-size: 1.1rem;
}

.correct-message {
  background: #d1fae5;
  color: #065f46;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.incorrect-message {
  background: #fee2e2;
  color: #991b1b;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.game-over {
  text-align: center;
}

.game-over-content {
  padding: 2rem;
}

.game-over-title {
  font-size: 2rem;
  font-weight: 800;
  color: #1e293b;
  margin-bottom: 2rem;
}

.final-stats {
  display: flex;
  justify-content: center;
  gap: 2rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}

.final-stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem;
  background: #f8fafc;
  border-radius: 10px;
  min-width: 120px;
}

.final-stat .stat-label {
  font-size: 0.875rem;
  color: #64748b;
}

.final-stat .stat-value {
  font-size: 1.5rem;
  font-weight: 800;
  color: #667eea;
}

.game-over-actions {
  display: flex;
  justify-content: center;
  gap: 1rem;
  flex-wrap: wrap;
}

@media (max-width: 768px) {
  .word-matching-game {
    padding: 1rem;
  }
  
  .game-stats {
    gap: 1rem;
  }
  
  .options-container {
    grid-template-columns: 1fr;
  }
  
  .word-title {
    font-size: 2rem;
  }
  
  .final-stats {
    flex-direction: column;
    align-items: center;
  }
  
  .game-over-actions {
    flex-direction: column;
    align-items: center;
  }
}
</style>
