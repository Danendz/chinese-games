<template>
  <div class="modal-overlay" @click.self="$emit('playAgain')">
    <div class="modal animate-pop-in">
      <h2 class="modal-title">{{ title }}</h2>
      <div class="modal-stats">
        <div class="stat">
          <span class="stat-value">{{ score }}</span>
          <span class="stat-label">Score</span>
        </div>
        <div class="stat">
          <span class="stat-value">{{ time }}</span>
          <span class="stat-label">Time</span>
        </div>
        <div class="stat">
          <span class="stat-value">{{ accuracy }}%</span>
          <span class="stat-label">Accuracy</span>
        </div>
      </div>
      <div class="modal-actions">
        <button class="btn btn-primary" @click="$emit('playAgain')">Play Again</button>
        <button class="btn btn-secondary" @click="$emit('goHome')">Back to Games</button>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: { type: String, default: 'Game Over!' },
  score: { type: Number, default: 0 },
  time: { type: String, default: '00:00' },
  accuracy: { type: Number, default: 100 }
})
defineEmits(['playAgain', 'goHome'])
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(4px);
}

.modal {
  background: var(--color-surface);
  border-radius: var(--radius-xl);
  padding: 40px;
  max-width: 400px;
  width: 90%;
  text-align: center;
}

.modal-title {
  font-size: 1.8rem;
  font-weight: 700;
  color: var(--color-primary);
  margin-bottom: 24px;
}

.modal-stats {
  display: flex;
  justify-content: center;
  gap: 32px;
  margin-bottom: 32px;
}

.stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.stat-value {
  font-size: 1.6rem;
  font-weight: 700;
  color: var(--color-text);
  font-variant-numeric: tabular-nums;
}

.stat-label {
  font-size: 0.8rem;
  color: var(--color-text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.modal-actions {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.btn {
  padding: 12px 24px;
  border-radius: var(--radius-md);
  font-weight: 600;
  font-size: 1rem;
  transition: all var(--transition-fast);
}

.btn-primary {
  background: var(--color-primary);
  color: white;
}

.btn-primary:hover {
  background: var(--color-primary-dark);
}

.btn-secondary {
  background: var(--color-bg-secondary);
  color: var(--color-text-secondary);
}

.btn-secondary:hover {
  background: var(--color-border);
}
</style>
