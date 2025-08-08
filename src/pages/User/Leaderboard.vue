<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { useUserStore } from '@/stores/userStore.js'

const userStore = useUserStore()
const loading = ref(true)
const selectedPeriod = ref('weekly')

const periods = [
  { id: 'weekly', name: 'This Week', icon: '📅' },
  { id: 'monthly', name: 'This Month', icon: '📊' },
  { id: 'all_time', name: 'All Time', icon: '🏆' }
]

const leaderboard = ref([
  {
    rank: 1,
    username: 'Sarah Johnson',
    avatar: '👩‍🎓',
    points: 1250,
    lessons_completed: 45,
    streak_days: 12,
    level: 'advanced',
    country: '🇺🇸'
  },
  {
    rank: 2,
    username: 'Michael Chen',
    avatar: '👨‍💻',
    points: 1180,
    lessons_completed: 42,
    streak_days: 10,
    level: 'advanced',
    country: '🇨🇦'
  },
  {
    rank: 3,
    username: 'Emma Wilson',
    avatar: '👩‍🏫',
    points: 1100,
    lessons_completed: 38,
    streak_days: 8,
    level: 'intermediate',
    country: '🇬🇧'
  },
  {
    rank: 4,
    username: 'David Kim',
    avatar: '👨‍🎨',
    points: 980,
    lessons_completed: 35,
    streak_days: 7,
    level: 'intermediate',
    country: '🇰🇷'
  },
  {
    rank: 5,
    username: 'Lisa Rodriguez',
    avatar: '👩‍⚕️',
    points: 920,
    lessons_completed: 32,
    streak_days: 6,
    level: 'intermediate',
    country: '🇪🇸'
  },
  {
    rank: 6,
    username: 'Alex Thompson',
    avatar: '👨‍🔬',
    points: 850,
    lessons_completed: 30,
    streak_days: 5,
    level: 'intermediate',
    country: '🇦🇺'
  },
  {
    rank: 7,
    username: 'Maria Garcia',
    avatar: '👩‍🍳',
    points: 780,
    lessons_completed: 28,
    streak_days: 4,
    level: 'beginner',
    country: '🇲🇽'
  },
  {
    rank: 8,
    username: 'James Lee',
    avatar: '👨‍💼',
    points: 720,
    lessons_completed: 25,
    streak_days: 3,
    level: 'beginner',
    country: '🇺🇸'
  },
  {
    rank: 9,
    username: 'Anna Schmidt',
    avatar: '👩‍🎨',
    points: 680,
    lessons_completed: 22,
    streak_days: 3,
    level: 'beginner',
    country: '🇩🇪'
  },
  {
    rank: 10,
    username: 'Carlos Silva',
    avatar: '👨‍🏭',
    points: 650,
    lessons_completed: 20,
    streak_days: 2,
    level: 'beginner',
    country: '🇧🇷'
  }
])

const currentUser = ref({
  rank: 15,
  username: 'Demo User',
  avatar: '👤',
  points: 250,
  lessons_completed: 12,
  streak_days: 5,
  level: 'intermediate',
  country: '🌍'
})

onMounted(async () => {
  await loadLeaderboardData()
  loading.value = false
})

const loadLeaderboardData = async () => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  // In a real app, you would fetch leaderboard data from API
  // const response = await api.getLeaderboard(selectedPeriod.value)
  // leaderboard.value = response.data.leaderboard
  // currentUser.value = response.data.currentUser
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
  return user.username === currentUser.value.username
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

      <!-- Top 10 Leaderboard -->
      <div class="leaderboard-section">
        <h2>Top 10 Learners</h2>
        <div class="leaderboard-list">
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
      </div>

      <!-- Statistics -->
      <div class="statistics">
        <div class="stat-card">
          <div class="stat-icon">👥</div>
          <div class="stat-info">
            <span class="stat-value">1,247</span>
            <span class="stat-label">Total Learners</span>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon">🌍</div>
          <div class="stat-info">
            <span class="stat-value">45</span>
            <span class="stat-label">Countries</span>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon">📚</div>
          <div class="stat-info">
            <span class="stat-value">12,450</span>
            <span class="stat-label">Lessons Completed</span>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon">🔥</div>
          <div class="stat-info">
            <span class="stat-value">8.5</span>
            <span class="stat-label">Avg. Streak Days</span>
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

.leaderboard-section h2 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 1.5rem;
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
