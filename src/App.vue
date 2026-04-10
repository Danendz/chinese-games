<template>
  <div class="app">
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
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import AppHeader from './components/layout/AppHeader.vue'

const route = useRoute()
const isFullscreenRoute = computed(() => route.meta.fullscreen === true)
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
