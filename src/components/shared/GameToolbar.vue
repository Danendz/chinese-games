<template>
  <div class="toolbar">
    <div class="toolbar-item">
      <span class="toolbar-label">{{ t('game.score') }}</span>
      <span class="toolbar-value">{{ score }}</span>
    </div>
    <div class="toolbar-item">
      <span class="toolbar-label">{{ t('game.time') }}</span>
      <span class="toolbar-value timer" :class="{ active: isPlaying }">{{ timer }}</span>
    </div>
  </div>
</template>

<script setup>
import { useI18n } from '../../composables/useI18n'
const { t } = useI18n()

defineProps({
  score: { type: Number, default: 0 },
  timer: { type: String, default: '00:00' },
  isPlaying: { type: Boolean, default: false }
})
</script>

<style scoped>
.toolbar {
  display: flex;
  justify-content: center;
  gap: 32px;
  padding: 12px 0;
  margin-bottom: 16px;
}

.toolbar-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}

.toolbar-label {
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--color-text-light);
  font-weight: 600;
}

.toolbar-value {
  font-size: 1.4rem;
  font-weight: 700;
  color: var(--color-text);
  font-variant-numeric: tabular-nums;
}

.timer.active {
  color: var(--color-primary);
}
</style>
