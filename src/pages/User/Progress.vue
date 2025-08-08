<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { useUserStore } from '@/stores/userStore.js'

const userStore = useUserStore()
const loading = ref(true)

const stats = ref({
  total_points: 250,
  streak_days: 5,
  lessons_completed: 12,
  tests_passed: 8,
  total_study_time: 1800, // in minutes
  average_score: 85,
  current_level: 'intermediate',
  next_level_points: 100
})

const studyHistory = ref([
  { date: '2024-01-15', duration: 45, lessons: 2, points: 25 },
  { date: '2024-01-14', duration: 30, lessons: 1, points: 15 },
  { date: '2024-01-13', duration: 60, lessons: 3, points: 35 },
  { date: '2024-01-12', duration: 20, lessons: 1, points: 10 },
  { date: '2024-01-11', duration: 40, lessons: 2, points: 20 },
  { date: '2024-01-10', duration: 35, lessons: 1, points: 15 },
  { date: '2024-01-09', duration: 50, lessons: 2, points: 25 }
])

const weeklyStats = ref({
  monday: { duration: 45, lessons: 2, points: 25 },
  tuesday: { duration: 30, lessons: 1, points: 15 },
  wednesday: { duration: 60, lessons: 3, points: 35 },
  thursday: { duration: 20, lessons: 1, points: 10 },
  friday: { duration: 40, lessons: 2, points: 20 },
  saturday: { duration: 35, lessons: 1, points: 15 },
  sunday: { duration: 50, lessons: 2, points: 25 }
})

onMounted(async () => {
  await loadProgressData()
  loading.value = false
})

const loadProgressData = async () => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  // In a real app, you would fetch progress data from API
  // const response = await api.getProgress()
  // stats.value = response.data.stats
  // studyHistory.value = response.data.history
  // weeklyStats.value = response.data.weekly
}

const formatTime = (minutes) => {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  })
}

const progressToNextLevel = computed(() => {
  const currentPoints = stats.value.total_points
  const nextLevelPoints = stats.value.next_level_points
  return Math.min((currentPoints / nextLevelPoints) * 100, 100)
})

const totalStudyTime = computed(() => {
  return studyHistory.value.reduce((total, day) => total + day.duration, 0)
})

const averageDailyTime = computed(() => {
  return Math.round(totalStudyTime.value / studyHistory.value.length)
})

const totalPointsEarned = computed(() => {
  return studyHistory.value.reduce((total, day) => total + day.points, 0)
})
</script>

<template>
  <div class="progress-container">
    <div v-if="loading" class="loading">
      <div class="spinner"></div>
      <p>Loading progress...</p>
    </div>

    <div v-else class="progress-content">
      <!-- Header -->
      <div class="header">
        <h1>My Progress</h1>
        <p class="subtitle">Track your learning journey and achievements</p>
      </div>

      <!-- Overview Stats -->
      <div class="overview-stats">
        <div class="stat-card">
          <div class="stat-icon">🎯</div>
          <div class="stat-info">
            <span class="stat-value">{{ stats.total_points }}</span>
            <span class="stat-label">Total Points</span>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">🔥</div>
          <div class="stat-info">
            <span class="stat-value">{{ stats.streak_days }}</span>
            <span class="stat-label">Day Streak</span>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">📚</div>
          <div class="stat-info">
            <span class="stat-value">{{ stats.lessons_completed }}</span>
            <span class="stat-label">Lessons Completed</span>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">✅</div>
          <div class="stat-info">
            <span class="stat-value">{{ stats.tests_passed }}</span>
            <span class="stat-label">Tests Passed</span>
          </div>
        </div>
      </div>

      <!-- Level Progress -->
      <div class="level-progress">
        <div class="level-info">
          <h2>Current Level: {{ stats.current_level }}</h2>
          <p>Points to next level: {{ stats.next_level_points - stats.total_points }}</p>
        </div>
        <div class="progress-bar">
          <div class="progress-fill" :style="{ width: progressToNextLevel + '%' }"></div>
        </div>
        <div class="progress-text">
          {{ stats.total_points }} / {{ stats.next_level_points }} points
        </div>
      </div>

      <!-- Study Time Stats -->
      <div class="study-stats">
        <div class="stat-item">
          <div class="stat-header">
            <h3>Study Time</h3>
            <span class="stat-icon">⏱️</span>
          </div>
          <div class="stat-details">
            <div class="detail">
              <span class="label">Total Time:</span>
              <span class="value">{{ formatTime(totalStudyTime) }}</span>
            </div>
            <div class="detail">
              <span class="label">Average Daily:</span>
              <span class="value">{{ formatTime(averageDailyTime) }}</span>
            </div>
            <div class="detail">
              <span class="label">This Week:</span>
              <span class="value">{{ formatTime(stats.total_study_time) }}</span>
            </div>
          </div>
        </div>

        <div class="stat-item">
          <div class="stat-header">
            <h3>Performance</h3>
            <span class="stat-icon">📊</span>
          </div>
          <div class="stat-details">
            <div class="detail">
              <span class="label">Average Score:</span>
              <span class="value">{{ stats.average_score }}%</span>
            </div>
            <div class="detail">
              <span class="label">Points Earned:</span>
              <span class="value">{{ totalPointsEarned }}</span>
            </div>
            <div class="detail">
              <span class="label">Success Rate:</span>
              <span class="value">{{ Math.round((stats.tests_passed / stats.lessons_completed) * 100) }}%</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Weekly Activity -->
      <div class="weekly-activity">
        <h2>This Week's Activity</h2>
        <div class="weekly-chart">
          <div v-for="(day, key) in weeklyStats" :key="key" class="day-column">
            <div class="day-label">{{ key.charAt(0).toUpperCase() + key.slice(1) }}</div>
            <div class="day-bar" :style="{ height: (day.duration / 60) * 100 + '%' }">
              <div class="bar-tooltip">
                <div>{{ formatTime(day.duration) }}</div>
                <div>{{ day.lessons }} lessons</div>
                <div>{{ day.points }} points</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Activity -->
      <div class="recent-activity">
        <h2>Recent Activity</h2>
        <div class="activity-list">
          <div v-for="(day, index) in studyHistory.slice(0, 7)" :key="index" class="activity-item">
            <div class="activity-date">
              <span class="day">{{ formatDate(day.date).split(',')[0] }}</span>
              <span class="date">{{ formatDate(day.date).split(',')[1] }}</span>
            </div>
            <div class="activity-details">
              <div class="detail">
                <span class="icon">⏱️</span>
                <span>{{ formatTime(day.duration) }}</span>
              </div>
              <div class="detail">
                <span class="icon">📚</span>
                <span>{{ day.lessons }} lessons</span>
              </div>
              <div class="detail">
                <span class="icon">💎</span>
                <span>{{ day.points }} points</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.progress-container {
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

.progress-content {
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

.level-progress {
  background: white;
  border-radius: 1rem;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
}

.level-info {
  margin-bottom: 1rem;
}

.level-info h2 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 0.5rem;
}

.level-info p {
  color: #64748b;
}

.progress-bar {
  width: 100%;
  height: 12px;
  background: #e5e7eb;
  border-radius: 6px;
  overflow: hidden;
  margin-bottom: 0.5rem;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #667eea, #764ba2);
  transition: width 0.3s ease;
}

.progress-text {
  text-align: center;
  font-weight: 600;
  color: #64748b;
}

.study-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
}

.stat-item {
  background: white;
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
}

.stat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.stat-header h3 {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1e293b;
}

.stat-header .stat-icon {
  font-size: 1.5rem;
}

.stat-details {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.detail {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  background: #f8fafc;
  border-radius: 0.5rem;
}

.label {
  color: #64748b;
  font-weight: 500;
}

.value {
  font-weight: 700;
  color: #1e293b;
}

.weekly-activity {
  background: white;
  border-radius: 1rem;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
}

.weekly-activity h2 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 1.5rem;
}

.weekly-chart {
  display: flex;
  justify-content: space-between;
  align-items: end;
  height: 200px;
  gap: 1rem;
}

.day-column {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  flex: 1;
}

.day-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: #64748b;
}

.day-bar {
  width: 100%;
  background: linear-gradient(180deg, #667eea, #764ba2);
  border-radius: 0.25rem;
  position: relative;
  min-height: 20px;
  transition: all 0.2s ease;
}

.day-bar:hover {
  transform: scaleY(1.05);
}

.bar-tooltip {
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  background: #1e293b;
  color: white;
  padding: 0.5rem;
  border-radius: 0.5rem;
  font-size: 0.75rem;
  white-space: nowrap;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.2s ease;
  z-index: 10;
}

.day-bar:hover .bar-tooltip {
  opacity: 1;
}

.recent-activity {
  background: white;
  border-radius: 1rem;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
}

.recent-activity h2 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 1.5rem;
}

.activity-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.activity-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: #f8fafc;
  border-radius: 0.75rem;
  transition: all 0.2s ease;
}

.activity-item:hover {
  background: #f1f5f9;
  transform: translateX(4px);
}

.activity-date {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.day {
  font-weight: 700;
  color: #1e293b;
}

.date {
  font-size: 0.875rem;
  color: #64748b;
}

.activity-details {
  display: flex;
  gap: 1.5rem;
}

.detail {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: #64748b;
}

.icon {
  font-size: 1rem;
}

@media (max-width: 768px) {
  .progress-container {
    padding: 1rem;
  }
  
  .header h1 {
    font-size: 2rem;
  }
  
  .overview-stats {
    grid-template-columns: 1fr;
  }
  
  .study-stats {
    grid-template-columns: 1fr;
  }
  
  .weekly-chart {
    height: 150px;
  }
  
  .activity-details {
    flex-direction: column;
    gap: 0.5rem;
  }
}

@media (max-width: 480px) {
  .stat-card {
    flex-direction: column;
    text-align: center;
  }
  
  .weekly-chart {
    flex-direction: column;
    height: auto;
    gap: 0.5rem;
  }
  
  .day-column {
    flex-direction: row;
    align-items: center;
    gap: 1rem;
  }
  
  .day-bar {
    width: 50px;
    height: 100px;
  }
}
</style>
