<script setup>

import { onMounted, ref } from 'vue'

const languages = ref([
  {
    code: "uz",
    name: "Oʻzbekcha"
  },
  {
    code: "ru",
    name: "Русский"
  },
  {
    code: "en",
    name: "English"
  }
]);
const selectedLanguage = ref(localStorage.getItem('locale') || 'Oʻzbekcha');

const language = ref('uz');

const changeLocale = (language) => {
  selectedLanguage.value = language.name
  langcurrent.value = language.code
  localStorage.setItem("locale", language.code)
  window.location.reload();
}

const langcurrent = ref(localStorage.getItem('locale') || 'en')

onMounted(() => {
  const selectedLang = localStorage.getItem('locale') || 'uz';
  selectedLanguage.value = languages.value.filter((el) => el.code == selectedLang)[0].name;

});

</script>

<template>
  <div class="plbrb-topbar__lang-holder ">
    <div class="plbrb-topbar__lang">
      <div class="plbrb-topbar__lang-toggler">
        <img :src="`https://hamroh.biznes-portal.uz/services/platon-core/web/v1/store/file/auth/${langcurrent}.svg`" alt="ru" class="plbrb-topbar__lang-currentflag" />
        <p class="plbrb-topbar__lang-currentlabel">{{ $t('lang_txt') }}:</p>
        <p class="plbrb-topbar__lang-currentlang">{{ $t('selected_language') }}</p>
        <span class="plbrb-topbar__lang-icon"></span>
      </div>
      <div class="plbrb-topbar__lang-body">
        <ul class="plbrb-topbar__lang-list">
          <li v-for="(item, index) in languages" :key="'lang' + index" @click.native="changeLocale(item)" class="plbrb-topbar__lang-item plblang">
            <img :src="`https://hamroh.biznes-portal.uz/services/platon-core/web/v1/store/file/auth/${item.code}.svg`" alt="ru" class="plblang__flag" />
            <p class="plblang__text">{{item.name}}</p>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style scoped>

.authorization__form.dark .selected-language {
  color: #fff;
  background: #0d1521;
}

.authorization__form.dark .language-list {
  color: #fff;
  background: #0d1521;
}

.authorization__form.dark .language-list li:hover {
  background-color: #172232;
}

.plbrb-topbar__lang {
  position: absolute;
  z-index: 2;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 10px;
  transition: 0.3s;
  background: white;
}

.plbrb-topbar__lang-holder {
  display: flex;
  flex-shrink: 0;
  width: 220px;
  height: 55px;
  position: relative;
  z-index: 3;
}

.plbrb-topbar__lang-toggler {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: 0 20px;
  gap: 5px;
  cursor: pointer;
}

.plbrb-topbar__lang-currentflag {
  width: 28px;
  height: 18px;
  display: flex;
  object-fit: cover;
  flex-shrink: 0;
  border-radius: 3px;
}


.plbrb-topbar__lang-currentlang {
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 100%;
  flex-grow: 1;
  overflow: hidden;
  padding: 0 20px 0 0;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -moz-box;
  -moz-box-orient: vertical;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  word-break: break-all;
  -webkit-box-orient: vertical;
  line-clamp: 1;
  box-orient: vertical;
}

.plbrb-topbar__lang-icon {
  width: 15px;
  height: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  position: absolute;
  top: 50%;
  right: 20px;
  transform: translateY(-50%);
  transition: 0.3s;
}

.plbrb-topbar__lang-icon::after,
.plbrb-topbar__lang-icon::before {
  display: flex;
  content: "";
  width: 1px;
  height: 5px;
  position: absolute;
  transform-origin: bottom center;
  border-radius: 1px;
}

.plbrb-topbar__lang-icon::after {
  transform: rotate(-45deg) translateY(0.5px);
}

.plbrb-topbar__lang-icon::before {
  transform: rotate(45deg) translateY(0.5px);
}

.plbrb-topbar__lang-body {
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  padding: 10px 0;
  /* background: #f4f4f4; */
  border-radius: 0 0 10px 10px;
  box-shadow: 0 10px 20px -10px rgba(0, 0, 0, 0.2);
  opacity: 0;
  visibility: hidden;
  transition: 0.3s;
  transform: translateY(-20px);
}

.plbrb-topbar__lang-list {
  margin: 0;
}

.plbrb-topbar__lang .plblang {
  width: 100%;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  cursor: pointer;
  gap: 5px;
  overflow: hidden;
  transition: 0.3s;
  background: #f4f4f4;
  padding: 0 20px;
}

.plbrb-topbar__lang .plblang__flag {
  width: 28px;
  height: 18px;
  display: flex;
  object-fit: cover;
  border-radius: 3px;
  flex-shrink: 0;
  display: flex;
}

.plbrb-topbar__lang .plblang__text {
  font-size: 16px;
  font-style: normal;
  transition: 0.3s;
  font-weight: 400;
  line-height: 120%;
}

.plbrb-topbar__lang .plblang:hover {
  background: white;
}

.plbrb-topbar__lang .plblang:hover .plblang__text {
  opacity: 0.7;
}

.plbrb-topbar__lang:hover {
  border-radius: 10px 10px 0 0;
}

.plbrb-topbar__lang:hover .plbrb-topbar__lang-body {
  transform: translateY(0);
  opacity: 1;
  visibility: visible;
}

.plbrb-topbar__lang:hover .plbrb-topbar__lang-icon {
  transform: translateY(-50%) rotate(180deg);
}

</style>