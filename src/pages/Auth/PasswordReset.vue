<template>
  <div class="auth-container">
    <BackButton :fixed="true" />
    <div class="auth-card">
      <div class="auth-header">
        <router-link to="/" class="logo">
          <span class="logo-text">{{ $t('app_name') }}</span>
          <div class="logo-accent"></div>
        </router-link>
        <h1 class="auth-title">{{ $t('auth.reset_password') }}</h1>
        <p class="auth-subtitle">{{ $t('auth.reset_password_subtitle') }}</p>
      </div>

      <!-- Step 1: Email Input -->
      <el-form 
        v-if="currentStep === 1" 
        @submit.prevent="handleSendOTP" 
        class="auth-form"
        :model="form"
        :rules="emailRules"
        ref="emailFormRef"
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

        <el-button 
          type="primary" 
          size="large" 
          class="auth-btn" 
          :loading="userStore.isLoading"
          @click="handleSendOTP"
        >
          {{ $t('auth.send_otp') }}
        </el-button>

        <div class="auth-footer">
          <p class="auth-footer-text">
            {{ $t('auth.remember_password') }}
            <router-link to="/auth/login" class="auth-link">{{ $t('auth.sign_in') }}</router-link>
          </p>
        </div>
      </el-form>

      <!-- Step 2: OTP Verification -->
      <el-form 
        v-if="currentStep === 2" 
        @submit.prevent="handleVerifyOTP" 
        class="auth-form"
        :model="form"
        :rules="otpRules"
        ref="otpFormRef"
      >
        <div class="otp-info">
          <p class="otp-info-text">
            {{ $t('auth.otp_sent_to') }} <strong>{{ form.email }}</strong>
          </p>
        </div>

        <el-form-item prop="otp" class="form-group">
          <el-input
            v-model="form.otp"
            type="text"
            :placeholder="$t('auth.enter_otp')"
            size="large"
            :prefix-icon="Key"
          />
        </el-form-item>

        <el-button 
          type="primary" 
          size="large" 
          class="auth-btn" 
          :loading="userStore.isLoading"
          @click="handleVerifyOTP"
        >
          {{ $t('auth.verify_otp') }}
        </el-button>

        <div class="auth-footer">
          <p class="auth-footer-text">
            {{ $t('auth.didnt_receive_otp') }}
            <el-button 
              type="text" 
              class="resend-link"
              :loading="resendLoading"
              @click="resendOTP"
            >
              {{ $t('auth.resend_otp') }}
            </el-button>
          </p>
        </div>
      </el-form>

      <!-- Step 3: New Password -->
      <el-form 
        v-if="currentStep === 3" 
        @submit.prevent="handleResetPassword" 
        class="auth-form"
        :model="form"
        :rules="passwordRules"
        ref="passwordFormRef"
      >
        <div class="otp-info">
          <p class="otp-info-text">
            {{ $t('auth.otp_verified') }} <strong>{{ form.email }}</strong>
          </p>
        </div>

        <el-form-item prop="newPassword" class="form-group">
          <el-input
            v-model="form.newPassword"
            type="password"
            :placeholder="$t('auth.create_password')"
            size="large"
            :prefix-icon="Lock"
            show-password
          />
        </el-form-item>

        <el-form-item prop="confirmPassword" class="form-group">
          <el-input
            v-model="form.confirmPassword"
            type="password"
            :placeholder="$t('auth.confirm_your_password')"
            size="large"
            :prefix-icon="Lock"
            show-password
          />
        </el-form-item>

        <el-button 
          type="primary" 
          size="large" 
          class="auth-btn" 
          :loading="userStore.isLoading"
          @click="handleResetPassword"
        >
          {{ $t('auth.reset_password_btn') }}
        </el-button>
      </el-form>

      <!-- Success Message -->
      <div v-if="currentStep === 4" class="success-container">
        <div class="success-icon">
          <el-icon size="48" color="#10b981"><CircleCheckFilled /></el-icon>
        </div>
        <h3 class="success-title">{{ $t('auth.password_reset_success') }}</h3>
        <p class="success-text">
          {{ $t('auth.password_reset_success_text') }}
        </p>
        
        <div class="success-actions">
          <router-link to="/auth/login" class="btn btn-primary auth-btn">
            {{ $t('auth.back_to_login') }}
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useUserStore } from '@/stores/userStore.js'
import { useI18n } from 'vue-i18n'
import { ElMessage } from 'element-plus'
import { Message, CircleCheckFilled, Key, Lock } from '@element-plus/icons-vue'
import BackButton from '@/components/BackButton.vue'

const userStore = useUserStore()
const { t } = useI18n()

const emailFormRef = ref()
const otpFormRef = ref()
const passwordFormRef = ref()
const currentStep = ref(1)
const resendLoading = ref(false)

const form = reactive({
  email: '',
  otp: '',
  newPassword: '',
  confirmPassword: ''
})

const emailRules = {
  email: [
    { required: true, message: t('auth.email_required'), trigger: 'blur' },
    { type: 'email', message: t('auth.valid_email'), trigger: 'blur' }
  ]
}

const otpRules = {
  otp: [
    { required: true, message: t('auth.otp_required'), trigger: 'blur' },
  ]
}

const passwordRules = {
  newPassword: [
    { required: true, message: t('auth.password_required'), trigger: 'blur' },
    { min: 8, message: t('auth.password_min_length'), trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: t('auth.confirm_password_required'), trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        if (value !== form.newPassword) {
          callback(new Error(t('auth.passwords_not_match')))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ]
}

const handleSendOTP = async () => {
  if (!emailFormRef.value) return
  
  try {
    await emailFormRef.value.validate()
    
    const response = await userStore.forgotPassword(form.email)
    console.log("response", response)
    
    if (response.data.success) {
      currentStep.value = 2
      ElMessage.success(t('auth.otp_sent_success'))
    }
  } catch (error) {
    console.error('Send OTP error:', error)
    if (error.response?.data?.message) {
      ElMessage.error(error.response.data.message)
    } else {
      ElMessage.error(t('auth.error_occurred'))
    }
  }
}

const handleVerifyOTP = async () => {
  if (!otpFormRef.value) return
  
  try {
    await otpFormRef.value.validate()
    
    const response = await userStore.verifyOTP({ email: form.email, code: form.otp })
    
    if (response.success) {
      currentStep.value = 3
      ElMessage.success(t('auth.otp_verified_success'))
    }
  } catch (error) {
    console.error('Verify OTP error:', error)
    if (error.response?.data?.message) {
      ElMessage.error(error.response.data.message)
    } else {
      ElMessage.error(t('auth.error_occurred'))
    }
  }
}

const handleResetPassword = async () => {
  if (!passwordFormRef.value) return
  
  try {
    await passwordFormRef.value.validate()
    
    const response = await userStore.resetPassword(form.email, form.newPassword)
    
    if (response.success) {
      currentStep.value = 4
      ElMessage.success(t('auth.password_reset_success'))
    }
  } catch (error) {
    console.error('Password reset error:', error)
    if (error.response?.data?.message) {
      ElMessage.error(error.response.data.message)
    } else {
      ElMessage.error(t('auth.error_occurred'))
    }
  }
}

const resendOTP = async () => {
  try {
    resendLoading.value = true
    await userStore.forgotPassword(form.email)
    ElMessage.success(t('auth.otp_resent_success'))
  } catch (error) {
    console.error('Resend OTP error:', error)
    ElMessage.error(t('auth.otp_resent_error'))
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

/* OTP Info */
.otp-info {
  text-align: center;
  margin-bottom: 1.5rem;
  padding: 1rem;
  background: #f8fafc;
  border-radius: 0.75rem;
  border: 1px solid #e2e8f0;
}

.otp-info-text {
  color: #64748b;
  font-size: 0.875rem;
  margin: 0;
}

.otp-info-text strong {
  color: #1e293b;
}

.resend-link {
  color: #667eea;
  text-decoration: none;
  font-weight: 600;
  padding: 0;
  margin: 0;
  height: auto;
}

.resend-link:hover {
  color: #5a67d8;
  text-decoration: underline;
}

/* Success Container */
.success-container {
  text-align: center;
  padding: 1rem 0;
}

.success-icon {
  margin-bottom: 1.5rem;
}

.success-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 1rem;
}

.success-text {
  color: #64748b;
  font-size: 1rem;
  line-height: 1.6;
  margin-bottom: 2rem;
}

.success-text strong {
  color: #1e293b;
}

.success-actions {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.btn-secondary {
  background: #f1f5f9;
  color: #64748b;
  border: 2px solid #e2e8f0;
}

.btn-secondary:hover {
  background: #e2e8f0;
  border-color: #cbd5e1;
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
    gap: 0.75rem;
  }
}

@media (max-width: 480px) {
  .auth-card {
    padding: 1.5rem;
  }
  
  .auth-title {
    font-size: 1.5rem;
  }
  
  .success-title {
    font-size: 1.25rem;
  }
}
</style>
