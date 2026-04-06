<template>
  <div>
    <transition name="toast">
      <div v-if="pool.poolExhausted.value" class="pool-toast">
        All words completed! Starting over with fresh shuffle...
      </div>
    </transition>
    <div v-if="infinite" class="round-indicator">Round {{ pool.round.value }}</div>
    <div class="board" :style="{ gridTemplateColumns: `repeat(${cols}, 1fr)` }">
      <MemoryCard
        v-for="card in cards"
        :key="card.id"
        :content="card.content"
        :type="card.type"
        :pinyin="card.pinyin"
        :english="card.english"
        :is-flipped="card.isFlipped"
        :is-matched="card.isMatched"
        @flip="flipCard(card)"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import MemoryCard from './MemoryCard.vue'
import { vocabulary } from '../../data/vocabulary'
import { getMyVocabulary } from '../../data/myWordsStore'
import { useInfinitePool } from '../../composables/useInfinitePool'

const props = defineProps({
  hskLevel: { type: String, default: 'Beginner' },
  difficulty: { type: String, default: '4x3' },
  infinite: { type: Boolean, default: false }
})

const emit = defineEmits(['matchFound', 'mismatch', 'gameComplete', 'gameStart', 'roundComplete'])

const fullPool = ref([])
const cards = ref([])
const flippedCards = ref([])
const isLocked = ref(false)
const gameStarted = ref(false)

const cols = computed(() => parseInt(props.difficulty.split('x')[0]))
const rows = computed(() => parseInt(props.difficulty.split('x')[1]))
const totalPairs = computed(() => (cols.value * rows.value) / 2)

const pool = useInfinitePool(fullPool, totalPairs.value, computed(() => props.infinite))

function shuffleArray(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function buildCards(selected) {
  const cardPairs = selected.flatMap((vocab, i) => [
    {
      id: `${pool.round.value}-${i}-char`,
      pairId: i,
      content: vocab.character,
      type: 'character',
      pinyin: vocab.pinyin,
      english: vocab.english,
      isFlipped: false,
      isMatched: false
    },
    {
      id: `${pool.round.value}-${i}-pin`,
      pairId: i,
      content: `${vocab.pinyin}\n${vocab.english}`,
      type: 'pinyin',
      pinyin: vocab.pinyin,
      english: vocab.english,
      isFlipped: false,
      isMatched: false
    }
  ])
  cards.value = shuffleArray(cardPairs)
  flippedCards.value = []
  isLocked.value = false
}

function initializeGame() {
  const source = props.hskLevel === 'MyWords'
    ? getMyVocabulary()
    : (vocabulary[props.hskLevel] || vocabulary.Beginner)
  fullPool.value = source

  if (props.infinite) {
    const batch = pool.nextBatch()
    buildCards(batch)
  } else {
    const selected = shuffleArray(source).slice(0, totalPairs.value)
    buildCards(selected)
  }
}

function startNextRound() {
  const batch = pool.nextBatch()
  if (batch.length === 0) return
  buildCards(batch)
  emit('roundComplete', { round: pool.round.value })
}

function flipCard(card) {
  if (isLocked.value || card.isFlipped || card.isMatched) return

  if (!gameStarted.value) {
    gameStarted.value = true
    emit('gameStart')
  }

  card.isFlipped = true
  flippedCards.value.push(card)

  if (flippedCards.value.length === 2) {
    isLocked.value = true
    const [a, b] = flippedCards.value

    if (a.pairId === b.pairId) {
      a.isMatched = true
      b.isMatched = true
      const matchedWord = a.type === 'character' ? a.content : b.content
      emit('matchFound', { word: matchedWord })
      flippedCards.value = []
      isLocked.value = false

      if (cards.value.every(c => c.isMatched)) {
        if (props.infinite) {
          setTimeout(() => startNextRound(), 1000)
        } else {
          emit('gameComplete')
        }
      }
    } else {
      emit('mismatch')
      setTimeout(() => {
        a.isFlipped = false
        b.isFlipped = false
        flippedCards.value = []
        isLocked.value = false
      }, 800)
    }
  }
}

onMounted(() => {
  initializeGame()
})
</script>

<style scoped>
.board {
  display: grid;
  gap: 10px;
  max-width: 600px;
  margin: 0 auto;
  padding: 8px;
}

.round-indicator {
  text-align: center;
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--color-primary);
  margin-bottom: 12px;
}

.pool-toast {
  position: fixed; top: 80px; left: 50%; transform: translateX(-50%);
  background: linear-gradient(135deg, #fdcb6e, #e17055); color: white;
  padding: 12px 24px; border-radius: var(--radius-md); font-size: 0.9rem;
  font-weight: 600; box-shadow: var(--shadow-lg); z-index: 500;
}
.toast-enter-active { animation: slideDown 0.3s ease; }
.toast-leave-active { animation: slideDown 0.3s ease reverse; }

@media (max-width: 480px) {
  .board {
    gap: 6px;
    padding: 4px;
  }
}
</style>
