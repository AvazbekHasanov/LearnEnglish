<template>
<!--  <DefaultLayout>-->
    <!-- Hero Section -->
    <section class="hero">
      <div class="hero-background">
        <div class="floating-element" style="top: 15%; left: 10%;"></div>
        <div class="floating-element" style="top: 60%; right: 15%; animation-delay: -2s;"></div>
        <div class="floating-element" style="top: 80%; left: 20%; animation-delay: -4s;"></div>
      </div>
      
      <div class="hero-content">
        <div class="hero-text">
          <h1 class="hero-title">
            {{ $t('home_page.hero_title') }}
            <span class="gradient-text">{{ $t('home_page.hero_online') }}</span>
            {{ $t('home_page.hero_subtitle') }}
          </h1>
          <p class="hero-description">
            {{ $t('home_page.hero_description') }}
          </p>
          <div class="hero-buttons">
            <router-link to="/grammar" class="btn btn-primary hero-btn">
              {{ $t('home_page.start_learning') }}
              <i class="fas fa-arrow-right"></i>
            </router-link>
            <button class="btn btn-secondary hero-btn" @click="watchDemo">
              <i class="fas fa-play-circle"></i>
              {{ $t('home_page.watch_demo') }}
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- Stats Section -->
    <section class="stats-section">
      <div class="container">
        <div class="stats-grid">
          <div class="stat-card" v-for="(stat, index) in stats" :key="index">
            <div class="stat-icon">
              <i :class="stat.icon"></i>
            </div>
            <div class="stat-number">{{ stat.number }}</div>
            <div class="stat-label">{{ stat.label }}</div>
          </div>
        </div>
      </div>
    </section>

    <!-- Featured Lessons Section -->
    <section class="featured-section">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">{{ $t('home_page.featured_lessons') }}</h2>
          <p class="section-subtitle">
            {{ $t('home_page.featured_subtitle') }}
          </p>
        </div>
        
        <div class="lessons-grid">
          <div 
            class="lesson-card" 
            v-for="lesson in featuredLessons" 
            :key="lesson.id"
            @click="goToLesson(lesson.id)"
          >
            <div class="lesson-icon">
              <i :class="lesson.icon"></i>
            </div>
            <h3 class="lesson-title">{{ lesson.title }}</h3>
            <p class="lesson-description">{{ lesson.description }}</p>
            <div class="lesson-meta">
              <span class="lesson-level">{{ lesson.level }}</span>
              <span class="lesson-duration">{{ lesson.duration }}</span>
            </div>
            <div class="lesson-progress" v-if="lesson.progress">
              <div class="progress-bar">
                <div class="progress-fill" :style="{ width: lesson.progress + '%' }"></div>
              </div>
              <span class="progress-text">{{ lesson.progress }}% {{ $t('home_page.lesson.complete') }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Learning Paths Section -->
    <section class="paths-section">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">{{ $t('home_page.learning_paths') }}</h2>
          <p class="section-subtitle">
            {{ $t('home_page.learning_paths_subtitle') }}
          </p>
        </div>
        
        <div class="paths-grid">
          <div 
            class="path-card" 
            v-for="path in learningPaths" 
            :key="path.id"
            @click="selectPath(path.id)"
          >
            <div class="path-header">
              <div class="path-icon">
                <i :class="path.icon"></i>
              </div>
              <div class="path-badge">{{ path.level }}</div>
            </div>
            <h3 class="path-title">{{ path.title }}</h3>
            <p class="path-description">{{ path.description }}</p>
            <ul class="path-features">
              <li v-for="feature in path.features" :key="feature">
                <i class="fas fa-check"></i>
                {{ feature }}
              </li>
            </ul>
            <div class="path-stats">
              <div class="path-stat">
                <span class="stat-number">{{ path.lessons }}</span>
                <span class="stat-label">{{ $t('home_page.path.lessons') }}</span>
              </div>
              <div class="path-stat">
                <span class="stat-number">{{ path.hours }}</span>
                <span class="stat-label">{{ $t('home_page.path.hours') }}</span>
              </div>
              <div class="path-stat">
                <span class="stat-number">{{ path.exercises }}</span>
                <span class="stat-label">{{ $t('home_page.path.exercises') }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Testimonials Section -->
    <section class="testimonials-section">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">{{ $t('home_page.testimonials') }}</h2>
          <p class="section-subtitle">
            {{ $t('home_page.testimonials_subtitle') }}
          </p>
        </div>
        
        <div class="testimonials-grid">
          <div 
            class="testimonial-card" 
            v-for="testimonial in testimonials" 
            :key="testimonial.id"
          >
            <div class="testimonial-stars">
              <i v-for="star in 5" :key="star" class="fas fa-star"></i>
            </div>
            <p class="testimonial-text">"{{ testimonial.text }}"</p>
            <div class="testimonial-author">
              <div class="author-avatar">
                {{ testimonial.name.charAt(0) }}
              </div>
              <div class="author-info">
                <div class="author-name">{{ testimonial.name }}</div>
                <div class="author-level">{{ testimonial.level }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="cta-section">
      <div class="container">
        <div class="cta-content">
          <h2 class="cta-title">{{ $t('home_page.cta_title') }}</h2>
          <p class="cta-description">
            {{ $t('home_page.cta_description') }}
          </p>
          <div class="cta-buttons">
            <router-link to="/auth/signup" class="btn btn-primary cta-btn">
              {{ $t('home_page.get_started_free') }}
              <i class="fas fa-arrow-right"></i>
            </router-link>
            <router-link to="/grammar" class="btn btn-secondary cta-btn">
              {{ $t('home_page.browse_lessons') }}
            </router-link>
          </div>
        </div>
      </div>
    </section>
<!--  </Def0ultLayout>-->
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/userStore.js'
import { useI18n } from 'vue-i18n'
import DefaultLayout from '@/components/DefaultLayout.vue'

const router = useRouter()
const userStore = useUserStore()
const { t } = useI18n()

const stats = ref([
  {
    number: '50,000+',
    label: t('home_page.stats.active_students'),
    icon: 'fas fa-users'
  },
  {
    number: '500+',
    label: t('home_page.stats.interactive_lessons'),
    icon: 'fas fa-book'
  },
  {
    number: '95%',
    label: t('home_page.stats.success_rate'),
    icon: 'fas fa-chart-line'
  },
  {
    number: '24/7',
    label: t('home_page.stats.available'),
    icon: 'fas fa-clock'
  }
])

const featuredLessons = ref([
  {
    id: 1,
    title: t('home_page.lesson.basic_grammar'),
    description: t('home_page.lesson.basic_grammar_desc'),
    icon: 'fas fa-language',
    level: t('home_page.lesson.beginner'),
    duration: '30 min',
    progress: userStore.progress.grammar.completedLessons?.includes(1) ? 100 : 0
  },
  {
    id: 2,
    title: t('home_page.lesson.family_vocabulary'),
    description: t('home_page.lesson.family_vocabulary_desc'),
    icon: 'fas fa-home',
    level: t('home_page.lesson.beginner'),
    duration: '25 min',
    progress: userStore.progress.vocabulary.completedSets?.includes('family') ? 100 : 0
  },
  {
    id: 3,
    title: t('home_page.lesson.present_tense'),
    description: t('home_page.lesson.present_tense_desc'),
    icon: 'fas fa-clock',
    level: t('home_page.lesson.intermediate'),
    duration: '35 min',
    progress: userStore.progress.grammar.completedLessons?.includes(3) ? 100 : 0
  },
  {
    id: 4,
    title: t('home_page.lesson.business_english'),
    description: t('home_page.lesson.business_english_desc'),
    icon: 'fas fa-briefcase',
    level: t('home_page.lesson.intermediate'),
    duration: '40 min',
    progress: userStore.progress.vocabulary.completedSets?.includes('business') ? 100 : 0
  }
])

const learningPaths = ref([
  {
    id: 'beginner',
    title: t('home_page.path.beginner_title'),
    description: t('home_page.path.beginner_desc'),
    icon: 'fas fa-seedling',
    level: t('home_page.lesson.beginner'),
    lessons: 25,
    hours: 12,
    exercises: 150,
    features: [
      t('home_page.path.features.basic_grammar'),
      t('home_page.path.features.essential_vocabulary'),
      t('home_page.path.features.simple_conversations'),
      t('home_page.path.features.pronunciation_basics')
    ]
  },
  {
    id: 'intermediate',
    title: t('home_page.path.intermediate_title'),
    description: t('home_page.path.intermediate_desc'),
    icon: 'fas fa-tree',
    level: t('home_page.lesson.intermediate'),
    lessons: 35,
    hours: 20,
    exercises: 250,
    features: [
      t('home_page.path.features.advanced_grammar'),
      t('home_page.path.features.expanded_vocabulary'),
      t('home_page.path.features.complex_conversations'),
      t('home_page.path.features.writing_skills')
    ]
  },
  {
    id: 'advanced',
    title: t('home_page.path.advanced_title'),
    description: t('home_page.path.advanced_desc'),
    icon: 'fas fa-crown',
    level: t('home_page.lesson.advanced'),
    lessons: 45,
    hours: 30,
    exercises: 400,
    features: [
      t('home_page.path.features.advanced_grammar_mastery'),
      t('home_page.path.features.academic_vocabulary'),
      t('home_page.path.features.professional_communication'),
      t('home_page.path.features.cultural_understanding')
    ]
  }
])

const testimonials = ref([
  {
    id: 1,
    text: t('home_page.testimonial.maria'),
    name: "Maria Garcia",
    level: t('home_page.lesson.intermediate') + " " + t('home_page.stats.active_students').slice(0, -1)
  },
  {
    id: 2,
    text: t('home_page.testimonial.ahmed'),
    name: "Ahmed Hassan",
    level: t('home_page.lesson.beginner') + " " + t('home_page.stats.active_students').slice(0, -1)
  },
  {
    id: 3,
    text: t('home_page.testimonial.sarah'),
    name: "Sarah Johnson",
    level: t('home_page.lesson.advanced') + " " + t('home_page.stats.active_students').slice(0, -1)
  }
])

const watchDemo = () => {
  // Implement demo video functionality
  alert('Demo video would play here')
}

const goToLesson = (lessonId) => {
  router.push(`/lesson/${lessonId}`)
}

const selectPath = (pathId) => {
  // Store selected path and redirect to first lesson
  localStorage.setItem('selectedPath', pathId)
  router.push('/grammar')
}
</script>

<style scoped>
/* Hero Section */
.hero {
  min-height: 80vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
  display: flex;
  align-items: center;
  position: relative;
  overflow: hidden;
  padding: 2rem 0;
}

.hero-background {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.floating-element {
  position: absolute;
  width: 200px;
  height: 200px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  animation: float 6s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-30px) rotate(180deg); }
}

.hero-content {
  position: relative;
  z-index: 2;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

.hero-text {
  max-width: 700px;
  text-align: center;
  margin: 0 auto;
}

.hero-title {
  font-size: 3.5rem;
  font-weight: 800;
  color: white;
  line-height: 1.1;
  margin-bottom: 1.5rem;
}

.gradient-text {
  background: linear-gradient(135deg, #fbbf24, #f59e0b);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-description {
  font-size: 1.25rem;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 2rem;
  line-height: 1.6;
}

.hero-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.hero-btn {
  padding: 1rem 2rem;
  font-size: 1.1rem;
}

/* Stats Section */
.stats-section {
  padding: 4rem 0;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2rem;
}

.stat-card {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(20px);
  padding: 2rem;
  border-radius: 20px;
  text-align: center;
  transition: all 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.stat-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
}

.stat-icon {
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-radius: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem;
  color: white;
  font-size: 1.5rem;
}

.stat-number {
  font-size: 2.5rem;
  font-weight: 800;
  color: #1e293b;
  margin-bottom: 0.5rem;
}

.stat-label {
  color: #64748b;
  font-weight: 500;
}

/* Featured Lessons Section */
.featured-section {
  padding: 6rem 0;
  background: white;
}

.section-header {
  text-align: center;
  margin-bottom: 4rem;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
}

.section-title {
  font-size: 3rem;
  font-weight: 800;
  color: #1e293b;
  margin-bottom: 1rem;
}

.section-subtitle {
  font-size: 1.2rem;
  color: #64748b;
  line-height: 1.6;
}

.lessons-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.lesson-card {
  background: white;
  padding: 2rem;
  border-radius: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  border: 1px solid #e2e8f0;
  cursor: pointer;
}

.lesson-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15);
}

.lesson-icon {
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

.lesson-level,
.lesson-duration {
  font-size: 0.875rem;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-weight: 600;
}

.lesson-level {
  background: #dbeafe;
  color: #1e40af;
}

.lesson-duration {
  background: #fef3c7;
  color: #92400e;
}

.lesson-progress {
  margin-top: 1rem;
}

.progress-text {
  font-size: 0.875rem;
  color: #64748b;
  margin-top: 0.5rem;
  display: block;
}

/* Learning Paths Section */
.paths-section {
  padding: 6rem 0;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
}

.paths-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
}

.path-card {
  background: white;
  padding: 2.5rem;
  border-radius: 24px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  border: 1px solid #e2e8f0;
  cursor: pointer;
}

.path-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15);
}

.path-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.path-icon {
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-radius: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.5rem;
}

.path-badge {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 600;
}

.path-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 1rem;
}

.path-description {
  color: #64748b;
  margin-bottom: 1.5rem;
  line-height: 1.6;
}

.path-features {
  list-style: none;
  margin-bottom: 2rem;
}

.path-features li {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: #64748b;
  margin-bottom: 0.5rem;
}

.path-features li i {
  color: #10b981;
  font-size: 0.8rem;
}

.path-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  text-align: center;
}

.path-stat .stat-number {
  font-size: 1.5rem;
  font-weight: 800;
  color: #667eea;
  display: block;
}

.path-stat .stat-label {
  font-size: 0.875rem;
  color: #64748b;
}

/* Testimonials Section */
.testimonials-section {
  padding: 6rem 0;
  background: white;
}

.testimonials-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
}

.testimonial-card {
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  padding: 2.5rem;
  border-radius: 24px;
  transition: all 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.testimonial-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.1);
}

.testimonial-stars {
  display: flex;
  gap: 0.25rem;
  margin-bottom: 1.5rem;
}

.testimonial-stars i {
  color: #fbbf24;
  font-size: 1.1rem;
}

.testimonial-text {
  font-size: 1.1rem;
  color: #374151;
  line-height: 1.7;
  margin-bottom: 2rem;
  font-style: italic;
}

.testimonial-author {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.author-avatar {
  width: 50px;
  height: 50px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 700;
  font-size: 1.2rem;
}

.author-name {
  font-weight: 600;
  color: #1e293b;
}

.author-level {
  color: #64748b;
  font-size: 0.9rem;
}

/* CTA Section */
.cta-section {
  padding: 6rem 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
  color: white;
}

.cta-content {
  text-align: center;
  max-width: 800px;
  margin: 0 auto;
}

.cta-title {
  font-size: 3rem;
  font-weight: 800;
  margin-bottom: 1rem;
}

.cta-description {
  font-size: 1.2rem;
  opacity: 0.9;
  margin-bottom: 2rem;
  line-height: 1.6;
}

.cta-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.cta-btn {
  padding: 1rem 2rem;
  font-size: 1.1rem;
}

/* Responsive Design */
@media (max-width: 768px) {
  .hero-title {
    font-size: 2.5rem;
  }
  
  .hero-description {
    font-size: 1.1rem;
  }
  
  .hero-buttons {
    flex-direction: column;
    align-items: center;
  }
  
  .hero-btn {
    width: 100%;
    max-width: 300px;
    justify-content: center;
  }
  
  .section-title {
    font-size: 2.5rem;
  }
  
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .lessons-grid,
  .paths-grid,
  .testimonials-grid {
    grid-template-columns: 1fr;
  }
  
  .cta-title {
    font-size: 2.5rem;
  }
  
  .cta-buttons {
    flex-direction: column;
    align-items: center;
  }
  
  .cta-btn {
    width: 100%;
    max-width: 300px;
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .hero-title {
    font-size: 2rem;
  }
  
  .section-title {
    font-size: 2rem;
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
  }
  
  .stat-card,
  .lesson-card,
  .path-card,
  .testimonial-card {
    padding: 1.5rem;
  }
  
  .cta-title {
    font-size: 2rem;
  }
}
</style>
