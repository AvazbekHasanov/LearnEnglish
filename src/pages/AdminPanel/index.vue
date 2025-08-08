<template>
  <el-container class="h-screen">
    <!-- Sidebar -->
    <transition name="slide-sidebar">
       <el-aside :class="['flex flex-col ' +
        'transition-all duration-300  bg-white inset-y-0 left-0',
         sidebarOpen ? (isDesktop ? 'w-72' : '!w-full fixed top-0 left-0 z-10') : isDesktop ? '!w-20' : '!w-0']">
      <div v-if="sidebarOpen || isDesktop"  
      class="p-4 text-center gap-1  flex items-center justify-center " style="margin: 1rem;">
         <img src="https://www.uwed.uz/static/images/logo-dark.png" alt="Logo"
        class="!w-16 !h-16 rounded-full mb-2 min-w-16 min-h-16" />
        <span v-if="sidebarOpen" class="text-xl font-bold account-name" >{{$t('university_name')}}</span>
        <el-button class="md:hidden ml-2" @click="toggleSidebar" v-if="!isDesktop">
          <el-icon><Menu /></el-icon>
        </el-button>
      </div>
      <el-menu v-if="sidebarOpen || isDesktop" :default-active="activeMenu" class="h-full " router>
        <template v-for="menu in menus" :key="menu.index" >
          <el-sub-menu v-if="menu.children" :index="menu.index" >
            <template #title>
              <el-icon><component :is="menu.icon" /></el-icon>
              <span class="menu-label" v-if="sidebarOpen">{{ $t(`${menu.label}`) }}</span>
            </template>
            <el-menu-item v-for="child in menu.children" :key="child.index" :index="child.index">
              <el-icon v-if="child.icon"><component :is="child.icon" /></el-icon>
              <span v-if="sidebarOpen">{{ child.label }}</span>
            </el-menu-item>
          </el-sub-menu>
          <el-menu-item v-else :index="menu.index">
            <el-icon><component :is="menu.icon" /></el-icon>
            <span class="menu-label" v-if="sidebarOpen">{{ $t(`${menu.label}`) }}</span>
          </el-menu-item>
        </template>
      </el-menu>
    </el-aside>
    </transition>


    <el-container :class="['transition-all duration-300']">
      <!-- Top Bar -->
      <el-header class="bg-white flex justify-between items-center p-4 border-b shadow-md">
        <div class="flex items-center gap-5">
          <el-button class="md:hidden svk-btn  sys-btn" @click="toggleSidebar">
            <el-icon><Menu /></el-icon>
          </el-button>
          <span class="text-lg font-bold cabinet_header"> {{ $t('cabinet_header')}} </span>
        </div>
        <div class="flex items-center gap-4">
          <Language />
          <!-- <el-switch v-model="darkMode" inactive-text="Тунги режим" /> -->
          <el-dropdown placement="bottom-start">
            <el-avatar class="mr-4" v-if="!overallStore.isLoading">{{ userStore.user.full_name[0] }}</el-avatar>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item >
                  <span class="flex"> {{userStore.user.full_name}} </span>
                </el-dropdown-item>
                <el-dropdown-item @click="logOut">
                  <span class="flex"> <CircleClose class="w-[24px]"/> {{$t('logout')}} </span>
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </el-header>

      <!-- Main Content -->
      <el-main class="p-6">
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { Menu, House, Document, Notebook, School, Setting, User, CircleClose } from '@element-plus/icons-vue'
import Language from '@/components/Language.vue'

const route = useRoute();
const router = useRouter();

const activeMenu = ref(route.path);
const darkMode = ref(false);
const language = ref('uz');
const username = ref('Jahon iqtisodiyoti va  diplomatiya universiteti');
const sidebarOpen = ref(true);
const isDesktop = ref(window.innerWidth >= 768);
import { useOverallStore } from '@/stores/overall'

import {useUserStore} from '@/stores/userStore.js'

const userStore = useUserStore()

const overallStore = useOverallStore()
const menus = ref([
  { index: '/pages/home', label: 'main', icon: House },
  { index: '/pages/application', label: 'application', icon: Document },
  { index: '/pages/law-schools-application', label: 'law_schools', icon: Document }

]);

const toggleSidebar = () => {
  sidebarOpen.value = !sidebarOpen.value;
};

const handleResize = () => {
  isDesktop.value = window.innerWidth >= 768;
  if (!isDesktop.value) {
    sidebarOpen.value = false;
  }
};

const logOut = () => {
  userStore.logOut()
}

// Следим за изменением маршрута и обновляем activeMenu
watch(
  () => route.path,
  (newPath) => {
    activeMenu.value = newPath;
    if (isDesktop.value === false) sidebarOpen.value = false;
  },
  { immediate: true }
);

onMounted(() => {
  window.addEventListener('resize', handleResize);
  handleResize();
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
});
</script>

<style scoped>


/* Sidebar Transition */
.slide-sidebar-enter-active, .slide-sidebar-leave-active {
  transition: transform 0.3s ease-in-out;
}
.slide-sidebar-enter-from, .slide-sidebar-leave-to {
  transform: translateX(-100%);
}

.account-name{
  text-align: start;
  /* display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden; */
}
.el-menu{
  border: none;
}
.el-aside{
  border-right: 1px solid var(--el-menu-border-color);
}
.el-menu-item.is-active {
  background: rgb(255,220,227) !important;
  color: rgb(138,0,25) !important;
  font-weight: 600;
  border-right: 4px solid rgb(138,0,25);
}
.menu-label {
  white-space: normal !important; /* Allow wrapping */
  word-break: break-word;
  display: inline-block;
  max-width: 100%; /* Optional: constrain width */
  line-height: 1.5; /* Optional: reduce spacing */
}

@media screen and (max-width: 900px) {
  .cabinet_header{
    display: none;
  }
}
</style>
