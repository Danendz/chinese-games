<template>
  <div class="radical-game" v-if="currentPuzzle">
    <div class="progress-bar">
      <div class="progress-fill" :style="{ width: progressPercent + '%' }"></div>
      <span class="progress-text">
        <template v-if="infinite">Round {{ pool.round.value }} -- </template>
        {{ currentIndex + 1 }} / {{ puzzles.length }}
      </span>
    </div>

    <transition name="toast">
      <div v-if="pool.poolExhausted.value" class="pool-toast">All radicals completed! Starting over...</div>
    </transition>

    <div class="target-section">
      <div class="target-char text-chinese">{{ currentPuzzle.character }}</div>
      <div class="target-info">
        <span class="target-pinyin">{{ currentPuzzle.pinyin }}</span>
        <span class="target-english">{{ currentPuzzle.english }}</span>
      </div>
    </div>

    <div class="assembly-zone" :class="[`structure-${currentPuzzle.structure}`]">
      <div
        v-for="comp in currentPuzzle.components"
        :key="comp.position"
        class="drop-slot"
        :class="{
          filled: placedRadicals[comp.position],
          'drag-over': dragOverSlot === comp.position,
          correct: placedRadicals[comp.position] === comp.radical
        }"
        @dragover.prevent="dragOverSlot = comp.position"
        @dragleave="dragOverSlot = null"
        @drop="handleDrop(comp.position, $event)"
        @click="handleSlotClick(comp.position)"
      >
        <span v-if="placedRadicals[comp.position]" class="slot-char text-chinese">
          {{ placedRadicals[comp.position] }}
        </span>
        <span v-else class="slot-label">{{ comp.label }}</span>
      </div>
    </div>

    <div class="hint-section" v-if="showHint">
      <p class="hint-text">{{ currentPuzzle.hint }}</p>
    </div>
    <button class="hint-btn" @click="showHint = !showHint">
      {{ showHint ? 'Hide Hint' : 'Show Hint' }}
    </button>

    <div class="pieces-area">
      <div
        v-for="piece in availablePieces"
        :key="piece.id"
        class="radical-piece text-chinese"
        :class="{ placed: piece.isPlaced, wrong: piece.shakeAnim }"
        draggable="true"
        @dragstart="handleDragStart(piece, $event)"
        @click="handlePieceClick(piece)"
      >
        {{ piece.radical }}
      </div>
    </div>

    <div v-if="puzzleComplete" class="puzzle-success animate-pop-in">
      <span class="success-text">Correct!</span>
      <button v-if="currentIndex < puzzles.length - 1" class="next-btn" @click="nextPuzzle">
        Next Character &rarr;
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { radicalPuzzles } from '../../data/radicals'
import { getMyRadicals } from '../../data/myWordsStore'
import { useInfinitePool } from '../../composables/useInfinitePool'

const props = defineProps({
  hskLevel: { type: String, default: 'HSK1' },
  infinite: { type: Boolean, default: false }
})

const emit = defineEmits(['correct', 'incorrect', 'gameStart', 'gameComplete', 'roundComplete'])

const fullPool = ref([])
const puzzles = ref([])
const currentIndex = ref(0)
const placedRadicals = reactive({})
const availablePieces = ref([])
const showHint = ref(false)
const puzzleComplete = ref(false)
const dragOverSlot = ref(null)
const gameStarted = ref(false)
const selectedPiece = ref(null)

const pool = useInfinitePool(fullPool, 8, computed(() => props.infinite))
const currentPuzzle = computed(() => puzzles.value[currentIndex.value])
const progressPercent = computed(() => ((currentIndex.value) / puzzles.value.length) * 100)

function shuffleArray(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function loadPuzzle() {
  const puzzle = currentPuzzle.value
  if (!puzzle) return

  puzzleComplete.value = false
  showHint.value = false
  dragOverSlot.value = null
  selectedPiece.value = null

  // Clear placed radicals
  Object.keys(placedRadicals).forEach(k => delete placedRadicals[k])
  puzzle.components.forEach(c => {
    placedRadicals[c.position] = null
  })

  // Create pieces pool
  const allPieces = [
    ...puzzle.components.map(c => c.radical),
    ...puzzle.distractors
  ]
  availablePieces.value = shuffleArray(allPieces).map((r, i) => ({
    id: i,
    radical: r,
    isPlaced: false,
    shakeAnim: false
  }))
}

function handleDragStart(piece, event) {
  if (piece.isPlaced) return
  event.dataTransfer.setData('text/plain', JSON.stringify({ radical: piece.radical, id: piece.id }))
  if (!gameStarted.value) {
    gameStarted.value = true
    emit('gameStart')
  }
}

function handleDrop(position, event) {
  dragOverSlot.value = null
  const data = JSON.parse(event.dataTransfer.getData('text/plain'))
  tryPlace(position, data.radical, data.id)
}

function handlePieceClick(piece) {
  if (piece.isPlaced) return
  if (!gameStarted.value) {
    gameStarted.value = true
    emit('gameStart')
  }

  if (selectedPiece.value === piece.id) {
    selectedPiece.value = null
    return
  }
  selectedPiece.value = piece.id

  // Find first empty slot
  const emptySlot = currentPuzzle.value.components.find(c => !placedRadicals[c.position])
  if (emptySlot) {
    tryPlace(emptySlot.position, piece.radical, piece.id)
  }
}

function handleSlotClick(position) {
  if (!placedRadicals[position]) return
  // Return piece to pool
  const radical = placedRadicals[position]
  const piece = availablePieces.value.find(p => p.radical === radical && p.isPlaced)
  if (piece) piece.isPlaced = false
  placedRadicals[position] = null
}

function tryPlace(position, radical, pieceId) {
  const expected = currentPuzzle.value.components.find(c => c.position === position)
  if (!expected) return

  if (expected.radical === radical) {
    placedRadicals[position] = radical
    const piece = availablePieces.value.find(p => p.id === pieceId)
    if (piece) piece.isPlaced = true
    selectedPiece.value = null

    // Check completion
    const allFilled = currentPuzzle.value.components.every(c => placedRadicals[c.position] === c.radical)
    if (allFilled) {
      puzzleComplete.value = true
      emit('correct')
      if (currentIndex.value >= puzzles.value.length - 1) {
        if (props.infinite) {
          setTimeout(() => startNextRound(), 1200)
        } else {
          setTimeout(() => emit('gameComplete'), 1200)
        }
      }
    }
  } else {
    emit('incorrect')
    // Shake the piece
    const piece = availablePieces.value.find(p => p.id === pieceId)
    if (piece) {
      piece.shakeAnim = true
      setTimeout(() => { piece.shakeAnim = false }, 500)
    }
  }
}

function startNextRound() {
  const batch = pool.nextBatch()
  if (batch.length === 0) return
  puzzles.value = batch
  currentIndex.value = 0
  loadPuzzle()
  emit('roundComplete', { round: pool.round.value })
}

function nextPuzzle() {
  currentIndex.value++
  loadPuzzle()
}

onMounted(() => {
  const source = props.hskLevel === 'MyWords'
    ? getMyRadicals()
    : (radicalPuzzles[props.hskLevel] || radicalPuzzles.Beginner)
  fullPool.value = source
  if (props.infinite) {
    puzzles.value = pool.nextBatch()
  } else {
    puzzles.value = shuffleArray(source)
  }
  loadPuzzle()
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

.radical-game {
  max-width: 500px;
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

.target-section {
  margin-bottom: 24px;
}

.target-char {
  font-size: 4rem;
  font-weight: 700;
  color: var(--color-text-light);
  opacity: 0.3;
  line-height: 1.2;
}

.target-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.target-pinyin {
  font-family: var(--font-pinyin);
  font-size: 1.1rem;
  color: var(--color-primary);
  font-weight: 600;
}

.target-english {
  font-size: 0.95rem;
  color: var(--color-text-secondary);
}

/* Assembly Zone */
.assembly-zone {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-bottom: 20px;
  min-height: 120px;
  align-items: center;
}

.structure-top-bottom {
  flex-direction: column;
  align-items: center;
}

.structure-enclosed {
  position: relative;
}

.drop-slot {
  width: 100px;
  height: 100px;
  border: 3px dashed var(--color-border);
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--transition-fast);
  cursor: pointer;
  background: var(--color-bg-secondary);
}

.drop-slot.drag-over {
  border-color: var(--color-primary);
  background: rgba(214, 48, 49, 0.05);
  transform: scale(1.05);
}

.drop-slot.filled {
  border-style: solid;
  border-color: var(--color-success);
  background: rgba(0, 184, 148, 0.08);
}

.drop-slot.correct {
  animation: glow 1.5s ease infinite;
}

.slot-char {
  font-size: 2.8rem;
  font-weight: 700;
  color: var(--color-text);
}

.slot-label {
  font-size: 0.75rem;
  color: var(--color-text-light);
  text-transform: uppercase;
}

.structure-enclosed .drop-slot:first-child {
  width: 120px;
  height: 120px;
}

.structure-enclosed .drop-slot:last-child {
  position: absolute;
  width: 60px;
  height: 60px;
  border-width: 2px;
}

/* Hint */
.hint-section {
  margin-bottom: 8px;
  padding: 10px 16px;
  background: var(--color-bg-secondary);
  border-radius: var(--radius-sm);
}

.hint-text {
  font-size: 0.9rem;
  color: var(--color-text-secondary);
  line-height: 1.5;
}

.hint-btn {
  font-size: 0.8rem;
  color: var(--color-primary);
  margin-bottom: 24px;
  padding: 4px 12px;
  font-weight: 500;
}

.hint-btn:hover {
  text-decoration: underline;
}

/* Pieces */
.pieces-area {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 12px;
  margin-bottom: 24px;
}

.radical-piece {
  width: 72px;
  height: 72px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  font-weight: 700;
  background: var(--color-surface);
  border: 2px solid var(--color-border);
  border-radius: var(--radius-md);
  cursor: grab;
  transition: all var(--transition-fast);
  box-shadow: var(--shadow-sm);
  user-select: none;
}

.radical-piece:hover:not(.placed) {
  border-color: var(--color-primary);
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
}

.radical-piece:active:not(.placed) {
  cursor: grabbing;
  transform: scale(0.95);
}

.radical-piece.placed {
  opacity: 0.3;
  cursor: default;
  transform: scale(0.9);
}

.radical-piece.wrong {
  animation: shake 0.5s ease;
  border-color: var(--color-error);
}

/* Success */
.puzzle-success {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.success-text {
  font-size: 1.3rem;
  font-weight: 700;
  color: var(--color-success);
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
  .target-char {
    font-size: 3rem;
  }

  .drop-slot {
    width: 80px;
    height: 80px;
  }

  .slot-char {
    font-size: 2.2rem;
  }

  .radical-piece {
    width: 60px;
    height: 60px;
    font-size: 1.6rem;
  }
}
</style>
