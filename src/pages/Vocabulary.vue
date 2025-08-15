<template>
  <DefaultLayout>
    <!-- Hero Section -->
    <section class="hero-section">
      <div class="container">
        <div class="hero-content">
          <h1 class="hero-title">Vocabulary Builder</h1>
          <p class="hero-description">
            Expand your English vocabulary with thematic word groups, interactive flashcards, 
            and contextual learning. Master new words through practice and repetition.
          </p>
          <div class="hero-stats">
            <div class="stat-item">
              <span class="stat-number">{{ vocabularyWords.length }}</span>
              <span class="stat-label">Words Available</span>
            </div>
            <div class="stat-item">
              <span class="stat-number">{{ vocabularyCategories.length }}</span>
              <span class="stat-label">Categories</span>
            </div>
            <div class="stat-item">
              <span class="stat-number">{{ vocabularyCategories.length }}</span>
              <span class="stat-label">Total Categories</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Categories Section -->
    <section class="categories-section">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">Vocabulary Categories</h2>
          <p class="section-subtitle">Choose a category to start learning new words</p>
        </div>

        <div class="categories-grid">
          <div 
            class="category-card" 
            v-for="category in vocabularyCategories" 
            :key="category.id"
            @click="selectCategory(category)"
          >
            <div class="category-icon">
              <i class="fas fa-book"></i>
            </div>
            <h3 class="category-title">{{ category.title }}</h3>
            <p class="category-description">Vocabulary words in this category</p>
            <div class="category-stats">
              <span class="word-count">{{ category.id }} words</span>
              <span class="difficulty">Category</span>
            </div>
            <div class="category-progress">
              <div class="progress-bar">
                <div 
                  class="progress-fill" 
                  :style="{ width: getCategoryProgress(category.id) + '%' }"
                ></div>
              </div>
              <span class="progress-text">{{ getCategoryProgress(category.id) }}% Complete</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Word Sets Section -->
    <section class="sets-section">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">
            {{ selectedCategory ? `${selectedCategory.title} Words` : 'All Words' }}
          </h2>
          <p class="section-subtitle">
            {{ selectedCategory ? `Vocabulary words in ${selectedCategory.title}` : 'Browse all available vocabulary words' }}
          </p>
        </div>

        <div class="sets-grid">
          <div 
            class="set-card" 
            v-for="word in vocabularyWords" 
            :key="word.id"
          >
            <div class="set-header">
              <div class="set-icon">
                <i class="fas fa-language"></i>
              </div>
              <div class="set-badge">
                {{ word.levels }}
              </div>
            </div>
            
            <h3 class="set-title">{{ word.word }}</h3>
            <p class="set-description">{{ word.translation }}</p>
            
            <div class="set-meta">
              <span class="set-words">
                <i class="fas fa-book"></i>
                {{ word.definition }}
              </span>
              <span class="set-exercises">
                <i class="fas fa-star"></i>
                Score: {{ word.score }}
              </span>
            </div>

            <div class="set-preview">
              <div class="preview-words">
                <span class="preview-word">
                  {{ word.example }}
                </span>
              </div>
            </div>

            <div class="set-actions">
              <button 
                class="btn btn-primary set-btn"
                @click="playAudio(word.audioUrl)"
              >
                <i class="fas fa-volume-up"></i>
                Listen
              </button>
            </div>
          </div>
        </div>

        <!-- No Sets Message -->
        <div v-if="filteredSets.length === 0" class="no-sets">
          <div class="no-sets-icon">
            <i class="fas fa-book-open"></i>
          </div>
          <h3>No Word Sets Available</h3>
          <p>Word sets for this category will be available soon.</p>
        </div>
      </div>
    </section>

    <!-- Flashcard Practice Section -->
    <section class="flashcard-section">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">Flashcard Practice</h2>
          <p class="section-subtitle">Review words you've learned with interactive flashcards</p>
        </div>

        <div class="flashcard-grid">
          <div 
            class="flashcard-card" 
            v-for="practice in flashcardPractices" 
            :key="practice.id"
            @click="startFlashcardPractice(practice.id)"
          >
            <div class="flashcard-icon">
              <i :class="practice.icon"></i>
            </div>
            <h3 class="flashcard-title">{{ practice.title }}</h3>
            <p class="flashcard-description">{{ practice.description }}</p>
            <div class="flashcard-meta">
              <span class="flashcard-words">{{ practice.wordCount }} words</span>
              <span class="flashcard-time">{{ practice.time }} min</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Daily Challenge Section -->
    <section class="challenge-section">
      <div class="container">
        <div class="challenge-card">
          <div class="challenge-content">
            <div class="challenge-icon">
              <i class="fas fa-trophy"></i>
            </div>
            <h3 class="challenge-title">Daily Vocabulary Challenge</h3>
            <p class="challenge-description">
              Test your vocabulary knowledge with our daily challenge. 
              Learn new words and compete with other learners!
            </p>
            <div class="challenge-stats">
              <div class="challenge-stat">
                <span class="stat-number">5</span>
                <span class="stat-label">Questions</span>
              </div>
              <div class="challenge-stat">
                <span class="stat-number">10</span>
                <span class="stat-label">Points</span>
              </div>
              <div class="challenge-stat">
                <span class="stat-number">5 min</span>
                <span class="stat-label">Time</span>
              </div>
            </div>
            <button class="btn btn-primary challenge-btn" @click="startDailyChallenge">
              <i class="fas fa-play"></i>
              Start Challenge
            </button>
          </div>
        </div>
      </div>
    </section>
  </DefaultLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/userStore.js'
import { vocabularyAPI } from '@/services/api.js'
import DefaultLayout from '@/components/DefaultLayout.vue'

const router = useRouter()
const userStore = useUserStore()

const selectedCategory = ref(null)
const vocabularyCategories = ref([])
const vocabularyWords = ref([])
const isLoading = ref(false)

// Load data from API
const loadVocabularyData = async () => {
  try {
    isLoading.value = true
    
    // Load vocabulary categories
    const categoriesResponse = await vocabularyAPI.getCategories()
    vocabularyCategories.value = categoriesResponse.data
  } catch (error) {
    console.error('Failed to load vocabulary data:', error)
  } finally {
    isLoading.value = false
  }
}

const loadWordsByCategory = async (groupId) => {
  try {
    const response = await vocabularyAPI.getWords(groupId)
    vocabularyWords.value = response.data
  } catch (error) {
    console.error('Failed to load vocabulary words:', error)
  }
}

onMounted(() => {
  loadVocabularyData()
})

const vocabularySets = ref([
  // Basic Vocabulary Sets
  {
    id: 1,
    category: 'basic',
    title: 'Greetings & Introductions',
    description: 'Learn how to greet people and introduce yourself',
    icon: 'fas fa-handshake',
    level: 'Beginner',
    wordCount: 25,
    exercises: 4,
    unlocked: true,
    previewWords: ['Hello', 'Goodbye', 'Thank you', 'Please']
  },
  {
    id: 2,
    category: 'basic',
    title: 'Numbers & Colors',
    description: 'Master numbers, colors, and basic counting',
    icon: 'fas fa-palette',
    level: 'Beginner',
    wordCount: 30,
    exercises: 5,
    unlocked: true,
    previewWords: ['One', 'Red', 'Blue', 'Green']
  },
  {
    id: 3,
    category: 'basic',
    title: 'Days & Months',
    description: 'Learn the days of the week and months of the year',
    icon: 'fas fa-calendar',
    level: 'Beginner',
    wordCount: 19,
    exercises: 3,
    unlocked: true,
    previewWords: ['Monday', 'January', 'February', 'March']
  },
  // Family & Relationships Sets
  {
    id: 4,
    category: 'family',
    title: 'Family Members',
    description: 'Learn words for different family members',
    icon: 'fas fa-user-friends',
    level: 'Beginner',
    wordCount: 20,
    exercises: 4,
    unlocked: true,
    previewWords: ['Mother', 'Father', 'Sister', 'Brother']
  },
  {
    id: 5,
    category: 'family',
    title: 'Relationships',
    description: 'Vocabulary for different types of relationships',
    icon: 'fas fa-heart',
    level: 'Beginner',
    wordCount: 15,
    exercises: 3,
    unlocked: true,
    previewWords: ['Friend', 'Partner', 'Colleague', 'Neighbor']
  },
  // Food & Dining Sets
  {
    id: 6,
    category: 'food',
    title: 'Common Foods',
    description: 'Learn names of common foods and ingredients',
    icon: 'fas fa-apple-alt',
    level: 'Intermediate',
    wordCount: 40,
    exercises: 6,
    unlocked: true,
    previewWords: ['Bread', 'Milk', 'Chicken', 'Rice']
  },
  {
    id: 7,
    category: 'food',
    title: 'Restaurant Vocabulary',
    description: 'Words for dining out and ordering food',
    icon: 'fas fa-utensils',
    level: 'Intermediate',
    wordCount: 35,
    exercises: 5,
    unlocked: false,
    previewWords: ['Menu', 'Waiter', 'Bill', 'Reservation']
  },
  // Business & Work Sets
  {
    id: 8,
    category: 'business',
    title: 'Office Vocabulary',
    description: 'Common words used in office environments',
    icon: 'fas fa-building',
    level: 'Intermediate',
    wordCount: 50,
    exercises: 8,
    unlocked: false,
    previewWords: ['Meeting', 'Deadline', 'Project', 'Report']
  },
  {
    id: 9,
    category: 'business',
    title: 'Business Communication',
    description: 'Professional communication vocabulary',
    icon: 'fas fa-comments',
    level: 'Intermediate',
    wordCount: 45,
    exercises: 7,
    unlocked: false,
    previewWords: ['Presentation', 'Negotiation', 'Agreement', 'Contract']
  },
  // Travel & Tourism Sets
  {
    id: 10,
    category: 'travel',
    title: 'Transportation',
    description: 'Words for different modes of transportation',
    icon: 'fas fa-car',
    level: 'Intermediate',
    wordCount: 30,
    exercises: 5,
    unlocked: false,
    previewWords: ['Airport', 'Train', 'Bus', 'Taxi']
  },
  {
    id: 11,
    category: 'travel',
    title: 'Accommodation',
    description: 'Vocabulary for hotels and accommodation',
    icon: 'fas fa-bed',
    level: 'Intermediate',
    wordCount: 25,
    exercises: 4,
    unlocked: false,
    previewWords: ['Hotel', 'Room', 'Reservation', 'Check-in']
  },
  // Academic Vocabulary Sets
  {
    id: 12,
    category: 'academic',
    title: 'Academic Writing',
    description: 'Words commonly used in academic writing',
    icon: 'fas fa-pen-fancy',
    level: 'Advanced',
    wordCount: 60,
    exercises: 10,
    unlocked: false,
    previewWords: ['Furthermore', 'Nevertheless', 'Consequently', 'Moreover']
  }
])

const flashcardPractices = ref([
  {
    id: 1,
    title: 'Basic Words Review',
    description: 'Review basic vocabulary words you\'ve learned',
    icon: 'fas fa-book',
    wordCount: 50,
    time: 10
  },
  {
    id: 2,
    title: 'Family Words Practice',
    description: 'Practice family and relationship vocabulary',
    icon: 'fas fa-users',
    wordCount: 35,
    time: 8
  },
  {
    id: 3,
    title: 'Food Vocabulary',
    description: 'Review food and dining vocabulary',
    icon: 'fas fa-utensils',
    wordCount: 75,
    time: 12
  }
])

const getCategoryProgress = (categoryId) => {
  // For now, return 0 as we don't have progress tracking implemented
  return 0
}

const selectCategory = async (category) => {
  selectedCategory.value = category
  await loadWordsByCategory(category.id)
}

const playAudio = (audioUrl) => {
  if (audioUrl) {
    const audio = new Audio(audioUrl)
    audio.play().catch(error => {
      console.error('Failed to play audio:', error)
    })
  }
}

const startFlashcardPractice = (practiceId) => {
  router.push(`/vocabulary/flashcards/${practiceId}`)
}

const startDailyChallenge = () => {
  router.push('/vocabulary/daily-challenge')
}
</script>

<style scoped>
/* Hero Section */
.hero-section {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 4rem 0;
}

.hero-content {
  text-align: center;
  max-width: 800px;
  margin: 0 auto;
}

.hero-title {
  font-size: 3rem;
  font-weight: 800;
  margin-bottom: 1rem;
}

.hero-description {
  font-size: 1.2rem;
  opacity: 0.9;
  margin-bottom: 2rem;
  line-height: 1.6;
}

.hero-stats {
  display: flex;
  justify-content: center;
  gap: 3rem;
  flex-wrap: wrap;
}

.stat-item {
  text-align: center;
}

.stat-number {
  display: block;
  font-size: 2.5rem;
  font-weight: 800;
  margin-bottom: 0.5rem;
}

.stat-label {
  font-size: 0.875rem;
  opacity: 0.8;
}

/* Categories Section */
.categories-section {
  padding: 4rem 0;
  background: white;
}

.section-header {
  text-align: center;
  margin-bottom: 3rem;
}

.section-title {
  font-size: 2.5rem;
  font-weight: 800;
  color: #1e293b;
  margin-bottom: 1rem;
}

.section-subtitle {
  font-size: 1.1rem;
  color: #64748b;
}

.categories-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
}

.category-card {
  background: white;
  border: 2px solid #e5e7eb;
  border-radius: 20px;
  padding: 2rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.category-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  border-color: #667eea;
}

.category-icon {
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-radius: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
}

.category-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 0.75rem;
}

.category-description {
  color: #64748b;
  margin-bottom: 1rem;
  line-height: 1.6;
}

.category-stats {
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
}

.word-count,
.difficulty {
  font-size: 0.875rem;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-weight: 600;
}

.word-count {
  background: #dbeafe;
  color: #1e40af;
}

.difficulty {
  background: #fef3c7;
  color: #92400e;
}

.category-progress {
  margin-top: 1rem;
}

.progress-text {
  font-size: 0.875rem;
  color: #64748b;
  margin-top: 0.5rem;
  display: block;
}

/* Sets Section */
.sets-section {
  padding: 4rem 0;
  background: #f8fafc;
}

.sets-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
}

.set-card {
  background: white;
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  cursor: pointer;
  border: 1px solid #e2e8f0;
}

.set-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15);
}

.set-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.set-icon {
  width: 50px;
  height: 50px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.2rem;
}

.set-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
}

.set-badge.Beginner {
  background: #d1fae5;
  color: #065f46;
}

.set-badge.Intermediate {
  background: #fef3c7;
  color: #92400e;
}

.set-badge.Advanced {
  background: #fee2e2;
  color: #991b1b;
}

.set-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 0.75rem;
}

.set-description {
  color: #64748b;
  margin-bottom: 1rem;
  line-height: 1.6;
}

.set-meta {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}

.set-words,
.set-exercises {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: #64748b;
}

.set-preview {
  margin-bottom: 1rem;
}

.preview-words {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.preview-word {
  background: #f1f5f9;
  color: #475569;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 500;
}

.more-words {
  color: #64748b;
  font-size: 0.875rem;
  font-style: italic;
}

.set-progress {
  margin-bottom: 1rem;
}

.set-actions {
  display: flex;
  justify-content: center;
}

.set-btn {
  width: 100%;
  padding: 0.75rem 1.5rem;
  font-size: 0.875rem;
}

/* No Sets Message */
.no-sets {
  text-align: center;
  padding: 4rem 2rem;
  color: #64748b;
}

.no-sets-icon {
  font-size: 4rem;
  color: #cbd5e1;
  margin-bottom: 1rem;
}

.no-sets h3 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #374151;
  margin-bottom: 0.5rem;
}

/* Flashcard Section */
.flashcard-section {
  padding: 4rem 0;
  background: white;
}

.flashcard-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.flashcard-card {
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  border-radius: 20px;
  padding: 2rem;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.flashcard-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.1);
}

.flashcard-icon {
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-radius: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
}

.flashcard-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 0.75rem;
}

.flashcard-description {
  color: #64748b;
  margin-bottom: 1rem;
  line-height: 1.6;
}

.flashcard-meta {
  display: flex;
  justify-content: space-between;
}

.flashcard-words,
.flashcard-time {
  font-size: 0.875rem;
  color: #64748b;
}

/* Challenge Section */
.challenge-section {
  padding: 4rem 0;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
}

.challenge-card {
  background: white;
  border-radius: 24px;
  padding: 3rem;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  text-align: center;
  max-width: 600px;
  margin: 0 auto;
}

.challenge-content {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.challenge-icon {
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #fbbf24, #f59e0b);
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 2rem;
  margin-bottom: 1.5rem;
}

.challenge-title {
  font-size: 1.75rem;
  font-weight: 800;
  color: #1e293b;
  margin-bottom: 1rem;
}

.challenge-description {
  color: #64748b;
  margin-bottom: 2rem;
  line-height: 1.6;
}

.challenge-stats {
  display: flex;
  justify-content: center;
  gap: 2rem;
  margin-bottom: 2rem;
}

.challenge-stat {
  text-align: center;
}

.challenge-stat .stat-number {
  display: block;
  font-size: 1.5rem;
  font-weight: 800;
  color: #667eea;
  margin-bottom: 0.25rem;
}

.challenge-stat .stat-label {
  font-size: 0.875rem;
  color: #64748b;
}

.challenge-btn {
  padding: 1rem 2rem;
  font-size: 1.1rem;
}

/* Responsive Design */
@media (max-width: 768px) {
  .hero-title {
    font-size: 2.5rem;
  }
  
  .hero-stats {
    gap: 2rem;
  }
  
  .section-title {
    font-size: 2rem;
  }
  
  .categories-grid,
  .sets-grid,
  .flashcard-grid {
    grid-template-columns: 1fr;
  }
  
  .set-meta {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .challenge-stats {
    flex-direction: column;
    gap: 1rem;
  }
}

@media (max-width: 480px) {
  .hero-title {
    font-size: 2rem;
  }
  
  .hero-stats {
    flex-direction: column;
    gap: 1rem;
  }
  
  .section-title {
    font-size: 1.75rem;
  }
  
  .category-card,
  .set-card,
  .flashcard-card {
    padding: 1.5rem;
  }
  
  .challenge-card {
    padding: 2rem;
  }
}
</style>
