<template>
  <DefaultLayout>
    <div class="grammar-admin-container">
      <div class="container">
        <div class="admin-header">
          <h1 class="admin-title">Grammar Lessons Management</h1>
          <p class="admin-subtitle">Add and manage grammar lessons</p>
        </div>

        <!-- Add New Lesson Form -->
        <div class="add-lesson-section">
          <h2 class="section-title">Add New Lesson</h2>
          <form @submit.prevent="addLesson" class="lesson-form">
            <div class="form-grid">
              <div class="form-group">
                <label for="title">Lesson Title *</label>
                <input 
                  id="title"
                  v-model="newLesson.title" 
                  type="text" 
                  required
                  placeholder="Enter lesson title"
                />
              </div>

              <div class="form-group">
                <label for="description">Description *</label>
                <textarea 
                  id="description"
                  v-model="newLesson.description" 
                  required
                  placeholder="Enter lesson description"
                  rows="3"
                ></textarea>
              </div>

              <div class="form-group">
                <label for="videoUrl">Video URL</label>
                <input 
                  id="videoUrl"
                  v-model="newLesson.videoUrl" 
                  type="url" 
                  placeholder="Enter video URL"
                />
              </div>

              <div class="form-group">
                <label for="rules">Grammar Rules</label>
                <textarea 
                  id="rules"
                  v-model="newLesson.rules" 
                  placeholder="Enter grammar rules (one per line)"
                  rows="4"
                ></textarea>
              </div>

              <div class="form-group">
                <label for="example">Examples</label>
                <textarea 
                  id="example"
                  v-model="newLesson.example" 
                  placeholder="Enter examples (one per line)"
                  rows="4"
                ></textarea>
              </div>

              <div class="form-group">
                <label for="assignment">Assignment</label>
                <textarea 
                  id="assignment"
                  v-model="newLesson.assignment" 
                  placeholder="Enter assignment description"
                  rows="3"
                ></textarea>
              </div>

              <div class="form-group">
                <label for="level">Level *</label>
                <select 
                  id="level"
                  v-model="newLesson.levels.id" 
                  required
                >
                  <option value="">Select a level</option>
                  <option 
                    v-for="level in grammarLevels" 
                    :key="level.id" 
                    :value="level.id"
                  >
                    {{ level.level }}
                  </option>
                </select>
              </div>

              <div class="form-group">
                <label for="score">Score</label>
                <input 
                  id="score"
                  v-model.number="newLesson.score" 
                  type="number" 
                  min="0"
                  placeholder="Enter lesson score"
                />
              </div>
            </div>

            <div class="form-actions">
              <button 
                type="submit" 
                class="btn btn-primary"
                :disabled="isSubmitting"
              >
                <span v-if="isSubmitting">Adding...</span>
                <span v-else>Add Lesson</span>
              </button>
              <button 
                type="button" 
                class="btn btn-secondary"
                @click="resetForm"
              >
                Reset Form
              </button>
            </div>
          </form>
        </div>

        <!-- Existing Lessons -->
        <div class="existing-lessons-section">
          <h2 class="section-title">Existing Lessons</h2>
          <div class="lessons-grid">
            <div 
              class="lesson-card" 
              v-for="lesson in grammarLessons" 
              :key="lesson.id"
            >
              <div class="lesson-header">
                <h3 class="lesson-title">{{ lesson.title }}</h3>
                <span class="lesson-level">{{ lesson.levels?.level }}</span>
              </div>
              <p class="lesson-description">{{ lesson.description }}</p>
              <div class="lesson-meta">
                <span class="lesson-score" v-if="lesson.score">
                  Score: {{ lesson.score }}
                </span>
                <span class="lesson-status" v-if="lesson.ended">
                  Completed
                </span>
              </div>
              <div class="lesson-actions">
                <button 
                  class="btn btn-sm btn-outline"
                  @click="editLesson(lesson)"
                >
                  Edit
                </button>
                <button 
                  class="btn btn-sm btn-danger"
                  @click="deleteLesson(lesson.id)"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Topic List -->
        <div class="topic-list-section">
          <h2 class="section-title">Topic List</h2>
          <div class="topic-grid">
            <div 
              class="topic-card" 
              v-for="topic in topicList" 
              :key="topic.id"
            >
              <h3 class="topic-title">{{ topic.title }}</h3>
              <span class="topic-id">ID: {{ topic.id }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </DefaultLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useGrammar } from '@/composables/useGrammar.js'
import DefaultLayout from '@/components/DefaultLayout.vue'

const isSubmitting = ref(false)

// Use the grammar composable
const {
  grammarLevels,
  grammarLessons,
  topicList,
  isLoading,
  error,
  loadAllData,
  addLessons
} = useGrammar()

const newLesson = ref({
  title: '',
  description: '',
  videoUrl: '',
  rules: '',
  example: '',
  levels: {
    id: '',
    level: ''
  },
  assignment: '',
  score: 0
})

onMounted(() => {
  loadAllData()
})

const addLesson = async () => {
  try {
    isSubmitting.value = true
    
    // Find the level object
    const selectedLevel = grammarLevels.value.find(level => level.id === newLesson.value.levels.id)
    
    const lessonData = {
      ...newLesson.value,
      levels: {
        id: selectedLevel.id,
        level: selectedLevel.level
      }
    }
    
    await addLessons([lessonData])
    
    // Reset form
    resetForm()
    
    alert('Lesson added successfully!')
  } catch (error) {
    console.error('Failed to add lesson:', error)
    alert('Failed to add lesson. Please try again.')
  } finally {
    isSubmitting.value = false
  }
}

const resetForm = () => {
  newLesson.value = {
    title: '',
    description: '',
    videoUrl: '',
    rules: '',
    example: '',
    levels: {
      id: '',
      level: ''
    },
    assignment: '',
    score: 0
  }
}

const editLesson = (lesson) => {
  // TODO: Implement edit functionality
  console.log('Edit lesson:', lesson)
}

const deleteLesson = async (lessonId) => {
  if (confirm('Are you sure you want to delete this lesson?')) {
    // TODO: Implement delete functionality
    console.log('Delete lesson:', lessonId)
  }
}
</script>

<style scoped>
.grammar-admin-container {
  padding: 2rem 0;
}

.admin-header {
  text-align: center;
  margin-bottom: 3rem;
}

.admin-title {
  font-size: 2.5rem;
  font-weight: 800;
  color: #1e293b;
  margin-bottom: 0.5rem;
}

.admin-subtitle {
  font-size: 1.1rem;
  color: #64748b;
}

.section-title {
  font-size: 1.75rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 1.5rem;
}

.add-lesson-section {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  margin-bottom: 3rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
}

.lesson-form {
  max-width: 100%;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group label {
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.5rem;
}

.form-group input,
.form-group textarea,
.form-group select {
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 0.875rem;
  transition: border-color 0.2s;
}

.form-group input:focus,
.form-group textarea:focus,
.form-group select:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-start;
}

.btn {
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
  font-size: 0.875rem;
}

.btn-primary {
  background: #667eea;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: #5a67d8;
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-secondary {
  background: #f3f4f6;
  color: #374151;
}

.btn-secondary:hover {
  background: #e5e7eb;
}

.btn-sm {
  padding: 0.5rem 1rem;
  font-size: 0.75rem;
}

.btn-outline {
  background: transparent;
  border: 1px solid #d1d5db;
  color: #374151;
}

.btn-outline:hover {
  background: #f9fafb;
}

.btn-danger {
  background: #ef4444;
  color: white;
}

.btn-danger:hover {
  background: #dc2626;
}

.existing-lessons-section {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  margin-bottom: 3rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
}

.lessons-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 1.5rem;
}

.lesson-card {
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 1.5rem;
  transition: all 0.2s;
}

.lesson-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.lesson-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.lesson-title {
  font-size: 1.125rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
}

.lesson-level {
  background: #dbeafe;
  color: #1e40af;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
}

.lesson-description {
  color: #64748b;
  margin-bottom: 1rem;
  line-height: 1.5;
}

.lesson-meta {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}

.lesson-score,
.lesson-status {
  font-size: 0.875rem;
  color: #64748b;
}

.lesson-actions {
  display: flex;
  gap: 0.5rem;
}

.topic-list-section {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
}

.topic-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
}

.topic-card {
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 1rem;
  text-align: center;
}

.topic-title {
  font-size: 1rem;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 0.5rem;
}

.topic-id {
  font-size: 0.875rem;
  color: #64748b;
}

@media (max-width: 768px) {
  .form-grid {
    grid-template-columns: 1fr;
  }
  
  .form-actions {
    flex-direction: column;
  }
  
  .lessons-grid {
    grid-template-columns: 1fr;
  }
  
  .topic-grid {
    grid-template-columns: 1fr;
  }
}
</style>
