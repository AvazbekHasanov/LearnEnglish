<template>
  <div class="auth-container">
    <BackButton :fixed="true" />
    <div class="auth-card">
      <div class="auth-header">
        <router-link to="/" class="logo">
          <span class="logo-text">{{ $t('app_name') }}</span>
          <div class="logo-accent"></div>
        </router-link>
        <h1 class="auth-title">{{ $t('auth.create_account') }}</h1>
        <p class="auth-subtitle">{{ $t('auth.join_learners') }}</p>
      </div>

      <!-- Signup Form -->
      <el-form 
        v-if="!showOtpForm" 
        @submit.prevent="handleSignup" 
        class="auth-form"
        :model="form"
        :rules="rules"
        ref="signupFormRef"
      >
        <div class="form-row">
          <el-form-item prop="firstName" class="form-group">
            <el-input
              v-model="form.firstName"
              :placeholder="$t('auth.enter_first_name')"
              size="large"
              :prefix-icon="User"
            />
          </el-form-item>

          <el-form-item prop="lastName" class="form-group">
            <el-input
              v-model="form.lastName"
              :placeholder="$t('auth.enter_last_name')"
              size="large"
              :prefix-icon="User"
            />
          </el-form-item>
        </div>

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
            :placeholder="$t('auth.create_password')"
            size="large"
            :prefix-icon="Lock"
            show-password
          />
        </el-form-item>

        <el-form-item prop="confirmPassword" class="form-group">
          <el-input
            v-model="form.confirmPassword"
            :type="showConfirmPassword ? 'text' : 'password'"
            :placeholder="$t('auth.confirm_your_password')"
            size="large"
            :prefix-icon="Lock"
            show-password
          />
        </el-form-item>

        <el-form-item prop="learningLevel" class="form-group">
          <el-select
            v-model="form.learningLevel"
            :placeholder="$t('auth.select_your_level')"
            size="large"
            style="width: 100%"
          >
            <el-option value="beginner" :label="$t('auth.beginner_desc')" />
            <el-option value="elementary" :label="$t('auth.intermediate_desc')" />
          </el-select>
        </el-form-item>

        <el-form-item prop="agreeToTerms" class="form-group">
          <el-checkbox v-model="form.agreeToTerms">
            {{ $t('auth.agree_terms') }} 
            <el-link type="danger">{{ $t('auth.terms_of_service') }}</el-link> {{ $t('auth.or') }}
            <el-link type="danger">{{ $t('auth.privacy_policy') }}</el-link>
          </el-checkbox>
        </el-form-item>

        <el-button 
          type="primary" 
          size="large" 
          class="auth-btn" 
          :loading="userStore.isLoading"
          @click="handleSignup"
        >
          {{ $t('auth.create_account_btn') }}
        </el-button>

<!--        <div class="divider">-->
<!--          <span class="divider-text">{{ $t('auth.or') }}</span>-->
<!--        </div>-->

<!--        <el-button-->
<!--          type="default"-->
<!--          size="large"-->
<!--          class="auth-btn btn-google"-->
<!--          @click="handleGoogleSignup"-->
<!--          :loading="userStore.isLoading"-->
<!--        >-->
<!--          <el-icon><svg viewBox="0 0 24 24" width="16" height="16"><path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg></el-icon>-->
<!--          {{ $t('auth.sign_up_with_google') }}-->
<!--        </el-button>-->

        <div class="auth-footer">
          <p class="auth-footer-text">
            {{ $t('auth.already_have_account') }}
            <router-link to="/auth/login" class="auth-link">{{ $t('auth.sign_in') }}</router-link>
          </p>
        </div>
      </el-form>

      <!-- OTP Verification Form -->
      <el-form 
        v-else 
        @submit.prevent="handleOtpVerification" 
        class="auth-form"
        :model="otpForm"
        :rules="otpRules"
        ref="otpFormRef"
      >
        <div class="otp-header">
          <el-icon size="24" color="#667eea"><Message /></el-icon>
          <h2>{{ $t('auth.otp_verification') }}</h2>
          <p>{{ $t('auth.otp_sent_to') }} <strong>{{ form.email }}</strong></p>
        </div>

        <el-form-item prop="otp" class="form-group">
                     <el-input
             v-model="otpForm.otp"
             :placeholder="$t('auth.enter_otp')"
             size="large"
             :prefix-icon="Key"
           />
        </el-form-item>

        <el-button 
          type="primary" 
          size="large" 
          class="auth-btn" 
          :loading="otpLoading"
          @click="handleOtpVerification"
        >
          {{ $t('auth.verify_otp') }}
        </el-button>

        <div class="otp-actions">
          <el-button 
            type="text" 
            @click="resendOtp"
            :loading="resendLoading"
            :disabled="resendLoading"
          >
            {{ $t('auth.resend_otp') }}
          </el-button>
          <el-button 
            type="text" 
            @click="backToSignup"
          >
            {{ $t('auth.back_to_signup') }}
          </el-button>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/userStore.js'
import { useI18n } from 'vue-i18n'
import { ElMessage } from 'element-plus'
import { User, Message, Lock, Key } from '@element-plus/icons-vue'
import BackButton from '@/components/BackButton.vue'

const router = useRouter()
const userStore = useUserStore()
const { t } = useI18n()

const signupFormRef = ref()
const otpFormRef = ref()

const showOtpForm = ref(false)
const otpLoading = ref(false)
const resendLoading = ref(false)

const form = reactive({
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  confirmPassword: '',
  learningLevel: '',
  agreeToTerms: false
})

const otpForm = reactive({
  otp: ''
})

const rules = {
  firstName: [
    { required: true, message: t('auth.first_name_required'), trigger: 'blur' },
    { min: 2, message: t('auth.first_name_min_length'), trigger: 'blur' }
  ],
  lastName: [
    { required: true, message: t('auth.last_name_required'), trigger: 'blur' },
    { min: 2, message: t('auth.last_name_min_length'), trigger: 'blur' }
  ],
  email: [
    { required: true, message: t('auth.email_required'), trigger: 'blur' },
    { type: 'email', message: t('auth.valid_email'), trigger: 'blur' }
  ],
  password: [
    { required: true, message: t('auth.password_required'), trigger: 'blur' },
    { min: 8, message: t('auth.password_min_length'), trigger: 'blur' },
    { 
      pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 
      message: t('auth.password_complexity'), 
      trigger: 'blur' 
    }
  ],
  confirmPassword: [
    { required: true, message: t('auth.confirm_password_required'), trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        if (value !== form.password) {
          callback(new Error(t('auth.passwords_not_match')))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ],
  learningLevel: [
    { required: true, message: t('auth.learning_level_required'), trigger: 'change' }
  ],
  agreeToTerms: [
    {
      validator: (rule, value, callback) => {
        if (!value) {
          callback(new Error(t('auth.agree_terms_required')))
        } else {
          callback()
        }
      },
      trigger: 'change'
    }
  ]
}

const otpRules = {
  otp: [
    { required: true, message: t('auth.otp_required'), trigger: 'blur' }
  ]
}

const handleSignup = async () => {
  if (!signupFormRef.value) return
  
  try {
    await signupFormRef.value.validate()
    console.log("form", form)
    
    const response = await userStore.signUp({
      firstname: form.firstName,
      lastname: form.lastName,
      email: form.email,
      password: form.password,
      levelId: getLevelId(form.learningLevel)
    })

    console.log("response", response)

    if (response.data.success) {
      ElMessage.success(t('auth.otp_sent_success'))
      showOtpForm.value = true
    } else if (response.data.message === 'code_already_sent') {
      ElMessage.warning(t('auth.otp_already_sent'))
      showOtpForm.value = true
    }
  } catch (error) {
    console.error('Signup error:', error)
    if (error.response?.data?.message) {
      ElMessage.error(error.response.data.message)
    } else {
      ElMessage.error(t('auth.signup_error'))
    }
  }
}

const handleOtpVerification = async () => {
  if (!otpFormRef.value) return
  
  try {
    await otpFormRef.value.validate()
    otpLoading.value = true

    const response = await userStore.verifyOTP({
      email: form.email,
      code: otpForm.otp
    })

    if (response.data.success) {
      ElMessage.success(t('auth.verification_success'))
      router.push('/auth/login')
    }
  } catch (error) {
    console.error('OTP verification error:', error)
    if (error.response?.data?.message) {
      ElMessage.error(error.response.data.message)
    } else {
      ElMessage.error(t('auth.verification_error'))
    }
  } finally {
    otpLoading.value = false
  }
}

const resendOtp = async () => {
  try {
    resendLoading.value = true
    await userStore.resendOtp({ email: form.email })
    ElMessage.success(t('auth.otp_resent_success'))
  } catch (error) {
    console.error('Resend OTP error:', error)
    ElMessage.error(t('auth.otp_resent_error'))
  } finally {
    resendLoading.value = false
  }
}

const backToSignup = () => {
  showOtpForm.value = false
  otpForm.otp = ''
}

const getLevelId = (level) => {
  switch (level) {
    case 'beginner': return 1
    case 'elementary': return 2
    default: return 1
  }
}

const handleGoogleSignup = async () => {
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

    ElMessage.success(t('auth.google_signup_success'))
    router.push('/')
  } catch (error) {
    console.error('Google signup error:', error)
    ElMessage.error(t('auth.google_signup_failed'))
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
  margin-bottom: 0;
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

/* OTP Form Styles */
.otp-header {
  text-align: center;
  margin-bottom: 2rem;
}

.otp-header h2 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e293b;
  margin: 1rem 0 0.5rem;
}

.otp-header p {
  color: #64748b;
  font-size: 0.875rem;
}

.otp-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1rem;
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
  
  .otp-actions {
    flex-direction: column;
    gap: 1rem;
  }
}
</style>
