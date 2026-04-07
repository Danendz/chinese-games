<template>
  <div class="idiom-game" v-if="currentIdiom">
    <!-- Progress bar -->
    <div class="progress-bar">
      <div class="progress-fill" :style="{ width: progressPercent + '%' }"></div>
      <span class="progress-text">
        <template v-if="infinite">{{ t('game.round') }} {{ pool.round.value }} -- </template>
        {{ currentIndex + 1 }} / {{ idiomList.length }}
      </span>
    </div>

    <transition name="toast">
      <div v-if="pool.poolExhausted.value" class="pool-toast">{{ t('game.poolExhausted') }}</div>
    </transition>

    <!-- Idiom display -->
    <div class="idiom-display">
      <div class="idiom-characters">
        <span
          v-for="(char, i) in displayCharacters"
          :key="'char-' + i"
          class="idiom-char text-chinese"
          :class="{
            'blank-slot': char === null,
            'correct-reveal': answered && i === currentIdiom.missingIndex && selectedCorrect,
            'incorrect-reveal': answered && i === currentIdiom.missingIndex && !selectedCorrect
          }"
        >
          <template v-if="char !== null">{{ char }}</template>
          <template v-else>
            <span class="blank-inner">{{ answered ? correctCharacter : '?' }}</span>
          </template>
        </span>
      </div>
    </div>

    <!-- Hint area (for Beginner, always show English) -->
    <div class="hint-area" v-if="isBeginner">
      <div class="hint-english">{{ tr(currentIdiom) }}</div>
      <div class="hint-pinyin">{{ currentIdiom.pinyin }}</div>
    </div>

    <!-- Pinyin / English (hidden until answered for non-beginner) -->
    <div class="hint-area" v-if="!isBeginner">
      <div class="hint-pinyin" :class="{ revealed: answered }">
        {{ answered ? currentIdiom.pinyin : 'Pinyin will appear after answering' }}
      </div>
      <div class="hint-english" :class="{ revealed: answered }">
        {{ answered ? tr(currentIdiom) : 'Meaning will appear after answering' }}
      </div>
    </div>

    <!-- Answer options -->
    <div class="options-grid" :class="{ disabled: answered }">
      <button
        v-for="(option, i) in options"
        :key="'opt-' + i"
        class="option-btn text-chinese"
        :class="{
          correct: answered && option === correctCharacter,
          incorrect: answered && option === selectedOption && option !== correctCharacter,
          'animate-shake': answered && option === selectedOption && option !== correctCharacter
        }"
        :disabled="answered"
        @click="selectOption(option)"
      >
        {{ option }}
      </button>
    </div>

    <!-- Explanation (shown after answering) -->
    <div v-if="answered" class="explanation-section animate-pop-in">
      <div class="explanation-header" :class="selectedCorrect ? 'correct' : 'incorrect'">
        {{ selectedCorrect ? t('game.correct') : 'Not quite...' }}
      </div>
      <div class="explanation-text">{{ currentIdiom.explanation }}</div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { idioms } from '../../data/idioms'
import { useInfinitePool } from '../../composables/useInfinitePool'
import { useI18n } from '../../composables/useI18n'
const { t, tr } = useI18n()

const props = defineProps({
  hskLevel: { type: String, default: 'Beginner' },
  infinite: { type: Boolean, default: false }
})

const emit = defineEmits(['correct', 'incorrect', 'gameStart', 'gameComplete', 'roundComplete'])

const fullPool = ref([])
const idiomList = ref([])
const currentIndex = ref(0)
const answered = ref(false)
const selectedOption = ref(null)
const selectedCorrect = ref(false)
const gameStarted = ref(false)
const options = ref([])

const pool = useInfinitePool(fullPool, 8, computed(() => props.infinite))
const currentIdiom = computed(() => idiomList.value[currentIndex.value])
const isBeginner = computed(() => props.hskLevel === 'Beginner')
const progressPercent = computed(() => (currentIndex.value / idiomList.value.length) * 100)

const correctCharacter = computed(() => {
  if (!currentIdiom.value) return ''
  const chars = [...currentIdiom.value.idiom]
  return chars[currentIdiom.value.missingIndex]
})

const displayCharacters = computed(() => {
  if (!currentIdiom.value) return []
  const chars = [...currentIdiom.value.idiom]
  return chars.map((c, i) => (i === currentIdiom.value.missingIndex ? null : c))
})

function shuffleArray(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function buildOptions() {
  if (!currentIdiom.value) return
  const correct = correctCharacter.value
  const allOptions = [correct, ...currentIdiom.value.distractors]
  options.value = shuffleArray(allOptions)
}

function selectOption(option) {
  if (answered.value) return

  if (!gameStarted.value) {
    gameStarted.value = true
    emit('gameStart')
  }

  answered.value = true
  selectedOption.value = option
  selectedCorrect.value = option === correctCharacter.value

  if (selectedCorrect.value) {
    emit('correct', { word: currentIdiom.value.idiom })
  } else {
    emit('incorrect')
  }

  setTimeout(() => {
    if (currentIndex.value < idiomList.value.length - 1) {
      nextIdiom()
    } else if (props.infinite) {
      startNextRound()
    } else {
      emit('gameComplete')
    }
  }, 1800)
}

function nextIdiom() {
  currentIndex.value++
  answered.value = false
  selectedOption.value = null
  selectedCorrect.value = false
  buildOptions()
}

function startNextRound() {
  const batch = pool.nextBatch()
  if (batch.length === 0) return
  idiomList.value = batch
  currentIndex.value = 0
  answered.value = false
  selectedOption.value = null
  selectedCorrect.value = false
  buildOptions()
  emit('roundComplete', { round: pool.round.value })
}

function loadGame() {
  const source = idioms[props.hskLevel] || idioms.Beginner
  fullPool.value = source
  if (props.infinite) {
    idiomList.value = pool.nextBatch()
  } else {
    idiomList.value = shuffleArray(source)
  }
  currentIndex.value = 0
  answered.value = false
  selectedOption.value = null
  selectedCorrect.value = false
  gameStarted.value = false
  buildOptions()
}

onMounted(() => {
  loadGame()
})
</script>

<style scoped>
.pool-toast {
  position: fixed; top: 80px; left: 50%; transform: translateX(-50%);
  background: linear-gradient(135deg, #fdcb6e, #e17055); color: white;
  padding: 12px 24px; border-radius: var(--radius-md); font-size: 0.9rem;
  font-weight: 600; box-shadow: var(--shadow-lg); z-index: 500;
}
.toast-enter-active { animation: slideDown 0.3s ease; }
.toast-leave-active { animation: slideDown 0.3s ease reverse; }

.idiom-game {
  max-width: 560px;
  margin: 0 auto;
}

/* Progress bar */
.progress-bar {
  position: relative;
  height: 6px;
  background: var(--color-bg-secondary);
  border-radius: 3px;
  margin-bottom: 32px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: var(--color-primary);
  border-radius: 3px;
  transition: width var(--transition-medium);
}

.progress-text {
  position: absolute;
  right: 0;
  top: 12px;
  font-size: 0.8rem;
  color: var(--color-text-secondary);
}

/* Idiom display */
.idiom-display {
  text-align: center;
  margin-bottom: 24px;
  padding: 32px 16px;
  background: var(--color-surface);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
}

.idiom-characters {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
}

.idiom-char {
  width: 72px;
  height: 72px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.4rem;
  font-weight: 700;
  color: var(--color-text);
  border-radius: var(--radius-md);
  background: var(--color-bg-secondary);
  transition: all var(--transition-medium);
}

.idiom-char.blank-slot {
  border: 3px dashed var(--color-primary-light);
  background: rgba(214, 48, 49, 0.04);
  color: var(--color-primary);
}

.blank-inner {
  font-size: 1.8rem;
  font-weight: 700;
  opacity: 0.6;
}

.idiom-char.correct-reveal {
  border-color: var(--color-success);
  background: rgba(0, 184, 148, 0.1);
  color: var(--color-success);
  animation: glow 1.5s ease infinite;
}

.idiom-char.incorrect-reveal {
  border-color: var(--color-error);
  background: rgba(214, 48, 49, 0.08);
  color: var(--color-error);
}

/* Hint area */
.hint-area {
  text-align: center;
  margin-bottom: 28px;
}

.hint-pinyin {
  font-family: var(--font-pinyin);
  font-size: 0.95rem;
  color: var(--color-text-light);
  margin-bottom: 4px;
  transition: color var(--transition-medium);
  font-style: italic;
}

.hint-pinyin.revealed {
  color: var(--color-primary);
  font-style: normal;
  font-weight: 500;
}

.hint-english {
  font-size: 1rem;
  color: var(--color-text-secondary);
  font-weight: 500;
}

.hint-english.revealed {
  color: var(--color-text);
}

/* Options grid */
.options-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  margin-bottom: 24px;
}

.options-grid.disabled {
  pointer-events: none;
}

.option-btn {
  padding: 18px 16px;
  font-size: 1.8rem;
  font-weight: 700;
  background: var(--color-surface);
  border: 2px solid var(--color-border);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all var(--transition-fast);
  box-shadow: var(--shadow-sm);
}

.option-btn:hover:not(:disabled) {
  border-color: var(--color-primary);
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.option-btn:active:not(:disabled) {
  transform: scale(0.97);
}

.option-btn.correct {
  border-color: var(--color-success);
  background: rgba(0, 184, 148, 0.1);
  color: var(--color-success);
  box-shadow: 0 0 12px rgba(0, 184, 148, 0.3);
}

.option-btn.incorrect {
  border-color: var(--color-error);
  background: rgba(214, 48, 49, 0.08);
  color: var(--color-error);
}

/* Explanation section */
.explanation-section {
  text-align: center;
  padding: 20px;
  background: var(--color-bg-secondary);
  border-radius: var(--radius-md);
  margin-bottom: 16px;
}

.explanation-header {
  font-size: 1.3rem;
  font-weight: 700;
  margin-bottom: 8px;
}

.explanation-header.correct {
  color: var(--color-success);
}

.explanation-header.incorrect {
  color: var(--color-error);
}

.explanation-text {
  font-size: 0.9rem;
  color: var(--color-text-secondary);
  line-height: 1.5;
}

/* Responsive */
@media (max-width: 480px) {
  .idiom-char {
    width: 56px;
    height: 56px;
    font-size: 1.8rem;
  }

  .idiom-characters {
    gap: 8px;
  }

  .blank-inner {
    font-size: 1.4rem;
  }

  .option-btn {
    padding: 14px 12px;
    font-size: 1.5rem;
  }
}
</style>
