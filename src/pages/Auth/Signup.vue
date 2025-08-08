<template>
  <div class="auth-container">
    <div class="auth-card">
      <div class="auth-header">
        <router-link to="/" class="logo">
          <span class="logo-text">LearnEnglish</span>
          <div class="logo-accent"></div>
        </router-link>
        <h1 class="auth-title">Create Your Account</h1>
        <p class="auth-subtitle">Join thousands of learners and start your English journey</p>
      </div>

      <form @submit.prevent="handleSignup" class="auth-form">
        <div class="form-row">
          <div class="form-group">
            <label for="firstName" class="form-label">First Name</label>
            <input
              id="firstName"
              v-model="form.firstName"
              type="text"
              class="form-input"
              :class="{ 'error': errors.firstName }"
              placeholder="Enter your first name"
              required
            />
            <span v-if="errors.firstName" class="error-message">{{ errors.firstName }}</span>
          </div>

          <div class="form-group">
            <label for="lastName" class="form-label">Last Name</label>
            <input
              id="lastName"
              v-model="form.lastName"
              type="text"
              class="form-input"
              :class="{ 'error': errors.lastName }"
              placeholder="Enter your last name"
              required
            />
            <span v-if="errors.lastName" class="error-message">{{ errors.lastName }}</span>
          </div>
        </div>

        <div class="form-group">
          <label for="email" class="form-label">Email Address</label>
          <input
            id="email"
            v-model="form.email"
            type="email"
            class="form-input"
            :class="{ 'error': errors.email }"
            placeholder="Enter your email"
            required
          />
          <span v-if="errors.email" class="error-message">{{ errors.email }}</span>
        </div>

        <div class="form-group">
          <label for="password" class="form-label">Password</label>
          <div class="password-input">
            <input
              id="password"
              v-model="form.password"
              :type="showPassword ? 'text' : 'password'"
              class="form-input"
              :class="{ 'error': errors.password }"
              placeholder="Create a password"
              required
            />
            <button
              type="button"
              class="password-toggle"
              @click="togglePassword"
            >
              <i :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
            </button>
          </div>
          <span v-if="errors.password" class="error-message">{{ errors.password }}</span>
        </div>

        <div class="form-group">
          <label for="confirmPassword" class="form-label">Confirm Password</label>
          <div class="password-input">
            <input
              id="confirmPassword"
              v-model="form.confirmPassword"
              :type="showConfirmPassword ? 'text' : 'password'"
              class="form-input"
              :class="{ 'error': errors.confirmPassword }"
              placeholder="Confirm your password"
              required
            />
            <button
              type="button"
              class="password-toggle"
              @click="toggleConfirmPassword"
            >
              <i :class="showConfirmPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
            </button>
          </div>
          <span v-if="errors.confirmPassword" class="error-message">{{ errors.confirmPassword }}</span>
        </div>

        <div class="form-group">
          <label for="learningLevel" class="form-label">Learning Level</label>
          <select
            id="learningLevel"
            v-model="form.learningLevel"
            class="form-input"
            :class="{ 'error': errors.learningLevel }"
            required
          >
            <option value="">Select your level</option>
            <option value="beginner">Beginner - I'm just starting to learn English</option>
            <option value="intermediate">Intermediate - I can have basic conversations</option>
            <option value="advanced">Advanced - I want to perfect my English</option>
          </select>
          <span v-if="errors.learningLevel" class="error-message">{{ errors.learningLevel }}</span>
        </div>

        <div class="form-options">
          <label class="checkbox-label">
            <input
              v-model="form.agreeToTerms"
              type="checkbox"
              class="checkbox-input"
              required
            />
            <span class="checkbox-text">
              I agree to the 
              <a href="#" class="link">Terms of Service</a> and 
              <a href="#" class="link">Privacy Policy</a>
            </span>
          </label>
        </div>

        <button type="submit" class="btn btn-primary auth-btn" :disabled="loading">
          <span v-if="loading" class="spinner"></span>
          <span v-else>Create Account</span>
        </button>

        <div class="divider">
          <span class="divider-text">or</span>
        </div>

        <button
          type="button"
          class="btn btn-google auth-btn"
          @click="handleGoogleSignup"
          :disabled="loading"
        >
          <i class="fab fa-google"></i>
          Sign up with Google
        </button>

        <div class="auth-footer">
          <p class="auth-footer-text">
            Already have an account?
            <router-link to="/login" class="auth-link">Sign in</router-link>
          </p>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/userStore.js'

const router = useRouter()
const userStore = useUserStore()

const form = reactive({
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  confirmPassword: '',
  learningLevel: '',
  agreeToTerms: false
})

const errors = reactive({
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  confirmPassword: '',
  learningLevel: ''
})

const loading = ref(false)
const showPassword = ref(false)
const showConfirmPassword = ref(false)

const validateForm = () => {
  errors.firstName = ''
  errors.lastName = ''
  errors.email = ''
  errors.password = ''
  errors.confirmPassword = ''
  errors.learningLevel = ''

  if (!form.firstName.trim()) {
    errors.firstName = 'First name is required'
  } else if (form.firstName.length < 2) {
    errors.firstName = 'First name must be at least 2 characters'
  }

  if (!form.lastName.trim()) {
    errors.lastName = 'Last name is required'
  } else if (form.lastName.length < 2) {
    errors.lastName = 'Last name must be at least 2 characters'
  }

  if (!form.email) {
    errors.email = 'Email is required'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = 'Please enter a valid email address'
  }

  if (!form.password) {
    errors.password = 'Password is required'
  } else if (form.password.length < 8) {
    errors.password = 'Password must be at least 8 characters'
  } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(form.password)) {
    errors.password = 'Password must contain at least one uppercase letter, one lowercase letter, and one number'
  }

  if (!form.confirmPassword) {
    errors.confirmPassword = 'Please confirm your password'
  } else if (form.password !== form.confirmPassword) {
    errors.confirmPassword = 'Passwords do not match'
  }

  if (!form.learningLevel) {
    errors.learningLevel = 'Please select your learning level'
  }

  if (!form.agreeToTerms) {
    alert('Please agree to the Terms of Service and Privacy Policy')
    return false
  }

  return !Object.values(errors).some(error => error)
}

const handleSignup = async () => {
  if (!validateForm()) return

  loading.value = true

  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))

    // Create user data
    const userData = {
      id: Date.now(),
      email: form.email,
      full_name: `${form.firstName} ${form.lastName}`,
      username: form.email.split('@')[0],
      learning_level: form.learningLevel,
      points: 0,
      streak_days: 0,
      lessons_completed: 0,
      tests_passed: 0,
      created_at: new Date().toISOString()
    }

    userStore.setUserData(userData)
    userStore.saveToLocalStorage()
    localStorage.setItem('accessToken', `token-${Date.now()}`)

    // Redirect to home page
    router.push('/')
  } catch (error) {
    console.error('Signup error:', error)
    alert('An error occurred during signup. Please try again.')
  } finally {
    loading.value = false
  }
}

const handleGoogleSignup = async () => {
  loading.value = true

  try {
    // Simulate Google OAuth
    await new Promise(resolve => setTimeout(resolve, 1500))

    // Demo Google signup
    const userData = {
      id: Date.now() + 1,
      email: 'google.user@example.com',
      full_name: 'Google User',
      username: 'google_user',
      learning_level: 'beginner',
      points: 0,
      streak_days: 0,
      lessons_completed: 0,
      tests_passed: 0,
      created_at: new Date().toISOString()
    }

    userStore.setUserData(userData)
    userStore.saveToLocalStorage()
    localStorage.setItem('accessToken', `google-token-${Date.now()}`)

    router.push('/')
  } catch (error) {
    console.error('Google signup error:', error)
    alert('Google signup failed. Please try again.')
  } finally {
    loading.value = false
  }
}

const togglePassword = () => {
  showPassword.value = !showPassword.value
}

const toggleConfirmPassword = () => {
  showConfirmPassword.value = !showConfirmPassword.value
}
</script>

<style scoped>
.auth-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.auth-card {
  background: white;
  border-radius: 24px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  padding: 3rem;
  width: 100%;
  max-width: 500px;
  position: relative;
  z-index: 2;
}

.auth-header {
  text-align: center;
  margin-bottom: 2rem;
}

.logo {
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  position: relative;
  margin-bottom: 1.5rem;
}

.logo-text {
  font-size: 1.5rem;
  font-weight: 800;
  background: linear-gradient(135deg, #667eea, #764ba2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.logo-accent {
  position: absolute;
  bottom: -5px;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-radius: 2px;
}

.auth-title {
  font-size: 2rem;
  font-weight: 800;
  color: #1e293b;
  margin-bottom: 0.5rem;
}

.auth-subtitle {
  color: #64748b;
  font-size: 1.1rem;
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-label {
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
}

.form-input {
  padding: 0.75rem 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 0.75rem;
  font-size: 1rem;
  transition: all 0.2s ease;
  background: white;
}

.form-input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.form-input.error {
  border-color: #ef4444;
}

.error-message {
  color: #ef4444;
  font-size: 0.875rem;
  margin-top: 0.25rem;
}

.password-input {
  position: relative;
}

.password-toggle {
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #64748b;
  cursor: pointer;
  padding: 0.25rem;
}

.password-toggle:hover {
  color: #667eea;
}

.form-options {
  margin-top: -0.5rem;
}

.checkbox-label {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  cursor: pointer;
}

.checkbox-input {
  width: 1rem;
  height: 1rem;
  accent-color: #667eea;
  margin-top: 0.125rem;
}

.checkbox-text {
  font-size: 0.875rem;
  color: #64748b;
  line-height: 1.4;
}

.link {
  color: #667eea;
  text-decoration: none;
  font-weight: 500;
}

.link:hover {
  text-decoration: underline;
}

.auth-btn {
  width: 100%;
  padding: 0.875rem 1.5rem;
  font-size: 1rem;
  font-weight: 600;
  border-radius: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: all 0.2s ease;
}

.auth-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-google {
  background: white;
  color: #374151;
  border: 2px solid #e5e7eb;
}

.btn-google:hover {
  background: #f8fafc;
  border-color: #d1d5db;
}

.divider {
  position: relative;
  text-align: center;
  margin: 1.5rem 0;
}

.divider::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 1px;
  background: #e5e7eb;
}

.divider-text {
  background: white;
  padding: 0 1rem;
  color: #64748b;
  font-size: 0.875rem;
  position: relative;
  z-index: 1;
}

.auth-footer {
  text-align: center;
  margin-top: 1rem;
}

.auth-footer-text {
  color: #64748b;
  font-size: 0.875rem;
}

.auth-link {
  color: #667eea;
  text-decoration: none;
  font-weight: 600;
}

.auth-link:hover {
  text-decoration: underline;
}

/* Loading Spinner */
.spinner {
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top: 2px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Responsive Design */
@media (max-width: 768px) {
  .auth-container {
    padding: 1rem;
  }
  
  .auth-card {
    padding: 2rem;
  }
  
  .auth-title {
    font-size: 1.75rem;
  }
  
  .form-row {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .auth-card {
    padding: 1.5rem;
  }
  
  .auth-title {
    font-size: 1.5rem;
  }
  
  .checkbox-label {
    align-items: flex-start;
  }
}
</style>
