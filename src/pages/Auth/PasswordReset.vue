<template>
  <div class="auth-container">
    <div class="auth-card">
      <div class="auth-header">
        <router-link to="/" class="logo">
          <span class="logo-text">LearnEnglish</span>
          <div class="logo-accent"></div>
        </router-link>
        <h1 class="auth-title">Reset Your Password</h1>
        <p class="auth-subtitle">Enter your email address and we'll send you a link to reset your password</p>
      </div>

      <form @submit.prevent="handlePasswordReset" class="auth-form">
        <div class="form-group">
          <label for="email" class="form-label">Email Address</label>
          <input
            id="email"
            v-model="form.email"
            type="email"
            class="form-input"
            :class="{ 'error': errors.email }"
            placeholder="Enter your email address"
            required
          />
          <span v-if="errors.email" class="error-message">{{ errors.email }}</span>
        </div>

        <button type="submit" class="btn btn-primary auth-btn" :disabled="loading">
          <span v-if="loading" class="spinner"></span>
          <span v-else>Send Reset Link</span>
        </button>

        <div class="auth-footer">
          <p class="auth-footer-text">
            Remember your password?
            <router-link to="/login" class="auth-link">Sign in</router-link>
          </p>
        </div>
      </form>

      <!-- Success Message -->
      <div v-if="resetSent" class="success-message">
        <div class="success-icon">
          <i class="fas fa-check-circle"></i>
        </div>
        <h3 class="success-title">Reset Link Sent!</h3>
        <p class="success-text">
          We've sent a password reset link to <strong>{{ form.email }}</strong>. 
          Please check your email and click the link to reset your password.
        </p>
        <div class="success-actions">
          <button @click="resendEmail" class="btn btn-secondary" :disabled="resendLoading">
            <span v-if="resendLoading" class="spinner"></span>
            <span v-else>Resend Email</span>
          </button>
          <router-link to="/login" class="btn btn-primary">
            Back to Login
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const form = reactive({
  email: ''
})

const errors = reactive({
  email: ''
})

const loading = ref(false)
const resetSent = ref(false)
const resendLoading = ref(false)

const validateForm = () => {
  errors.email = ''

  if (!form.email) {
    errors.email = 'Email is required'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = 'Please enter a valid email address'
  }

  return !errors.email
}

const handlePasswordReset = async () => {
  if (!validateForm()) return

  loading.value = true

  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))

    // Show success message
    resetSent.value = true
  } catch (error) {
    console.error('Password reset error:', error)
    alert('An error occurred. Please try again.')
  } finally {
    loading.value = false
  }
}

const resendEmail = async () => {
  resendLoading.value = true

  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    alert('Reset link sent again!')
  } catch (error) {
    console.error('Resend error:', error)
    alert('Failed to resend email. Please try again.')
  } finally {
    resendLoading.value = false
  }
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
  line-height: 1.6;
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

/* Success Message */
.success-message {
  text-align: center;
  padding: 2rem 0;
}

.success-icon {
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #10b981, #059669);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.5rem;
  color: white;
  font-size: 2rem;
}

.success-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 1rem;
}

.success-text {
  color: #64748b;
  line-height: 1.6;
  margin-bottom: 2rem;
}

.success-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.success-actions .btn {
  padding: 0.75rem 1.5rem;
  font-size: 0.875rem;
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
  
  .success-actions {
    flex-direction: column;
    align-items: center;
  }
  
  .success-actions .btn {
    width: 100%;
    max-width: 200px;
  }
}

@media (max-width: 480px) {
  .auth-card {
    padding: 1.5rem;
  }
  
  .auth-title {
    font-size: 1.5rem;
  }
  
  .success-icon {
    width: 60px;
    height: 60px;
    font-size: 1.5rem;
  }
}
</style>
