<template>
  <DefaultLayout>
    <!-- Hero Section -->
    <section class="hero-section">
      <div class="container">
        <div class="hero-content">
          <h1 class="hero-title">Grammar Lessons</h1>
          <p class="hero-description">
            Master English grammar with interactive lessons, practice exercises, and real-world examples.
            Track your progress and unlock new lessons as you improve.
          </p>
          <div class="hero-stats">
            <div class="stat-item">
              <span class="stat-number">{{ completedLessons.length }}</span>
              <span class="stat-label">Lessons Completed</span>
            </div>
            <div class="stat-item">
              <span class="stat-number">{{ totalScore }}</span>
              <span class="stat-label">Total Score</span>
            </div>
            <div class="stat-item">
              <span class="stat-number">{{ grammarLessons.length }}</span>
              <span class="stat-label">Total Lessons</span>
            </div>
          </div>
        </div>
      </div>
    </section>
    <!-- Lessons Section -->
    <section class="lessons-section">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">
            {{ selectedCategory ? `${selectedCategory} Lessons` : 'All Lessons' }}
          </h2>
          <p class="section-subtitle">
            {{ selectedCategory ? `Grammar lessons for ${selectedCategory.toLowerCase()} level` : 'Browse all available grammar lessons' }}
          </p>
        </div>

        <div class="lessons-grid">
          <div 
            class="lesson-card" 
            v-for="lesson in filteredLessons" 
            :key="lesson.id"
            @click="goToLesson(lesson.id)"
          >
            <div class="lesson-header">
              <div class="lesson-icon">
                <i class="fas fa-book-open"></i>
              </div>
              <div class="lesson-badge" :class="lesson.levels?.level">
                {{ lesson.levels?.level }}
              </div>
            </div>
            
            <h3 class="lesson-title">{{ lesson.title }}</h3>
            <p class="lesson-description">{{ lesson.description }}</p>
            
            <!-- Video URL Display -->
            <div class="lesson-video" v-if="lesson.videoUrl">
              <div class="video-info">
                <i class="fas fa-video"></i>
                <span class="video-text">Video Available</span>
              </div>
              <a 
                :href="lesson.videoUrl" 
                target="_blank" 
                class="video-link"
                @click.stop
              >
                <i class="fas fa-external-link-alt"></i>
                Watch Video
              </a>
            </div>
            
            <div class="lesson-meta">
              <span class="lesson-score" v-if="lesson.score">
                <i class="fas fa-star"></i>
                Score: {{ lesson.score }}
              </span>
              <span class="lesson-status" v-if="lesson.ended">
                <i class="fas fa-check-circle"></i>
                Completed
              </span>
            </div>

            <div class="lesson-progress" v-if="isLessonCompleted(lesson.id)">
              <div class="progress-bar">
                <div class="progress-fill" style="width: 100%"></div>
              </div>
              <span class="progress-text">Completed</span>
            </div>

            <div class="lesson-actions">
              <button 
                class="btn btn-primary lesson-btn"
                :disabled="!isLessonUnlocked(lesson.id)"
              >
                <i class="fas fa-play"></i>
                {{ isLessonCompleted(lesson.id) ? 'Review' : 'Start Lesson' }}
              </button>
            </div>
          </div>
        </div>

        <!-- No Lessons Message -->
        <div v-if="filteredLessons.length === 0" class="no-lessons">
          <div class="no-lessons-icon">
            <i class="fas fa-book-open"></i>
          </div>
          <h3>No Lessons Available</h3>
          <p>Lessons for this category will be available soon.</p>
        </div>
      </div>
    </section>

  </DefaultLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/userStore.js'
import { useGrammar } from '@/composables/useGrammar.js'
import DefaultLayout from '@/components/DefaultLayout.vue'
import ApiDebugger from '@/components/ApiDebugger.vue'

const router = useRouter()
const userStore = useUserStore()

const selectedCategory = ref(null)

// Use the grammar composable
const {
  grammarLevels,
  grammarLessons,
  myLessons,
  isLoading,
  error,
  completedLessons,
  totalScore,
  lessonsByLevel,
  progressByLevel,
  loadAllData,
  isLessonCompleted,
  getLevelProgress,
  getLessonsForLevel
} = useGrammar()

const grammarCategories = ref([
  {
    id: 'basics',
    title: 'Basic Grammar',
    description: 'Essential grammar rules and sentence structure',
    icon: 'fas fa-seedling',
    lessonCount: 8,
    difficulty: 'Beginner'
  },
  {
    id: 'tenses',
    title: 'Verb Tenses',
    description: 'Master present, past, and future tenses',
    icon: 'fas fa-clock',
    lessonCount: 12,
    difficulty: 'Intermediate'
  },
  {
    id: 'parts',
    title: 'Parts of Speech',
    description: 'Learn nouns, verbs, adjectives, and more',
    icon: 'fas fa-tags',
    lessonCount: 10,
    difficulty: 'Beginner'
  },
  {
    id: 'advanced',
    title: 'Advanced Grammar',
    description: 'Complex grammar concepts and structures',
    icon: 'fas fa-crown',
    lessonCount: 15,
    difficulty: 'Advanced'
  }
])

onMounted(() => {
  loadAllData()
})

const quickPractices = ref([
  {
    id: 1,
    title: 'Basic Grammar Quiz',
    description: 'Test your knowledge of basic grammar rules',
    icon: 'fas fa-question-circle',
    questions: 10,
    time: 5
  },
  {
    id: 2,
    title: 'Tense Practice',
    description: 'Practice using different verb tenses',
    icon: 'fas fa-clock',
    questions: 15,
    time: 8
  },
  {
    id: 3,
    title: 'Parts of Speech',
    description: 'Identify different parts of speech',
    icon: 'fas fa-tags',
    questions: 12,
    time: 6
  }
])

const filteredLessons = computed(() => {
  console.log('Filtering lessons. Selected category:', selectedCategory.value)
  console.log('Available lessons:', grammarLessons.value)
  
  if (selectedCategory.value) {
    const filtered = grammarLessons.value.filter(lesson => lesson.levels?.level === selectedCategory.value)
    console.log('Filtered lessons:', filtered)
    return filtered
  }
  return grammarLessons.value
})

const isLessonUnlocked = (lessonId) => {
  // For now, all lessons are unlocked. You can implement logic based on user progress
  return true
}

const selectCategory = (level) => {
  console.log('Selecting category:', level)
  selectedCategory.value = level
}

const goToLesson = (lessonId) => {
  if (isLessonUnlocked(lessonId)) {
    router.push(`/lesson/${lessonId}`)
  } else {
    alert('This lesson is not yet unlocked. Complete previous lessons first.')
  }
}

const startQuickPractice = (practiceId) => {
  router.push(`/practice/quick-${practiceId}`)
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

.lesson-count,
.difficulty {
  font-size: 0.875rem;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-weight: 600;
}

.lesson-count {
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

/* Lessons Section */
.lessons-section {
  padding: 4rem 0;
  background: #f8fafc;
}

.lessons-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
}

.lesson-card {
  background: white;
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  cursor: pointer;
  border: 1px solid #e2e8f0;
}

.lesson-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15);
}

.lesson-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.lesson-icon {
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

.lesson-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
}

.lesson-badge.Beginner {
  background: #d1fae5;
  color: #065f46;
}

.lesson-badge.Intermediate {
  background: #fef3c7;
  color: #92400e;
}

.lesson-badge.Advanced {
  background: #fee2e2;
  color: #991b1b;
}

.lesson-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 0.75rem;
}

.lesson-description {
  color: #64748b;
  margin-bottom: 1rem;
  line-height: 1.6;
}

.lesson-video {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #f8fafc;
  border-radius: 12px;
  padding: 0.75rem 1rem;
  margin-bottom: 1rem;
  border: 1px solid #e2e8f0;
}

.video-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #64748b;
  font-size: 0.875rem;
}

.video-info i {
  color: #667eea;
}

.video-link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #667eea;
  text-decoration: none;
  font-size: 0.875rem;
  font-weight: 600;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  background: rgba(102, 126, 234, 0.1);
  transition: all 0.2s ease;
}

.video-link:hover {
  background: rgba(102, 126, 234, 0.2);
  color: #5a67d8;
}

.lesson-meta {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}

.lesson-duration,
.lesson-exercises {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: #64748b;
}

.lesson-progress {
  margin-bottom: 1rem;
}

.lesson-actions {
  display: flex;
  justify-content: center;
}

.lesson-btn {
  width: 100%;
  padding: 0.75rem 1.5rem;
  font-size: 0.875rem;
}

/* No Lessons Message */
.no-lessons {
  text-align: center;
  padding: 4rem 2rem;
  color: #64748b;
}

.no-lessons-icon {
  font-size: 4rem;
  color: #cbd5e1;
  margin-bottom: 1rem;
}

.no-lessons h3 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #374151;
  margin-bottom: 0.5rem;
}

/* Practice Section */
.practice-section {
  padding: 4rem 0;
  background: white;
}

.practice-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.practice-card {
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  border-radius: 20px;
  padding: 2rem;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.practice-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.1);
}

.practice-icon {
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

.practice-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 0.75rem;
}

.practice-description {
  color: #64748b;
  margin-bottom: 1rem;
  line-height: 1.6;
}

.practice-meta {
  display: flex;
  justify-content: space-between;
}

.practice-questions,
.practice-time {
  font-size: 0.875rem;
  color: #64748b;
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
  .lessons-grid,
  .practice-grid {
    grid-template-columns: 1fr;
  }
  
  .lesson-meta {
    flex-direction: column;
    gap: 0.5rem;
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
  .lesson-card,
  .practice-card {
    padding: 1.5rem;
  }
}
</style>
