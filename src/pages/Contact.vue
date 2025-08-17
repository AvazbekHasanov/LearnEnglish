<script setup>
import { ref, reactive, onMounted } from 'vue'

const loading = ref(false)
const submitted = ref(false)

const contactForm = reactive({
  name: '',
  email: '',
  subject: '',
  message: '',
  category: 'general'
})

const categories = [
  { value: 'general', label: 'General Inquiry', icon: '❓' },
  { value: 'technical', label: 'Technical Support', icon: '🔧' },
  { value: 'bug', label: 'Bug Report', icon: '🐛' },
  { value: 'feature', label: 'Feature Request', icon: '💡' },
  { value: 'feedback', label: 'Feedback', icon: '📝' },
  { value: 'billing', label: 'Billing Issue', icon: '💳' }
]

const faqItems = ref([
  {
    question: 'How do I reset my password?',
    answer: 'You can reset your password by clicking on the "Forgot Password" link on the login page. We\'ll send you an email with instructions to create a new password.',
    category: 'account'
  },
  {
    question: 'Can I use the app offline?',
    answer: 'Currently, the app requires an internet connection to access lessons and track progress. We\'re working on offline features for future updates.',
    category: 'technical'
  },
  {
    question: 'How do I track my progress?',
    answer: 'Your progress is automatically tracked as you complete lessons and take practice tests. You can view your progress in the "My Progress" section of your profile.',
    category: 'learning'
  },
  {
    question: 'Are there different difficulty levels?',
    answer: 'Yes! We offer lessons for beginner, intermediate, and advanced learners. The app will recommend lessons based on your current level and progress.',
    category: 'learning'
  },
  {
    question: 'How do I earn points and achievements?',
    answer: 'You earn points by completing lessons, taking practice tests, and maintaining study streaks. Achievements are unlocked as you reach specific milestones.',
    category: 'learning'
  },
  {
    question: 'Can I practice with other learners?',
    answer: 'Currently, the app focuses on individual learning. However, you can compare your progress with other learners on the leaderboard.',
    category: 'social'
  }
])

const supportInfo = ref({
  email: 'support@learnenglish.com',
  phone: '+1 (555) 123-4567',
  hours: 'Monday - Friday, 9:00 AM - 6:00 PM EST',
  response_time: 'Within 24 hours'
})

onMounted(() => {
  // Any initialization if needed
})

const submitForm = async () => {
  if (!contactForm.name || !contactForm.email || !contactForm.subject || !contactForm.message) {
    alert('Please fill in all required fields')
    return
  }

  loading.value = true

  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // In a real app, you would send the form data to API
    // await api.submitContactForm(contactForm)
    
    submitted.value = true
    
    // Reset form
    Object.assign(contactForm, {
      name: '',
      email: '',
      subject: '',
      message: '',
      category: 'general'
    })
  } catch (error) {
    console.error('Error submitting form:', error)
    alert('There was an error submitting your message. Please try again.')
  } finally {
    loading.value = false
  }
}

const getCategoryIcon = (category) => {
  const found = categories.find(c => c.value === category)
  return found ? found.icon : '❓'
}

const getCategoryLabel = (category) => {
  const found = categories.find(c => c.value === category)
  return found ? found.label : 'General Inquiry'
}
</script>

<template>
  <div class="contact-container">
    <div class="contact-content">
      <!-- Header -->
      <div class="header">
        <h1>Contact Us</h1>
        <p class="subtitle">We're here to help with any questions or issues</p>
      </div>

      <div class="contact-grid">
        <!-- Contact Form -->
        <div class="contact-form-section">
          <h2>Send us a Message</h2>
          <p class="form-description">
            Have a question, suggestion, or need help? Fill out the form below and we'll get back to you as soon as possible.
          </p>

          <form v-if="!submitted" @submit.prevent="submitForm" class="contact-form">
            <div class="form-row">
              <div class="form-group">
                <label for="name">Full Name *</label>
                <input
                  id="name"
                  v-model="contactForm.name"
                  type="text"
                  class="form-input"
                  placeholder="Enter your full name"
                  required
                />
              </div>

              <div class="form-group">
                <label for="email">Email Address *</label>
                <input
                  id="email"
                  v-model="contactForm.email"
                  type="email"
                  class="form-input"
                  placeholder="Enter your email address"
                  required
                />
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="category">Category</label>
                <select id="category" v-model="contactForm.category" class="form-input">
                  <option v-for="category in categories" :key="category.value" :value="category.value">
                    {{ category.icon }} {{ category.label }}
                  </option>
                </select>
              </div>

              <div class="form-group">
                <label for="subject">Subject *</label>
                <input
                  id="subject"
                  v-model="contactForm.subject"
                  type="text"
                  class="form-input"
                  placeholder="Brief description of your inquiry"
                  required
                />
              </div>
            </div>

            <div class="form-group">
              <label for="message">Message *</label>
              <textarea
                id="message"
                v-model="contactForm.message"
                class="form-input"
                placeholder="Please provide details about your inquiry..."
                rows="6"
                required
              ></textarea>
            </div>

            <button type="submit" class="btn btn-primary submit-btn" :disabled="loading">
              <span v-if="loading" class="spinner"></span>
              <span v-else>Send Message</span>
            </button>
          </form>

          <div v-else class="success-message">
            <div class="success-icon">✅</div>
            <h3>Message Sent Successfully!</h3>
            <p>Thank you for contacting us. We'll get back to you within 24 hours.</p>
            <button @click="submitted = false" class="btn btn-secondary">
              Send Another Message
            </button>
          </div>
        </div>

        <!-- Support Information -->
        <div class="support-section">
          <h2>Get Help</h2>
          
          <div class="support-info">
            <div class="info-item">
              <div class="info-icon">📧</div>
              <div class="info-content">
                <h4>Email Support</h4>
                <p>{{ supportInfo.email }}</p>
                <span class="response-time">Response within {{ supportInfo.response_time }}</span>
              </div>
            </div>

            <div class="info-item">
              <div class="info-icon">📞</div>
              <div class="info-content">
                <h4>Phone Support</h4>
                <p>{{ supportInfo.phone }}</p>
                <span class="hours">{{ supportInfo.hours }}</span>
              </div>
            </div>

            <div class="info-item">
              <div class="info-icon">💬</div>
              <div class="info-content">
                <h4>Live Chat</h4>
                <p>Available during business hours</p>
                <span class="status online">Online Now</span>
              </div>
            </div>
          </div>

          <!-- FAQ Section -->
          <div class="faq-section">
            <h3>Frequently Asked Questions</h3>
            <div class="faq-list">
              <div v-for="(item, index) in faqItems" :key="index" class="faq-item">
                <div class="faq-question">
                  <h4>{{ item.question }}</h4>
                  <span class="faq-icon">+</span>
                </div>
                <div class="faq-answer">
                  <p>{{ item.answer }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Additional Information -->
      <div class="additional-info">
        <div class="info-card">
          <div class="card-icon">📚</div>
          <h3>Learning Resources</h3>
          <p>Access our comprehensive library of lessons, practice tests, and learning materials designed to help you master English.</p>
        </div>

        <div class="info-card">
          <div class="card-icon">🎯</div>
          <h3>Progress Tracking</h3>
          <p>Monitor your learning journey with detailed progress reports, achievements, and personalized recommendations.</p>
        </div>

        <div class="info-card">
          <div class="card-icon">🏆</div>
          <h3>Community</h3>
          <p>Join thousands of learners worldwide, compete on leaderboards, and share your achievements with the community.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.contact-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.contact-content {
  display: flex;
  flex-direction: column;
  gap: 3rem;
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

.contact-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
}

.contact-form-section {
  background: white;
  border-radius: 1rem;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
}

.contact-form-section h2 {
  font-size: 1.75rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 0.5rem;
}

.form-description {
  color: #64748b;
  margin-bottom: 2rem;
}

.contact-form {
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
  gap: 0.5rem;
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

.submit-btn {
  padding: 1rem 2rem;
  font-size: 1.125rem;
  font-weight: 600;
  border-radius: 0.75rem;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

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

.success-message {
  text-align: center;
  padding: 2rem;
}

.success-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.success-message h3 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 0.5rem;
}

.success-message p {
  color: #64748b;
  margin-bottom: 1.5rem;
}

.support-section {
  background: white;
  border-radius: 1rem;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
}

.support-section h2 {
  font-size: 1.75rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 1.5rem;
}

.support-info {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: #f8fafc;
  border-radius: 0.75rem;
  transition: all 0.2s ease;
}

.info-item:hover {
  background: #f1f5f9;
  transform: translateY(-2px);
}

.info-icon {
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

.info-content h4 {
  font-size: 1.125rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 0.25rem;
}

.info-content p {
  color: #64748b;
  margin-bottom: 0.25rem;
}

.response-time,
.hours {
  font-size: 0.875rem;
  color: #16a34a;
  font-weight: 600;
}

.status {
  font-size: 0.875rem;
  font-weight: 600;
}

.status.online {
  color: #16a34a;
}

.faq-section {
  margin-top: 2rem;
}

.faq-section h3 {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 1rem;
}

.faq-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.faq-item {
  border: 1px solid #e5e7eb;
  border-radius: 0.75rem;
  overflow: hidden;
}

.faq-question {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: #f8fafc;
  cursor: pointer;
  transition: all 0.2s ease;
}

.faq-question:hover {
  background: #f1f5f9;
}

.faq-question h4 {
  font-size: 1rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
}

.faq-icon {
  font-size: 1.25rem;
  color: #64748b;
  font-weight: 700;
}

.faq-answer {
  padding: 1rem;
  background: white;
}

.faq-answer p {
  color: #64748b;
  line-height: 1.6;
  margin: 0;
}

.additional-info {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.info-card {
  background: white;
  border-radius: 1rem;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  text-align: center;
  transition: transform 0.2s ease;
}

.info-card:hover {
  transform: translateY(-4px);
}

.card-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.info-card h3 {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 1rem;
}

.info-card p {
  color: #64748b;
  line-height: 1.6;
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

.btn-primary:hover:not(:disabled) {
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
  .contact-container {
    padding: 1rem;
  }
  
  .header h1 {
    font-size: 2rem;
  }
  
  .contact-grid {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
  
  .form-row {
    grid-template-columns: 1fr;
  }
  
  .additional-info {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .info-item {
    flex-direction: column;
    text-align: center;
  }
  
  .info-icon {
    width: 50px;
    height: 50px;
    font-size: 1.5rem;
  }
}
</style>



