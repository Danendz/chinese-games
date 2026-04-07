<template>
  <div class="hsk-picker">
    <button
      v-for="level in allLevels"
      :key="level.value"
      class="hsk-btn"
      :class="{ active: modelValue === level.value, 'my-words': level.value === 'MyWords' }"
      @click="$emit('update:modelValue', level.value)"
    >
      <span class="hsk-btn-label">{{ level.label }}</span>
      <span class="hsk-btn-sub" v-if="level.sub">{{ level.sub }}</span>
    </button>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { getMyVocabulary, getMySentences } from '../../data/myWordsStore'
import { useI18n } from '../../composables/useI18n'

const { t } = useI18n()
defineEmits(['update:modelValue'])

const levels = computed(() => [
  { value: 'Beginner', label: t('hsk.beginner'), sub: t('hsk.beginnerSub') },
  { value: 'HSK1-3', label: 'HSK 1-3', sub: t('hsk.hsk13Sub') },
  { value: 'HSK4-6', label: 'HSK 4-6', sub: t('hsk.hsk46Sub') },
  { value: 'HSK7-9', label: 'HSK 7-9', sub: t('hsk.hsk79Sub') }
])

const hasMyWords = computed(() => {
  try {
    const vocab = getMyVocabulary()
    const sents = getMySentences()
    return vocab.length > 0 || sents.length > 0
  } catch {
    return false
  }
})

const props = defineProps({
  modelValue: { type: String, default: 'Beginner' },
  showMyWords: { type: Boolean, default: true }
})

const allLevels = computed(() => {
  const base = [...levels.value]
  if (props.showMyWords && hasMyWords.value) {
    base.push({ value: 'MyWords', label: t('hsk.myWords'), sub: t('hsk.myWordsSub') })
  }
  return base
})
</script>

<style scoped>
.hsk-picker {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.hsk-btn {
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  background: var(--color-bg-secondary);
  color: var(--color-text-secondary);
  transition: all var(--transition-fast);
  border: 2px solid transparent;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1px;
  min-width: 72px;
}

.hsk-btn-label {
  font-size: 0.8rem;
  font-weight: 600;
}

.hsk-btn-sub {
  font-size: 0.65rem;
  font-weight: 400;
  opacity: 0.7;
}

.hsk-btn.active {
  background: var(--color-primary);
  color: white;
  border-color: var(--color-primary);
}

.hsk-btn.active .hsk-btn-sub {
  opacity: 0.9;
}

.hsk-btn.my-words {
  border-color: var(--color-warning);
}

.hsk-btn.my-words.active {
  background: #e17055;
  border-color: #e17055;
}

.hsk-btn:hover:not(.active) {
  border-color: var(--color-primary-light);
  color: var(--color-primary);
}
</style>
