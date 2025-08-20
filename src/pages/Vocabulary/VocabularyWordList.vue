<template>
  <DefaultLayout>
    <div class="vocabulary-wordlist-container">
      <!-- Header Section -->
      <section class="header-section">
        <div class="container">
          <div class="header-content">
            <BackButton />
            <div class="header-info">
              <h1 class="page-title">{{ categoryTitle }}</h1>
              <p class="page-subtitle">
                {{ words.length }} words to learn • {{ getCompletedCount() }} completed
              </p>
            </div>
            <div class="header-actions">
              <button @click="startPractice" class="btn btn-primary">
                <i class="fas fa-play"></i>
                Start Practice
              </button>
            </div>
          </div>
        </div>
      </section>

      <!-- Loading State -->
      <div v-if="loading" class="loading-section">
        <div class="loading-spinner"></div>
        <p>Loading vocabulary words...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="error-section">
        <div class="error-content">
          <i class="fas fa-exclamation-triangle"></i>
          <h3>Failed to load words</h3>
          <p>{{ error }}</p>
          <button @click="loadWords" class="btn btn-primary">Try Again</button>
        </div>
      </div>

      <!-- Words Grid -->
      <section v-else class="words-section">
        <div class="container">
          <!-- Search and Filter -->
          <div class="controls-bar">
            <div class="search-box">
              <i class="fas fa-search"></i>
              <input 
                v-model="searchQuery" 
                type="text" 
                placeholder="Search words..."
                class="search-input"
              />
            </div>
            <div class="filter-controls">
              <select v-model="levelFilter" class="filter-select">
                <option value="">All Levels</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
          </div>

          <!-- Words Grid -->
          <div class="words-grid">
            <div 
              v-for="word in filteredWords" 
              :key="word.id"
              class="word-card"
              :class="{ 'word-learned': isWordLearned(word.id) }"
            >
              <div class="word-header">
                <div class="word-level" :class="word.level">
                  {{ word.level }}
                </div>
                <div class="word-actions">
                  <button 
                    @click="playAudio(word.audioUrl)" 
                    class="btn-icon"
                    :disabled="!word.audioUrl"
                  >
                    <i class="fas fa-volume-up"></i>
                  </button>
                  <button 
                    @click="toggleFavorite(word.id)" 
                    class="btn-icon"
                    :class="{ 'favorited': isFavorited(word.id) }"
                  >
                    <i class="fas fa-heart"></i>
                  </button>
                </div>
              </div>

                             <div class="word-content">
                 <div class="word-header-row">
                   <h3 class="word-text">{{ word.word }}</h3>
                   <button 
                     @click="pronounceWord(word.word)" 
                     class="btn-icon pronounce-btn"
                     title="Pronounce word"
                   >
                     <i class="fas fa-volume-up"></i>
                   </button>
                 </div>
                 <p class="word-translation">{{ word.translation }}</p>
                 <p class="word-definition">{{ word.definition }}</p>
                
                <div v-if="word.example" class="word-example">
                  <span class="example-label">Example:</span>
                  <p class="example-text">{{ word.example }}</p>
                </div>
              </div>

              <div class="word-footer">
                <div class="word-stats">
                  <span class="word-score">
                    <i class="fas fa-star"></i>
                    {{ word.score || 0 }}
                  </span>
                </div>
                <button 
                  @click="markAsLearned(word.id)"
                  class="btn btn-secondary btn-sm"
                  :class="{ 'learned': isWordLearned(word.id) }"
                >
                  <i class="fas fa-check"></i>
                  {{ isWordLearned(word.id) ? 'Learned' : 'Mark Learned' }}
                </button>
              </div>
            </div>
          </div>

          <!-- Empty State -->
          <div v-if="filteredWords.length === 0 && !loading" class="empty-state">
            <div class="empty-content">
              <i class="fas fa-search"></i>
              <h3>No words found</h3>
              <p>Try adjusting your search or filter criteria</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Progress Section -->
      <section class="progress-section">
        <div class="container">
          <div class="progress-card">
            <div class="progress-header">
              <h3>Learning Progress</h3>
              <span class="progress-percentage">{{ getProgressPercentage() }}%</span>
            </div>
            <div class="progress-bar">
              <div 
                class="progress-fill" 
                :style="{ width: getProgressPercentage() + '%' }"
              ></div>
            </div>
            <div class="progress-stats">
              <div class="stat">
                <span class="stat-number">{{ getCompletedCount() }}</span>
                <span class="stat-label">Learned</span>
              </div>
              <div class="stat">
                <span class="stat-number">{{ words.length - getCompletedCount() }}</span>
                <span class="stat-label">Remaining</span>
              </div>
              <div class="stat">
                <span class="stat-number">{{ getTotalScore() }}</span>
                <span class="stat-label">Total Score</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  </DefaultLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/stores/userStore.js'
import { vocabularyAPI } from '@/services/api.js'
import DefaultLayout from '@/components/DefaultLayout.vue'
import BackButton from '@/components/BackButton.vue'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

const groupId = computed(() => route.params.groupId)
const loading = ref(true)
const error = ref(null)
const words = ref([])
const searchQuery = ref('')
const levelFilter = ref('')
const learnedWords = ref(new Set())
const favoriteWords = ref(new Set())

// Load words from localStorage
const loadLearnedWords = () => {
  const stored = localStorage.getItem(`learned_words_${groupId.value}`)
  if (stored) {
    learnedWords.value = new Set(JSON.parse(stored))
  }
}

const loadFavoriteWords = () => {
  const stored = localStorage.getItem(`favorite_words_${groupId.value}`)
  if (stored) {
    favoriteWords.value = new Set(JSON.parse(stored))
  }
}

const saveLearnedWords = () => {
  localStorage.setItem(`learned_words_${groupId.value}`, JSON.stringify([...learnedWords.value]))
}

const saveFavoriteWords = () => {
  localStorage.setItem(`favorite_words_${groupId.value}`, JSON.stringify([...favoriteWords.value]))
}

const categoryTitle = computed(() => {
  // You can enhance this by fetching category details from API
  return `Vocabulary Category ${groupId.value}`
})

const filteredWords = computed(() => {
  let filtered = words.value

  // Apply search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(word => 
      word.word.toLowerCase().includes(query) ||
      word.translation.toLowerCase().includes(query) ||
      word.definition.toLowerCase().includes(query)
    )
  }

  // Apply level filter
  if (levelFilter.value) {
    filtered = filtered.filter(word => word.level === levelFilter.value)
  }

  return filtered
})

onMounted(async () => {
  loadLearnedWords()
  loadFavoriteWords()
  await loadWords()
})

const loadWords = async () => {
  try {
    loading.value = true
    error.value = null
    
    const response = await vocabularyAPI.getWords(groupId.value)
    words.value = response.data
    
    // Update user progress
    userStore.updateProgress('vocabulary', {
      totalWordsLearned: getCompletedCount()
    })
    
  } catch (err) {
    console.error('Failed to load vocabulary words:', err)
    error.value = err.response?.data?.message || 'Failed to load vocabulary words'
  } finally {
    loading.value = false
  }
}

const playAudio = (audioUrl) => {
  if (audioUrl) {
    const audio = new Audio(audioUrl)
    audio.play().catch(error => {
      console.error('Failed to play audio:', error)
    })
  }
}

const pronounceWord = (word) => {
  if ('speechSynthesis' in window) {
    // Stop any currently playing speech
    window.speechSynthesis.cancel()
    
    // Create speech utterance
    const utterance = new SpeechSynthesisUtterance(word)
    utterance.lang = 'en-US'
    utterance.rate = 0.8
    utterance.pitch = 1
    utterance.volume = 1
    
    // Speak the word
    window.speechSynthesis.speak(utterance)
  } else {
    console.log('Speech synthesis not supported')
  }
}

const toggleFavorite = (wordId) => {
  if (favoriteWords.value.has(wordId)) {
    favoriteWords.value.delete(wordId)
  } else {
    favoriteWords.value.add(wordId)
  }
  saveFavoriteWords()
}

const isFavorited = (wordId) => {
  return favoriteWords.value.has(wordId)
}

const markAsLearned = (wordId) => {
  if (learnedWords.value.has(wordId)) {
    learnedWords.value.delete(wordId)
  } else {
    learnedWords.value.add(wordId)
    // Add points for learning a new word
    userStore.addPoints(5)
  }
  saveLearnedWords()
  
  // Update user progress
  userStore.updateProgress('vocabulary', {
    totalWordsLearned: getCompletedCount()
  })
}

const isWordLearned = (wordId) => {
  return learnedWords.value.has(wordId)
}

const getCompletedCount = () => {
  return learnedWords.value.size
}

const getProgressPercentage = () => {
  if (words.value.length === 0) return 0
  return Math.round((getCompletedCount() / words.value.length) * 100)
}

const getTotalScore = () => {
  return words.value.reduce((total, word) => total + (word.score || 0), 0)
}

const startPractice = () => {
  router.push(`/vocabulary/quiz/${groupId.value}`)
}
</script>

<style scoped>
.vocabulary-wordlist-container {
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
  justify-content: space-between;
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

.header-actions {
  display: flex;
  gap: 1rem;
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

/* Words Section */
.words-section {
  padding: 3rem 0;
}

.controls-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  gap: 1rem;
}

.search-box {
  position: relative;
  flex: 1;
  max-width: 400px;
}

.search-box i {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #64748b;
}

.search-input {
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 2.5rem;
  border: 2px solid #e5e7eb;
  border-radius: 0.75rem;
  font-size: 1rem;
  background: white;
}

.search-input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.filter-select {
  padding: 0.75rem 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 0.75rem;
  font-size: 1rem;
  background: white;
  cursor: pointer;
}

.filter-select:focus {
  outline: none;
  border-color: #667eea;
}

/* Words Grid */
.words-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
  margin-bottom: 3rem;
}

.word-card {
  background: white;
  border: 2px solid #e5e7eb;
  border-radius: 1rem;
  padding: 1.5rem;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.word-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}

.word-card.word-learned {
  border-color: #16a34a;
  background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
}

.word-card.word-learned::before {
  content: '✓';
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  background: #16a34a;
  color: white;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: bold;
}

.word-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.word-level {
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
}

.word-level.beginner {
  background: #dbeafe;
  color: #1e40af;
}

.word-level.intermediate {
  background: #fef3c7;
  color: #92400e;
}

.word-level.advanced {
  background: #fecaca;
  color: #991b1b;
}

.word-actions {
  display: flex;
  gap: 0.5rem;
}

.btn-icon {
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 0.5rem;
  background: #f1f5f9;
  color: #64748b;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-icon:hover {
  background: #e2e8f0;
  color: #475569;
}

.btn-icon.favorited {
  background: #fecaca;
  color: #dc2626;
}

.btn-icon:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.word-content {
  margin-bottom: 1.5rem;
}

.word-header-row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.5rem;
}

.word-text {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
  flex: 1;
}

.pronounce-btn {
  background: #667eea;
  color: white;
  border: none;
  transition: all 0.2s ease;
}

.pronounce-btn:hover {
  background: #5a67d8;
  transform: scale(1.05);
}

.pronounce-btn:active {
  transform: scale(0.95);
}

.word-translation {
  font-size: 1.1rem;
  color: #667eea;
  font-weight: 600;
  margin-bottom: 0.75rem;
}

.word-definition {
  color: #64748b;
  line-height: 1.6;
  margin-bottom: 1rem;
}

.word-example {
  background: #f8fafc;
  padding: 1rem;
  border-radius: 0.75rem;
  border-left: 4px solid #667eea;
}

.example-label {
  font-weight: 600;
  color: #374151;
  display: block;
  margin-bottom: 0.5rem;
}

.example-text {
  color: #64748b;
  font-style: italic;
  margin: 0;
}

.word-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.word-stats {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.word-score {
  color: #f59e0b;
  font-weight: 600;
}

.btn-sm {
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
}

.btn-sm.learned {
  background: #16a34a;
  color: white;
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 4rem 2rem;
}

.empty-content {
  max-width: 400px;
  margin: 0 auto;
}

.empty-content i {
  font-size: 3rem;
  color: #94a3b8;
  margin-bottom: 1rem;
}

/* Progress Section */
.progress-section {
  padding: 2rem 0;
  background: white;
  border-top: 1px solid #e5e7eb;
}

.progress-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 2rem;
  border-radius: 1rem;
  text-align: center;
}

.progress-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.progress-header h3 {
  margin: 0;
  font-size: 1.25rem;
}

.progress-percentage {
  font-size: 1.5rem;
  font-weight: 800;
}

.progress-bar {
  width: 100%;
  height: 8px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 1.5rem;
}

.progress-fill {
  height: 100%;
  background: white;
  transition: width 0.3s ease;
}

.progress-stats {
  display: flex;
  justify-content: space-around;
  gap: 2rem;
}

.stat {
  text-align: center;
}

.stat-number {
  display: block;
  font-size: 1.5rem;
  font-weight: 800;
  margin-bottom: 0.25rem;
}

.stat-label {
  font-size: 0.875rem;
  opacity: 0.8;
}

/* Buttons */
.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  text-decoration: none;
}

.btn-primary {
  background: #667eea;
  color: white;
}

.btn-primary:hover {
  background: #5a67d8;
  transform: translateY(-1px);
}

.btn-secondary {
  background: #f1f5f9;
  color: #374151;
}

.btn-secondary:hover {
  background: #e2e8f0;
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
  
  .controls-bar {
    flex-direction: column;
    align-items: stretch;
  }
  
  .search-box {
    max-width: none;
  }
  
  .words-grid {
    grid-template-columns: 1fr;
  }
  
  .progress-stats {
    flex-direction: column;
    gap: 1rem;
  }
}
</style>
