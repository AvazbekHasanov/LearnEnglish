<template>
  <el-button
    @click="goBack" 
    class="back-button"
    :icon="ArrowLeft"
    :class="{ 'back-button--fixed': fixed }"
  >
    <span v-if="showText">{{ text || $t('common.back') }}</span>
  </el-button>
</template>

<script setup>
import { useRouter } from 'vue-router'

import {ArrowLeft} from '@element-plus/icons-vue'

const props = defineProps({
  text: {
    type: String,
    default: ''
  },
  showText: {
    type: Boolean,
    default: true
  },
  fixed: {
    type: Boolean,
    default: false
  },
  fallbackRoute: {
    type: String,
    default: '/'
  }
})

const router = useRouter()

const goBack = () => {
  if (window.history.length > 1) {
    router.back()
  } else {
    router.push(props.fallbackRoute)
  }
}
</script>

<style scoped>
.back-button {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  color: #64748b;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.2s ease;
  cursor: pointer;
  backdrop-filter: blur(10px);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.back-button:hover {
  background: rgba(255, 255, 255, 1);
  color: #475569;
  transform: translateY(-1px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.back-button--fixed {
  position: fixed;
  top: 1rem;
  left: 1rem;
  z-index: 1000;
}

.back-button i {
  font-size: 0.875rem;
}

.back-button span {
  font-size: 0.875rem;
}

@media (max-width: 768px) {
  .back-button {
    padding: 0.5rem 0.75rem;
  }
  
  .back-button span {
    display: none;
  }
}
</style>
