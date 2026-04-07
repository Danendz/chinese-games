<template>
  <div class="word-sorting" v-if="currentPuzzle">
    <div class="progress-bar">
      <div class="progress-fill" :style="{ width: progressPercent + '%' }"></div>
      <span class="progress-text">
        <template v-if="infinite">{{ t('game.round') }} {{ pool.round.value }} -- </template>
        {{ currentIndex + 1 }} / {{ puzzles.length }}
      </span>
    </div>

    <transition name="toast">
      <div v-if="pool.poolExhausted.value" class="pool-toast">
        {{ t('game.poolExhausted') }}
      </div>
    </transition>

    <div class="category-buckets">
      <div
        v-for="(cat, ci) in currentPuzzle.categories"
        :key="ci"
        class="category-bucket"
        :class="{ highlight: selectedWord !== null, flash: bucketFlash === ci }"
        @click="assignToCategory(ci)"
      >
        <div class="category-label">{{ cat }}</div>
        <div class="sorted-words">
          <transition-group name="drop">
            <span
              v-for="w in sortedBuckets[ci]"
              :key="w.word"
              class="sorted-chip text-chinese"
            >{{ w.word }}</span>
          </transition-group>
        </div>
      </div>
    </div>

    <div class="word-tiles">
      <transition-group name="tile">
        <button
          v-for="w in remainingWords"
          :key="w.word"
          class="word-tile text-chinese"
          :class="{
            selected: selectedWord && selectedWord.word === w.word,
            'shake-wrong': shakeWord === w.word
          }"
          @click="selectWord(w)"
        >
          <span class="tile-word">{{ w.word }}</span>
          <span class="tile-pinyin">{{ w.pinyin }}</span>
        </button>
      </transition-group>
    </div>

    <transition name="fade">
      <div v-if="puzzleComplete" class="complete-banner animate-pop-in">
        {{ t('sorting.complete') }}
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { wordCategories } from '../../data/wordCategories'
import { useInfinitePool } from '../../composables/useInfinitePool'
import { useI18n } from '../../composables/useI18n'
const { t } = useI18n()

const props = defineProps({
  hskLevel: { type: String, default: 'Beginner' },
  infinite: { type: Boolean, default: false }
})

const emit = defineEmits(['correct', 'incorrect', 'gameStart', 'gameComplete', 'roundComplete'])

const fullPool = ref([])
const puzzles = ref([])
const currentIndex = ref(0)
const selectedWord = ref(null)
const shakeWord = ref(null)
const bucketFlash = ref(-1)
const puzzleComplete = ref(false)
const gameStarted = ref(false)

// Each puzzle set is one pool item; batch = total available sets
const pool = useInfinitePool(fullPool, 999, computed(() => props.infinite))

const currentPuzzle = computed(() => puzzles.value[currentIndex.value])
const progressPercent = computed(() => (currentIndex.value / puzzles.value.length) * 100)

// Track which words are already sorted into each bucket
const sortedBuckets = ref({})
// Track remaining unsorted words
const remainingWords = ref([])

function shuffleArray(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function initPuzzle() {
  const p = currentPuzzle.value
  if (!p) return
  puzzleComplete.value = false
  selectedWord.value = null
  shakeWord.value = null
  bucketFlash.value = -1

  // Initialize empty buckets
  const buckets = {}
  p.categories.forEach((_, i) => { buckets[i] = [] })
  sortedBuckets.value = buckets

  // Shuffle words for display
  remainingWords.value = shuffleArray([...p.words])
}

function selectWord(w) {
  if (puzzleComplete.value) return
  if (!gameStarted.value) {
    gameStarted.value = true
    emit('gameStart')
  }
  if (selectedWord.value && selectedWord.value.word === w.word) {
    selectedWord.value = null
  } else {
    selectedWord.value = w
  }
}

function assignToCategory(catIndex) {
  if (!selectedWord.value || puzzleComplete.value) return

  const w = selectedWord.value
  if (w.category === catIndex) {
    // Correct
    bucketFlash.value = catIndex
    setTimeout(() => { bucketFlash.value = -1 }, 400)

    sortedBuckets.value[catIndex] = [...sortedBuckets.value[catIndex], w]
    remainingWords.value = remainingWords.value.filter(rw => rw.word !== w.word)
    selectedWord.value = null
    emit('correct', { word: w.word })

    // Check if all words sorted
    if (remainingWords.value.length === 0) {
      puzzleComplete.value = true
      setTimeout(() => advance(), 1200)
    }
  } else {
    // Incorrect
    shakeWord.value = w.word
    emit('incorrect')
    setTimeout(() => { shakeWord.value = null }, 600)
    selectedWord.value = null
  }
}

function advance() {
  if (currentIndex.value < puzzles.value.length - 1) {
    currentIndex.value++
    initPuzzle()
  } else if (props.infinite) {
    startNextRound()
  } else {
    emit('gameComplete')
  }
}

function startNextRound() {
  const batch = pool.nextBatch()
  if (batch.length === 0) return
  puzzles.value = batch
  currentIndex.value = 0
  initPuzzle()
  emit('roundComplete', { round: pool.round.value })
}

onMounted(() => {
  const source = wordCategories[props.hskLevel] || wordCategories.Beginner
  // Assign ids so useInfinitePool can track them
  const withIds = source.map((p, i) => ({ ...p, id: `sort_${props.hskLevel}_${i}` }))
  fullPool.value = withIds

  if (props.infinite) {
    // Pool batch size is large enough to get all; we'll use them all each round
    pool.nextBatch()
    puzzles.value = shuffleArray(withIds)
  } else {
    puzzles.value = shuffleArray(withIds)
  }
  initPuzzle()
})
</script>

<style scoped>
.word-sorting {
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
  position: fixed; top: 80px; left: 50%; transform: translateX(-50%);
  background: linear-gradient(135deg, #fdcb6e, #e17055); color: white;
  padding: 12px 24px; border-radius: var(--radius-md); font-size: 0.9rem;
  font-weight: 600; box-shadow: var(--shadow-lg); z-index: 500;
}
.toast-enter-active { animation: slideDown 0.3s ease; }
.toast-leave-active { animation: slideDown 0.3s ease reverse; }

/* Category buckets at the top */
.category-buckets {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
  margin-bottom: 28px;
}

.category-bucket {
  min-height: 120px;
  padding: 14px;
  background: var(--color-surface);
  border: 2px dashed var(--color-border);
  border-radius: var(--radius-lg);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.category-bucket.highlight {
  border-color: var(--color-primary);
  background: rgba(108, 92, 231, 0.04);
  box-shadow: 0 0 0 3px rgba(108, 92, 231, 0.12);
}

.category-bucket.flash {
  border-color: var(--color-success);
  background: rgba(0, 184, 148, 0.1);
}

.category-label {
  font-size: 0.95rem;
  font-weight: 700;
  color: var(--color-text-primary);
  margin-bottom: 10px;
  padding-bottom: 8px;
  border-bottom: 1px solid var(--color-border);
}

.sorted-words {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  justify-content: center;
}

.sorted-chip {
  display: inline-block;
  padding: 4px 12px;
  background: rgba(0, 184, 148, 0.15);
  color: var(--color-success);
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
}

/* Word tiles */
.word-tiles {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: center;
  margin-bottom: 24px;
}

.word-tile {
  padding: 12px 18px;
  background: var(--color-surface);
  border: 2px solid var(--color-border);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all var(--transition-fast);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}

.word-tile:hover {
  border-color: var(--color-primary);
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.word-tile.selected {
  border-color: var(--color-primary);
  background: rgba(108, 92, 231, 0.1);
  transform: scale(1.05);
  box-shadow: 0 0 0 3px rgba(108, 92, 231, 0.2), var(--shadow-md);
}

.word-tile.shake-wrong {
  border-color: var(--color-error);
  background: rgba(214, 48, 49, 0.05);
  animation: shake 0.5s ease;
}

.tile-word {
  font-size: 1.3rem;
  font-weight: 700;
}

.tile-pinyin {
  font-size: 0.7rem;
  color: var(--color-text-secondary);
  font-weight: 400;
}

/* Transition groups */
.drop-enter-active { animation: dropIn 0.35s ease; }
.drop-leave-active { animation: dropIn 0.2s ease reverse; }
@keyframes dropIn {
  from { opacity: 0; transform: translateY(-10px) scale(0.8); }
  to   { opacity: 1; transform: translateY(0) scale(1); }
}

.tile-enter-active { transition: all 0.3s ease; }
.tile-leave-active { transition: all 0.3s ease; position: absolute; }
.tile-enter-from { opacity: 0; transform: scale(0.5); }
.tile-leave-to { opacity: 0; transform: scale(0.5); }
.tile-move { transition: transform 0.3s ease; }

/* Complete banner */
.complete-banner {
  margin-top: 12px;
  padding: 16px 32px;
  background: linear-gradient(135deg, #00b894, #00cec9);
  color: white;
  font-size: 1.4rem;
  font-weight: 700;
  border-radius: var(--radius-lg);
  display: inline-block;
  box-shadow: var(--shadow-lg);
}

.fade-enter-active { animation: fadeIn 0.3s ease; }
.fade-leave-active { animation: fadeIn 0.3s ease reverse; }
@keyframes fadeIn {
  from { opacity: 0; }
  to   { opacity: 1; }
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  20% { transform: translateX(-6px); }
  40% { transform: translateX(6px); }
  60% { transform: translateX(-4px); }
  80% { transform: translateX(4px); }
}

@media (max-width: 480px) {
  .category-buckets {
    grid-template-columns: 1fr;
  }

  .category-bucket {
    min-height: 80px;
  }

  .word-tile {
    padding: 10px 14px;
  }

  .tile-word {
    font-size: 1.1rem;
  }
}
</style>
