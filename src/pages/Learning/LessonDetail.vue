<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/stores/userStore.js'
import { useGrammar } from '@/composables/useGrammar.js'
import BackButton from '@/components/BackButton.vue'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

const lessonId = computed(() => route.params.id)
const loading = ref(true)
const currentVideoTime = ref(0)
const videoDuration = ref(0)
const isVideoPlaying = ref(false)

// Use the grammar composable
const { getLessonById, endLesson } = useGrammar()

// Lesson data
const lesson = ref({
  id: 1,
  title: 'Present Simple Tense',
  category: 'grammar',
  level: 'beginner',
  duration: '15 minutes',
  video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
  theory: {
    overview: 'The Present Simple tense is used to describe habits, general truths, and repeated actions.',
    rules: [
      'Use for habits and routines',
      'Use for general truths and facts',
      'Use for scheduled events',
      'Add -s/-es for 3rd person singular'
    ],
    examples: [
      'I work in a bank.',
      'She studies English every day.',
      'The sun rises in the east.',
      'The train leaves at 8 AM.'
    ],
    notes: [
      'Remember to add -s for he/she/it',
      'Use do/does for questions and negatives',
      'Common time expressions: always, usually, often, sometimes, never'
    ]
  },
  practice_questions: 10,
  required_score: 70,
  points_reward: 25
})

const videoRef = ref(null)

onMounted(async () => {
  await loadLessonData()
  loading.value = false
})

const loadLessonData = async () => {
  try {
    // Load lesson data from API
    const lessonData = getLessonById(parseInt(lessonId.value))
    
    if (lessonData) {
      lesson.value = {
        id: lessonData.id,
        title: lessonData.title,
        category: 'grammar',
        level: lessonData.levels?.level?.toLowerCase() || 'beginner',
        duration: '15 minutes',
        video_url: lessonData.videoUrl,
        theory: {
          overview: lessonData.description,
          rules: lessonData.rules ? lessonData.rules.split('\n').filter(rule => rule.trim()) : [],
          examples: lessonData.example ? lessonData.example.split('\n').filter(example => example.trim()) : [],
          notes: []
        },
        practice_questions: 10,
        required_score: 70,
        points_reward: lessonData.score || 25,
        assignment: lessonData.assignment
      }
    }
  } catch (error) {
    console.error('Failed to load lesson data:', error)
  }
}

const handleVideoPlay = () => {
  isVideoPlaying.value = true
}

const handleVideoPause = () => {
  isVideoPlaying.value = false
}

const handleVideoTimeUpdate = (event) => {
  currentVideoTime.value = event.target.currentTime
  videoDuration.value = event.target.duration
}

const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

const startPractice = () => {
  router.push(`/practice/${lessonId.value}`)
}

const completeLesson = async () => {
  try {
    await endLesson(lessonId.value)
    // Optionally refresh user progress or show success message
    console.log('Lesson completed successfully')
  } catch (error) {
    console.error('Failed to end lesson:', error)
  }
}

const isLessonCompleted = computed(() => {
  return userStore.progress.grammar.completedLessons?.includes(lessonId.value) || false
})

const canStartPractice = computed(() => {
  return currentVideoTime.value >= videoDuration.value * 0.8 || isLessonCompleted.value
})
</script>

<template>
  <div class="lesson-detail-container">
    <BackButton :fixed="true" />
    <div v-if="loading" class="loading-container">
      <div class="loading-spinner"></div>
      <p>Loading lesson...</p>
    </div>

    <div v-else class="lesson-content">
      <!-- Header -->
      <div class="lesson-header">
        <div class="lesson-info">
          <h1 class="lesson-title">{{ lesson.title }}</h1>
          <div class="lesson-meta">
            <span class="lesson-category">{{ lesson.category }}</span>
            <span class="lesson-level">{{ lesson.level }}</span>
            <span class="lesson-duration">{{ lesson.duration }}</span>
          </div>
        </div>
        <div class="lesson-progress">
          <div class="progress-circle">
            <svg viewBox="0 0 36 36" class="progress-ring">
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="#e5e7eb"
                stroke-width="2"
              />
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="#667eea"
                stroke-width="2"
                :stroke-dasharray="isLessonCompleted ? '100' : '0'"
                stroke-dashoffset="25"
              />
            </svg>
            <div class="progress-text">
              <span v-if="isLessonCompleted" class="completed-icon">✓</span>
              <span v-else class="progress-percentage">{{ Math.round((currentVideoTime / videoDuration) * 100) || 0 }}%</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Video Section -->
      <div class="video-section">
        <div class="video-container">
          <iframe
            ref="videoRef"
            :src="lesson.video_url"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
            class="video-frame"
            @load="handleVideoTimeUpdate"
          ></iframe>
        </div>
        <div class="video-controls">
          <div class="time-display">
            <span>{{ formatTime(currentVideoTime) }}</span>
            <span>/</span>
            <span>{{ formatTime(videoDuration) }}</span>
          </div>
          <div class="play-status">
            <span v-if="isVideoPlaying" class="playing">▶ Playing</span>
            <span v-else class="paused">⏸ Paused</span>
          </div>
        </div>
      </div>

      <!-- Theory Section -->
      <div class="theory-section">
        <h2 class="section-title">Theory</h2>
        
        <div class="theory-content">
          <div class="overview">
            <h3>Overview</h3>
            <p>{{ lesson.theory.overview }}</p>
          </div>

          <div class="rules">
            <h3>Rules</h3>
            <ul class="rules-list">
              <li v-for="(rule, index) in lesson.theory.rules" :key="index">
                {{ rule }}
              </li>
            </ul>
          </div>

          <div class="examples">
            <h3>Examples</h3>
            <div class="examples-grid">
              <div v-for="(example, index) in lesson.theory.examples" :key="index" class="example-card">
                <span class="example-text">{{ example }}</span>
              </div>
            </div>
          </div>

          <div class="notes">
            <h3>Important Notes</h3>
            <ul class="notes-list">
              <li v-for="(note, index) in lesson.theory.notes" :key="index">
                {{ note }}
              </li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Practice Section -->
      <div class="practice-section">
        <div class="practice-info">
          <h2>Practice Test</h2>
          <div class="practice-details">
            <div class="detail-item">
              <span class="detail-label">Questions:</span>
              <span class="detail-value">{{ lesson.practice_questions }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Required Score:</span>
              <span class="detail-value">{{ lesson.required_score }}%</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Points Reward:</span>
              <span class="detail-value">{{ lesson.points_reward }} pts</span>
            </div>
          </div>
        </div>

        <button
          @click="startPractice"
          class="btn btn-primary practice-btn"
          :disabled="!canStartPractice"
        >
          <span v-if="!canStartPractice" class="btn-disabled-text">
            Watch 80% of video to unlock practice
          </span>
          <span v-else>
            {{ isLessonCompleted ? 'Retake Practice' : 'Start Practice' }}
          </span>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.lesson-detail-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  gap: 1rem;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #e5e7eb;
  border-top: 4px solid #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.lesson-content {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.lesson-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 2rem;
}

.lesson-info {
  flex: 1;
}

.lesson-title {
  font-size: 2.5rem;
  font-weight: 800;
  color: #1e293b;
  margin-bottom: 1rem;
}

.lesson-meta {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.lesson-category,
.lesson-level,
.lesson-duration {
  padding: 0.5rem 1rem;
  border-radius: 2rem;
  font-size: 0.875rem;
  font-weight: 600;
}

.lesson-category {
  background: #dbeafe;
  color: #1e40af;
}

.lesson-level {
  background: #fef3c7;
  color: #d97706;
}

.lesson-duration {
  background: #dcfce7;
  color: #16a34a;
}

.lesson-progress {
  display: flex;
  align-items: center;
}

.progress-circle {
  position: relative;
  width: 80px;
  height: 80px;
}

.progress-ring {
  transform: rotate(-90deg);
}

.progress-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 1.25rem;
  font-weight: 700;
  color: #667eea;
}

.completed-icon {
  color: #16a34a;
  font-size: 1.5rem;
}

.video-section {
  background: white;
  border-radius: 1rem;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
}

.video-container {
  position: relative;
  width: 100%;
  height: 0;
  padding-bottom: 56.25%; /* 16:9 aspect ratio */
}

.video-frame {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.video-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  background: #f8fafc;
  border-top: 1px solid #e5e7eb;
}

.time-display {
  display: flex;
  gap: 0.5rem;
  font-family: monospace;
  font-weight: 600;
  color: #64748b;
}

.play-status {
  font-size: 0.875rem;
  font-weight: 600;
}

.playing {
  color: #16a34a;
}

.paused {
  color: #f59e0b;
}

.theory-section {
  background: white;
  border-radius: 1rem;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
}

.section-title {
  font-size: 1.75rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 1.5rem;
}

.theory-content {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.overview h3,
.rules h3,
.examples h3,
.notes h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 1rem;
}

.overview p {
  color: #64748b;
  line-height: 1.6;
  font-size: 1.1rem;
}

.rules-list {
  list-style: none;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.rules-list li {
  padding: 1rem;
  background: #f8fafc;
  border-radius: 0.75rem;
  border-left: 4px solid #667eea;
  color: #374151;
  font-weight: 500;
}

.examples-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1rem;
}

.example-card {
  padding: 1.5rem;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  border-radius: 0.75rem;
  text-align: center;
  font-weight: 600;
  font-size: 1.1rem;
}

.notes-list {
  list-style: none;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.notes-list li {
  padding: 1rem;
  background: #fef3c7;
  border-radius: 0.75rem;
  color: #92400e;
  font-weight: 500;
  border-left: 4px solid #f59e0b;
}

.practice-section {
  background: white;
  border-radius: 1rem;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 2rem;
}

.practice-info h2 {
  font-size: 1.75rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 1rem;
}

.practice-details {
  display: flex;
  gap: 2rem;
}

.detail-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.detail-label {
  font-size: 0.875rem;
  color: #64748b;
  font-weight: 500;
}

.detail-value {
  font-size: 1.125rem;
  font-weight: 700;
  color: #1e293b;
}

.practice-btn {
  padding: 1rem 2rem;
  font-size: 1.125rem;
  font-weight: 600;
  border-radius: 0.75rem;
  min-width: 200px;
  height: fit-content;
}

.practice-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  background: #e5e7eb;
  color: #9ca3af;
}

.btn-disabled-text {
  font-size: 0.875rem;
}

/* Responsive Design */
@media (max-width: 768px) {
  .lesson-detail-container {
    padding: 1rem;
  }
  
  .lesson-header {
    flex-direction: column;
    gap: 1rem;
  }
  
  .lesson-title {
    font-size: 2rem;
  }
  
  .practice-section {
    flex-direction: column;
    gap: 1.5rem;
  }
  
  .practice-details {
    flex-direction: column;
    gap: 1rem;
  }
  
  .examples-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .lesson-title {
    font-size: 1.75rem;
  }
  
  .lesson-meta {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .theory-section,
  .practice-section {
    padding: 1.5rem;
  }
}
</style>

