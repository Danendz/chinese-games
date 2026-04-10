<template>
  <div v-if="ready" class="app">
    <template v-if="isFullscreenRoute">
      <router-view :key="$route.path" />
    </template>
    <template v-else>
      <AppHeader />
      <main class="main-content">
        <router-view :key="$route.path" />
      </main>
    </template>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AppHeader from './components/layout/AppHeader.vue'

const route = useRoute()
const router = useRouter()
const ready = ref(false)
const isFullscreenRoute = computed(() => route.meta.fullscreen === true)

router.isReady().then(() => { ready.value = true })
</script>

<style>
.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
  padding: 24px 16px;
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  box-sizing: border-box;
}
</style>
