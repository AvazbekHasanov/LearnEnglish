<template>
  <div class="sentence-unscramble-game">
    <div class="game-header">
      <div class="header-top">
        <h2 class="game-title">{{ $t('games.sentence_unscramble_game') }}</h2>
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
      <div class="sentence-container">
        <h3 class="sentence-title">{{ $t('games.sentence_unscramble_description') }}:</h3>
                 <div class="scrambled-words">
           <div
             v-for="(word, index) in scrambledWords"
             :key="`scrambled-${index}`"
             class="word-tile"
             :class="{ 
               'selected': selectedWords.includes(index),
               'placed': placedWords.includes(index)
             }"
             draggable="true"
             @dragstart="onDragStart($event, 'scrambled', index)"
             @click="toggleWordSelection(index)"
           >
             {{ word }}
           </div>
         </div>
      </div>

             <div class="answer-container">
         <h4 class="answer-title">{{ $t('quiz.submit') }}:</h4>
         <div 
           class="answer-area"
           :class="{ 'drag-over': isDragOver }"
           @dragover.prevent="onDragOver"
           @drop="onDrop"
           @dragenter.prevent="onDragEnter"
           @dragleave.prevent="onDragLeave"
         >
           <div
             v-for="(word, index) in userAnswer"
             :key="`answer-${index}`"
             class="answer-word"
             draggable="true"
             @dragstart="onDragStart($event, 'answer', index)"
             @click="removeWord(index)"
           >
             {{ word }}
             <span class="remove-btn">×</span>
           </div>
           <div v-if="userAnswer.length === 0" class="placeholder">
             {{ $t('games.sentence_unscramble_description') }}
           </div>
         </div>
       </div>

      <div class="game-actions">
        <button 
          class="btn btn-secondary" 
          @click="clearAnswer"
          :disabled="userAnswer.length === 0"
        >
          <i class="fas fa-undo"></i>
          {{ $t('vocabulary.cancel') }}
        </button>
        <button 
          class="btn btn-primary" 
          @click="checkAnswer"
          :disabled="userAnswer.length === 0"
        >
          <i class="fas fa-check"></i>
          {{ $t('quiz.submit') }}
        </button>
        <button 
          v-if="showResult" 
          class="btn btn-primary" 
          @click="nextQuestion"
        >
          {{ isLastQuestion ? $t('games.play_now') : $t('quiz.next') }}
        </button>
      </div>

      <div v-if="showResult" class="result-message">
        <div v-if="isCorrect" class="correct-message">
          <i class="fas fa-check-circle"></i>
          <span>Perfect! Well done!</span>
        </div>
        <div v-else class="incorrect-message">
          <i class="fas fa-times-circle"></i>
          <span>Incorrect. The correct sentence is: "{{ correctSentence }}"</span>
        </div>
      </div>
    </div>

    <div v-else class="game-over">
      <div class="game-over-content">
        <h3 class="game-over-title">Game Over!</h3>
        <div class="final-stats">
          <div class="final-stat">
            <span class="stat-label">Final Score:</span>
            <span class="stat-value">{{ score }}</span>
          </div>
          <div class="final-stat">
            <span class="stat-label">Correct Answers:</span>
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
            Play Again
          </button>
          <button class="btn btn-secondary" @click="$emit('close')">
            <i class="fas fa-home"></i>
            Back to Games
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
const showResult = ref(false)
const gameOver = ref(false)
const correctAnswers = ref(0)
const totalQuestions = ref(0)

// Timer
let timer = null

// Sentence data
const sentenceData = [
  { sentence: 'The quick brown fox jumps over the lazy dog', difficulty: 'Beginner' },
  { sentence: 'Learning English can be both challenging and rewarding', difficulty: 'Intermediate' },
  { sentence: 'She carefully prepared the delicious meal for her family', difficulty: 'Intermediate' },
  { sentence: 'The beautiful sunset painted the sky with vibrant colors', difficulty: 'Intermediate' },
  { sentence: 'Students should always strive to improve their knowledge', difficulty: 'Intermediate' },
  { sentence: 'Technology has revolutionized the way we communicate', difficulty: 'Advanced' },
  { sentence: 'Environmental protection is crucial for future generations', difficulty: 'Advanced' },
  { sentence: 'The ancient ruins tell stories of civilizations long gone', difficulty: 'Advanced' },
  { sentence: 'Innovation drives progress in every field of human endeavor', difficulty: 'Advanced' },
  { sentence: 'Education empowers individuals to achieve their dreams', difficulty: 'Intermediate' },
  { sentence: 'The weather forecast predicts rain for the weekend', difficulty: 'Beginner' },
  { sentence: 'Cooking requires patience and attention to detail', difficulty: 'Intermediate' },
  { sentence: 'Reading books expands our imagination and knowledge', difficulty: 'Intermediate' },
  { sentence: 'Exercise is essential for maintaining good health', difficulty: 'Beginner' },
  { sentence: 'Music has the power to evoke strong emotions', difficulty: 'Intermediate' },
  { sentence: 'Traveling broadens our perspective on different cultures', difficulty: 'Advanced' },
  { sentence: 'Friendship is built on trust and mutual understanding', difficulty: 'Intermediate' },
  { sentence: 'The internet connects people from around the world', difficulty: 'Beginner' },
  { sentence: 'Success comes from hard work and determination', difficulty: 'Intermediate' },
  { sentence: 'Nature provides us with beauty and inspiration', difficulty: 'Intermediate' }
]

// Current question state
const shuffledSentences = ref([])
const currentSentence = ref('')
const correctSentence = ref('')
const scrambledWords = ref([])
const selectedWords = ref([])
const placedWords = ref([])
const userAnswer = ref([])
const isDragOver = ref(false)

const isLastQuestion = computed(() => {
  return currentQuestionIndex.value === totalQuestions - 1
})

const accuracy = computed(() => {
  return totalQuestions.value > 0 ? Math.round((correctAnswers.value / totalQuestions.value) * 100) : 0
})

const initializeGame = () => {
  // Shuffle sentences and select 10 for the game
  shuffledSentences.value = [...sentenceData].sort(() => Math.random() - 0.5).slice(0, 10)
  totalQuestions.value = shuffledSentences.value.length
  currentQuestionIndex.value = 0
  score.value = 0
  correctAnswers.value = 0
  timeLeft.value = 300
  gameOver.value = false
  loadQuestion()
  startTimer()
}

const loadQuestion = () => {
  const currentSentenceData = shuffledSentences.value[currentQuestionIndex.value]
  currentSentence.value = currentSentenceData.sentence
  correctSentence.value = currentSentenceData.sentence
  
  // Split sentence into words and shuffle
  const words = currentSentence.value.split(' ')
  scrambledWords.value = [...words].sort(() => Math.random() - 0.5)
  
  // Reset state
  selectedWords.value = []
  placedWords.value = []
  userAnswer.value = []
  showResult.value = false
  isDragOver.value = false
}

const toggleWordSelection = (index) => {
  if (showResult.value) return
  
  // If word is already placed, don't allow selection
  if (placedWords.value.includes(index)) return
  
  if (selectedWords.value.includes(index)) {
    // Remove from selection
    selectedWords.value = selectedWords.value.filter(i => i !== index)
  } else {
    // Add to selection and immediately add to answer
    selectedWords.value = [index]
    const word = scrambledWords.value[index]
    userAnswer.value.push(word)
    placedWords.value.push(index)
    selectedWords.value = [] // Clear selection after adding
  }
}

const removeWord = (index) => {
  if (showResult.value) return
  
  const word = userAnswer.value[index]
  
  // Find the first occurrence of this word in placedWords and remove it
  const wordIndex = placedWords.value.findIndex(placedIndex => 
    scrambledWords.value[placedIndex] === word
  )
  
  if (wordIndex !== -1) {
    placedWords.value.splice(wordIndex, 1)
  }
  
  // Remove from user answer
  userAnswer.value.splice(index, 1)
}

const clearAnswer = () => {
  if (showResult.value) return
  
  userAnswer.value = []
  placedWords.value = []
  selectedWords.value = []
  isDragOver.value = false
}

// Drag and drop functionality
const onDragStart = (event, source, index) => {
  event.dataTransfer.setData('text/plain', JSON.stringify({ source, index }))
  event.dataTransfer.effectAllowed = 'move'
}

const onDragOver = (event) => {
  event.preventDefault()
  isDragOver.value = true
}

const onDragEnter = (event) => {
  event.preventDefault()
  isDragOver.value = true
}

const onDragLeave = (event) => {
  event.preventDefault()
  // Only set to false if we're leaving the drop zone entirely
  if (!event.currentTarget.contains(event.relatedTarget)) {
    isDragOver.value = false
  }
}

const onDrop = (event) => {
  if (showResult.value) return
  
  event.preventDefault()
  isDragOver.value = false
  
  const data = JSON.parse(event.dataTransfer.getData('text/plain'))
  
  if (data.source === 'scrambled') {
    // Adding a word from scrambled area to answer area
    const wordIndex = data.index
    if (!placedWords.value.includes(wordIndex)) {
      const word = scrambledWords.value[wordIndex]
      userAnswer.value.push(word)
      placedWords.value.push(wordIndex)
    }
  } else if (data.source === 'answer') {
    // Reordering within answer area
    const fromIndex = data.index
    const toIndex = userAnswer.value.length // Add to end
    
    if (fromIndex !== toIndex) {
      const word = userAnswer.value.splice(fromIndex, 1)[0]
      userAnswer.value.splice(toIndex, 0, word)
      
      // Update placedWords accordingly
      const placedIndex = placedWords.value.splice(fromIndex, 1)[0]
      placedWords.value.splice(toIndex, 0, placedIndex)
    }
  }
}

const checkAnswer = () => {
  if (userAnswer.value.length === 0) return
  
  showResult.value = true
  const userSentence = userAnswer.value.join(' ')
  const isCorrect = userSentence.toLowerCase() === correctSentence.value.toLowerCase()
  
  if (isCorrect) {
    score.value += 10
    correctAnswers.value++
  }
}

const isCorrect = computed(() => {
  if (userAnswer.value.length === 0) return false
  const userSentence = userAnswer.value.join(' ')
  return userSentence.toLowerCase() === correctSentence.value.toLowerCase()
})

const nextQuestion = () => {
  if (isLastQuestion.value) {
    endGame()
  } else {
    currentQuestionIndex.value++
    loadQuestion()
  }
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
.sentence-unscramble-game {
  max-width: 900px;
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

.sentence-container {
  margin-bottom: 2rem;
  padding: 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 15px;
  color: white;
}

.sentence-title {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
}

.scrambled-words {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  justify-content: center;
}

.word-tile {
  padding: 0.75rem 1rem;
  background: rgba(255, 255, 255, 0.2);
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 8px;
  cursor: grab;
  transition: all 0.3s ease;
  font-weight: 600;
  user-select: none;
}

.word-tile:active {
  cursor: grabbing;
}

.word-tile:hover:not(.placed) {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-2px);
}

.word-tile.selected {
  background: rgba(255, 255, 255, 0.4);
  border-color: rgba(255, 255, 255, 0.8);
  transform: translateY(-2px);
}

.word-tile.placed {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.2);
  opacity: 0.6;
  cursor: not-allowed;
}

.answer-container {
  margin-bottom: 2rem;
  text-align: left;
}

.answer-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 1rem;
}

.answer-area {
  min-height: 80px;
  padding: 1rem;
  border: 2px dashed #cbd5e1;
  border-radius: 12px;
  background: #f8fafc;
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  align-items: center;
  transition: all 0.3s ease;
}

.answer-area.drag-over {
  border-color: #667eea;
  background: #eff6ff;
  transform: scale(1.02);
}

.answer-word {
  padding: 0.5rem 0.75rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  user-select: none;
}

.answer-word:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(102, 126, 234, 0.3);
}

.remove-btn {
  font-size: 1.2rem;
  font-weight: 800;
  opacity: 0.8;
}

.remove-btn:hover {
  opacity: 1;
}

.placeholder {
  color: #94a3b8;
  font-style: italic;
  width: 100%;
  text-align: center;
}

.game-actions {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
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

.btn-secondary:hover:not(:disabled) {
  background: #e2e8f0;
  color: #475569;
}

.btn-secondary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
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
  .sentence-unscramble-game {
    padding: 1rem;
  }
  
  .game-stats {
    gap: 1rem;
  }
  
  .scrambled-words {
    gap: 0.25rem;
  }
  
  .word-tile {
    padding: 0.5rem 0.75rem;
    font-size: 0.875rem;
  }
  
  .answer-area {
    min-height: 60px;
    padding: 0.75rem;
  }
  
  .answer-word {
    padding: 0.375rem 0.5rem;
    font-size: 0.875rem;
  }
  
  .game-actions {
    flex-direction: column;
    align-items: center;
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
