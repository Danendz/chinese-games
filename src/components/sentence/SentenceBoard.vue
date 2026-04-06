<template>
  <div class="sentence-game" v-if="currentSentence">
    <div class="progress-bar">
      <div class="progress-fill" :style="{ width: progressPercent + '%' }"></div>
      <span class="progress-text">
        <template v-if="infinite">Round {{ pool.round.value }} -- </template>
        {{ currentIndex + 1 }} / {{ sentenceList.length }}
      </span>
    </div>

    <transition name="toast">
      <div v-if="pool.poolExhausted.value" class="pool-toast">All sentences completed! Starting over...</div>
    </transition>

    <!-- Answer slots -->
    <div class="answer-area">
      <div class="answer-label">Build the sentence:</div>
      <div class="answer-slots">
        <div
          v-for="(slot, i) in answerSlots"
          :key="'slot-' + i"
          class="answer-slot"
          :class="{
            filled: slot.word,
            locked: slot.locked,
            'drag-over': dragOverIndex === i,
            wrong: wrongSlots.has(i)
          }"
          @dragover.prevent="slot.locked ? null : (dragOverIndex = i)"
          @dragleave="dragOverIndex = null"
          @drop="handleDrop(i, $event)"
          @click="removeFromSlot(i)"
        >
          <span v-if="slot.word" class="slot-word text-chinese">{{ slot.word }}</span>
          <span v-else class="slot-placeholder">{{ slot.locked ? slot.word : '___' }}</span>
        </div>
      </div>
    </div>

    <!-- Result info -->
    <div v-if="isCorrect" class="result-section animate-pop-in">
      <div class="result-correct">Correct!</div>
      <div class="result-pinyin">{{ currentSentence.pinyin }}</div>
      <div class="result-english">{{ currentSentence.english }}</div>
      <div class="grammar-box">
        <div class="grammar-pattern">{{ currentSentence.grammarPattern }}</div>
        <div class="grammar-note">{{ currentSentence.grammarNote }}</div>
      </div>
      <button v-if="currentIndex < sentenceList.length - 1" class="next-btn" @click="nextSentence">
        Next Sentence &rarr;
      </button>
    </div>

    <!-- Word bank -->
    <div class="word-bank" v-if="!isCorrect">
      <div class="bank-label">Available words:</div>
      <div class="bank-words">
        <div
          v-for="item in wordBank"
          :key="'word-' + item.id"
          class="word-tile text-chinese"
          :class="{ placed: item.isPlaced }"
          draggable="true"
          @dragstart="handleDragStart(item, $event)"
          @click="handleWordClick(item)"
        >
          {{ item.word }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { sentences } from '../../data/sentences'
import { getMySentences } from '../../data/myWordsStore'
import { useInfinitePool } from '../../composables/useInfinitePool'

const props = defineProps({
  hskLevel: { type: String, default: 'HSK1' },
  infinite: { type: Boolean, default: false }
})

const emit = defineEmits(['correct', 'incorrect', 'gameStart', 'gameComplete', 'roundComplete'])

const fullPool = ref([])
const sentenceList = ref([])
const currentIndex = ref(0)
const wordBank = ref([])
const answerSlots = ref([])
const isCorrect = ref(false)
const dragOverIndex = ref(null)
const gameStarted = ref(false)
const wrongSlots = reactive(new Set())

const pool = useInfinitePool(fullPool, 8, computed(() => props.infinite))
const currentSentence = computed(() => sentenceList.value[currentIndex.value])
const progressPercent = computed(() => ((currentIndex.value) / sentenceList.value.length) * 100)

const punctuation = new Set(['。', '？', '！', '，', '、', '；', '：'])

function isPunctuation(w) {
  return punctuation.has(w)
}

function shuffleArray(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function loadSentence() {
  const sentence = currentSentence.value
  if (!sentence) return

  isCorrect.value = false
  dragOverIndex.value = null
  wrongSlots.clear()

  const contentWords = sentence.words.filter(w => !isPunctuation(w))
  const punctuationWords = sentence.words.filter(w => isPunctuation(w))

  wordBank.value = shuffleArray(contentWords).map((w, i) => ({
    id: i,
    word: w,
    isPlaced: false
  }))

  answerSlots.value = [
    ...contentWords.map(() => ({ word: null, locked: false })),
    ...punctuationWords.map(p => ({ word: p, locked: true }))
  ]
}

function handleDragStart(item, event) {
  if (item.isPlaced) return
  event.dataTransfer.setData('text/plain', JSON.stringify({ word: item.word, id: item.id }))
  if (!gameStarted.value) {
    gameStarted.value = true
    emit('gameStart')
  }
}

function handleDrop(slotIndex, event) {
  dragOverIndex.value = null
  const slot = answerSlots.value[slotIndex]
  if (slot.locked || slot.word) return

  const data = JSON.parse(event.dataTransfer.getData('text/plain'))
  placeWord(slotIndex, data.word, data.id)
}

function handleWordClick(item) {
  if (item.isPlaced) return
  if (!gameStarted.value) {
    gameStarted.value = true
    emit('gameStart')
  }

  // Find first empty slot
  const emptyIndex = answerSlots.value.findIndex(s => !s.locked && !s.word)
  if (emptyIndex !== -1) {
    placeWord(emptyIndex, item.word, item.id)
  }
}

function placeWord(slotIndex, word, wordId) {
  answerSlots.value[slotIndex].word = word
  const bankItem = wordBank.value.find(w => w.id === wordId)
  if (bankItem) bankItem.isPlaced = true
  checkCompletion()
}

function removeFromSlot(slotIndex) {
  const slot = answerSlots.value[slotIndex]
  if (slot.locked || !slot.word) return

  const word = slot.word
  const bankItem = wordBank.value.find(w => w.word === word && w.isPlaced)
  if (bankItem) bankItem.isPlaced = false
  slot.word = null
  wrongSlots.delete(slotIndex)
}

function checkCompletion() {
  const contentSlots = answerSlots.value.filter(s => !s.locked)
  if (contentSlots.some(s => s.word === null)) return

  const assembled = answerSlots.value.map(s => s.word)
  const correct = currentSentence.value.words

  if (assembled.length === correct.length && assembled.every((w, i) => w === correct[i])) {
    isCorrect.value = true
    emit('correct', { word: currentSentence.value.words.join('') })
    if (currentIndex.value >= sentenceList.value.length - 1) {
      if (props.infinite) {
        setTimeout(() => startNextRound(), 1500)
      } else {
        setTimeout(() => emit('gameComplete'), 1500)
      }
    }
  } else {
    emit('incorrect')
    // Highlight wrong slots
    wrongSlots.clear()
    answerSlots.value.forEach((slot, i) => {
      if (!slot.locked && slot.word !== correct[i]) {
        wrongSlots.add(i)
      }
    })
    setTimeout(() => wrongSlots.clear(), 1000)
  }
}

function startNextRound() {
  const batch = pool.nextBatch()
  if (batch.length === 0) return
  sentenceList.value = batch
  currentIndex.value = 0
  loadSentence()
  emit('roundComplete', { round: pool.round.value })
}

function nextSentence() {
  currentIndex.value++
  loadSentence()
}

onMounted(() => {
  const source = props.hskLevel === 'MyWords'
    ? getMySentences()
    : (sentences[props.hskLevel] || sentences.Beginner)
  fullPool.value = source
  if (props.infinite) {
    sentenceList.value = pool.nextBatch()
  } else {
    sentenceList.value = shuffleArray(source)
  }
  loadSentence()
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

.sentence-game {
  max-width: 600px;
  margin: 0 auto;
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

/* Answer area */
.answer-area {
  margin-bottom: 32px;
}

.answer-label,
.bank-label {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--color-text-secondary);
  margin-bottom: 12px;
  text-transform: uppercase;
  letter-spacing: 0.03em;
}

.answer-slots {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  min-height: 56px;
  padding: 16px;
  background: var(--color-bg-secondary);
  border-radius: var(--radius-md);
  border: 2px dashed var(--color-border);
}

.answer-slot {
  min-width: 48px;
  height: 44px;
  padding: 0 14px;
  border: 2px dashed var(--color-border);
  border-radius: var(--radius-sm);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--transition-fast);
  cursor: pointer;
  background: var(--color-surface);
}

.answer-slot.filled {
  border-style: solid;
  border-color: var(--color-primary-light);
  background: white;
}

.answer-slot.locked {
  border-style: solid;
  border-color: var(--color-text-light);
  cursor: default;
  background: var(--color-bg-secondary);
}

.answer-slot.drag-over {
  border-color: var(--color-primary);
  background: rgba(214, 48, 49, 0.05);
  transform: scale(1.05);
}

.answer-slot.wrong {
  border-color: var(--color-error);
  animation: shake 0.5s ease;
  background: rgba(214, 48, 49, 0.05);
}

.slot-word {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--color-text);
}

.slot-placeholder {
  font-size: 0.9rem;
  color: var(--color-text-light);
}

/* Word bank */
.word-bank {
  margin-bottom: 24px;
}

.bank-words {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: center;
}

.word-tile {
  padding: 10px 20px;
  background: var(--color-surface);
  border: 2px solid var(--color-border);
  border-radius: var(--radius-sm);
  font-size: 1.15rem;
  font-weight: 600;
  cursor: grab;
  transition: all var(--transition-fast);
  box-shadow: var(--shadow-sm);
  user-select: none;
}

.word-tile:hover:not(.placed) {
  border-color: var(--color-primary);
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
}

.word-tile:active:not(.placed) {
  cursor: grabbing;
  transform: scale(0.95);
}

.word-tile.placed {
  opacity: 0.3;
  cursor: default;
  transform: scale(0.9);
}

/* Result */
.result-section {
  text-align: center;
  padding: 20px;
  margin-bottom: 20px;
  background: linear-gradient(135deg, #f0fff4, #e6fffa);
  border-radius: var(--radius-md);
  border: 1px solid var(--color-success-light);
}

.result-correct {
  font-size: 1.4rem;
  font-weight: 700;
  color: var(--color-success);
  margin-bottom: 8px;
}

.result-pinyin {
  font-family: var(--font-pinyin);
  font-size: 1.05rem;
  color: var(--color-primary);
  font-weight: 500;
  margin-bottom: 4px;
}

.result-english {
  font-size: 0.95rem;
  color: var(--color-text-secondary);
  margin-bottom: 12px;
}

.grammar-box {
  padding: 12px 16px;
  background: rgba(255, 255, 255, 0.7);
  border-radius: var(--radius-sm);
  margin-bottom: 16px;
}

.grammar-pattern {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--color-text);
  margin-bottom: 4px;
  font-family: monospace;
}

.grammar-note {
  font-size: 0.85rem;
  color: var(--color-text-secondary);
  line-height: 1.4;
}

.next-btn {
  padding: 10px 24px;
  background: var(--color-primary);
  color: white;
  border-radius: var(--radius-md);
  font-weight: 600;
  font-size: 0.95rem;
  transition: background var(--transition-fast);
}

.next-btn:hover {
  background: var(--color-primary-dark);
}

@media (max-width: 480px) {
  .answer-slots {
    padding: 10px;
    gap: 6px;
  }

  .answer-slot {
    min-width: 40px;
    height: 38px;
    padding: 0 10px;
  }

  .slot-word {
    font-size: 1rem;
  }

  .word-tile {
    padding: 8px 14px;
    font-size: 1rem;
  }
}
</style>
