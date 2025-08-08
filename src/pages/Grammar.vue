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
              <span class="stat-number">{{ userStore.progress.grammar.completed_lessons.length }}</span>
              <span class="stat-label">Lessons Completed</span>
            </div>
            <div class="stat-item">
              <span class="stat-number">{{ userStore.progress.grammar.total_score }}</span>
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

    <!-- Categories Section -->
    <section class="categories-section">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">Grammar Categories</h2>
          <p class="section-subtitle">Choose a category to start learning</p>
        </div>

        <div class="categories-grid">
          <div 
            class="category-card" 
            v-for="category in grammarCategories" 
            :key="category.id"
            @click="selectCategory(category.id)"
          >
            <div class="category-icon">
              <i :class="category.icon"></i>
            </div>
            <h3 class="category-title">{{ category.title }}</h3>
            <p class="category-description">{{ category.description }}</p>
            <div class="category-stats">
              <span class="lesson-count">{{ category.lessonCount }} lessons</span>
              <span class="difficulty">{{ category.difficulty }}</span>
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

    <!-- Lessons Section -->
    <section class="lessons-section">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">
            {{ selectedCategory ? `${selectedCategory.title} Lessons` : 'All Lessons' }}
          </h2>
          <p class="section-subtitle">
            {{ selectedCategory ? selectedCategory.description : 'Browse all available grammar lessons' }}
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
                <i :class="lesson.icon"></i>
              </div>
              <div class="lesson-badge" :class="lesson.level">
                {{ lesson.level }}
              </div>
            </div>
            
            <h3 class="lesson-title">{{ lesson.title }}</h3>
            <p class="lesson-description">{{ lesson.description }}</p>
            
            <div class="lesson-meta">
              <span class="lesson-duration">
                <i class="fas fa-clock"></i>
                {{ lesson.duration }}
              </span>
              <span class="lesson-exercises">
                <i class="fas fa-tasks"></i>
                {{ lesson.exercises }} exercises
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

    <!-- Quick Practice Section -->
    <section class="practice-section">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">Quick Practice</h2>
          <p class="section-subtitle">Test your knowledge with these quick exercises</p>
        </div>

        <div class="practice-grid">
          <div 
            class="practice-card" 
            v-for="practice in quickPractices" 
            :key="practice.id"
            @click="startQuickPractice(practice.id)"
          >
            <div class="practice-icon">
              <i :class="practice.icon"></i>
            </div>
            <h3 class="practice-title">{{ practice.title }}</h3>
            <p class="practice-description">{{ practice.description }}</p>
            <div class="practice-meta">
              <span class="practice-questions">{{ practice.questions }} questions</span>
              <span class="practice-time">{{ practice.time }} min</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  </DefaultLayout>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/userStore.js'
import DefaultLayout from '@/components/DefaultLayout.vue'

const router = useRouter()
const userStore = useUserStore()

const selectedCategory = ref(null)

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

const grammarLessons = ref([
  // Basic Grammar Lessons
  {
    id: 1,
    category: 'basics',
    title: 'Sentence Structure',
    description: 'Learn the basic structure of English sentences',
    icon: 'fas fa-align-left',
    level: 'Beginner',
    duration: '20 min',
    exercises: 5,
    unlocked: true
  },
  {
    id: 2,
    category: 'basics',
    title: 'Subject-Verb Agreement',
    description: 'Master the rules of subject-verb agreement',
    icon: 'fas fa-handshake',
    level: 'Beginner',
    duration: '25 min',
    exercises: 6,
    unlocked: true
  },
  {
    id: 3,
    category: 'basics',
    title: 'Articles (A, An, The)',
    description: 'Learn when and how to use articles correctly',
    icon: 'fas fa-quote-left',
    level: 'Beginner',
    duration: '30 min',
    exercises: 8,
    unlocked: true
  },
  {
    id: 4,
    category: 'basics',
    title: 'Plural Forms',
    description: 'Understand how to form plural nouns',
    icon: 'fas fa-copy',
    level: 'Beginner',
    duration: '20 min',
    exercises: 4,
    unlocked: true
  },
  // Verb Tenses Lessons
  {
    id: 5,
    category: 'tenses',
    title: 'Present Simple',
    description: 'Learn to use the present simple tense',
    icon: 'fas fa-calendar-day',
    level: 'Intermediate',
    duration: '35 min',
    exercises: 10,
    unlocked: true
  },
  {
    id: 6,
    category: 'tenses',
    title: 'Present Continuous',
    description: 'Master the present continuous tense',
    icon: 'fas fa-spinner',
    level: 'Intermediate',
    duration: '30 min',
    exercises: 8,
    unlocked: true
  },
  {
    id: 7,
    category: 'tenses',
    title: 'Past Simple',
    description: 'Learn to use the past simple tense',
    icon: 'fas fa-history',
    level: 'Intermediate',
    duration: '35 min',
    exercises: 10,
    unlocked: false
  },
  {
    id: 8,
    category: 'tenses',
    title: 'Future Tenses',
    description: 'Master different ways to express the future',
    icon: 'fas fa-rocket',
    level: 'Intermediate',
    duration: '40 min',
    exercises: 12,
    unlocked: false
  },
  // Parts of Speech Lessons
  {
    id: 9,
    category: 'parts',
    title: 'Nouns and Pronouns',
    description: 'Learn about different types of nouns and pronouns',
    icon: 'fas fa-user',
    level: 'Beginner',
    duration: '25 min',
    exercises: 6,
    unlocked: true
  },
  {
    id: 10,
    category: 'parts',
    title: 'Verbs and Adverbs',
    description: 'Master verbs and their modifying adverbs',
    icon: 'fas fa-running',
    level: 'Beginner',
    duration: '30 min',
    exercises: 8,
    unlocked: true
  },
  // Advanced Grammar Lessons
  {
    id: 11,
    category: 'advanced',
    title: 'Conditional Sentences',
    description: 'Learn to use conditional sentences correctly',
    icon: 'fas fa-code-branch',
    level: 'Advanced',
    duration: '45 min',
    exercises: 15,
    unlocked: false
  },
  {
    id: 12,
    category: 'advanced',
    title: 'Passive Voice',
    description: 'Master the passive voice construction',
    icon: 'fas fa-exchange-alt',
    level: 'Advanced',
    duration: '40 min',
    exercises: 12,
    unlocked: false
  }
])

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
  if (selectedCategory.value) {
    return grammarLessons.value.filter(lesson => lesson.category === selectedCategory.value.id)
  }
  return grammarLessons.value
})

const getCategoryProgress = (categoryId) => {
  const categoryLessons = grammarLessons.value.filter(lesson => lesson.category === categoryId)
  const completedLessons = categoryLessons.filter(lesson => 
    userStore.progress.grammar.completed_lessons.includes(lesson.id)
  )
  return categoryLessons.length > 0 ? Math.round((completedLessons.length / categoryLessons.length) * 100) : 0
}

const isLessonCompleted = (lessonId) => {
  return userStore.progress.grammar.completed_lessons.includes(lessonId)
}

const isLessonUnlocked = (lessonId) => {
  const lesson = grammarLessons.value.find(l => l.id === lessonId)
  return lesson ? lesson.unlocked : false
}

const selectCategory = (categoryId) => {
  selectedCategory.value = grammarCategories.value.find(cat => cat.id === categoryId)
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
