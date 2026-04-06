<template>
  <div class="app">
    <AppHeader />
    <main class="main-content">
      <router-view :key="$route.path" />
    </main>
  </div>
</template>

<script setup>
import AppHeader from './components/layout/AppHeader.vue'
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
