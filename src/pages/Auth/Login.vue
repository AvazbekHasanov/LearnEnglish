<script setup>
import { ref, reactive } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useUserStore } from '@/stores/userStore.js'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

const form = reactive({
  email: '',
  password: '',
  rememberMe: false
})

const errors = reactive({
  email: '',
  password: ''
})

const loading = ref(false)
const showPassword = ref(false)

const validateForm = () => {
  errors.email = ''
  errors.password = ''

  if (!form.email) {
    errors.email = 'Email is required'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = 'Please enter a valid email address'
  }

  if (!form.password) {
    errors.password = 'Password is required'
  } else if (form.password.length < 6) {
    errors.password = 'Password must be at least 6 characters'
  }

  return !errors.email && !errors.password
}

const handleLogin = async () => {
  if (!validateForm()) return

  loading.value = true

  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Demo login logic
    if (form.email === 'demo@learnenglish.com' && form.password === 'demo123') {
      // Set user data
      const userData = {
        id: 1,
        email: form.email,
        full_name: 'Demo User',
        username: 'demo_user',
        learning_level: 'intermediate',
        points: 250,
        streak_days: 5,
        lessons_completed: 12,
        tests_passed: 8
      }

      userStore.setUserData(userData)
      userStore.saveToLocalStorage()
      localStorage.setItem('accessToken', 'demo-token-123')

      // Redirect to intended page or home
      const redirectPath = route.query.redirect || '/'
      router.push(redirectPath)
    } else {
      errors.password = 'Invalid email or password'
    }
  } catch (error) {
    console.error('Login error:', error)
    errors.password = 'An error occurred. Please try again.'
  } finally {
    loading.value = false
  }
}

const handleGoogleLogin = async () => {
  loading.value = true

  try {
    // Simulate Google OAuth
    await new Promise(resolve => setTimeout(resolve, 1500))

    // Demo Google login
    const userData = {
      id: 2,
      email: 'google.user@example.com',
      full_name: 'Google User',
      username: 'google_user',
      learning_level: 'beginner',
      points: 100,
      streak_days: 2,
      lessons_completed: 5,
      tests_passed: 3
    }

    userStore.setUserData(userData)
    userStore.saveToLocalStorage()
    localStorage.setItem('accessToken', 'google-token-456')

    const redirectPath = route.query.redirect || '/'
    router.push(redirectPath)
  } catch (error) {
    console.error('Google login error:', error)
    alert('Google login failed. Please try again.')
  } finally {
    loading.value = false
  }
}

const togglePassword = () => {
  showPassword.value = !showPassword.value
}
</script>

<template>
  <div class="auth-container">
    <div class="auth-card">
      <div class="auth-header">
        <router-link to="/" class="logo">
          <span class="logo-text">LearnEnglish</span>
          <div class="logo-accent"></div>
        </router-link>
        <h1 class="auth-title">Welcome Back</h1>
        <p class="auth-subtitle">Sign in to continue your learning journey</p>
      </div>

      <form @submit.prevent="handleLogin" class="auth-form">
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
              placeholder="Enter your password"
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

        <div class="form-options">
          <label class="checkbox-label">
            <input
              v-model="form.rememberMe"
              type="checkbox"
              class="checkbox-input"
            />
            <span class="checkbox-text">Remember me</span>
          </label>
          <router-link to="/password-reset" class="forgot-link">
            Forgot password?
          </router-link>
        </div>

        <button type="submit" class="btn btn-primary auth-btn" :disabled="loading">
          <span v-if="loading" class="spinner"></span>
          <span v-else>Sign In</span>
        </button>

        <div class="divider">
          <span class="divider-text">or</span>
        </div>

        <button
          type="button"
          class="btn btn-google auth-btn"
          @click="handleGoogleLogin"
          :disabled="loading"
        >
          <i class="fab fa-google"></i>
          Continue with Google
        </button>

        <div class="auth-footer">
          <p class="auth-footer-text">
            Don't have an account?
            <router-link to="/signup" class="auth-link">Sign up</router-link>
          </p>
        </div>
      </form>
    </div>

    <!-- Demo Account Info -->
    <div class="demo-info">
      <h3>Demo Account</h3>
      <p>You can use these credentials to test the application:</p>
      <div class="demo-credentials">
        <div class="demo-item">
          <strong>Email:</strong> demo@learnenglish.com
        </div>
        <div class="demo-item">
          <strong>Password:</strong> demo123
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.auth-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  position: relative;
}

.auth-card {
  background: white;
  border-radius: 24px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  padding: 3rem;
  width: 100%;
  max-width: 450px;
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
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: -0.5rem;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
}

.checkbox-input {
  width: 1rem;
  height: 1rem;
  accent-color: #667eea;
}

.checkbox-text {
  font-size: 0.875rem;
  color: #64748b;
}

.forgot-link {
  color: #667eea;
  text-decoration: none;
  font-size: 0.875rem;
  font-weight: 500;
}

.forgot-link:hover {
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

/* Demo Info */
.demo-info {
  position: absolute;
  bottom: 2rem;
  left: 2rem;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  padding: 1.5rem;
  border-radius: 1rem;
  max-width: 300px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}

.demo-info h3 {
  color: #1e293b;
  font-size: 1.125rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.demo-info p {
  color: #64748b;
  font-size: 0.875rem;
  margin-bottom: 1rem;
}

.demo-credentials {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.demo-item {
  font-size: 0.875rem;
  color: #374151;
}

.demo-item strong {
  color: #1e293b;
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
  
  .demo-info {
    position: static;
    margin-top: 2rem;
    max-width: none;
  }
}

@media (max-width: 480px) {
  .auth-card {
    padding: 1.5rem;
  }
  
  .auth-title {
    font-size: 1.5rem;
  }
  
  .form-options {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
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
</style>