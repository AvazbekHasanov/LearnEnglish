<template>
  <div id="app">
    <!-- Header -->
    <header 
      class="header" 
      :class="{ 'scrolled': scrollY > 50 }"
    >
      <nav class="nav-container">
        <div class="logo">
          <span class="logo-text">LendTech</span>
          <div class="logo-accent"></div>
        </div>
        
        <!-- Desktop Menu -->
        <div class="desktop-menu">
          <a href="#about" class="nav-link">About Us</a>
          <a href="#services" class="nav-link">Services</a>
          <a href="#feedback" class="nav-link">Feedback</a>
          <a href="#contact" class="nav-link">Contact</a>
        </div>
        
        <div class="header-actions">
          <button class="cta-button desktop-only">
            Get Started
            <i class="fas fa-arrow-right ml-2"></i>
          </button>
          
          <!-- Mobile Menu Toggle -->
          <button 
            class="mobile-menu-toggle"
            @click="toggleMobileMenu"
          >
            <i :class="isMobileMenuOpen ? 'fas fa-times' : 'fas fa-bars'"></i>
          </button>
        </div>
      </nav>
      
      <!-- Mobile Menu -->
      <div class="mobile-menu" :class="{ 'active': isMobileMenuOpen }">
        <div class="mobile-menu-content">
          <a href="#about" class="mobile-nav-link" @click="closeMobileMenu">About Us</a>
          <a href="#services" class="mobile-nav-link" @click="closeMobileMenu">Services</a>
          <a href="#feedback" class="mobile-nav-link" @click="closeMobileMenu">Feedback</a>
          <a href="#contact" class="mobile-nav-link" @click="closeMobileMenu">Contact</a>
          <button class="cta-button mobile-cta" @click="closeMobileMenu">
            Get Started
            <i class="fas fa-arrow-right ml-2"></i>
          </button>
        </div>
      </div>
    </header>

    <!-- Hero Section -->
    <section class="hero">
      <div class="hero-background">
        <div class="floating-element" style="top: 15%; left: 10%;"></div>
        <div class="floating-element" style="top: 60%; right: 15%; animation-delay: -2s;"></div>
        <div class="floating-element" style="top: 80%; left: 20%; animation-delay: -4s;"></div>
      </div>
      
      <div class="hero-content">
        <div class="hero-text">
          <h1 class="hero-title">
            Professional Lending
            <span class="gradient-text">Solutions</span>
            for You
          </h1>
          <p class="hero-description">
            Transform your financial goals with our innovative lending platform. 
            Fast, secure, and reliable services tailored to your needs.
          </p>
          <div class="hero-buttons">
            <button class="primary-button">
              Apply Now
              <i class="fas fa-arrow-right"></i>
            </button>
            <button class="secondary-button">
              <i class="fas fa-play-circle mr-2"></i>
              Watch Demo
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- Stats Section -->
    <section class="stats-section">
      <div class="container">
        <div class="stats-grid">
          <div class="stat-card" v-for="(stat, index) in stats" :key="index">
            <div class="stat-icon">
              <i :class="stat.icon"></i>
            </div>
            <div class="stat-number">{{ stat.number }}</div>
            <div class="stat-label">{{ stat.label }}</div>
          </div>
        </div>
      </div>
    </section>

    <!-- About Section -->
    <section id="about" class="about-section">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">About Us</h2>
          <p class="section-subtitle">
            We're revolutionizing the lending industry with cutting-edge technology and 
            personalized service that puts our customers first.
          </p>
        </div>
        
        <div class="about-content">
          <div class="about-text">
            <h3 class="about-subtitle">Our Mission</h3>
            <p class="about-description">
              To provide accessible, transparent, and innovative financial solutions that 
              empower individuals and businesses to achieve their goals. We believe in 
              building lasting relationships based on trust and mutual success.
            </p>
            
            <div class="feature-list">
              <div class="feature-item" v-for="feature in aboutFeatures" :key="feature">
                <i class="fas fa-check-circle"></i>
                <span>{{ feature }}</span>
              </div>
            </div>
          </div>
          
          <div class="about-visual">
            <div class="highlight-card">
              <div class="highlight-number">250K+</div>
              <div class="highlight-text">Happy clients worldwide</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Services Section -->
    <section id="services" class="services-section">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">Our Services</h2>
          <p class="section-subtitle">
            Comprehensive lending solutions designed to meet your unique financial needs
          </p>
        </div>
        
        <div class="services-grid">
          <div 
            class="service-card" 
            v-for="service in services" 
            :key="service.id"
          >
            <div class="service-icon">
              <i :class="service.iconClass"></i>
            </div>
            <h3 class="service-title">{{ service.title }}</h3>
            <p class="service-description">{{ service.description }}</p>
            <ul class="service-features">
              <li v-for="feature in service.features" :key="feature">
                <i class="fas fa-check"></i>
                {{ feature }}
              </li>
            </ul>
            <button class="service-button">
              Learn More
              <i class="fas fa-arrow-right"></i>
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- Testimonials Section -->
    <section id="feedback" class="testimonials-section">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">Client Feedback</h2>
          <p class="section-subtitle">
            What our satisfied customers say about our services
          </p>
        </div>
        
        <div class="testimonials-grid">
          <div 
            class="testimonial-card" 
            v-for="testimonial in testimonials" 
            :key="testimonial.id"
          >
            <div class="testimonial-stars">
              <i v-for="star in 5" :key="star" class="fas fa-star"></i>
            </div>
            <p class="testimonial-text">"{{ testimonial.text }}"</p>
            <div class="testimonial-author">
              <div class="author-avatar">
                {{ testimonial.name.charAt(0) }}
              </div>
              <div class="author-info">
                <div class="author-name">{{ testimonial.name }}</div>
                <div class="author-position">{{ testimonial.position }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Contact Section -->
    <section id="contact" class="contact-section">
      <div class="container">
        <div class="section-header light">
          <h2 class="section-title">Contact Us</h2>
          <p class="section-subtitle">
            Ready to get started? Get in touch with our expert team today
          </p>
        </div>

        <div class="contact-content">
          <div class="contact-info">
            <h3 class="contact-title">Get In Touch</h3>
            <div class="contact-methods">
              <div class="contact-method">
                <div class="contact-icon">
                  <i class="fas fa-phone"></i>
                </div>
                <div class="contact-details">
                  <div class="contact-label">Phone</div>
                  <div class="contact-value">+1 (555) 123-4567</div>
                </div>
              </div>

              <div class="contact-method">
                <div class="contact-icon">
                  <i class="fas fa-envelope"></i>
                </div>
                <div class="contact-details">
                  <div class="contact-label">Email</div>
                  <div class="contact-value">contact@lendtech.com</div>
                </div>
              </div>

              <div class="contact-method">
                <div class="contact-icon">
                  <i class="fas fa-map-marker-alt"></i>
                </div>
                <div class="contact-details">
                  <div class="contact-label">Address</div>
                  <div class="contact-value">123 Finance Street, Business District</div>
                </div>
              </div>
            </div>
          </div>

          <div class="contact-form-container">
            <form @submit="submitForm" class="contact-form">
              <div class="form-row">
                <div class="form-group">
                  <input
                    v-model="contactForm.name"
                    type="text"
                    placeholder="Your Name"
                    class="form-input"
                    required
                  />
                </div>
                <div class="form-group">
                  <input
                    v-model="contactForm.email"
                    type="email"
                    placeholder="Your Email"
                    class="form-input"
                    required
                  />
                </div>
              </div>

              <div class="form-group">
                <input
                  v-model="contactForm.phone"
                  type="tel"
                  placeholder="Your Phone"
                  class="form-input"
                />
              </div>

              <div class="form-group">
                <textarea
                  v-model="contactForm.message"
                  placeholder="Your Message"
                  class="form-textarea"
                  rows="5"
                  required
                ></textarea>
              </div>

              <button type="submit" class="submit-button">
                Send Message
                <i class="fas fa-paper-plane"></i>
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="footer">
      <div class="container">
        <div class="footer-content">
          <div class="footer-brand">
            <div class="footer-logo">LendTech</div>
            <p class="footer-description">
              Professional lending solutions for a better future
            </p>
          </div>
          
          <div class="footer-social">
            <a href="#" class="social-link">
              <i class="fab fa-facebook-f"></i>
            </a>
            <a href="#" class="social-link">
              <i class="fab fa-twitter"></i>
            </a>
            <a href="#" class="social-link">
              <i class="fab fa-linkedin-in"></i>
            </a>
            <a href="#" class="social-link">
              <i class="fab fa-instagram"></i>
            </a>
          </div>
        </div>
        
        <div class="footer-bottom">
          <p>&copy; 2024 LendTech. All rights reserved.</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script>
export default {
  name: 'LendTech',
  data() {
    return {
      scrollY: 0,
      isMobileMenuOpen: false,
      contactForm: {
        name: '',
        email: '',
        phone: '',
        message: ''
      },
      stats: [
        {
          number: '50,000+',
          label: 'Satisfied Customers',
          icon: 'fas fa-users'
        },
        {
          number: '$500M+',
          label: 'Loans Processed',
          icon: 'fas fa-dollar-sign'
        },
        {
          number: '98%',
          label: 'Approval Rate',
          icon: 'fas fa-chart-line'
        }
      ],
      aboutFeatures: [
        '15+ years of industry experience',
        'Award-winning customer service',
        'Cutting-edge security technology'
      ],
      services: [
        {
          id: 1,
          title: "Personal Loans",
          description: "Quick and flexible personal loans with competitive rates for all your needs.",
          features: ["Fast approval process", "Flexible repayment terms", "No hidden fees", "24/7 support"],
          iconClass: "fas fa-user"
        },
        {
          id: 2,
          title: "Business Loans",
          description: "Fuel your business growth with our comprehensive business lending solutions.",
          features: ["Up to $500K funding", "Quick decision making", "Business expert support", "Flexible terms"],
          iconClass: "fas fa-building"
        },
        {
          id: 3,
          title: "Mortgage Loans",
          description: "Make your dream home a reality with our competitive mortgage rates.",
          features: ["Low interest rates", "First-time buyer programs", "Expert guidance", "Quick processing"],
          iconClass: "fas fa-home"
        }
      ],
      testimonials: [
        {
          id: 1,
          text: "LendTech made getting a personal loan so easy. The process was quick and the customer service was exceptional!",
          name: "Sarah Johnson",
          position: "Small Business Owner"
        },
        {
          id: 2,
          text: "I got my mortgage approved faster than I expected. The team was professional and guided me through every step.",
          name: "Michael Chen",
          position: "Software Engineer"
        },
        {
          id: 3,
          text: "The business loan helped us expand our operations. Great rates and flexible terms. Highly recommended!",
          name: "Emily Rodriguez",
          position: "Restaurant Owner"
        }
      ]
    }
  },
  mounted() {
    window.addEventListener('scroll', this.handleScroll);
  },
  beforeUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  },
  methods: {
    handleScroll() {
      this.scrollY = window.scrollY;
    },
    toggleMobileMenu() {
      this.isMobileMenuOpen = !this.isMobileMenuOpen;
    },
    closeMobileMenu() {
      this.isMobileMenuOpen = false;
    },
    submitForm(e) {
      e.preventDefault();
      if (!this.contactForm.name || !this.contactForm.email || !this.contactForm.message) {
        alert('Please fill in all required fields');
        return;
      }
      
      alert('Thank you for your message! We will get back to you soon.');
      
      // Reset form
      this.contactForm = {
        name: '',
        email: '',
        phone: '',
        message: ''
      };
    }
  }
}
</script>

<style scoped>
/* Global Styles */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  line-height: 1.6;
  overflow-x: hidden;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

/* Header Styles */
.header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  z-index: 1000;
  transition: all 0.3s ease;
}

.header.scrolled {
  background: rgba(255, 255, 255, 0.98);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  position: relative;
  display: flex;
  align-items: center;
}

.logo-text {
  font-size: 2rem;
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

.desktop-menu {
  display: flex;
  gap: 2rem;
}

.nav-link {
  text-decoration: none;
  color: #64748b;
  font-weight: 500;
  transition: all 0.3s ease;
  position: relative;
}

.nav-link:hover {
  color: #667eea;
}

.nav-link::after {
  content: '';
  position: absolute;
  bottom: -5px;
  left: 0;
  width: 0;
  height: 2px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  transition: width 0.3s ease;
}

.nav-link:hover::after {
  width: 100%;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.cta-button {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.cta-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.25);
}

.mobile-menu-toggle {
  display: none;
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #64748b;
  cursor: pointer;
  padding: 0.5rem;
}

.mobile-menu {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(20px);
  max-height: 0;
  overflow: hidden;
  transition: all 0.3s ease;
}

.mobile-menu.active {
  max-height: 400px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.mobile-menu-content {
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.mobile-nav-link {
  text-decoration: none;
  color: #64748b;
  font-weight: 500;
  padding: 0.5rem 0;
  border-bottom: 1px solid #e2e8f0;
  transition: color 0.3s ease;
}

.mobile-nav-link:hover {
  color: #667eea;
}

.mobile-cta {
  margin-top: 1rem;
  justify-content: center;
}

/* Hero Section */
.hero {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
  display: flex;
  align-items: center;
  position: relative;
  overflow: hidden;
  padding-top: 5rem;
}

.hero-background {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.floating-element {
  position: absolute;
  width: 200px;
  height: 200px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  animation: float 6s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-30px) rotate(180deg); }
}

.hero-content {
  position: relative;
  z-index: 2;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

.hero-text {
  max-width: 700px;
  text-align: center;
  margin: 0 auto;
}

.hero-title {
  font-size: 4rem;
  font-weight: 800;
  color: white;
  line-height: 1.1;
  margin-bottom: 1.5rem;
}

.gradient-text {
  background: linear-gradient(135deg, #fbbf24, #f59e0b);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-description {
  font-size: 1.25rem;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 2rem;
  line-height: 1.6;
}

.hero-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.primary-button,
.secondary-button {
  padding: 1rem 2rem;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1rem;
  border: 2px solid transparent;
}

.primary-button {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border-color: rgba(255, 255, 255, 0.3);
}

.primary-button:hover {
  background: white;
  color: #667eea;
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(255, 255, 255, 0.25);
}

.secondary-button {
  background: transparent;
  color: white;
  border-color: rgba(255, 255, 255, 0.5);
}

.secondary-button:hover {
  background: rgba(255, 255, 255, 0.1);
  transform: translateY(-2px);
}

/* Stats Section */
.stats-section {
  padding: 5rem 0;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
}

.stat-card {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(20px);
  padding: 2rem;
  border-radius: 20px;
  text-align: center;
  transition: all 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.stat-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
}

.stat-icon {
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-radius: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem;
  color: white;
  font-size: 1.5rem;
}

.stat-number {
  font-size: 2.5rem;
  font-weight: 800;
  color: #1e293b;
  margin-bottom: 0.5rem;
}

.stat-label {
  color: #64748b;
  font-weight: 500;
}

/* Section Headers */
.section-header {
  text-align: center;
  margin-bottom: 4rem;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
}

.section-title {
  font-size: 3rem;
  font-weight: 800;
  color: #1e293b;
  margin-bottom: 1rem;
}

.section-subtitle {
  font-size: 1.2rem;
  color: #64748b;
  line-height: 1.6;
}

.section-header.light .section-title {
  color: white;
}

.section-header.light .section-subtitle {
  color: rgba(255, 255, 255, 0.8);
}

/* About Section */
.about-section {
  padding: 6rem 0;
  background: white;
}

.about-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;
}

.about-subtitle {
  font-size: 2rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 1.5rem;
}

.about-description {
  font-size: 1.1rem;
  color: #64748b;
  margin-bottom: 2rem;
  line-height: 1.7;
}

.feature-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  color: #64748b;
}

.feature-item i {
  color: #10b981;
  font-size: 1.2rem;
}

.about-visual {
  display: flex;
  justify-content: center;
}

.highlight-card {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  padding: 3rem;
  border-radius: 24px;
  text-align: center;
  box-shadow: 0 20px 40px rgba(102, 126, 234, 0.3);
  transform: rotate(-5deg);
  transition: transform 0.3s ease;
}

.highlight-card:hover {
  transform: rotate(0deg) scale(1.05);
}

.highlight-number {
  font-size: 4rem;
  font-weight: 800;
  margin-bottom: 1rem;
}

.highlight-text {
  font-size: 1.2rem;
  opacity: 0.9;
}

/* Services Section */
.services-section {
  padding: 6rem 0;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
}

.services-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
}

.service-card {
  background: white;
  padding: 2.5rem;
  border-radius: 24px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  border: 1px solid #e2e8f0;
}

.service-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15);
}

.service-icon {
  width: 70px;
  height: 70px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-radius: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.8rem;
  margin-bottom: 1.5rem;
}

.service-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 1rem;
}

.service-description {
  color: #64748b;
  margin-bottom: 1.5rem;
  line-height: 1.6;
}

.service-features {
  list-style: none;
  margin-bottom: 2rem;
}

.service-features li {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: #64748b;
  margin-bottom: 0.5rem;
}

.service-features li i {
  color: #10b981;
  font-size: 0.8rem;
}

.service-button {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: 100%;
}

.service-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.25);
}

/* Testimonials Section */
.testimonials-section {
  padding: 6rem 0;
  background: white;
}

.testimonials-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
}

.testimonial-card {
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  padding: 2.5rem;
  border-radius: 24px;
  transition: all 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.testimonial-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.1);
}

.testimonial-stars {
  display: flex;
  gap: 0.25rem;
  margin-bottom: 1.5rem;
}

.testimonial-stars i {
  color: #fbbf24;
  font-size: 1.1rem;
}

.testimonial-text {
  font-size: 1.1rem;
  color: #374151;
  line-height: 1.7;
  margin-bottom: 2rem;
  font-style: italic;
}

.testimonial-author {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.author-avatar {
  width: 50px;
  height: 50px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 700;
  font-size: 1.2rem;
}

.author-name {
  font-weight: 600;
  color: #1e293b;
}

.author-position {
  color: #64748b;
  font-size: 0.9rem;
}

/* Contact Section */
.contact-section {
  padding: 6rem 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
  color: white;
}

.contact-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: start;
}

.contact-title {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 2rem;
}

.contact-methods {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.contact-method {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.contact-icon {
  width: 50px;
  height: 50px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
}

.contact-label {
  font-weight: 600;
  margin-bottom: 0.25rem;
}

.contact-value {
  opacity: 0.9;
}

.contact-form-container {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  padding: 2.5rem;
  border-radius: 24px;
  border: 1px solid rgba(255, 255, 255, 0.2);
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
}

.form-input,
.form-textarea {
  background: rgba(255, 255, 255, 0.9);
  border: 2px solid transparent;
  border-radius: 12px;
  padding: 1rem;
  font-size: 1rem;
  transition: all 0.3s ease;
  font-family: inherit;
}

.form-input:focus,
.form-textarea:focus {
  outline: none;
  border-color: #667eea;
  /* background: white; */
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.form-textarea {
  resize: vertical;
  min-height: 120px;
}

.submit-button {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 2px solid rgba(255, 255, 255, 0.3);
  padding: 1rem 2rem;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-size: 1rem;
}

.submit-button:hover {
  background: white;
  color: #667eea;
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(255, 255, 255, 0.25);
}

/* Footer */
.footer {
  background: #1e293b;
  color: white;
  padding: 3rem 0 1rem;
}

.footer-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.footer-logo {
  font-size: 1.8rem;
  font-weight: 800;
  background: linear-gradient(135deg, #667eea, #764ba2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 0.5rem;
}

.footer-description {
  color: #94a3b8;
  max-width: 300px;
}

.footer-social {
  display: flex;
  gap: 1rem;
}

.social-link {
  width: 45px;
  height: 45px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  text-decoration: none;
  transition: all 0.3s ease;
  font-size: 1.1rem;
}

.social-link:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
}

.footer-bottom {
  text-align: center;
  padding-top: 2rem;
  border-top: 1px solid #334155;
  color: #94a3b8;
}

/* Mobile Responsive Design */
@media (max-width: 768px) {
  .container {
    padding: 0 1rem;
  }
  
  .nav-container {
    padding: 1rem;
  }
  
  .desktop-menu {
    display: none;
  }
  
  .desktop-only {
    display: none;
  }
  
  .mobile-menu-toggle {
    display: block;
  }
  
  .hero-title {
    font-size: 2.5rem;
  }
  
  .hero-description {
    font-size: 1.1rem;
  }
  
  .hero-buttons {
    flex-direction: column;
    align-items: center;
  }
  
  .primary-button,
  .secondary-button {
    width: 100%;
    max-width: 300px;
    justify-content: center;
  }
  
  .section-title {
    font-size: 2.5rem;
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
  
  .about-content {
    grid-template-columns: 1fr;
    gap: 2rem;
    text-align: center;
  }
  
  .services-grid {
    grid-template-columns: 1fr;
  }
  
  .testimonials-grid {
    grid-template-columns: 1fr;
  }
  
  .contact-content {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
  
  .form-row {
    grid-template-columns: 1fr;
  }
  
  .footer-content {
    flex-direction: column;
    gap: 2rem;
    text-align: center;
  }
}

@media (max-width: 480px) {
  .hero-title {
    font-size: 2rem;
  }
  
  .section-title {
    font-size: 2rem;
  }
  
  .stat-card,
  .service-card,
  .testimonial-card {
    padding: 1.5rem;
  }
  
  .contact-form-container {
    padding: 1.5rem;
  }
}

/* Utility Classes */
.ml-2 {
  margin-left: 0.5rem;
}

.mr-2 {
  margin-right: 0.5rem;
}

/* Smooth Scrolling */
html {
  scroll-behavior: smooth;
}

/* Loading Animation */
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

/* Focus Styles for Accessibility */
button:focus,
input:focus,
textarea:focus,
a:focus {
  outline: 2px solid #667eea;
  outline-offset: 2px;
}

/* Print Styles */
@media print {
  .header,
  .footer {
    display: none;
  }
  
  .hero {
    min-height: auto;
    padding: 2rem 0;
  }
}
</style>