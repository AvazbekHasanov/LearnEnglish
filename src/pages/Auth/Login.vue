<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/userStore.js'
import { useI18n } from 'vue-i18n'
import { ElMessage } from 'element-plus'
import { Message, Lock } from '@element-plus/icons-vue'
import BackButton from '@/components/BackButton.vue'

const router = useRouter()
const userStore = useUserStore()
const { t } = useI18n()

const loginFormRef = ref()

const form = reactive({
  email: '',
  password: '',
  rememberMe: false
})

const rules = {
  email: [
    { required: true, message: t('auth.email_required'), trigger: 'blur' },
    { type: 'email', message: t('auth.valid_email'), trigger: 'blur' }
  ],
  password: [
    { required: true, message: t('auth.password_required'), trigger: 'blur' },
    { min: 4, message: t('auth.password_min_length'), trigger: 'blur' }
  ]
}

const handleLogin = async () => {
  if (!loginFormRef.value) return
  
  try {
    await loginFormRef.value.validate()
    
    const response = await userStore.signIn({
      email: form.email,
      password: form.password
    })

    if (response.data.accessToken) {
      ElMessage.success(t('auth.login_success'))
      router.push('/')
    }
  } catch (error) {
    console.error('Login error:', error)
    if (error.response?.data?.message) {
      ElMessage.error(error.response.data.message)
    } else {
      ElMessage.error(t('auth.login_error'))
    }
  }
}

const handleGoogleLogin = async () => {
  try {
    // Simulate Google OAuth
    await new Promise(resolve => setTimeout(resolve, 1500))

    // Demo Google login
    const userData = {
      id: Date.now(),
      email: 'google.user@example.com',
      fullName: 'Google User',
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

    ElMessage.success(t('auth.google_login_success'))
    router.push('/')
  } catch (error) {
    console.error('Google login error:', error)
    ElMessage.error(t('auth.google_login_failed'))
  }
}
</script>

<template>
  <div class="auth-container">
    <BackButton :fixed="true" />
    <div class="auth-card">
      <div class="auth-header">
        <router-link to="/" class="logo">
          <span class="logo-text">{{ $t('app_name') }}</span>
          <div class="logo-accent"></div>
        </router-link>
        <h1 class="auth-title">{{ $t('auth.welcome_back') }}</h1>
        <p class="auth-subtitle">{{ $t('auth.sign_in_journey') }}</p>
      </div>

      <el-form 
        @submit.prevent="handleLogin" 
        class="auth-form"
        :model="form"
        :rules="rules"
        ref="loginFormRef"
      >
        <el-form-item prop="email" class="form-group">
          <el-input
            v-model="form.email"
            type="email"
            :placeholder="$t('auth.enter_email')"
            size="large"
            :prefix-icon="Message"
          />
        </el-form-item>

        <el-form-item prop="password" class="form-group">
          <el-input
            v-model="form.password"
            :type="showPassword ? 'text' : 'password'"
            :placeholder="$t('auth.enter_password')"
            size="large"
            :prefix-icon="Lock"
            show-password
          />
        </el-form-item>

        <div class="form-options">
          <el-checkbox v-model="form.rememberMe">
            {{ $t('auth.remember_me') }}
          </el-checkbox>
          <router-link to="/auth/password-reset" class="forgot-link">
            {{ $t('auth.forgot_password') }}
          </router-link>
        </div>

        <el-button 
          type="primary" 
          size="large" 
          class="auth-btn" 
          :loading="userStore.isLoading"
          @click="handleLogin"
        >
          {{ $t('auth.sign_in') }}
        </el-button>

        <div class="divider">
          <span class="divider-text">{{ $t('auth.or') }}</span>
        </div>

        <el-button
          type="default"
          size="large"
          class="auth-btn btn-google"
          @click="handleGoogleLogin"
          :loading="userStore.isLoading"
        >
          <el-icon><svg viewBox="0 0 24 24" width="16" height="16"><path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg></el-icon>
          {{ $t('auth.continue_with_google') }}
        </el-button>

        <div class="auth-footer">
          <p class="auth-footer-text">
            {{ $t('auth.dont_have_account') }}
            <router-link to="/auth/signup" class="auth-link">{{ $t('auth.sign_up') }}</router-link>
          </p>
        </div>
      </el-form>


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

.form-group {
  margin-bottom: 0;
}

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: -0.5rem;
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
  height: 48px;
  font-size: 1rem;
  font-weight: 600;
  border-radius: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: all 0.2s ease;
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

/* API Info Section */
.api-info {
  margin-top: 2rem;
  padding: 1.5rem;
  background: #f8fafc;
  border-radius: 1rem;
  border: 1px solid #e2e8f0;
}

.api-info h3 {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 0.5rem;
}

.api-info p {
  color: #64748b;
  font-size: 0.875rem;
  margin-bottom: 1rem;
}

.api-details {
  background: white;
  padding: 1rem;
  border-radius: 0.5rem;
  border: 1px solid #e2e8f0;
}

.api-details p {
  margin: 0.25rem 0;
  font-size: 0.875rem;
}

.api-details strong {
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
  
  .form-options {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }
}

@media (max-width: 480px) {
  .auth-card {
    padding: 1.5rem;
  }
  
  .auth-title {
    font-size: 1.5rem;
  }
  
  .api-info {
    padding: 1rem;
  }
}
</style>