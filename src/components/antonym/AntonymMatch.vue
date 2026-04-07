<template>
  <div class="antonym-match" v-if="pairs.length > 0">
    <div class="progress-bar">
      <div class="progress-fill" :style="{ width: progressPercent + '%' }"></div>
      <span class="progress-text">
        <template v-if="infinite">Round {{ pool.round.value }} -- </template>
        {{ matchedCount }} / {{ pairs.length }}
      </span>
    </div>

    <transition name="toast">
      <div v-if="pool.poolExhausted.value" class="pool-toast">
        All pairs completed! Starting over with fresh shuffle...
      </div>
    </transition>

    <p class="quiz-prompt">Match each word with its antonym</p>

    <div class="match-columns">
      <div class="column column-left">
        <button
          v-for="item in leftWords"
          :key="item.id"
          class="word-btn text-chinese"
          :class="{
            selected: selectedLeft?.id === item.id,
            matched: item.matched,
            wrong: item.wrong
          }"
          :disabled="item.matched"
          @click="selectLeft(item)"
          @mouseenter="item.hovered = true"
          @mouseleave="item.hovered = false"
        >
          <span class="word-char">{{ item.word }}</span>
          <span class="word-pinyin" v-if="item.hovered || item.matched">{{ item.pinyin }}</span>
        </button>
      </div>

      <div class="column-divider">
        <span class="divider-icon">&#x2194;</span>
      </div>

      <div class="column column-right">
        <button
          v-for="item in rightWords"
          :key="item.id"
          class="word-btn text-chinese"
          :class="{
            selected: selectedRight?.id === item.id,
            matched: item.matched,
            wrong: item.wrong
          }"
          :disabled="item.matched"
          @click="selectRight(item)"
          @mouseenter="item.hovered = true"
          @mouseleave="item.hovered = false"
        >
          <span class="word-char">{{ item.word }}</span>
          <span class="word-pinyin" v-if="item.hovered || item.matched">{{ item.pinyin }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { antonymPairs } from '../../data/antonyms'
import { useInfinitePool } from '../../composables/useInfinitePool'

const props = defineProps({
  hskLevel: { type: String, default: 'Beginner' },
  infinite: { type: Boolean, default: false }
})

const emit = defineEmits(['correct', 'incorrect', 'gameStart', 'gameComplete', 'roundComplete'])

const fullPool = ref([])
const pairs = ref([])
const leftWords = ref([])
const rightWords = ref([])
const selectedLeft = ref(null)
const selectedRight = ref(null)
const matchedCount = ref(0)
const gameStarted = ref(false)

const pool = useInfinitePool(fullPool, 6, computed(() => props.infinite))

const progressPercent = computed(() => (matchedCount.value / pairs.value.length) * 100)

function shuffleArray(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function buildColumns(pairBatch) {
  pairs.value = pairBatch
  matchedCount.value = 0
  selectedLeft.value = null
  selectedRight.value = null

  leftWords.value = pairBatch.map(p => reactive({
    id: p.id,
    pairId: p.id,
    word: p.wordA,
    pinyin: p.pinyinA,
    english: p.englishA,
    matched: false,
    wrong: false,
    hovered: false
  }))

  rightWords.value = shuffleArray(pairBatch.map(p => reactive({
    id: p.id + '_B',
    pairId: p.id,
    word: p.wordB,
    pinyin: p.pinyinB,
    english: p.englishB,
    matched: false,
    wrong: false,
    hovered: false
  })))
}

function startNextRound() {
  const batch = pool.nextBatch()
  if (batch.length === 0) return
  buildColumns(batch)
  emit('roundComplete', { round: pool.round.value })
}

function tryMatch() {
  if (!selectedLeft.value || !selectedRight.value) return

  if (!gameStarted.value) {
    gameStarted.value = true
    emit('gameStart')
  }

  const left = selectedLeft.value
  const right = selectedRight.value

  if (left.pairId === right.pairId) {
    // Correct match
    left.matched = true
    right.matched = true
    matchedCount.value++
    emit('correct', { word: left.word + '\u2194' + right.word })

    selectedLeft.value = null
    selectedRight.value = null

    // Check if round is complete
    if (matchedCount.value === pairs.value.length) {
      setTimeout(() => {
        if (props.infinite) {
          startNextRound()
        } else {
          emit('gameComplete')
        }
      }, 800)
    }
  } else {
    // Wrong match
    left.wrong = true
    right.wrong = true
    emit('incorrect')

    setTimeout(() => {
      left.wrong = false
      right.wrong = false
      selectedLeft.value = null
      selectedRight.value = null
    }, 600)
  }
}

function selectLeft(item) {
  if (item.matched || item.wrong) return
  selectedLeft.value = item
  tryMatch()
}

function selectRight(item) {
  if (item.matched || item.wrong) return
  selectedRight.value = item
  tryMatch()
}

onMounted(() => {
  const source = (antonymPairs[props.hskLevel] || antonymPairs.Beginner)
    .map((item, i) => ({ ...item, id: props.hskLevel + '_' + i }))
  fullPool.value = source

  if (props.infinite) {
    const batch = pool.nextBatch()
    buildColumns(batch)
  } else {
    const batch = shuffleArray(source).slice(0, Math.min(6, source.length))
    buildColumns(batch)
  }
})
</script>

<style scoped>
.antonym-match {
  max-width: 560px;
  margin: 0 auto;
  text-align: center;
}

.progress-bar {
  position: relative;
  height: 6px;
  background: var(--color-bg-secondary);
  border-radius: 3px;
  margin-bottom: 28px;
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

.pool-toast {
  position: fixed;
  top: 80px;
  left: 50%;
  transform: translateX(-50%);
  background: linear-gradient(135deg, #fdcb6e, #e17055);
  color: white;
  padding: 12px 24px;
  border-radius: var(--radius-md);
  font-size: 0.9rem;
  font-weight: 600;
  box-shadow: var(--shadow-lg);
  z-index: 500;
}

.toast-enter-active { animation: slideDown 0.3s ease; }
.toast-leave-active { animation: slideDown 0.3s ease reverse; }

.quiz-prompt {
  font-size: 0.95rem;
  color: var(--color-text-secondary);
  margin-bottom: 20px;
}

.match-columns {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.column {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.column-divider {
  display: flex;
  align-items: center;
  padding-top: 24px;
  color: var(--color-text-light);
  font-size: 1.2rem;
  flex-shrink: 0;
}

.divider-icon {
  opacity: 0.4;
}

.word-btn {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  padding: 14px 10px;
  background: var(--color-surface);
  border: 2px solid var(--color-border);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all var(--transition-fast);
  min-height: 56px;
}

.word-btn:hover:not(:disabled):not(.wrong) {
  border-color: var(--color-primary);
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.word-btn:disabled { cursor: default; }

.word-btn.selected {
  border-color: var(--color-primary);
  background: rgba(108, 92, 231, 0.08);
  box-shadow: 0 0 0 3px rgba(108, 92, 231, 0.15);
}

.word-btn.matched {
  border-color: var(--color-success);
  background: rgba(0, 184, 148, 0.1);
  opacity: 0.6;
  pointer-events: none;
}

.word-btn.wrong {
  border-color: var(--color-error);
  background: rgba(214, 48, 49, 0.05);
  animation: shake 0.5s ease;
}

.word-char {
  font-size: 1.4rem;
  font-weight: 700;
}

.word-pinyin {
  font-size: 0.75rem;
  font-family: var(--font-pinyin);
  color: var(--color-primary);
  font-weight: 500;
}
</style>
