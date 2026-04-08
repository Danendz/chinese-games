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
        <div class="theme-toggle">
          <button class="theme-btn" @click="showSlider = !showSlider" title="Brightness">
            <span>{{ isDark ? '🌙' : '☀️' }}</span>
          </button>
          <div v-if="showSlider" class="brightness-popup">
            <input type="range" min="0" max="100" v-model="brightness" @input="applyBrightness" class="brightness-slider" />
            <span class="brightness-label">{{ brightness }}%</span>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from '../../composables/useI18n'

const route = useRoute()
const { t, locale, toggleLocale } = useI18n()

// Brightness / dark mode
const BRIGHTNESS_KEY = 'chineseGames_brightness'
const brightness = ref(parseInt(localStorage.getItem(BRIGHTNESS_KEY) || '100'))
const showSlider = ref(false)
const isDark = computed(() => brightness.value < 50)

function applyBrightness() {
  const b = brightness.value
  localStorage.setItem(BRIGHTNESS_KEY, b)
  const root = document.documentElement

  if (b <= 50) {
    // Dark mode: map 0-50 to fully dark → medium dark
    const ratio = b / 50
    const bg = Math.round(20 + ratio * 20)         // 20-40
    const surface = Math.round(30 + ratio * 25)     // 30-55
    const text = Math.round(200 + ratio * 55)       // 200-255
    const textSec = Math.round(140 + ratio * 50)    // 140-190
    const textLight = Math.round(90 + ratio * 40)   // 90-130
    const border = Math.round(50 + ratio * 30)      // 50-80
    const bgSec = Math.round(25 + ratio * 20)       // 25-45

    root.style.setProperty('--color-bg', `rgb(${bg},${bg},${bg + 5})`)
    root.style.setProperty('--color-surface', `rgb(${surface},${surface},${surface + 5})`)
    root.style.setProperty('--color-text', `rgb(${text},${text},${text})`)
    root.style.setProperty('--color-text-secondary', `rgb(${textSec},${textSec},${textSec})`)
    root.style.setProperty('--color-text-light', `rgb(${textLight},${textLight},${textLight})`)
    root.style.setProperty('--color-border', `rgb(${border},${border},${border + 10})`)
    root.style.setProperty('--color-bg-secondary', `rgb(${bgSec},${bgSec},${bgSec + 5})`)
  } else {
    // Light mode: map 50-100 to slightly dim → full bright
    const ratio = (b - 50) / 50
    const bg = Math.round(220 + ratio * 30)         // 220-250
    const surface = Math.round(230 + ratio * 25)    // 230-255
    const text = Math.round(30 + ratio * 15)        // 30-45
    const textSec = Math.round(80 + ratio * 19)     // 80-99
    const textLight = Math.round(150 + ratio * 28)  // 150-178
    const border = Math.round(200 + ratio * 23)     // 200-223
    const bgSec = Math.round(225 + ratio * 20)      // 225-245

    root.style.setProperty('--color-bg', `rgb(${bg},${bg},${bg})`)
    root.style.setProperty('--color-surface', `rgb(${surface},${surface},${surface})`)
    root.style.setProperty('--color-text', `rgb(${text},${text + 4},${text + 6})`)
    root.style.setProperty('--color-text-secondary', `rgb(${textSec},${textSec + 10},${textSec + 14})`)
    root.style.setProperty('--color-text-light', `rgb(${textLight},${textLight + 8},${textLight + 13})`)
    root.style.setProperty('--color-border', `rgb(${border},${border + 6},${border + 9})`)
    root.style.setProperty('--color-bg-secondary', `rgb(${bgSec},${bgSec + 1},${bgSec})`)
  }
}

onMounted(() => {
  if (brightness.value !== 100) applyBrightness()
})
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

/* Brightness / Theme */
.theme-toggle {
  position: relative;
}

.theme-btn {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
  background: var(--color-bg-secondary);
  transition: all var(--transition-fast);
}

.theme-btn:hover {
  background: var(--color-border);
}

.brightness-popup {
  position: absolute;
  right: 0;
  top: 44px;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-lg);
  padding: 12px 16px;
  display: flex;
  align-items: center;
  gap: 10px;
  z-index: 200;
  min-width: 180px;
}

.brightness-slider {
  flex: 1;
  height: 6px;
  -webkit-appearance: none;
  appearance: none;
  background: var(--color-bg-secondary);
  border-radius: 3px;
  outline: none;
  cursor: pointer;
}

.brightness-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: var(--color-primary);
  cursor: pointer;
}

.brightness-slider::-moz-range-thumb {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: var(--color-primary);
  cursor: pointer;
  border: none;
}

.brightness-label {
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--color-text-secondary);
  min-width: 32px;
  text-align: right;
}
</style>
