<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { useUserStore } from '@/stores/userStore.js'

const userStore = useUserStore()
const loading = ref(true)
const activeTab = ref('profile')

const tabs = [
  { id: 'profile', name: 'Profile', icon: '👤' },
  { id: 'settings', name: 'Settings', icon: '⚙️' },
  { id: 'security', name: 'Security', icon: '🔒' }
]

const user = ref({
  id: 1,
  username: 'demo_user',
  email: 'demo@learnenglish.com',
  full_name: 'Demo User',
  avatar: '👤',
  learning_level: 'intermediate',
  points: 250,
  streak_days: 5,
  lessons_completed: 12,
  tests_passed: 8,
  join_date: '2024-01-01',
  last_login: '2024-01-15',
  country: 'United States',
  timezone: 'UTC-5',
  notifications: {
    email: true,
    push: true,
    reminders: true
  }
})

const profileForm = reactive({
  full_name: user.value.full_name,
  username: user.value.username,
  email: user.value.email,
  country: user.value.country,
  timezone: user.value.timezone
})

const settingsForm = reactive({
  notifications: { ...user.value.notifications },
  language: 'en',
  theme: 'light',
  auto_play: true,
  sound_effects: true
})

const securityForm = reactive({
  current_password: '',
  new_password: '',
  confirm_password: ''
})

onMounted(async () => {
  await loadUserData()
  loading.value = false
})

const loadUserData = async () => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  // In a real app, you would fetch user data from API
  // const response = await api.getUserProfile()
  // user.value = response.data
  // profileForm.full_name = user.value.full_name
  // etc.
}

const updateProfile = async () => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  // Update user data
  Object.assign(user.value, profileForm)
  
  // In a real app, you would send the update to API
  // await api.updateProfile(profileForm)
}

const updateSettings = async () => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  // Update settings
  Object.assign(user.value.notifications, settingsForm.notifications)
  
  // In a real app, you would send the update to API
  // await api.updateSettings(settingsForm)
}

const updatePassword = async () => {
  if (securityForm.new_password !== securityForm.confirm_password) {
    alert('New passwords do not match')
    return
  }
  
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  // In a real app, you would send the password update to API
  // await api.updatePassword(securityForm)
  
  // Clear form
  securityForm.current_password = ''
  securityForm.new_password = ''
  securityForm.confirm_password = ''
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
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
</script>

<template>
  <div class="profile-container">
    <div v-if="loading" class="loading">
      <div class="spinner"></div>
      <p>Loading profile...</p>
    </div>

    <div v-else class="profile-content">
      <!-- Header -->
      <div class="header">
        <h1>My Profile</h1>
        <p class="subtitle">Manage your account and preferences</p>
      </div>

      <!-- Profile Overview -->
      <div class="profile-overview">
        <div class="avatar-section">
          <div class="avatar">{{ user.avatar }}</div>
          <div class="user-info">
            <h2>{{ user.full_name }}</h2>
            <p class="username">@{{ user.username }}</p>
            <div class="level-badge" :style="{ color: getLevelColor(user.learning_level) }">
              {{ getLevelBadge(user.learning_level) }}
            </div>
          </div>
        </div>
        
        <div class="stats-grid">
          <div class="stat-item">
            <span class="stat-value">{{ user.points }}</span>
            <span class="stat-label">Points</span>
          </div>
          <div class="stat-item">
            <span class="stat-value">{{ user.streak_days }}</span>
            <span class="stat-label">Day Streak</span>
          </div>
          <div class="stat-item">
            <span class="stat-value">{{ user.lessons_completed }}</span>
            <span class="stat-label">Lessons</span>
          </div>
          <div class="stat-item">
            <span class="stat-value">{{ user.tests_passed }}</span>
            <span class="stat-label">Tests Passed</span>
          </div>
        </div>
      </div>

      <!-- Tabs -->
      <div class="tabs-container">
        <div class="tabs">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            @click="activeTab = tab.id"
            class="tab-btn"
            :class="{ 'active': activeTab === tab.id }"
          >
            <span class="tab-icon">{{ tab.icon }}</span>
            <span class="tab-name">{{ tab.name }}</span>
          </button>
        </div>

        <!-- Profile Tab -->
        <div v-if="activeTab === 'profile'" class="tab-content">
          <div class="form-section">
            <h3>Personal Information</h3>
            <form @submit.prevent="updateProfile" class="form">
              <div class="form-group">
                <label for="full_name">Full Name</label>
                <input
                  id="full_name"
                  v-model="profileForm.full_name"
                  type="text"
                  class="form-input"
                  required
                />
              </div>
              
              <div class="form-group">
                <label for="username">Username</label>
                <input
                  id="username"
                  v-model="profileForm.username"
                  type="text"
                  class="form-input"
                  required
                />
              </div>
              
              <div class="form-group">
                <label for="email">Email</label>
                <input
                  id="email"
                  v-model="profileForm.email"
                  type="email"
                  class="form-input"
                  required
                />
              </div>
              
              <div class="form-row">
                <div class="form-group">
                  <label for="country">Country</label>
                  <select id="country" v-model="profileForm.country" class="form-input">
                    <option value="United States">United States</option>
                    <option value="Canada">Canada</option>
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="Australia">Australia</option>
                    <option value="Germany">Germany</option>
                    <option value="France">France</option>
                    <option value="Spain">Spain</option>
                    <option value="Italy">Italy</option>
                    <option value="Japan">Japan</option>
                    <option value="South Korea">South Korea</option>
                  </select>
                </div>
                
                <div class="form-group">
                  <label for="timezone">Timezone</label>
                  <select id="timezone" v-model="profileForm.timezone" class="form-input">
                    <option value="UTC-8">UTC-8 (PST)</option>
                    <option value="UTC-5">UTC-5 (EST)</option>
                    <option value="UTC+0">UTC+0 (GMT)</option>
                    <option value="UTC+1">UTC+1 (CET)</option>
                    <option value="UTC+8">UTC+8 (CST)</option>
                    <option value="UTC+9">UTC+9 (JST)</option>
                  </select>
                </div>
              </div>
              
              <button type="submit" class="btn btn-primary">Update Profile</button>
            </form>
          </div>
          
          <div class="info-section">
            <h3>Account Information</h3>
            <div class="info-grid">
              <div class="info-item">
                <span class="info-label">Member Since</span>
                <span class="info-value">{{ formatDate(user.join_date) }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Last Login</span>
                <span class="info-value">{{ formatDate(user.last_login) }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Learning Level</span>
                <span class="info-value" :style="{ color: getLevelColor(user.learning_level) }">
                  {{ getLevelBadge(user.learning_level) }}
                </span>
              </div>
              <div class="info-item">
                <span class="info-label">Total Points</span>
                <span class="info-value">{{ user.points }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Settings Tab -->
        <div v-if="activeTab === 'settings'" class="tab-content">
          <div class="form-section">
            <h3>Notification Settings</h3>
            <form @submit.prevent="updateSettings" class="form">
              <div class="setting-group">
                <div class="setting-item">
                  <div class="setting-info">
                    <label for="email_notifications">Email Notifications</label>
                    <p class="setting-description">Receive updates via email</p>
                  </div>
                  <input
                    id="email_notifications"
                    v-model="settingsForm.notifications.email"
                    type="checkbox"
                    class="toggle-input"
                  />
                </div>
                
                <div class="setting-item">
                  <div class="setting-info">
                    <label for="push_notifications">Push Notifications</label>
                    <p class="setting-description">Receive push notifications</p>
                  </div>
                  <input
                    id="push_notifications"
                    v-model="settingsForm.notifications.push"
                    type="checkbox"
                    class="toggle-input"
                  />
                </div>
                
                <div class="setting-item">
                  <div class="setting-info">
                    <label for="reminders">Study Reminders</label>
                    <p class="setting-description">Daily study reminders</p>
                  </div>
                  <input
                    id="reminders"
                    v-model="settingsForm.notifications.reminders"
                    type="checkbox"
                    class="toggle-input"
                  />
                </div>
              </div>
              
              <h3>Learning Preferences</h3>
              <div class="setting-group">
                <div class="setting-item">
                  <div class="setting-info">
                    <label for="auto_play">Auto-play Videos</label>
                    <p class="setting-description">Automatically play lesson videos</p>
                  </div>
                  <input
                    id="auto_play"
                    v-model="settingsForm.auto_play"
                    type="checkbox"
                    class="toggle-input"
                  />
                </div>
                
                <div class="setting-item">
                  <div class="setting-info">
                    <label for="sound_effects">Sound Effects</label>
                    <p class="setting-description">Play sound effects in games</p>
                  </div>
                  <input
                    id="sound_effects"
                    v-model="settingsForm.sound_effects"
                    type="checkbox"
                    class="toggle-input"
                  />
                </div>
              </div>
              
              <div class="form-row">
                <div class="form-group">
                  <label for="language">Language</label>
                  <select id="language" v-model="settingsForm.language" class="form-input">
                    <option value="en">English</option>
                    <option value="es">Spanish</option>
                    <option value="fr">French</option>
                    <option value="de">German</option>
                    <option value="it">Italian</option>
                    <option value="pt">Portuguese</option>
                    <option value="ru">Russian</option>
                    <option value="ja">Japanese</option>
                    <option value="ko">Korean</option>
                    <option value="zh">Chinese</option>
                  </select>
                </div>
                
                <div class="form-group">
                  <label for="theme">Theme</label>
                  <select id="theme" v-model="settingsForm.theme" class="form-input">
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                    <option value="auto">Auto</option>
                  </select>
                </div>
              </div>
              
              <button type="submit" class="btn btn-primary">Save Settings</button>
            </form>
          </div>
        </div>

        <!-- Security Tab -->
        <div v-if="activeTab === 'security'" class="tab-content">
          <div class="form-section">
            <h3>Change Password</h3>
            <form @submit.prevent="updatePassword" class="form">
              <div class="form-group">
                <label for="current_password">Current Password</label>
                <input
                  id="current_password"
                  v-model="securityForm.current_password"
                  type="password"
                  class="form-input"
                  required
                />
              </div>
              
              <div class="form-group">
                <label for="new_password">New Password</label>
                <input
                  id="new_password"
                  v-model="securityForm.new_password"
                  type="password"
                  class="form-input"
                  required
                />
              </div>
              
              <div class="form-group">
                <label for="confirm_password">Confirm New Password</label>
                <input
                  id="confirm_password"
                  v-model="securityForm.confirm_password"
                  type="password"
                  class="form-input"
                  required
                />
              </div>
              
              <button type="submit" class="btn btn-primary">Update Password</button>
            </form>
          </div>
          
          <div class="security-info">
            <h3>Security Tips</h3>
            <ul class="security-tips">
              <li>Use a strong password with at least 8 characters</li>
              <li>Include a mix of letters, numbers, and symbols</li>
              <li>Don't reuse passwords from other accounts</li>
              <li>Enable two-factor authentication if available</li>
              <li>Keep your login credentials secure</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.profile-container {
  max-width: 1000px;
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

.profile-content {
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

.profile-overview {
  background: white;
  border-radius: 1rem;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
}

.avatar-section {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.avatar {
  font-size: 4rem;
  width: 100px;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  border-radius: 50%;
}

.user-info h2 {
  font-size: 1.75rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 0.5rem;
}

.username {
  color: #64748b;
  font-size: 1rem;
  margin-bottom: 0.5rem;
}

.level-badge {
  display: inline-block;
  padding: 0.5rem 1rem;
  background: #f8fafc;
  border-radius: 2rem;
  font-size: 0.875rem;
  font-weight: 600;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1.5rem;
}

.stat-item {
  text-align: center;
  padding: 1rem;
  background: #f8fafc;
  border-radius: 0.75rem;
}

.stat-value {
  display: block;
  font-size: 2rem;
  font-weight: 800;
  color: #1e293b;
  margin-bottom: 0.25rem;
}

.stat-label {
  color: #64748b;
  font-size: 0.875rem;
  font-weight: 500;
}

.tabs-container {
  background: white;
  border-radius: 1rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  overflow: hidden;
}

.tabs {
  display: flex;
  border-bottom: 1px solid #e5e7eb;
}

.tab-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 1.5rem;
  background: none;
  border: none;
  color: #64748b;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  border-bottom: 3px solid transparent;
}

.tab-btn:hover {
  color: #667eea;
  background: #f8fafc;
}

.tab-btn.active {
  color: #667eea;
  border-bottom-color: #667eea;
  background: #f8fafc;
}

.tab-icon {
  font-size: 1.125rem;
}

.tab-content {
  padding: 2rem;
}

.form-section {
  margin-bottom: 2rem;
}

.form-section h3 {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 1rem;
}

.form {
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

.setting-group {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
}

.setting-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: #f8fafc;
  border-radius: 0.75rem;
}

.setting-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.setting-info label {
  font-weight: 600;
  color: #1e293b;
}

.setting-description {
  font-size: 0.875rem;
  color: #64748b;
  margin: 0;
}

.toggle-input {
  width: 3rem;
  height: 1.5rem;
  background: #e5e7eb;
  border-radius: 1rem;
  border: none;
  position: relative;
  cursor: pointer;
  transition: all 0.2s ease;
  appearance: none;
}

.toggle-input:checked {
  background: #667eea;
}

.toggle-input::before {
  content: '';
  position: absolute;
  top: 2px;
  left: 2px;
  width: 1.25rem;
  height: 1.25rem;
  background: white;
  border-radius: 50%;
  transition: all 0.2s ease;
}

.toggle-input:checked::before {
  transform: translateX(1.5rem);
}

.info-section {
  background: #f8fafc;
  border-radius: 0.75rem;
  padding: 1.5rem;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  background: white;
  border-radius: 0.5rem;
}

.info-label {
  color: #64748b;
  font-weight: 500;
}

.info-value {
  font-weight: 600;
  color: #1e293b;
}

.security-info {
  background: #fef3c7;
  border-radius: 0.75rem;
  padding: 1.5rem;
  margin-top: 2rem;
}

.security-tips {
  list-style: none;
  padding: 0;
  margin: 1rem 0 0 0;
}

.security-tips li {
  padding: 0.5rem 0;
  color: #92400e;
  position: relative;
  padding-left: 1.5rem;
}

.security-tips li::before {
  content: '✓';
  position: absolute;
  left: 0;
  color: #f59e0b;
  font-weight: 700;
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

@media (max-width: 768px) {
  .profile-container {
    padding: 1rem;
  }
  
  .header h1 {
    font-size: 2rem;
  }
  
  .avatar-section {
    flex-direction: column;
    text-align: center;
  }
  
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .tabs {
    flex-direction: column;
  }
  
  .form-row {
    grid-template-columns: 1fr;
  }
  
  .info-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }
  
  .setting-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
}
</style>
