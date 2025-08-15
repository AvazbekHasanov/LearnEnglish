<template>
  <div class="home-container">
    <BackButton :fixed="true" />
    <!-- Интро -->
    <section class="intro-block">
      <h1 class="main-title">{{ $t('home_intro_title') || $t('home_bachelor_reg') }}</h1>
      <p>{{ $t('home_intro') }}</p>
    </section>

    <!-- Шаги поступления -->
    <section class="steps-block">
      <h2>{{ $t('home_steps_title') || 'Qabul bosqichlari' }}</h2>
      <div class="steps-list">
        <div class="step-card">
          <span class="step-number">1</span>
          <span>{{ $t('home_step_register') || 'Roʻyxatdan oʻting' }}</span>
        </div>
        <div class="step-card">
          <span class="step-number">2</span>
          <span>{{ $t('home_step_fill') || 'Anketani toʻldiring' }}</span>
        </div>
        <div class="step-card">
          <span class="step-number">3</span>
          <span>{{ $t('home_step_upload') || 'Hujjatlarni yuklang' }}</span>
        </div>
        <div class="step-card">
          <span class="step-number">4</span>
          <span>{{ $t('home_step_submit') || 'Arizani yuboring' }}</span>
        </div>
      </div>
    </section>

    <!-- Бакалавриат -->
    <section class="bachelor-block">
      <h2>{{ $t('home_bachelor') }}</h2>
      <div class="bachelor-content">
        <div>
          <h3>{{ $t('home_bachelor_reg') }}</h3>
        </div>
        <div>
          <a class="main-link" href="https://uwed.uz/admission/1" target="_blank" >{{ $t('home_info') }}</a>
          <ul>
            <li> <a class="main-link" href="https://uwed.uz/pages/tuition-fees-18" target="_blank"> {{ $t('home_cost') }}</a> </li>
          </ul>
        </div>
      </div>
    </section>

    <!-- Магистратура -->
    <section class="master-block">
      <h2>{{ $t('home_master') }}</h2>
      <div>
        <a class="main-link" href="https://uwed.uz/admission/2" target="_blank" >{{ $t('home_info') }}</a>
        <ul>
          <li> <a class="main-link" href="https://uwed.uz/pages/tuition-fees-18" target="_blank"> {{ $t('home_cost') }}</a> </li>
        </ul>
      </div>
    </section>

    <!-- Подробнее / More info -->
    <section class="more-info-block">
      <h2>{{ $t('home_more_info') }}</h2>
      <ul class="more-info-list">
        <li>
          <a href="https://uwed.uz" target="_blank" rel="noopener" class="main-link">
            {{ $t('home_uwed_link') }}
          </a>
        </li>
      </ul>
    </section>

    <!-- Контакты -->
    <section class="contacts-block">
      <h2>{{ $t('home_contacts_title') || 'Aloqa' }}</h2>
      <ul class="contacts-list">
        <li><strong>Email:</strong> <a href="mailto:admission@uwed.uz" target="_blank">admission@uwed.uz</a></li>
        <li>
          <strong>{{ $t('home_contacts_phone') || 'Telefon:' }}</strong>
          <a href="tel:+998 (71) 268-35-40" target="_blank">+998 (71) 268-35-40</a>
        </li>
        <li>
          <strong>{{ $t('home_contacts_telegram') || 'Telegram' }}:</strong>
          <a href="https://t.me/uwed_admission" target="_blank"> @uwed_admission </a>
        </li>
        <li>
          <strong>{{ $t('home_contacts_address') || 'Manzil:' }}</strong>
          {{ $t('home_contacts_address_val') || 'Tashkent, Mustaqillik shoh ko‘chasi, 54' }}
        </li>
      </ul>
    </section>

  </div>
</template>

<script setup>
import BackButton from '@/components/BackButton.vue'
// Логика не требуется
</script>

<style scoped>
.home-container {
  max-width: 900px;
  margin: 0 auto;
  padding: 32px 8px 48px 8px;
  display: flex;
  flex-direction: column;
  gap: 32px;
}
.main-title {
  font-size: 2.1rem;
  font-weight: 700;
  color: #1a237e;
  margin-bottom: 12px;
  text-align: center;
}
.intro-block {
  background: linear-gradient(90deg, #e3f0ff 0%, #f8fafd 100%);
  border-radius: 16px;
  padding: 28px 20px 20px 20px;
  font-size: 1.15rem;
  color: #333;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  text-align: center;
}
.steps-block {
  background: #fff;
  border-radius: 14px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  padding: 24px 16px;
}
.steps-block h2 {
  font-size: 1.25rem;
  margin-bottom: 18px;
  color: #1976d2;
  text-align: center;
}
.steps-list {
  display: flex;
  flex-wrap: wrap;
  gap: 18px;
  justify-content: center;
}
.step-card {
  background: #f1f8fe;
  border-radius: 10px;
  box-shadow: 0 1px 4px rgba(25, 118, 210, 0.07);
  padding: 18px 22px;
  min-width: 120px;
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 1.05rem;
  font-weight: 500;
  color: #1976d2;
  transition: box-shadow 0.2s;
}
.step-card:hover {
  box-shadow: 0 4px 16px rgba(25, 118, 210, 0.13);
}
.step-number {
  background: #1976d2;
  color: #fff;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
  font-weight: 700;
  margin-bottom: 8px;
}
.bachelor-block,
.master-block {
  background: #fff;
  border-radius: 14px;
  padding: 24px 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}
.bachelor-block h2,
.master-block h2 {
  font-size: 1.2rem;
  color: #1a237e;
  margin-bottom: 10px;
}
.bachelor-content,
.master-content {
  display: flex;
  flex-wrap: wrap;
  gap: 32px;
  justify-content: space-between;
}
.bachelor-content > div,
.master-content > div {
  flex: 1 1 260px;
}
.bachelor-content ul {
  margin-top: 8px;
  padding-left: 18px;
}
.bachelor-content li {
  font-size: 1rem;
  margin-bottom: 4px;
}
.contacts-block {
  background: #f8fafd;
  border-radius: 14px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  padding: 22px 16px;
}
.contacts-block h2 {
  font-size: 1.15rem;
  color: #1976d2;
  margin-bottom: 10px;
}
.contacts-list {
  list-style: none;
  padding: 0;
  margin: 0;
  font-size: 1.05rem;
}
.contacts-list li {
  margin-bottom: 6px;
}
.faq-block {
  background: #fff;
  border-radius: 14px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  padding: 22px 16px;
}
.faq-block h2 {
  font-size: 1.15rem;
  color: #1976d2;
  margin-bottom: 12px;
}
.faq-list {
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.faq-item {
  background: #f1f8fe;
  border-radius: 10px;
  padding: 14px 18px;
  box-shadow: 0 1px 4px rgba(25, 118, 210, 0.07);
}
.faq-q {
  font-weight: 600;
  color: #1a237e;
  margin-bottom: 4px;
}
.faq-a {
  color: #333;
  font-size: 0.98rem;
}
.main-link {
  color: #1976d2;
  font-weight: 600;
  text-decoration: underline;
  transition: color 0.2s;
}
.main-link:hover {
  color: #0d47a1;
}
.more-info-block {
  background: #f8fafd;
  border-radius: 14px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  padding: 22px 16px;
  margin-bottom: 12px;
}
.more-info-block h2 {
  font-size: 1.15rem;
  color: #1976d2;
  margin-bottom: 10px;
}
.more-info-list {
  list-style: none;
  padding: 0;
  margin: 0;
  font-size: 1.05rem;
  display: flex;
  flex-wrap: wrap;
  gap: 18px;
}
.more-info-list li {
  margin-bottom: 6px;
}
@media (max-width: 700px) {
  .home-container {
    padding: 16px 2vw 32px 2vw;
  }
  .steps-list,
  .bachelor-content,
  .master-content {
    flex-direction: column;
    gap: 16px;
  }
  .bachelor-content > div,
  .master-content > div {
    flex: 1 1 100%;
  }
}
</style>
