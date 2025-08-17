<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { useUserStore } from '@/stores/userStore.js'

const userStore = useUserStore()
const loading = ref(true)
const selectedDate = ref(new Date())
const selectedView = ref('week')

const views = [
  { id: 'day', name: 'Day', icon: '📅' },
  { id: 'week', name: 'Week', icon: '📊' },
  { id: 'month', name: 'Month', icon: '📆' }
]

const tasks = ref([
  {
    id: 1,
    title: 'Complete Present Simple Lesson',
    description: 'Watch video and take practice test',
    date: '2024-01-15',
    time: '09:00',
    duration: 30,
    type: 'lesson',
    completed: false,
    priority: 'high'
  },
  {
    id: 2,
    title: 'Vocabulary Practice',
    description: 'Learn 20 new words from Unit 3',
    date: '2024-01-15',
    time: '14:00',
    duration: 20,
    type: 'vocabulary',
    completed: true,
    priority: 'medium'
  },
  {
    id: 3,
    title: 'Grammar Quiz',
    description: 'Take quiz on Past Tense',
    date: '2024-01-16',
    time: '10:00',
    duration: 15,
    type: 'quiz',
    completed: false,
    priority: 'high'
  },
  {
    id: 4,
    title: 'Reading Practice',
    description: 'Read short story and answer questions',
    date: '2024-01-16',
    time: '16:00',
    duration: 25,
    type: 'reading',
    completed: false,
    priority: 'low'
  },
  {
    id: 5,
    title: 'Speaking Practice',
    description: 'Practice pronunciation with audio',
    date: '2024-01-17',
    time: '11:00',
    duration: 20,
    type: 'speaking',
    completed: false,
    priority: 'medium'
  }
])

const newTask = reactive({
  title: '',
  description: '',
  date: '',
  time: '',
  duration: 30,
  type: 'lesson',
  priority: 'medium'
})

const showAddTask = ref(false)

onMounted(async () => {
  await loadPlannerData()
  loading.value = false
})

const loadPlannerData = async () => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  // In a real app, you would fetch planner data from API
  // const response = await api.getPlanner(selectedDate.value)
  // tasks.value = response.data.tasks
}

const addTask = async () => {
  if (!newTask.title || !newTask.date) return
  
  const task = {
    id: Date.now(),
    ...newTask,
    completed: false
  }
  
  tasks.value.push(task)
  
  // Reset form
  Object.assign(newTask, {
    title: '',
    description: '',
    date: '',
    time: '',
    duration: 30,
    type: 'lesson',
    priority: 'medium'
  })
  
  showAddTask.value = false
  
  // In a real app, you would send the task to API
  // await api.addTask(task)
}

const toggleTask = (taskId) => {
  const task = tasks.value.find(t => t.id === taskId)
  if (task) {
    task.completed = !task.completed
  }
}

const deleteTask = (taskId) => {
  tasks.value = tasks.value.filter(t => t.id !== taskId)
}

const getTasksForDate = (date) => {
  return tasks.value.filter(task => task.date === date)
}

const getTasksForWeek = () => {
  const startOfWeek = new Date(selectedDate.value)
  startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay())
  
  const weekTasks = []
  for (let i = 0; i < 7; i++) {
    const date = new Date(startOfWeek)
    date.setDate(date.getDate() + i)
    const dateStr = date.toISOString().split('T')[0]
    weekTasks.push({
      date: dateStr,
      tasks: getTasksForDate(dateStr)
    })
  }
  return weekTasks
}

const getPriorityColor = (priority) => {
  switch (priority) {
    case 'high': return '#dc2626'
    case 'medium': return '#f59e0b'
    case 'low': return '#16a34a'
    default: return '#64748b'
  }
}

const getTypeIcon = (type) => {
  switch (type) {
    case 'lesson': return '📚'
    case 'vocabulary': return '📖'
    case 'quiz': return '📝'
    case 'reading': return '📰'
    case 'speaking': return '🗣️'
    case 'listening': return '🎧'
    case 'writing': return '✍️'
    default: return '📋'
  }
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  })
}

const formatTime = (timeString) => {
  return timeString
}

const today = computed(() => {
  return new Date().toISOString().split('T')[0]
})

const completedTasks = computed(() => {
  return tasks.value.filter(task => task.completed).length
})

const totalTasks = computed(() => tasks.value.length)
const completionRate = computed(() => {
  return totalTasks.value > 0 ? Math.round((completedTasks.value / totalTasks.value) * 100) : 0
})
</script>

<template>
  <div class="planner-container">
    <div v-if="loading" class="loading">
      <div class="spinner"></div>
      <p>Loading planner...</p>
    </div>

    <div v-else class="planner-content">
      <!-- Header -->
      <div class="header">
        <h1>Study Planner</h1>
        <p class="subtitle">Organize your learning schedule</p>
      </div>

      <!-- Overview Stats -->
      <div class="overview-stats">
        <div class="stat-card">
          <div class="stat-icon">📋</div>
          <div class="stat-info">
            <span class="stat-value">{{ totalTasks }}</span>
            <span class="stat-label">Total Tasks</span>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">✅</div>
          <div class="stat-info">
            <span class="stat-value">{{ completedTasks }}</span>
            <span class="stat-label">Completed</span>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">📊</div>
          <div class="stat-info">
            <span class="stat-value">{{ completionRate }}%</span>
            <span class="stat-label">Completion Rate</span>
          </div>
        </div>
      </div>

      <!-- Controls -->
      <div class="controls">
        <div class="view-selector">
          <button
            v-for="view in views"
            :key="view.id"
            @click="selectedView = view.id"
            class="view-btn"
            :class="{ 'active': selectedView === view.id }"
          >
            <span class="view-icon">{{ view.icon }}</span>
            <span class="view-name">{{ view.name }}</span>
          </button>
        </div>

        <button @click="showAddTask = true" class="btn btn-primary add-task-btn">
          <span class="btn-icon">➕</span>
          Add Task
        </button>
      </div>

      <!-- Calendar View -->
      <div class="calendar-view">
        <div v-if="selectedView === 'week'" class="week-view">
          <div class="week-header">
            <h2>This Week</h2>
            <div class="week-nav">
              <button class="nav-btn">←</button>
              <span class="current-week">Jan 15 - Jan 21, 2024</span>
              <button class="nav-btn">→</button>
            </div>
          </div>

          <div class="week-grid">
            <div
              v-for="day in getTasksForWeek()"
              :key="day.date"
              class="day-column"
              :class="{ 'today': day.date === today }"
            >
              <div class="day-header">
                <span class="day-name">{{ formatDate(day.date).split(',')[0] }}</span>
                <span class="day-date">{{ formatDate(day.date).split(',')[1] }}</span>
              </div>

              <div class="day-tasks">
                <div
                  v-for="task in day.tasks"
                  :key="task.id"
                  class="task-item"
                  :class="{ 'completed': task.completed }"
                  :style="{ borderLeftColor: getPriorityColor(task.priority) }"
                >
                  <div class="task-header">
                    <span class="task-icon">{{ getTypeIcon(task.type) }}</span>
                    <span class="task-time">{{ formatTime(task.time) }}</span>
                  </div>
                  
                  <h4 class="task-title">{{ task.title }}</h4>
                  <p class="task-description">{{ task.description }}</p>
                  
                  <div class="task-footer">
                    <span class="task-duration">{{ task.duration }}m</span>
                    <div class="task-actions">
                      <button @click="toggleTask(task.id)" class="action-btn">
                        {{ task.completed ? '✓' : '○' }}
                      </button>
                      <button @click="deleteTask(task.id)" class="action-btn delete">
                        🗑️
                      </button>
                    </div>
                  </div>
                </div>

                <div v-if="day.tasks.length === 0" class="empty-day">
                  <span class="empty-text">No tasks</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-else-if="selectedView === 'day'" class="day-view">
          <div class="day-header">
            <h2>{{ formatDate(selectedDate.toISOString().split('T')[0]) }}</h2>
          </div>

          <div class="day-tasks">
            <div
              v-for="task in getTasksForDate(selectedDate.toISOString().split('T')[0])"
              :key="task.id"
              class="task-item"
              :class="{ 'completed': task.completed }"
              :style="{ borderLeftColor: getPriorityColor(task.priority) }"
            >
              <div class="task-header">
                <span class="task-icon">{{ getTypeIcon(task.type) }}</span>
                <span class="task-time">{{ formatTime(task.time) }}</span>
              </div>
              
              <h4 class="task-title">{{ task.title }}</h4>
              <p class="task-description">{{ task.description }}</p>
              
              <div class="task-footer">
                <span class="task-duration">{{ task.duration }}m</span>
                <div class="task-actions">
                  <button @click="toggleTask(task.id)" class="action-btn">
                    {{ task.completed ? '✓' : '○' }}
                  </button>
                  <button @click="deleteTask(task.id)" class="action-btn delete">
                    🗑️
                  </button>
                </div>
              </div>
            </div>

            <div v-if="getTasksForDate(selectedDate.toISOString().split('T')[0]).length === 0" class="empty-day">
              <span class="empty-text">No tasks for this day</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Add Task Modal -->
      <div v-if="showAddTask" class="modal-overlay" @click="showAddTask = false">
        <div class="modal" @click.stop>
          <div class="modal-header">
            <h3>Add New Task</h3>
            <button @click="showAddTask = false" class="close-btn">×</button>
          </div>

          <form @submit.prevent="addTask" class="modal-form">
            <div class="form-group">
              <label for="task-title">Task Title</label>
              <input
                id="task-title"
                v-model="newTask.title"
                type="text"
                class="form-input"
                placeholder="Enter task title"
                required
              />
            </div>

            <div class="form-group">
              <label for="task-description">Description</label>
              <textarea
                id="task-description"
                v-model="newTask.description"
                class="form-input"
                placeholder="Enter task description"
                rows="3"
              ></textarea>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="task-date">Date</label>
                <input
                  id="task-date"
                  v-model="newTask.date"
                  type="date"
                  class="form-input"
                  required
                />
              </div>

              <div class="form-group">
                <label for="task-time">Time</label>
                <input
                  id="task-time"
                  v-model="newTask.time"
                  type="time"
                  class="form-input"
                  required
                />
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="task-duration">Duration (minutes)</label>
                <select id="task-duration" v-model="newTask.duration" class="form-input">
                  <option value="15">15 minutes</option>
                  <option value="20">20 minutes</option>
                  <option value="30">30 minutes</option>
                  <option value="45">45 minutes</option>
                  <option value="60">1 hour</option>
                </select>
              </div>

              <div class="form-group">
                <label for="task-priority">Priority</label>
                <select id="task-priority" v-model="newTask.priority" class="form-input">
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>

            <div class="form-group">
              <label for="task-type">Task Type</label>
              <select id="task-type" v-model="newTask.type" class="form-input">
                <option value="lesson">Lesson</option>
                <option value="vocabulary">Vocabulary</option>
                <option value="quiz">Quiz</option>
                <option value="reading">Reading</option>
                <option value="speaking">Speaking</option>
                <option value="listening">Listening</option>
                <option value="writing">Writing</option>
              </select>
            </div>

            <div class="modal-actions">
              <button type="button" @click="showAddTask = false" class="btn btn-secondary">
                Cancel
              </button>
              <button type="submit" class="btn btn-primary">
                Add Task
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.planner-container {
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

.planner-content {
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

.controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: white;
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
}

.view-selector {
  display: flex;
  gap: 0.5rem;
}

.view-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 0.75rem;
  background: white;
  color: #64748b;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.view-btn:hover {
  border-color: #667eea;
  color: #667eea;
}

.view-btn.active {
  background: #667eea;
  border-color: #667eea;
  color: white;
}

.view-icon {
  font-size: 1rem;
}

.add-task-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.add-task-btn:hover {
  background: #5a67d8;
}

.btn-icon {
  font-size: 1rem;
}

.calendar-view {
  background: white;
  border-radius: 1rem;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
}

.week-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.week-header h2 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e293b;
}

.week-nav {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.nav-btn {
  width: 40px;
  height: 40px;
  border: 2px solid #e5e7eb;
  border-radius: 50%;
  background: white;
  color: #64748b;
  cursor: pointer;
  transition: all 0.2s ease;
}

.nav-btn:hover {
  border-color: #667eea;
  color: #667eea;
}

.current-week {
  font-weight: 600;
  color: #1e293b;
}

.week-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 1rem;
}

.day-column {
  border: 1px solid #e5e7eb;
  border-radius: 0.75rem;
  overflow: hidden;
  transition: all 0.2s ease;
}

.day-column.today {
  border-color: #667eea;
  background: #f8fafc;
}

.day-header {
  background: #f8fafc;
  padding: 1rem;
  text-align: center;
  border-bottom: 1px solid #e5e7eb;
}

.day-name {
  display: block;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 0.25rem;
}

.day-date {
  font-size: 0.875rem;
  color: #64748b;
}

.day-tasks {
  padding: 1rem;
  min-height: 200px;
}

.task-item {
  background: white;
  border-radius: 0.5rem;
  padding: 1rem;
  margin-bottom: 1rem;
  border-left: 4px solid;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  transition: all 0.2s ease;
}

.task-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.task-item.completed {
  opacity: 0.6;
  background: #f8fafc;
}

.task-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.task-icon {
  font-size: 1.25rem;
}

.task-time {
  font-size: 0.875rem;
  color: #64748b;
  font-weight: 600;
}

.task-title {
  font-size: 1rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 0.5rem 0;
}

.task-description {
  font-size: 0.875rem;
  color: #64748b;
  margin: 0 0 1rem 0;
  line-height: 1.4;
}

.task-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.task-duration {
  font-size: 0.75rem;
  color: #64748b;
  font-weight: 600;
}

.task-actions {
  display: flex;
  gap: 0.5rem;
}

.action-btn {
  width: 24px;
  height: 24px;
  border: none;
  border-radius: 50%;
  background: #f8fafc;
  color: #64748b;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.875rem;
}

.action-btn:hover {
  background: #e5e7eb;
}

.action-btn.delete:hover {
  background: #fef2f2;
  color: #dc2626;
}

.empty-day {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100px;
  color: #9ca3af;
  font-style: italic;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal {
  background: white;
  border-radius: 1rem;
  padding: 2rem;
  max-width: 500px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.modal-header h3 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #64748b;
  cursor: pointer;
  padding: 0.5rem;
}

.close-btn:hover {
  color: #1e293b;
}

.modal-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.form-input {
  padding: 0.75rem 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 0.75rem;
  font-size: 1rem;
  transition: all 0.2s ease;
}

.form-input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.modal-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 1rem;
}

.btn {
  padding: 0.875rem 1.5rem;
  font-size: 1rem;
  font-weight: 600;
  border-radius: 0.75rem;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-primary {
  background: #667eea;
  color: white;
}

.btn-primary:hover {
  background: #5a67d8;
}

.btn-secondary {
  background: #f8fafc;
  color: #64748b;
  border: 2px solid #e5e7eb;
}

.btn-secondary:hover {
  background: #f1f5f9;
}

@media (max-width: 768px) {
  .planner-container {
    padding: 1rem;
  }
  
  .header h1 {
    font-size: 2rem;
  }
  
  .overview-stats {
    grid-template-columns: 1fr;
  }
  
  .controls {
    flex-direction: column;
    gap: 1rem;
  }
  
  .week-grid {
    grid-template-columns: 1fr;
  }
  
  .form-row {
    grid-template-columns: 1fr;
  }
  
  .modal {
    margin: 1rem;
    width: calc(100% - 2rem);
  }
}

@media (max-width: 480px) {
  .week-header {
    flex-direction: column;
    gap: 1rem;
  }
  
  .task-footer {
    flex-direction: column;
    gap: 0.5rem;
    align-items: flex-start;
  }
}
</style>



