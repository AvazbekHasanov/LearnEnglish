import { ref, watchEffect } from 'vue'
import { defineStore } from 'pinia'
import {useRouter} from 'vue-router'

const router = useRouter()

export const useUserStore = defineStore('user', () => {
  const user = ref({
    id: null,
    username: '',
    specialization: '',
    full_name: '',
    permission: [],
  })

  function setUserData(newUserData) {
    user.value = { ...user.value, ...newUserData }
  }

  function logOut(newUserData) {
    user.value = {
      id: null,
      username: '',
      specialization: '',
      full_name: '',
      permission: [],
    }
    localStorage.removeItem('accessToken')
    localStorage.removeItem('user_info')
    window.location.replace('/auth-login')
  }

  return {
    user,
    setUserData,
    logOut
  }
})
