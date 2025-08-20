<script setup>
import { ref, reactive, onMounted, computed, watch } from 'vue'
import { useUserStore } from '@/stores/userStore.js'
import { userAPI } from '@/services/api.js'
import { ElMessage } from 'element-plus'

const userStore = useUserStore()
const loading = ref(true)
const selectedPeriod = ref('weekly')

const periods = [
  { id: 'weekly', name: 'This Week', icon: '📅' },
  { id: 'monthly', name: 'This Month', icon: '📊' },
  { id: 'all_time', name: 'All Time', icon: '🏆' }
]

// API response data
const leaderboardData = ref({
  totalElements: 0,
  totalPages: 0,
  first: true,
  last: true,
  size: 10,
  content: [],
  number: 0,
  numberOfElements: 0,
  empty: true
})

const currentPage = ref(0)
const pageSize = ref(10)

// Computed properties for date ranges
const getDateRange = computed(() => {
  const now = new Date()
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  
  switch (selectedPeriod.value) {
    case 'weekly':
      const startOfWeek = new Date(startOfDay)
      startOfWeek.setDate(startOfDay.getDate() - startOfDay.getDay())
      return {
        begin: startOfWeek.toISOString().split('T')[0],
        end: now.toISOString().split('T')[0]
      }
    case 'monthly':
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
      return {
        begin: startOfMonth.toISOString().split('T')[0],
        end: now.toISOString().split('T')[0]
      }
    case 'all_time':
      return {
        begin: '2020-01-01', // Default start date for all time
        end: now.toISOString().split('T')[0]
      }
    default:
      return {
        begin: startOfDay.toISOString().split('T')[0],
        end: now.toISOString().split('T')[0]
      }
  }
})

// Transform API data to component format
const leaderboard = computed(() => {
  return leaderboardData.value.content.map((user, index) => ({
    rank: (currentPage.value * pageSize.value) + index + 1,
    username: `${user.firstname} ${user.lastname}`,
    avatar: '👤',
    points: user.totalScore,
    lessons_completed: user.lessons,
    streak_days: 0, // Not provided by API
    level: user.level || 'beginner',
    country: '🌍', // Not provided by API
    userId: user.userId
  }))
})

// Use current user from store
const currentUser = computed(() => {
  const user = userStore.user
  return {
    rank: calculateUserRank(),
    username: user.fullName || 'User',
    avatar: user.imageUrl ? '👤' : '👤',
    points: user.points || 0,
    lessons_completed: user.lessonsCompleted || 0,
    streak_days: user.streakDays || 0,
    level: user.langLevel || 'beginner',
    country: '🌍',
    userId: user.id
  }
})

onMounted(async () => {
  await loadLeaderboardData()
  loading.value = false
})

// Watch for period changes
watch(selectedPeriod, async () => {
  currentPage.value = 0
  loading.value = true
  await loadLeaderboardData()
  loading.value = false
})

const loadLeaderboardData = async () => {
  try {
    // Load user data from store
    await userStore.loadUserProfile()
    await userStore.loadUserProgress()
    
    // Get date range for selected period
    const { begin, end } = getDateRange.value
    
    // Fetch leaderboard data from API
    const response = await userAPI.getRanking(begin, end, currentPage.value, pageSize.value)
    leaderboardData.value = response.data
    
  } catch (error) {
    console.error('Failed to load leaderboard data:', error)
    ElMessage.error('Failed to load leaderboard data')
  }
}

const loadNextPage = async () => {
  if (!leaderboardData.value.last) {
    currentPage.value++
    loading.value = true
    await loadLeaderboardData()
    loading.value = false
  }
}

const loadPreviousPage = async () => {
  if (!leaderboardData.value.first) {
    currentPage.value--
    loading.value = true
    await loadLeaderboardData()
    loading.value = false
  }
}

const calculateUserRank = () => {
  const userPoints = userStore.user.points || 0
  
  // Find user's rank based on points in current leaderboard
  for (let i = 0; i < leaderboard.value.length; i++) {
    if (userPoints >= leaderboard.value[i].points) {
      return (currentPage.value * pageSize.value) + i + 1
    }
  }
  
  return (currentPage.value * pageSize.value) + leaderboard.value.length + 1
}

const getRankIcon = (rank) => {
  if (rank === 1) return '🥇'
  if (rank === 2) return '🥈'
  if (rank === 3) return '🥉'
  return `#${rank}`
}

const getLevelColor = (level) => {
  switch (level) {
    case 'advanced': return '#16a34a'
    case 'intermediate': return '#f59e0b'
    case 'beginner': return '#667eea'
    default: return '#64748b'
  }
}

const getLevelBadge = (level) => {
  switch (level) {
    case 'advanced': return 'Advanced'
    case 'intermediate': return 'Intermediate'
    case 'beginner': return 'Beginner'
    default: return 'Unknown'
  }
}

const isCurrentUser = (user) => {
  return user.userId === currentUser.value.userId
}
</script>

<template>
  <div class="leaderboard-container">
    <div v-if="loading" class="loading">
      <div class="spinner"></div>
      <p>Loading leaderboard...</p>
    </div>

    <div v-else class="leaderboard-content">
      <!-- Header -->
      <div class="header">
        <h1>Leaderboard</h1>
        <p class="subtitle">See how you rank among other learners</p>
      </div>

      <!-- Period Filter -->
      <div class="period-filter">
        <div class="filter-buttons">
          <button
            v-for="period in periods"
            :key="period.id"
            @click="selectedPeriod = period.id"
            class="filter-btn"
            :class="{ 'active': selectedPeriod === period.id }"
          >
            <span class="filter-icon">{{ period.icon }}</span>
            <span class="filter-name">{{ period.name }}</span>
          </button>
        </div>
      </div>

      <!-- Current User Position -->
      <div class="current-user">
        <div class="user-card current">
          <div class="rank-info">
            <span class="rank-number">{{ getRankIcon(currentUser.rank) }}</span>
            <span class="rank-text">Your Position</span>
          </div>
          
          <div class="user-info">
            <div class="avatar">{{ currentUser.avatar }}</div>
            <div class="details">
              <h3 class="username">{{ currentUser.username }}</h3>
              <div class="user-stats">
                <span class="country">{{ currentUser.country }}</span>
                <span class="level" :style="{ color: getLevelColor(currentUser.level) }">
                  {{ getLevelBadge(currentUser.level) }}
                </span>
              </div>
            </div>
          </div>
          
          <div class="user-score">
            <div class="score-item">
              <span class="score-label">Points</span>
              <span class="score-value">{{ currentUser.points }}</span>
            </div>
            <div class="score-item">
              <span class="score-label">Lessons</span>
              <span class="score-value">{{ currentUser.lessons_completed }}</span>
            </div>
            <div class="score-item">
              <span class="score-label">Streak</span>
              <span class="score-value">{{ currentUser.streak_days }}d</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Leaderboard -->
      <div class="leaderboard-section">
        <div class="leaderboard-header">
          <h2>Top Learners</h2>
          <div class="leaderboard-info">
            <span>Showing {{ leaderboardData.numberOfElements }} of {{ leaderboardData.totalElements }} learners</span>
          </div>
        </div>
        
        <div v-if="leaderboardData.empty" class="empty-state">
          <div class="empty-icon">📊</div>
          <h3>No data available</h3>
          <p>No leaderboard data found for the selected period.</p>
        </div>
        
        <div v-else class="leaderboard-list">
          <div
            v-for="user in leaderboard"
            :key="user.rank"
            class="leaderboard-item"
            :class="{ 'current-user': isCurrentUser(user) }"
          >
            <div class="rank-section">
              <span class="rank-icon">{{ getRankIcon(user.rank) }}</span>
              <span class="rank-number">{{ user.rank }}</span>
            </div>
            
            <div class="user-section">
              <div class="user-avatar">{{ user.avatar }}</div>
              <div class="user-details">
                <h3 class="user-name">{{ user.username }}</h3>
                <div class="user-meta">
                  <span class="country">{{ user.country }}</span>
                  <span class="level" :style="{ color: getLevelColor(user.level) }">
                    {{ getLevelBadge(user.level) }}
                  </span>
                </div>
              </div>
            </div>
            
            <div class="stats-section">
              <div class="stat-item">
                <span class="stat-label">Points</span>
                <span class="stat-value">{{ user.points }}</span>
              </div>
              <div class="stat-item">
                <span class="stat-label">Lessons</span>
                <span class="stat-value">{{ user.lessons_completed }}</span>
              </div>
              <div class="stat-item">
                <span class="stat-label">Streak</span>
                <span class="stat-value">{{ user.streak_days }}d</span>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Pagination -->
        <div v-if="!leaderboardData.empty" class="pagination">
          <button 
            @click="loadPreviousPage" 
            :disabled="leaderboardData.first"
            class="pagination-btn"
            :class="{ 'disabled': leaderboardData.first }"
          >
            ← Previous
          </button>
          
          <div class="page-info">
            Page {{ leaderboardData.number + 1 }} of {{ leaderboardData.totalPages }}
          </div>
          
          <button 
            @click="loadNextPage" 
            :disabled="leaderboardData.last"
            class="pagination-btn"
            :class="{ 'disabled': leaderboardData.last }"
          >
            Next →
          </button>
        </div>
      </div>

      <!-- Statistics -->
      <div class="statistics">
        <div class="stat-card">
          <div class="stat-icon">👥</div>
          <div class="stat-info">
            <span class="stat-value">{{ leaderboardData.totalElements }}</span>
            <span class="stat-label">Total Learners</span>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon">📊</div>
          <div class="stat-info">
            <span class="stat-value">{{ leaderboardData.totalPages }}</span>
            <span class="stat-label">Total Pages</span>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon">📚</div>
          <div class="stat-info">
            <span class="stat-value">{{ leaderboardData.content.reduce((sum, user) => sum + user.lessons, 0) }}</span>
            <span class="stat-label">Lessons Completed</span>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon">🏆</div>
          <div class="stat-info">
            <span class="stat-value">{{ leaderboardData.content.reduce((sum, user) => sum + user.totalScore, 0) }}</span>
            <span class="stat-label">Total Points</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.leaderboard-container {
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

.leaderboard-content {
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

.period-filter {
  background: white;
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
}

.filter-buttons {
  display: flex;
  justify-content: center;
  gap: 1rem;
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

.current-user {
  background: white;
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
}

.user-card {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  padding: 1rem;
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-radius: 1rem;
  color: white;
}

.user-card.current {
  background: linear-gradient(135deg, #f59e0b, #d97706);
}

.rank-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.rank-number {
  font-size: 2rem;
  font-weight: 800;
}

.rank-text {
  font-size: 0.875rem;
  opacity: 0.9;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex: 1;
}

.avatar {
  font-size: 2.5rem;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
}

.details {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.username {
  font-size: 1.25rem;
  font-weight: 700;
  margin: 0;
}

.user-stats {
  display: flex;
  gap: 1rem;
  font-size: 0.875rem;
  opacity: 0.9;
}

.user-score {
  display: flex;
  gap: 2rem;
}

.score-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
}

.score-label {
  font-size: 0.75rem;
  opacity: 0.8;
}

.score-value {
  font-size: 1.125rem;
  font-weight: 700;
}

.leaderboard-section {
  background: white;
  border-radius: 1rem;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
}

.leaderboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.leaderboard-header h2 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
}

.leaderboard-info {
  color: #64748b;
  font-size: 0.875rem;
}

.empty-state {
  text-align: center;
  padding: 3rem 1rem;
  color: #64748b;
}

.empty-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.empty-state h3 {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #1e293b;
}

.empty-state p {
  font-size: 1rem;
  margin: 0;
}

.leaderboard-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.leaderboard-item {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  padding: 1rem;
  background: #f8fafc;
  border-radius: 0.75rem;
  transition: all 0.2s ease;
}

.leaderboard-item:hover {
  background: #f1f5f9;
  transform: translateX(4px);
}

.leaderboard-item.current-user {
  background: linear-gradient(135deg, #fef3c7, #fde68a);
  border: 2px solid #f59e0b;
}

.rank-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  min-width: 60px;
}

.rank-icon {
  font-size: 1.5rem;
}

.rank-number {
  font-size: 1.125rem;
  font-weight: 700;
  color: #1e293b;
}

.user-section {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex: 1;
}

.user-avatar {
  font-size: 2rem;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  border-radius: 50%;
}

.user-details {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.user-name {
  font-size: 1.125rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
}

.user-meta {
  display: flex;
  gap: 1rem;
  font-size: 0.875rem;
  color: #64748b;
}

.stats-section {
  display: flex;
  gap: 2rem;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
}

.stat-label {
  font-size: 0.75rem;
  color: #64748b;
  font-weight: 500;
}

.stat-value {
  font-size: 1rem;
  font-weight: 700;
  color: #1e293b;
}

.statistics {
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

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e5e7eb;
}

.pagination-btn {
  padding: 0.5rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  background: white;
  color: #374151;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.pagination-btn:hover:not(.disabled) {
  background: #f3f4f6;
  border-color: #9ca3af;
}

.pagination-btn.disabled {
  opacity: 0.5;
  cursor: not-allowed;
  background: #f9fafb;
  color: #9ca3af;
}

.page-info {
  color: #6b7280;
  font-size: 0.875rem;
  font-weight: 500;
}

@media (max-width: 768px) {
  .leaderboard-container {
    padding: 1rem;
  }
  
  .header h1 {
    font-size: 2rem;
  }
  
  .filter-buttons {
    flex-direction: column;
  }
  
  .user-card {
    flex-direction: column;
    text-align: center;
    gap: 1rem;
  }
  
  .user-score {
    justify-content: center;
  }
  
  .leaderboard-item {
    flex-direction: column;
    text-align: center;
    gap: 1rem;
  }
  
  .stats-section {
    justify-content: center;
  }
  
  .statistics {
    grid-template-columns: 1fr;
  }
  
  .leaderboard-header {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
  
  .pagination {
    flex-direction: column;
    gap: 1rem;
  }
}

@media (max-width: 480px) {
  .user-stats {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .stats-section {
    flex-direction: column;
    gap: 1rem;
  }
}
</style>

