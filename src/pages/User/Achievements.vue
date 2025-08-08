<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { useUserStore } from '@/stores/userStore.js'

const userStore = useUserStore()
const loading = ref(true)
const selectedCategory = ref('all')

const categories = [
  { id: 'all', name: 'All Achievements', icon: '🏆' },
  { id: 'streak', name: 'Streak Badges', icon: '🔥' },
  { id: 'lessons', name: 'Lesson Mastery', icon: '📚' },
  { id: 'points', name: 'Point Collector', icon: '💎' },
  { id: 'special', name: 'Special Events', icon: '⭐' }
]

const achievements = ref([
  {
    id: 'first_lesson',
    name: 'First Steps',
    description: 'Complete your first lesson',
    icon: '🎯',
    category: 'lessons',
    unlocked: true,
    points: 10,
    unlocked_date: '2024-01-10',
    progress: 100
  },
  {
    id: 'streak_5',
    name: 'Consistent Learner',
    description: 'Study for 5 days in a row',
    icon: '🔥',
    category: 'streak',
    unlocked: true,
    points: 25,
    unlocked_date: '2024-01-12',
    progress: 100
  },
  {
    id: 'streak_10',
    name: 'Dedicated Student',
    description: 'Study for 10 days in a row',
    icon: '⚡',
    category: 'streak',
    unlocked: false,
    points: 50,
    progress: 50
  },
  {
    id: 'points_100',
    name: 'Point Collector',
    description: 'Earn 100 points',
    icon: '💎',
    category: 'points',
    unlocked: true,
    points: 20,
    unlocked_date: '2024-01-11',
    progress: 100
  },
  {
    id: 'grammar_master',
    name: 'Grammar Master',
    description: 'Complete all grammar lessons',
    icon: '📚',
    category: 'lessons',
    unlocked: false,
    points: 100,
    progress: 60
  },
  {
    id: 'vocabulary_expert',
    name: 'Vocabulary Expert',
    description: 'Learn 500 words',
    icon: '📖',
    category: 'lessons',
    unlocked: false,
    points: 100,
    progress: 30
  },
  {
    id: 'perfect_score',
    name: 'Perfect Score',
    description: 'Get 100% on any practice test',
    icon: '⭐',
    category: 'special',
    unlocked: false,
    points: 75,
    progress: 0
  },
  {
    id: 'early_bird',
    name: 'Early Bird',
    description: 'Study before 8 AM for 7 days',
    icon: '🌅',
    category: 'streak',
    unlocked: false,
    points: 30,
    progress: 20
  },
  {
    id: 'night_owl',
    name: 'Night Owl',
    description: 'Study after 10 PM for 5 days',
    icon: '🦉',
    category: 'streak',
    unlocked: false,
    points: 30,
    progress: 0
  },
  {
    id: 'weekend_warrior',
    name: 'Weekend Warrior',
    description: 'Study on weekends for 4 weeks',
    icon: '🏆',
    category: 'streak',
    unlocked: false,
    points: 50,
    progress: 75
  }
])

onMounted(async () => {
  await loadAchievementsData()
  loading.value = false
})

const loadAchievementsData = async () => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  // In a real app, you would fetch achievements from API
  // const response = await api.getAchievements()
  // achievements.value = response.data
}

const filteredAchievements = computed(() => {
  if (selectedCategory.value === 'all') {
    return achievements.value
  }
  return achievements.value.filter(achievement => achievement.category === selectedCategory.value)
})

const unlockedAchievements = computed(() => {
  return achievements.value.filter(achievement => achievement.unlocked)
})

const totalPoints = computed(() => {
  return unlockedAchievements.value.reduce((total, achievement) => total + achievement.points, 0)
})

const totalAchievements = computed(() => achievements.value.length)
const unlockedCount = computed(() => unlockedAchievements.value.length)
const progressPercentage = computed(() => Math.round((unlockedCount.value / totalAchievements.value) * 100))

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const getProgressColor = (progress) => {
  if (progress >= 100) return '#16a34a'
  if (progress >= 75) return '#f59e0b'
  if (progress >= 50) return '#f97316'
  return '#64748b'
}
</script>

<template>
  <div class="achievements-container">
    <div v-if="loading" class="loading">
      <div class="spinner"></div>
      <p>Loading achievements...</p>
    </div>

    <div v-else class="achievements-content">
      <!-- Header -->
      <div class="header">
        <h1>Achievements</h1>
        <p class="subtitle">Unlock badges and track your progress</p>
      </div>

      <!-- Overview Stats -->
      <div class="overview-stats">
        <div class="stat-card">
          <div class="stat-icon">🏆</div>
          <div class="stat-info">
            <span class="stat-value">{{ unlockedCount }}/{{ totalAchievements }}</span>
            <span class="stat-label">Achievements Unlocked</span>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">📊</div>
          <div class="stat-info">
            <span class="stat-value">{{ progressPercentage }}%</span>
            <span class="stat-label">Completion Rate</span>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">💎</div>
          <div class="stat-info">
            <span class="stat-value">{{ totalPoints }}</span>
            <span class="stat-label">Total Points Earned</span>
          </div>
        </div>
      </div>

      <!-- Category Filter -->
      <div class="category-filter">
        <div class="filter-buttons">
          <button
            v-for="category in categories"
            :key="category.id"
            @click="selectedCategory = category.id"
            class="filter-btn"
            :class="{ 'active': selectedCategory === category.id }"
          >
            <span class="filter-icon">{{ category.icon }}</span>
            <span class="filter-name">{{ category.name }}</span>
          </button>
        </div>
      </div>

      <!-- Achievements Grid -->
      <div class="achievements-grid">
        <div
          v-for="achievement in filteredAchievements"
          :key="achievement.id"
          class="achievement-card"
          :class="{ 'unlocked': achievement.unlocked, 'locked': !achievement.unlocked }"
        >
          <div class="achievement-icon">
            <span class="icon">{{ achievement.icon }}</span>
            <div v-if="achievement.unlocked" class="unlock-badge">✓</div>
          </div>

          <div class="achievement-info">
            <h3 class="achievement-name">{{ achievement.name }}</h3>
            <p class="achievement-description">{{ achievement.description }}</p>
            
            <div class="achievement-meta">
              <div class="points">
                <span class="points-icon">💎</span>
                <span class="points-value">{{ achievement.points }} pts</span>
              </div>
              
              <div v-if="achievement.unlocked" class="unlocked-date">
                Unlocked {{ formatDate(achievement.unlocked_date) }}
              </div>
            </div>

            <!-- Progress Bar for Locked Achievements -->
            <div v-if="!achievement.unlocked && achievement.progress > 0" class="progress-section">
              <div class="progress-bar">
                <div 
                  class="progress-fill" 
                  :style="{ 
                    width: achievement.progress + '%',
                    backgroundColor: getProgressColor(achievement.progress)
                  }"
                ></div>
              </div>
              <span class="progress-text">{{ achievement.progress }}% complete</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="filteredAchievements.length === 0" class="empty-state">
        <div class="empty-icon">🎯</div>
        <h3>No achievements found</h3>
        <p>Try selecting a different category or complete more lessons to unlock achievements!</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.achievements-container {
  max-width: 1200px;
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

.achievements-content {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.header {
  text-align: center;
  margin-bottom: 2rem;
}

.header h1 {
  font-size: 2.5rem;
  font-weight: 800;
  color: #1e293b;
  margin-bottom: 0.5rem;
}

.subtitle {
  color: #64748b;
  font-size: 1.125rem;
}

.overview-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.stat-card {
  background: white;
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  display: flex;
  align-items: center;
  gap: 1rem;
  transition: transform 0.2s ease;
}

.stat-card:hover {
  transform: translateY(-2px);
}

.stat-icon {
  font-size: 2rem;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  border-radius: 1rem;
}

.stat-info {
  display: flex;
  flex-direction: column;
}

.stat-value {
  font-size: 2rem;
  font-weight: 800;
  color: #1e293b;
}

.stat-label {
  color: #64748b;
  font-size: 0.875rem;
  font-weight: 500;
}

.category-filter {
  background: white;
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
}

.filter-buttons {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.filter-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border: 2px solid #e5e7eb;
  border-radius: 2rem;
  background: white;
  color: #64748b;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.filter-btn:hover {
  border-color: #667eea;
  color: #667eea;
}

.filter-btn.active {
  background: #667eea;
  border-color: #667eea;
  color: white;
}

.filter-icon {
  font-size: 1.125rem;
}

.achievements-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
}

.achievement-card {
  background: white;
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  display: flex;
  gap: 1rem;
  transition: all 0.2s ease;
  position: relative;
  overflow: hidden;
}

.achievement-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.achievement-card.unlocked {
  border-left: 4px solid #16a34a;
}

.achievement-card.locked {
  opacity: 0.7;
  border-left: 4px solid #64748b;
}

.achievement-icon {
  position: relative;
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-radius: 1rem;
  flex-shrink: 0;
}

.achievement-card.locked .achievement-icon {
  background: linear-gradient(135deg, #64748b, #475569);
}

.icon {
  font-size: 2.5rem;
  color: white;
}

.unlock-badge {
  position: absolute;
  top: -5px;
  right: -5px;
  width: 24px;
  height: 24px;
  background: #16a34a;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.875rem;
  font-weight: 700;
}

.achievement-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.achievement-name {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
}

.achievement-description {
  color: #64748b;
  font-size: 0.875rem;
  line-height: 1.5;
  margin: 0;
}

.achievement-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
}

.points {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
  color: #1e293b;
}

.points-icon {
  font-size: 1rem;
}

.unlocked-date {
  font-size: 0.75rem;
  color: #16a34a;
  font-weight: 600;
}

.progress-section {
  margin-top: 1rem;
}

.progress-bar {
  width: 100%;
  height: 6px;
  background: #e5e7eb;
  border-radius: 3px;
  overflow: hidden;
  margin-bottom: 0.5rem;
}

.progress-fill {
  height: 100%;
  transition: width 0.3s ease;
}

.progress-text {
  font-size: 0.75rem;
  color: #64748b;
  font-weight: 500;
}

.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  background: white;
  border-radius: 1rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.empty-state h3 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 0.5rem;
}

.empty-state p {
  color: #64748b;
  font-size: 1rem;
}

@media (max-width: 768px) {
  .achievements-container {
    padding: 1rem;
  }
  
  .header h1 {
    font-size: 2rem;
  }
  
  .overview-stats {
    grid-template-columns: 1fr;
  }
  
  .filter-buttons {
    justify-content: center;
  }
  
  .achievements-grid {
    grid-template-columns: 1fr;
  }
  
  .achievement-card {
    flex-direction: column;
    text-align: center;
  }
  
  .achievement-meta {
    flex-direction: column;
    gap: 0.5rem;
    align-items: center;
  }
}

@media (max-width: 480px) {
  .filter-buttons {
    flex-direction: column;
  }
  
  .filter-btn {
    justify-content: center;
  }
  
  .achievement-icon {
    width: 60px;
    height: 60px;
  }
  
  .icon {
    font-size: 2rem;
  }
}
</style>
