<script setup>
import {
  reactive,
  computed,
  ref,
  watch,
  onMounted,
  onBeforeUnmount
} from 'vue'
import api from '@/services/api.js'
import Language from '@/components/Language.vue'
import { useI18n } from 'vue-i18n'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const { t } = useI18n()

const route = useRoute()

const loginStep = ref(null);

const phone_number = ref(false);
const loginError = ref(null);
const saveMe = ref(false);

const isPassword = ref(false);
const darkMode = ref(false);

const username = reactive({
  value: "",
  noError: false,
  textError: null
})
const password = reactive({
  value: "",
  noError: false,
  textError: null
})

const checkValue = function (text, width, field) {
  let value = text.target.value
  field.noError = value.length < width ? false : true
  field.textError = value.length < width ? '3 ta harfdan kop' : null
}

const onGoogleLogin = () => {
  const client = google.accounts.oauth2.initTokenClient({
    client_id: '1099067991168-9p3q76leqm8sm37tb9gvajrnt68kab89.apps.googleusercontent.com',
    scope: 'email profile',
    callback: async (tokenResponse) => {
      if (tokenResponse.access_token) {
        try {
          const response = await api.post(`/auth/oauth2/${tokenResponse.access_token}`)
          localStorage.setItem('accessToken', response.data.data.token)
          localStorage.setItem('userInfo', JSON.stringify(response.data.data.user))
          router.push('/pages/home');
        } catch (error) {
          showErrorToast(t('google_login_error'));
          return;
        }

        // authenticateWithBackend(tokenResponse.access_token);
      }
    },
  });

  client.requestAccessToken();
}

const authenticateWithBackend = async (accessToken) => {
  try {
    // Get user profile from Google
    const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const userInfo = await userInfoResponse.json();
    console.log('User Info from Google:', userInfo);
    localStorage.setItem('accessToken', accessToken)
    localStorage.setItem('userInfo', JSON.stringify(userInfo));

    router.push('/pages');
    // Optional: Send user info or token to your backend
    const backendResponse = await this.$axios.post('/api/auth/google', {
      token: accessToken,
      profile: userInfo,
    });

    // Handle backend response
    console.log('Backend response:', backendResponse.data);
  } catch (error) {
    console.error('Error fetching user info or authenticating:', error);
  }
}



onBeforeUnmount(() => {

});

const togglePassword = () => {
  isPassword.value = !isPassword.value;
};




const onLoginSubmit = async () => {
  try {
    const response = await api.post('/auth/login', {
      username: username.value,
      password: password.value
    })
    localStorage.setItem('accessToken', response.data.accessToken)
  } catch (error) {
    loginError.value = true
  }
};

//ERROR TOAST
const error = ref(null);
const succes = ref(null);
const showErrorToast = (errortext) => {
  error.value = errortext;
  setTimeout(hideErrorToast, 3000);
};
const showGreenToast = (errortext) => {
  succes.value = errortext;
  setTimeout(hideGreenToast, 3000);
};
const hideErrorToast = () => {
  error.value = null;
};
const hideGreenToast = () => {
  succes.value = null;
};

onMounted( () => {
   // onGoogleLogin()
});

</script>

<template>
  <section class="authorization">
    <div class="authorization__form" :class="{ dark: darkMode }">

      <form class="authorization__main " @submit.prevent="onLoginSubmit">
        <Language />
        <div class="authorization__form-content">
          <h1 class="authorization__title">{{ $t('login_header_text') }}</h1>
          <div class="authorization__input" :class="phone_number && 'error'">
            <label class="input">
              <input class="input__field" type="text" placeholder=" " v-model="username.value"
                @blur="checkValue($event, 2, username)" />
              <span class="input__label">{{ $t('login_text') }}</span>
            </label>
            <label class="input">
              <input class="input__field" :type="isPassword ? 'text' : 'password'" placeholder=" "
                v-on:keyup.enter="onLoginSubmit" v-model="password.value" @blur="checkValue($event, 2, password)" />
              <span class="input__label">{{ $t('password_text') }}</span>
              <div class="image" @click="togglePassword">
                <img style="width: 24px;"
                  src="https://hamroh.biznes-portal.uz/services/platon-core/web/v1/store/file/auth/eye-login.svg"
                  alt="eye" />
              </div>
            </label>

            <p v-if="loginError" class="authorization__input-errortxt">
              {{ $t('wrong_password') }}
            </p>

            <div class="authorization__forgot-section">
              <div class="authorization__remember">
                <input name="todo" id="todo" type="checkbox" :checked="saveMe" class="authorization__remember-input" />
                <label class="todo" for="todo">{{ $t('remember') }}</label>
              </div>
              <a @click.prevent="loginStep = 'UPDATE_PASSWORD'">{{ $t('forgot_password') }}</a>
            </div>

            <div class="authorization__option">
              <a href="#" class="svk-btn " @click="onLoginSubmit">
                <div v-if="!isLoading" class="flex">
                  <p class="svk-btn__text">{{ $t('login_btn_text') }}</p>
                </div>
              </a>

            </div>

            <!-- Google Login Button -->
            <div class="authorization__option">
              <a href="#" class="svk-btn google-btn" @click="onGoogleLogin">
                <div class="flex items-center gap-2">
                  <img src="../../assets/images/googleicon.svg" alt="Google" class="w-5 h-5" />
                  <p class="svk-btn__text">Google</p>
                </div>
              </a>
            </div>


          </div>
        </div>
      </form>
    </div>
    <div class="authorization__form-cover">
      <img src="@/assets/images/uwed_building.png" alt="cover" class="authorization__cover-img" />
    </div>
  </section>
</template>

<style scoped>
*,
ul,
p,
span,
h1 {
  margin: 0;
  padding: 0;
  list-style: none;
  box-sizing: border-box;
  scroll-behavior: smooth;
  outline: none;
}

*::-webkit-scrollbar,
ul::-webkit-scrollbar,
p::-webkit-scrollbar,
span::-webkit-scrollbar,
h1::-webkit-scrollbar {
  width: 5px;
  height: 5px;
}

*::-webkit-scrollbar-track,
ul::-webkit-scrollbar-track,
p::-webkit-scrollbar-track,
span::-webkit-scrollbar-track,
h1::-webkit-scrollbar-track {
  background: #f1f1f1;
}

*::-webkit-scrollbar-thumb,
ul::-webkit-scrollbar-thumb,
p::-webkit-scrollbar-thumb,
span::-webkit-scrollbar-thumb,
h1::-webkit-scrollbar-thumb {
  background: rgba(28, 79, 209, 0.5);
  border-radius: 10px;
}

a {
  color: inherit;
  text-decoration: none;
  cursor: pointer;
}

a:hover {
  color: inherit;
  text-decoration: none;
}

img {
  display: flex;
}

section {
  overflow: hidden;
}

input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type="number"] {
  -moz-appearance: textfield;
  appearance: none;
}

input[type="radio"] {
  accent-color: rgb(138, 0, 25);
}

input[type="checkbox"] {
  accent-color: rgb(138, 0, 25);
}

.container {
  width: 1400px;
  margin: 0 auto;
}

body {
  /* background: #f7f7f7; */
  background-image: url('https://hamroh.biznes-portal.uzhttps://hamroh.biznes-portal.uz/services/platon-core/web/v1/store/file/auth/blur-background.png');
  background-repeat: no-repeat;
  overflow-y: scroll;
  min-width: 320px;
}



.input {
  position: relative;
  margin: 10px 0;
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

.input .image {
  cursor: pointer;
  position: absolute;
  padding: 0 10px;
}

.input__label {
  position: absolute;
  left: 0;
  top: 0;
  white-space: nowrap;
  transform: translate(0, 0);
  transform-origin: 0 0;
  background: #f4f4f4;
  transition: transform 120ms ease-in;
  font-size: 16px;
  font-weight: 400;
  line-height: 19px;
  letter-spacing: 0em;
  text-align: left;
  padding-left: 10px;
}

.input__field {
  box-sizing: border-box;
  display: block;
  width: 100%;
  border-radius: 16px;
  border: 1px solid transparent;
  padding: 17px;
  transition: border-color 0.3s;
  background-color: #f4f4f4;
}

/* .input__field, */
.authorization__remember-input:focus {
  border: 1px solid rgb(138, 0, 25);
}

.input__field:focus,
.input__field:-webkit-autofill,
.input__field:-webkit-autofill:hover,
.input__field:-webkit-autofill:focus,
.input__field:not(:placeholder-shown),
.input__field {
  -webkit-box-shadow: 0 0 0px 1000px #ffffff inset !important;
  background-color: #ffffff !important;
  border-color: #c4c4c4;
  -webkit-text-fill-color: #333 !important;
}

.authorization__form.dark .input__field {
  background-color: #0d1521;
}



.input__field:focus+.input__label,
.input__field:not(:placeholder-shown)+.input__label,
.input__field:-webkit-autofill+.input__label {
  transform: translate(0.25rem, -65%) scale(0.8);
  background: #fff;
}

/* .input__field:focus {
    outline: 1px solid rgb(138, 0, 25);
} */
.authorization__main {
  width: 530px;
  background: white;
  padding: 40px;
  border-radius: 24px;
  @apply flex flex-col items-center justify-center;
  box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
}

.authorization__form {
  justify-content: center;
  position: relative;
  z-index: 2;
  display: flex;
  align-items: center;
  flex-direction: column;
  width: 100%;
}

.authorization__cover-img {
  width: 100%;
  height: 100%;
}

.authorization {
  display: grid;
  grid-template-columns: 1fr 1fr;
  height: 100vh;
  align-items: stretch;
  position: relative;
}



.authorization__logos img {
  height: 90px;
  object-fit: contain;
  width: 40%;
}

.authorization__option {
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-top: 25px;
}

.authorization__option span {
  padding-left: 100px;
}



.auth-register-link span {
  text-decoration: underline;
  text-decoration-skip-ink: none;
  color: #141316;
  cursor: pointer;
  transition: 0.4s;

}

.authorization__remember {
  display: flex;
  gap: 8px;
  align-items: center;
}

.authorization__forgot-section {
  margin-top: 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}

.authorization__forgot-section a {
  text-decoration: underline;
  transition: 0.4s;
}

.authorization__remember-input {
  position: relative;
  width: 1.5em;
  height: 1.5em;
  color: black;
  border: 1px solid gray;
  border-radius: 4px;
  appearance: none;
  outline: 0;
  cursor: pointer;
  transition: background 175ms cubic-bezier(0.1, 0.1, 0.25, 1);
}

.google-btn {
  background-color: white;
  border: 1px solid #ccc;
  color: #444;
}

.google-btn:hover {
  background-color: #f7f7f7;
}

.authorization__remember-input::before {
  position: absolute;
  content: "";
  display: block;
  top: 1px;
  left: 6px;
  width: 4px;
  height: 10px;
  border-style: solid;
  border-color: #fff;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
  opacity: 0;
}

.authorization__remember label {}

.authorization__remember-input:checked {
  color: #fff;
  border-color: rgb(138, 0, 25);
  background: rgb(138, 0, 25);
}

.authorization__remember-input:checked::before {
  opacity: 1;
}


.authorization__form.dark {
  background: #20232c;
}

.authorization__form.dark .authorization__form-header {
  border-bottom: 1px solid #0d1521;
}

.authorization__form.dark .authorization__form-header-checkbox span {
  color: white;
}


.authorization__form.dark .authorization__title {
  color: #fff;
}

.authorization__form.dark .input {
  background: #20232c;
}

.authorization__form.dark .input__field:focus+.input__label,
.authorization__form.dark .input__field:not(:placeholder-shown)+.input__label {
  background: #20232c;
}

.authorization__form.dark .input__field:focus {
  /* background: #20232c; */
}

.authorization__form.dark .input__field::placeholder {
  color: #fff;
}

.authorization__form.dark .input__label {
  background: #0d1521;
}

.authorization__form.dark .todo {
  color: #fff;
}

.authorization__form.dark .otherSec {
  color: #fff;
}

.authorization__form.dark .plblang__text {
  color: #fff;
}

.authorization__form.dark .plbrb-topbar__lang-currentlabel {
  color: #fff;
}

.authorization__form.dark .plbrb-topbar__lang-currentlang {
  color: #fff;
}

.authorization__form.dark .plbrb-topbar__lang {
  color: #fff;
  background: #0d1521;
}

.authorization__form.dark .plbrb-topbar__lang .plblang {
  color: #fff;
  background: #0d1521;
}

.authorization__form.dark .plbrb-topbar__lang .plbrb-topbar__lang-body {
  padding: 0;
  background: #0d1521;
}


.authorization__form-header-checkbox span {
  font-size: 16px;
  font-weight: 510;
  line-height: 14px;
}

.authorization__form-content {
  /* padding-top: 100px; */
  width: 100%;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  flex-direction: column;
}

.authorization__title {
  font-style: normal;
  font-weight: 700;
  font-size: 30px;
  line-height: 46px;
  color: #000;
  margin: 0 auto 20px auto;
}

.authorization__input {
  gap: 0px;
  display: flex;
  flex-direction: column;
  width: 100%;
}

.authorization__input-errortxt {
  color: white;
  font-weight: 500;
  font-size: 16px;
  line-height: 1.4;
  text-shadow: 0px 1px 1px rgba(0, 0, 0, 0.1);
  background-color: #ff474c;
  padding: 10px;
  text-align: center;
  border-radius: 8px;
  width: 100%;
}


@keyframes breathing {
  0% {
    -webkit-transform: scale(1.1);
    -ms-transform: scale(1.1);
    transform: scale(1.1);
  }

  25% {
    -webkit-transform: scale(1);
    -ms-transform: scale(1);
    transform: scale(1);
  }

  60% {
    -webkit-transform: scale(1.2);
    -ms-transform: scale(1.2);
    transform: scale(1.2);
  }

  100% {
    -webkit-transform: scale(1.1);
    -ms-transform: scale(1.1);
    transform: scale(1.1);
  }
}



@media (max-width: 1200px) {
  .authorization {
    padding: 0;
  }

  .authorization__form-content {
    width: 400px;
  }
}

@media (max-width: 992px) {
  .authorization {
    flex-direction: column;
    align-items: center;
    grid-template-columns: 1fr;
    gap: 30px;
    min-height: 100vh;
    height: unset;
    padding: 50px 30px;
  }

  .authorization__form {
    min-width: 760px;
    margin: 0 auto;
  }

  .authorization__form-cover {
    display: none;
  }

  .authorization__form form {
    width: 100%;
  }

  .authorization__form-content {
    width: 100%;
  }

  .authorization__form-content .authorization__agreement {
    margin: 0.7rem 0 1.2rem 1rem;
  }

  .authorization__title {
    font-size: 26px;
    line-height: 100%;
    margin: 0 auto 20px auto;
  }



  .authorization__multiselect-select>div {
    padding: 0 15px;
  }
}

@media (max-width: 768px) {
  .authorization__form {
    padding: 0;
    width: 100%;
    min-width: unset;
  }

  .authorization__form-content {
    width: 60%;
  }
}

@media (max-width: 1250px) {
  .container {
    width: 100%;
    max-width: 992px;
    padding: 0 15px;
  }
}

@media (max-width: 992px) {
  .container {
    max-width: 768px;
  }
}

@media (max-width: 768px) {
  .container {
    max-width: 576px;
  }

  * {
    -webkit-tap-highlight-color: transparent;
    -webkit-touch-callout: none;
  }
}

@media (max-width: 576px) {
  .container {
    max-width: unset;
  }
}



.svk-btn .flex {
  display: flex;
  gap: 6px;
}



.svk-btn__text {
  display: flex;
  align-items: center;
  transition: 0.2s;
  white-space: nowrap;
  text-align: center;
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  line-height: 100%;
}

.svk-btn.red {
  border-color: rgb(138, 0, 25);
  background: rgb(138, 0, 25);
}

.svk-btn.green {
  background: white;
  border: 1px solid rgb(138, 0, 25);
}

.svk-btn.green .svk-btn__text {
  color: #141316;
  font-size: 14px;
}


.svk-btn.blue {
  background: #4825c2;
  border-color: #4825c2;
}

.svk-btn.white {
  background: #fff;
  border-color: #fff;
}

.svk-btn.white .svk-btn__text {
  color: #1f2937;
}

.svk-btn.squared {
  padding: 0;
  min-width: auto;
  width: 60px;
}



.svk-btn:active {
  transform: scale(0.975);
}


.switch input {
  display: none;
}



@media(max-width: 768px) {
  .authorization {
    padding: 20px;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
  }

  .authorization__logos img {
    height: 50px;
  }

  .authorization__form {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
  }



  .authorization__form-header img {
    order: 1;
  }

  .authorization__form form {
    margin: auto 0;
  }

  .authorization__form-content {
    width: 100%;
    padding: 0;
  }


}

/* ----------------------- ERROR TOAST ----------------------------------*/
.error-toast {
  position: fixed;
  top: 10px;
  right: 10px;
  transform: translateX(120%);
  background-color: #E53324;
  padding: 10px;
  border-radius: 5px;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  align-items: center;
  opacity: 1;
  z-index: 9;
  width: 300px;
  min-height: 75px;
  transition: 0.3s ease-in-out;
}

.error-toast.active {
  transform: translateX(0%);
  opacity: 1;
}

.green-toast {
  position: fixed;
  top: 10px;
  right: 10px;
  transform: translateX(120%);
  background-color: rgb(138, 0, 25);
  padding: 10px;
  border-radius: 8px;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  align-items: center;
  opacity: 1;
  z-index: 9;
  width: 300px;
  min-height: 75px;
  transition: 0.3s ease-in-out;
}

.green-toast.active {
  transform: translateX(0%);
  opacity: 1;
}


.new_login_inputs input {
  border: 1px solid rgba(255, 255, 255, 0.08);
  font-size: 24px;
  border-radius: 16px;
  padding: 0px 16px;
  padding-left: 24px;
  width: 64px;
  height: 56px;
  background: #f9f9fb;
}

.new_login_inputs input:focus {
  border-color: rgb(138, 0, 25);
}

.modal__box .modal__header {
  background-color: #72C420 !important;
}

.authorization__forgot-section a:focus,
.authorization__forgot-section a:hover {
  opacity: 0.7;
}

.auth-register-link span:focus,
.auth-register-link span:hover {
  opacity: 0.7;

}
</style>