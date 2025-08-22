<script setup>

</script>

<template >
  <div class="flex w-full h-full justify-center items-center flex-col  fail" >
    <h1 class="text-center">{{ $t('not_found.title') }}</h1>
    <p class="text-center">{{ $t('not_found.description') }}</p>
    <el-link class="svk-btn sys-btn " style="--el-link-hover-text-color: none" href="/"> {{ $t('not_found.go_home') }} </el-link>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap');



@keyframes shake {
  0% { transform: translateX(0); }
  20% { transform: translateX(-10px); }
  40% { transform: translateX(10px); }
  60% { transform: translateX(-10px); }
  80% { transform: translateX(10px); }
  100% { transform: translateX(0); }
}

.shake {
  animation: shake 0.6s ease-in-out;
}

@keyframes failFlash {
  0% { opacity: 0; transform: translateY(-20px) scale(0.95); color: #ff4d4f; }
  50% { opacity: 1; transform: translateY(0) scale(1); }
  100% { opacity: 1; }
}

.fail {
  animation: failFlash 0.8s ease-out;
}

body{
  background: #222;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  height: 100vh;
  width: 100vw;
  h1{
    color: transparent;
    font-size: 100px;
    font-family: 'Roboto', sans-serif;
    font-weight: 600;
    background-size: 100px;
    -webkit-background-clip: text;
  }
  p{
    font-size: 1.5vmax;
    line-height: 1.25;
    margin-bottom: 0.75rem;
    font-weight: 800;
    text-transform: uppercase;
  }

}
</style>