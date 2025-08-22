<template>
<!--  <DefaultLayout>-->
    <!-- Quiz Interface -->
    <el-dialog
      v-model="showQuiz"
      :title="$t('quiz.select_quiz')"
      :show-close="true"
      :close-on-click-modal="false"
      :close-on-press-escape="true"
      width="90%"
      :before-close="closeQuiz"
      class="game-dialog"
    >
      <QuizComponent @close="closeQuiz" />
    </el-dialog>

    <!-- Word Matching Game Interface -->
    <el-dialog
      v-model="showWordMatchingGame"
      :title="$t('games.word_matching_game')"
      :show-close="true"
      :close-on-click-modal="false"
      :close-on-press-escape="true"
      width="90%"
      :before-close="closeWordMatchingGame"
      class="game-dialog"
    >
      <WordMatchingGame @close="closeWordMatchingGame" @gameComplete="handleGameComplete" />
    </el-dialog>

    <!-- Sentence Unscramble Game Interface -->
    <el-dialog
      v-model="showSentenceUnscrambleGame"
      :title="$t('games.sentence_unscramble_game')"
      :show-close="true"
      :close-on-click-modal="false"
      :close-on-press-escape="true"
      width="90%"
      :before-close="closeSentenceUnscrambleGame"
      class="game-dialog"
    >
      <SentenceUnscrambleGame @close="closeSentenceUnscrambleGame" @gameComplete="handleGameComplete" />
    </el-dialog>

    <!-- Main Games Interface -->
    <div>
      <!-- Hero Section -->
      <section class="hero-section">
        <div class="container">
          <div class="hero-content">
            <h1 class="hero-title">{{ $t('games.title') }}</h1>
            <p class="hero-description">
              {{ $t('games.description') }}
            </p>
            <div class="hero-stats">
              <div class="stat-item">
                <span class="stat-number">{{ gamesPlayed }}</span>
                <span class="stat-label">{{ $t('games.games_played') }}</span>
              </div>
              <div class="stat-item">
                <span class="stat-number">{{ Object.keys(highScores).length }}</span>
                <span class="stat-label">{{ $t('games.high_scores') }}</span>
              </div>
              <div class="stat-item">
                <span class="stat-number">{{ games.length }}</span>
                <span class="stat-label">{{ $t('games.available_games') }}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Featured Games Section -->
      <section class="featured-section">
        <div class="container">
                  <div class="section-header">
          <h2 class="section-title">{{ $t('games.featured_games') }}</h2>
          <p class="section-subtitle">{{ $t('games.featured_subtitle') }}</p>
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
                    <span class="stat-label">{{ $t('games.best_score') }}</span>
                    <span class="stat-value">{{ highScores[game.id] || '0' }}</span>
                  </div>
                  <div class="game-stat">
                    <span class="stat-label">{{ $t('games.time') }}</span>
                    <span class="stat-value">{{ game.duration }}</span>
                  </div>
                </div>

                <button class="btn btn-primary game-btn">
                  <i class="fas fa-play"></i>
                  {{ $t('games.play_now') }}
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
          <h2 class="section-title">{{ $t('games.leaderboards') }}</h2>
          <p class="section-subtitle">{{ $t('games.leaderboards_subtitle') }}</p>
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
                <span class="rank-header">{{ $t('games.rank') }}</span>
                <span class="player-header">{{ $t('games.player') }}</span>
                <span class="score-header">{{ $t('games.score') }}</span>
                <span class="date-header">{{ $t('games.date') }}</span>
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

    </div>
<!--  </DefaultLayout>-->
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useUserStore } from '@/stores/userStore.js'
import DefaultLayout from '@/components/DefaultLayout.vue'
import QuizComponent from '@/components/QuizComponent.vue'
import WordMatchingGame from '@/components/WordMatchingGame.vue'
import SentenceUnscrambleGame from '@/components/SentenceUnscrambleGame.vue'
import { quizAPI } from '@/services/api.js'

const router = useRouter()
const { t } = useI18n()
const userStore = useUserStore()

const activeTab = ref('word-match')
const showQuiz = ref(false)
const showWordMatchingGame = ref(false)
const showSentenceUnscrambleGame = ref(false)
const isLoading = ref(false)
const error = ref(null)
const quizResults = ref(null)
const gamesPlayed = ref(0)
const highScores = ref({})

const games = ref([
  {
    id: 'word-matching',
    title: t('games.word_matching_game'),
    description: t('games.word_matching_description'),
    icon: 'fas fa-puzzle-piece',
    category: t('games.vocabulary'),
    difficulty: t('games.beginner'),
    duration: '5 min',
    featured: true
  },
  {
    id: 'sentence-unscramble',
    title: t('games.sentence_unscramble_game'),
    description: t('games.sentence_unscramble_description'),
    icon: 'fas fa-align-left',
    category: t('games.grammar'),
    difficulty: t('games.intermediate'),
    duration: '8 min',
    featured: true
  }
])

const featuredGames = computed(() => {
  return games.value.filter(game => game.featured)
})

const leaderboardTabs = ref([
  { id: 'word-matching', name: t('games.word_matching') },
  { id: 'sentence-unscramble', name: t('games.sentence_unscramble') },
  { id: 'overall', name: t('games.overall') }
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



const getLeaderboardData = () => {
  // Mock leaderboard data
  const mockData = {
    'word-matching': [
      { id: 1, name: 'Sarah Johnson', score: 95, date: '2024-01-15' },
      { id: 2, name: 'Mike Chen', score: 88, date: '2024-01-15' },
      { id: 3, name: 'Emma Wilson', score: 82, date: '2024-01-15' },
      { id: 4, name: 'David Brown', score: 78, date: '2024-01-15' },
      { id: 5, name: 'Lisa Garcia', score: 75, date: '2024-01-15' }
    ],
    'sentence-unscramble': [
      { id: 1, name: 'Alex Thompson', score: 92, date: '2024-01-15' },
      { id: 2, name: 'Maria Rodriguez', score: 87, date: '2024-01-15' },
      { id: 3, name: 'James Lee', score: 85, date: '2024-01-15' },
      { id: 4, name: 'Anna Kim', score: 80, date: '2024-01-15' },
      { id: 5, name: 'Tom Anderson', score: 76, date: '2024-01-15' }
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
  if (gameId === 'word-matching') {
    showWordMatchingGame.value = true
  } else if (gameId === 'sentence-unscramble') {
    showSentenceUnscrambleGame.value = true
  }
}

const closeQuiz = () => {
  showQuiz.value = false
}

const closeWordMatchingGame = () => {
  showWordMatchingGame.value = false
}

const closeSentenceUnscrambleGame = () => {
  showSentenceUnscrambleGame.value = false
}

const handleGameComplete = (gameResults) => {
  // Update high scores
  const gameId = showWordMatchingGame.value ? 'word-matching' : 'sentence-unscramble'
  if (!highScores.value[gameId] || gameResults.score > highScores.value[gameId]) {
    highScores.value[gameId] = gameResults.score
  }
  
  // Update games played
  gamesPlayed.value++
  
  // Close the game
  if (showWordMatchingGame.value) {
    showWordMatchingGame.value = false
  } else if (showSentenceUnscrambleGame.value) {
    showSentenceUnscrambleGame.value = false
  }
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

/* Game Dialog Styles */
.game-dialog {
  max-width: 1200px;
}

.game-dialog .el-dialog__body {
  padding: 0;
}

.game-dialog .el-dialog__header {
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #e5e7eb;
}

.game-dialog .el-dialog__title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e293b;
}
</style>
