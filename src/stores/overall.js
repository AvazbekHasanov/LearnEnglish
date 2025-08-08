import { ref, watchEffect } from 'vue'
import { defineStore } from 'pinia'
import { ElLoading } from 'element-plus'
import {useUserStore} from '@/stores/userStore.js'

export const useOverallStore = defineStore('overall', () => {

  const isLoading = ref(false)
  const loadingInstance = ref(null) 
  const userStore = useUserStore()


  const sidebarOpen = ref(true)
  const isDesktop = ref(window.innerWidth >= 768)

  watchEffect(() => {
    const updateIsDesktop = () => {
      isDesktop.value = window.innerWidth >= 768
    }
    window.addEventListener('resize', updateIsDesktop)

    return () => {
      window.removeEventListener('resize', updateIsDesktop)
    }
  })

  function setUserData(newUserData) {
    user.value = { ...user.value, ...newUserData }
  }

  function toggleSidebar(value) {
    if (typeof value === 'boolean') {
      sidebarOpen.value = value
    } else {
      sidebarOpen.value = !sidebarOpen.value
    }
  }

  // 👉 Start Element Plus loader
  function startLoader() {
    if (!loadingInstance.value) {
      loadingInstance.value = ElLoading.service({
        lock: true,
        text: 'Yuklanmoqda...',
        background: 'rgba(0, 0, 0, 0.3)',
      })
      isLoading.value = true
    }
  }

  // 👉 Stop loader
  function stopLoader() {
    if (loadingInstance.value) {
      loadingInstance.value.close()
      loadingInstance.value = null
      isLoading.value = false
    }
  }


  return {
    isLoading,
    sidebarOpen,
    isDesktop,
    setUserData,
    toggleSidebar,
    startLoader,
    stopLoader,
  }
})
