<template>
  <div
    class="card"
    :class="{ flipped: isFlipped, matched: isMatched }"
    @click="$emit('flip')"
  >
    <div class="card-inner">
      <div class="card-front">
        <span class="card-front-icon text-chinese">?</span>
      </div>
      <div class="card-back" :class="{ 'card-back-pinyin': type === 'pinyin' }">
        <span
          v-if="type === 'character'"
          class="card-character text-chinese"
          :class="{ 'card-character-long': content.length >= 3 }"
        >{{ content }}</span>
        <template v-else>
          <span class="card-pinyin">{{ pinyin }}</span>
          <span class="card-english">{{ english }}</span>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  content: String,
  type: String,
  pinyin: String,
  english: String,
  isFlipped: Boolean,
  isMatched: Boolean
})
defineEmits(['flip'])
</script>

<style scoped>
.card {
  aspect-ratio: 3 / 4;
  cursor: pointer;
  perspective: 800px;
}

.card.matched {
  cursor: default;
}

.card-inner {
  position: relative;
  width: 100%;
  height: 100%;
  transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  transform-style: preserve-3d;
}

.card.flipped .card-inner {
  transform: rotateY(180deg);
}

.card-front,
.card-back {
  position: absolute;
  inset: 0;
  backface-visibility: hidden;
  border-radius: var(--radius-md);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 8px;
}

.card-front {
  background: linear-gradient(135deg, var(--color-primary), var(--color-primary-dark));
  color: white;
  box-shadow: var(--shadow-md);
}

.card-front-icon {
  font-size: 2rem;
  opacity: 0.8;
}

.card-back {
  transform: rotateY(180deg);
  background: var(--color-surface);
  border: 2px solid var(--color-border);
  box-shadow: var(--shadow-md);
  overflow: hidden;
  text-align: center;
}

.card.matched .card-back {
  border-color: var(--color-success);
  background: linear-gradient(135deg, #f0fff4, #e6fffa);
}

.card-character {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--color-text);
  text-align: center;
  word-break: break-all;
  line-height: 1.2;
  max-width: 100%;
}

.card-character-long {
  font-size: 1.4rem;
  letter-spacing: 0.05em;
}

.card-pinyin {
  font-size: 1rem;
  font-family: var(--font-pinyin);
  color: var(--color-primary);
  font-weight: 600;
  margin-bottom: 4px;
  text-align: center;
  word-break: break-word;
  max-width: 100%;
  line-height: 1.3;
}

.card-english {
  font-size: 0.8rem;
  color: var(--color-text-secondary);
  text-align: center;
  word-break: break-word;
  max-width: 100%;
  line-height: 1.3;
}

.card:not(.flipped):not(.matched):hover .card-front {
  box-shadow: var(--shadow-hover);
}

.card:not(.flipped):not(.matched):active .card-inner {
  transform: scale(0.95);
}

@media (max-width: 480px) {
  .card-character {
    font-size: 1.6rem;
  }

  .card-character-long {
    font-size: 1.1rem;
  }

  .card-pinyin {
    font-size: 0.75rem;
  }

  .card-english {
    font-size: 0.65rem;
  }
}
</style>
