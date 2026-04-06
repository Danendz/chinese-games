<template>
  <header class="header">
    <div class="header-inner">
      <router-link to="/" class="logo">
        <span class="logo-icon">字</span>
        <span class="logo-text">中文游戏</span>
      </router-link>
      <nav class="nav" v-if="route.name !== 'home'">
        <router-link to="/" class="nav-back">
          <span class="nav-back-arrow">&larr;</span>
          <span>Back to Games</span>
        </router-link>
      </nav>
    </div>
  </header>
</template>

<script setup>
import { useRoute } from 'vue-router'
const route = useRoute()
</script>

<style scoped>
.header {
  background: var(--color-surface);
  border-bottom: 1px solid var(--color-border);
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 16px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.logo {
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 700;
  font-size: 1.2rem;
}

.logo-icon {
  font-family: var(--font-chinese);
  font-size: 1.5rem;
  color: var(--color-primary);
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--color-primary-light), var(--color-primary));
  color: white;
  border-radius: var(--radius-sm);
}

.logo-text {
  font-family: var(--font-chinese);
  color: var(--color-text);
}

.nav-back {
  display: flex;
  align-items: center;
  gap: 6px;
  color: var(--color-text-secondary);
  font-size: 0.9rem;
  padding: 6px 12px;
  border-radius: var(--radius-sm);
  transition: all var(--transition-fast);
}

.nav-back:hover {
  color: var(--color-primary);
  background: var(--color-bg-secondary);
}

.nav-back-arrow {
  font-size: 1.1rem;
}
</style>
