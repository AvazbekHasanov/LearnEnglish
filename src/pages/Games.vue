<template>
  <DefaultLayout>
    <!-- Quiz Interface -->
    <div v-if="showQuiz" class="quiz-wrapper">
      <QuizComponent @close="closeQuiz" />
    </div>

    <!-- Main Games Interface -->
    <div v-else>
      <!-- Hero Section -->
      <section class="hero-section">
        <div class="container">
          <div class="hero-content">
            <h1 class="hero-title">Learning Games</h1>
            <p class="hero-description">
              Make learning fun with interactive games designed to improve your English skills. 
              Challenge yourself, earn points, and compete with other learners!
            </p>
            <div class="hero-stats">
              <div class="stat-item">
                <span class="stat-number">{{ gamesPlayed }}</span>
                <span class="stat-label">Games Played</span>
              </div>
              <div class="stat-item">
                <span class="stat-number">{{ Object.keys(highScores).length }}</span>
                <span class="stat-label">High Scores</span>
              </div>
              <div class="stat-item">
                <span class="stat-number">{{ games.length }}</span>
                <span class="stat-label">Available Games</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Featured Games Section -->
      <section class="featured-section">
        <div class="container">
          <div class="section-header">
            <h2 class="section-title">Featured Games</h2>
            <p class="section-subtitle">Start with these popular games to boost your learning</p>
          </div>

          <div class="featured-games">
            <div 
              class="featured-game" 
              v-for="game in featuredGames" 
              :key="game.id"
              @click="startGame(game.id)"
            >
              <div class="game-banner">
                <div class="game-icon">
                  <i :class="game.icon"></i>
                </div>
                <div class="game-badge" :class="game.difficulty">
                  {{ game.difficulty }}
                </div>
              </div>
              
              <div class="game-content">
                <h3 class="game-title">{{ game.title }}</h3>
                <p class="game-description">{{ game.description }}</p>
                
                <div class="game-stats">
                  <div class="game-stat">
                    <span class="stat-label">Best Score</span>
                    <span class="stat-value">{{ getHighScore(game.id) || '0' }}</span>
                  </div>
                  <div class="game-stat">
                    <span class="stat-label">Time</span>
                    <span class="stat-value">{{ game.duration }}</span>
                  </div>
                </div>

                <button class="btn btn-primary game-btn">
                  <i class="fas fa-play"></i>
                  Play Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- All Games Section -->
      <section class="games-section">
        <div class="container">
          <div class="section-header">
            <h2 class="section-title">All Games</h2>
            <p class="section-subtitle">Choose from our collection of educational games</p>
          </div>

          <div class="games-grid">
            <div 
              class="game-card" 
              v-for="game in games" 
              :key="game.id"
              @click="startGame(game.id)"
            >
              <div class="game-header">
                <div class="game-icon">
                  <i :class="game.icon"></i>
                </div>
                <div class="game-badge" :class="game.difficulty">
                  {{ game.difficulty }}
                </div>
              </div>
              
              <h3 class="game-title">{{ game.title }}</h3>
              <p class="game-description">{{ game.description }}</p>
              
              <div class="game-meta">
                <span class="game-category">
                  <i class="fas fa-tag"></i>
                  {{ game.category }}
                </span>
                <span class="game-duration">
                  <i class="fas fa-clock"></i>
                  {{ game.duration }}
                </span>
              </div>

              <div class="game-progress" v-if="hasPlayedGame(game.id)">
                <div class="progress-bar">
                  <div 
                    class="progress-fill" 
                    :style="{ width: getGameProgress(game.id) + '%' }"
                  ></div>
                </div>
                <span class="progress-text">Best: {{ getHighScore(game.id) }}</span>
              </div>

              <div class="game-actions">
                <button class="btn btn-primary game-btn">
                  <i class="fas fa-play"></i>
                  {{ hasPlayedGame(game.id) ? 'Play Again' : 'Start Game' }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Leaderboard Section -->
      <section class="leaderboard-section">
        <div class="container">
          <div class="section-header">
            <h2 class="section-title">Game Leaderboards</h2>
            <p class="section-subtitle">See how you rank against other players</p>
          </div>

          <div class="leaderboard-tabs">
            <button 
              v-for="tab in leaderboardTabs" 
              :key="tab.id"
              class="tab-button"
              :class="{ active: activeTab === tab.id }"
              @click="activeTab = tab.id"
            >
              {{ tab.name }}
            </button>
          </div>

          <div class="leaderboard-content">
            <div class="leaderboard-table">
              <div class="table-header">
                <span class="rank-header">Rank</span>
                <span class="player-header">Player</span>
                <span class="score-header">Score</span>
                <span class="date-header">Date</span>
              </div>
              
              <div 
                class="table-row" 
                v-for="(player, index) in getLeaderboardData()" 
                :key="player.id"
              >
                <span class="rank">{{ index + 1 }}</span>
                <div class="player-info">
                  <div class="player-avatar">{{ player.name.charAt(0) }}</div>
                  <span class="player-name">{{ player.name }}</span>
                </div>
                <span class="score">{{ player.score }}</span>
                <span class="date">{{ player.date }}</span>
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
              <h3 class="challenge-title">Daily Gaming Challenge</h3>
              <p class="challenge-description">
                Complete today's challenge to earn bonus points and unlock special rewards!
              </p>
              <div class="challenge-stats">
                <div class="challenge-stat">
                  <span class="stat-number">3</span>
                  <span class="stat-label">Games</span>
                </div>
                <div class="challenge-stat">
                  <span class="stat-number">50</span>
                  <span class="stat-label">Points</span>
                </div>
                <div class="challenge-stat">
                  <span class="stat-number">24h</span>
                  <span class="stat-label">Time Left</span>
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
    </div>
  </DefaultLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/userStore.js'
import DefaultLayout from '@/components/DefaultLayout.vue'
import QuizComponent from '@/components/QuizComponent.vue'
import { quizAPI } from '@/services/api.js'

const router = useRouter()
const userStore = useUserStore()

const activeTab = ref('word-match')
const showQuiz = ref(false)
const isLoading = ref(false)
const error = ref(null)
const quizResults = ref(null)
const gamesPlayed = ref(0)
const highScores = ref({})

const games = ref([
  {
    id: 'word-match',
    title: 'Word Match',
    description: 'Match English words with their definitions or translations',
    icon: 'fas fa-puzzle-piece',
    category: 'Vocabulary',
    difficulty: 'Beginner',
    duration: '5 min',
    featured: true
  },
  {
    id: 'sentence-builder',
    title: 'Sentence Builder',
    description: 'Arrange words to form correct English sentences',
    icon: 'fas fa-align-left',
    category: 'Grammar',
    difficulty: 'Intermediate',
    duration: '8 min',
    featured: true
  },
  {
    id: 'grammar-quiz',
    title: 'Grammar Quiz',
    description: 'Test your grammar knowledge with multiple choice questions',
    icon: 'fas fa-question-circle',
    category: 'Grammar',
    difficulty: 'Intermediate',
    duration: '10 min',
    featured: true
  },
  {
    id: 'vocabulary-quiz',
    title: 'Vocabulary Quiz',
    description: 'Test your vocabulary knowledge with interactive quizzes',
    icon: 'fas fa-book-open',
    category: 'Vocabulary',
    difficulty: 'Beginner',
    duration: '8 min',
    featured: true
  },
  {
    id: 'word-scramble',
    title: 'Word Scramble',
    description: 'Unscramble letters to form English words',
    icon: 'fas fa-random',
    category: 'Vocabulary',
    difficulty: 'Beginner',
    duration: '6 min',
    featured: false
  },
  {
    id: 'listening-challenge',
    title: 'Listening Challenge',
    description: 'Listen to words and phrases and choose the correct meaning',
    icon: 'fas fa-headphones',
    category: 'Listening',
    difficulty: 'Intermediate',
    duration: '7 min',
    featured: false
  },
  {
    id: 'speed-typing',
    title: 'Speed Typing',
    description: 'Type English words as fast as you can',
    icon: 'fas fa-keyboard',
    category: 'Writing',
    difficulty: 'Advanced',
    duration: '5 min',
    featured: false
  },
  {
    id: 'memory-game',
    title: 'Memory Game',
    description: 'Find matching pairs of English words and their meanings',
    icon: 'fas fa-brain',
    category: 'Vocabulary',
    difficulty: 'Beginner',
    duration: '8 min',
    featured: false
  },
  {
    id: 'story-completion',
    title: 'Story Completion',
    description: 'Complete sentences to finish a story',
    icon: 'fas fa-book-open',
    category: 'Writing',
    difficulty: 'Advanced',
    duration: '12 min',
    featured: false
  }
])

const featuredGames = computed(() => {
  return games.value.filter(game => game.featured)
})

const leaderboardTabs = ref([
  { id: 'word-match', name: 'Word Match' },
  { id: 'sentence-builder', name: 'Sentence Builder' },
  { id: 'grammar-quiz', name: 'Grammar Quiz' },
  { id: 'overall', name: 'Overall' }
])

const loadQuizResults = async () => {
  try {
    isLoading.value = true
    error.value = null
    const response = await quizAPI.getGrammarResult()
    quizResults.value = response.data
  } catch (err) {
    console.error('Failed to load quiz results:', err)
    error.value = 'Failed to load quiz results'
  } finally {
    isLoading.value = false
  }
}

const getHighScore = (gameId) => {
  return highScores.value[gameId] || 0
}

const hasPlayedGame = (gameId) => {
  return highScores.value[gameId] !== undefined
}

const getGameProgress = (gameId) => {
  const score = getHighScore(gameId)
  // Calculate progress based on score (example: max score is 100)
  return Math.min(Math.round((score / 100) * 100), 100)
}

const getLeaderboardData = () => {
  // Mock leaderboard data
  const mockData = {
    'word-match': [
      { id: 1, name: 'Sarah Johnson', score: 95, date: '2024-01-15' },
      { id: 2, name: 'Mike Chen', score: 88, date: '2024-01-15' },
      { id: 3, name: 'Emma Wilson', score: 82, date: '2024-01-15' },
      { id: 4, name: 'David Brown', score: 78, date: '2024-01-15' },
      { id: 5, name: 'Lisa Garcia', score: 75, date: '2024-01-15' }
    ],
    'sentence-builder': [
      { id: 1, name: 'Alex Thompson', score: 92, date: '2024-01-15' },
      { id: 2, name: 'Maria Rodriguez', score: 87, date: '2024-01-15' },
      { id: 3, name: 'James Lee', score: 85, date: '2024-01-15' },
      { id: 4, name: 'Anna Kim', score: 80, date: '2024-01-15' },
      { id: 5, name: 'Tom Anderson', score: 76, date: '2024-01-15' }
    ],
    'grammar-quiz': [
      { id: 1, name: 'Chris Davis', score: 98, date: '2024-01-15' },
      { id: 2, name: 'Rachel Green', score: 94, date: '2024-01-15' },
      { id: 3, name: 'Kevin Park', score: 89, date: '2024-01-15' },
      { id: 4, name: 'Sophie White', score: 85, date: '2024-01-15' },
      { id: 5, name: 'Ryan Taylor', score: 82, date: '2024-01-15' }
    ],
    'overall': [
      { id: 1, name: 'Sarah Johnson', score: 285, date: '2024-01-15' },
      { id: 2, name: 'Mike Chen', score: 270, date: '2024-01-15' },
      { id: 3, name: 'Emma Wilson', score: 265, date: '2024-01-15' },
      { id: 4, name: 'David Brown', score: 258, date: '2024-01-15' },
      { id: 5, name: 'Lisa Garcia', score: 250, date: '2024-01-15' }
    ]
  }
  
  return mockData[activeTab.value] || []
}

const startGame = (gameId) => {
  if (gameId === 'grammar-quiz' || gameId === 'vocabulary-quiz') {
    showQuiz.value = true
  } else {
    router.push(`/games/${gameId}`)
  }
}

const closeQuiz = () => {
  showQuiz.value = false
}

const startDailyChallenge = () => {
  router.push('/games/daily-challenge')
}

onMounted(async () => {
  try {
    await loadQuizResults()
  } catch (err) {
    console.error('Failed to load initial data:', err)
  }
})
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

/* Featured Section */
.featured-section {
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

.featured-games {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 2rem;
}

.featured-game {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 24px;
  padding: 2rem;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.featured-game::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.1);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.featured-game:hover::before {
  opacity: 1;
}

.featured-game:hover {
  transform: translateY(-10px);
  box-shadow: 0 25px 50px rgba(102, 126, 234, 0.3);
}

.game-banner {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.game-icon {
  width: 60px;
  height: 60px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
}

.game-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  background: rgba(255, 255, 255, 0.2);
}

.game-content {
  position: relative;
  z-index: 1;
}

.game-title {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 0.75rem;
}

.game-description {
  opacity: 0.9;
  margin-bottom: 1.5rem;
  line-height: 1.6;
}

.game-stats {
  display: flex;
  gap: 2rem;
  margin-bottom: 1.5rem;
}

.game-stat {
  text-align: center;
}

.game-stat .stat-label {
  display: block;
  font-size: 0.875rem;
  opacity: 0.8;
  margin-bottom: 0.25rem;
}

.game-stat .stat-value {
  font-size: 1.25rem;
  font-weight: 700;
}

.game-btn {
  width: 100%;
  background: rgba(255, 255, 255, 0.2);
  border: 2px solid rgba(255, 255, 255, 0.3);
  color: white;
}

.game-btn:hover {
  background: white;
  color: #667eea;
}

/* Games Section */
.games-section {
  padding: 4rem 0;
  background: #f8fafc;
}

.games-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.game-card {
  background: white;
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  cursor: pointer;
  border: 1px solid #e2e8f0;
}

.game-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15);
}

.game-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.game-icon {
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

.game-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
}

.game-badge.Beginner {
  background: #d1fae5;
  color: #065f46;
}

.game-badge.Intermediate {
  background: #fef3c7;
  color: #92400e;
}

.game-badge.Advanced {
  background: #fee2e2;
  color: #991b1b;
}

.game-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 0.75rem;
}

.game-description {
  color: #64748b;
  margin-bottom: 1rem;
  line-height: 1.6;
}

.game-meta {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}

.game-category,
.game-duration {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: #64748b;
}

.game-progress {
  margin-bottom: 1rem;
}

.game-actions {
  display: flex;
  justify-content: center;
}

.game-btn {
  width: 100%;
  padding: 0.75rem 1.5rem;
  font-size: 0.875rem;
}

/* Leaderboard Section */
.leaderboard-section {
  padding: 4rem 0;
  background: white;
}

.leaderboard-tabs {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}

.tab-button {
  padding: 0.75rem 1.5rem;
  border: 2px solid #e5e7eb;
  background: white;
  color: #64748b;
  border-radius: 9999px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.tab-button.active,
.tab-button:hover {
  background: #667eea;
  color: white;
  border-color: #667eea;
}

.leaderboard-content {
  max-width: 800px;
  margin: 0 auto;
}

.leaderboard-table {
  background: white;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
}

.table-header {
  display: grid;
  grid-template-columns: 80px 1fr 100px 120px;
  gap: 1rem;
  padding: 1rem 1.5rem;
  background: #f8fafc;
  font-weight: 600;
  color: #374151;
  border-bottom: 1px solid #e5e7eb;
}

.table-row {
  display: grid;
  grid-template-columns: 80px 1fr 100px 120px;
  gap: 1rem;
  padding: 1rem 1.5rem;
  align-items: center;
  border-bottom: 1px solid #f1f5f9;
  transition: background-color 0.2s ease;
}

.table-row:hover {
  background: #f8fafc;
}

.table-row:last-child {
  border-bottom: none;
}

.rank {
  font-weight: 700;
  color: #667eea;
  font-size: 1.125rem;
}

.player-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.player-avatar {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 700;
  font-size: 1rem;
}

.player-name {
  font-weight: 600;
  color: #1e293b;
}

.score {
  font-weight: 700;
  color: #10b981;
  text-align: center;
}

.date {
  color: #64748b;
  font-size: 0.875rem;
  text-align: center;
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
  
  .featured-games {
    grid-template-columns: 1fr;
  }
  
  .games-grid {
    grid-template-columns: 1fr;
  }
  
  .leaderboard-tabs {
    flex-direction: column;
    align-items: center;
  }
  
  .table-header,
  .table-row {
    grid-template-columns: 60px 1fr 80px 100px;
    gap: 0.5rem;
    padding: 0.75rem 1rem;
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
  
  .featured-game,
  .game-card {
    padding: 1.5rem;
  }
  
  .challenge-card {
    padding: 2rem;
  }
  
  .table-header,
  .table-row {
    grid-template-columns: 50px 1fr 70px 80px;
    font-size: 0.875rem;
  }
}

/* Quiz Wrapper */
.quiz-wrapper {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}
</style>
