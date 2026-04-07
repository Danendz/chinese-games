<template>
  <header class="header">
    <div class="header-inner">
      <router-link to="/" class="logo">
        <span class="logo-icon">字</span>
        <span class="logo-text">中文游戏</span>
      </router-link>
      <div class="header-right">
        <nav class="nav" v-if="route.name !== 'home'">
          <router-link to="/" class="nav-back">
            <span class="nav-back-arrow">&larr;</span>
            <span>{{ t('header.back') }}</span>
          </router-link>
        </nav>
        <button class="lang-toggle" @click="toggleLocale" :title="locale === 'en' ? 'Переключить на русский' : 'Switch to English'">
          <span class="lang-icon">🌏</span>
          <span class="lang-label">{{ locale === 'en' ? 'EN' : 'RU' }}</span>
        </button>
      </div>
    </div>
  </header>
</template>

<script setup>
import { useRoute } from 'vue-router'
import { useI18n } from '../../composables/useI18n'

const route = useRoute()
const { t, locale, toggleLocale } = useI18n()
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

.header-right {
  display: flex;
  align-items: center;
  gap: 12px;
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

.lang-toggle {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 6px 10px;
  border-radius: 20px;
  background: var(--color-bg-secondary);
  color: var(--color-text-secondary);
  font-size: 0.8rem;
  font-weight: 600;
  transition: all var(--transition-fast);
  border: 1.5px solid transparent;
}

.lang-toggle:hover {
  border-color: var(--color-primary-light);
  color: var(--color-primary);
}

.lang-icon {
  font-size: 1rem;
}

.lang-label {
  font-size: 0.75rem;
  letter-spacing: 0.05em;
}
</style>
