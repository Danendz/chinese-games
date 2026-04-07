<template>
  <div class="speed-challenge">
    <!-- Pre-game: ready screen -->
    <div v-if="phase === 'ready'" class="ready-screen">
      <div class="ready-icon">⚡</div>
      <h2 class="ready-title text-chinese">准备好了吗？</h2>
      <p class="ready-desc">You have <strong>60 seconds</strong> to recognize as many words as possible!</p>
      <button class="start-btn" @click="startGame">Start! 开始!</button>
    </div>

    <!-- Playing -->
    <div v-if="phase === 'playing' && currentQuestion">
      <!-- Global timer bar -->
      <div class="global-timer">
        <div class="global-timer-fill" :style="{ width: globalTimePercent + '%' }" :class="{ urgent: globalTimeLeft <= 10, warning: globalTimeLeft <= 20 && globalTimeLeft > 10 }"></div>
        <span class="global-timer-text">{{ globalTimeLeft }}s</span>
      </div>

      <!-- Stats row -->
      <div class="stats-row">
        <div class="stat-box">
          <span class="stat-label">Score</span>
          <span class="stat-value">{{ totalScore }}</span>
        </div>
        <div class="stat-box">
          <span class="stat-label">Correct</span>
          <span class="stat-value correct-text">{{ correctCount }}</span>
        </div>
        <div class="stat-box" :class="{ 'on-fire': streak >= 3 }">
          <span class="stat-label">Streak</span>
          <span class="stat-value">{{ streak }}{{ streak >= 3 ? ' 🔥' : '' }}</span>
        </div>
      </div>

      <!-- Word display -->
      <div class="word-display" :class="{ 'flash-correct': flashState === 'correct', 'flash-wrong': flashState === 'wrong' }">
        <span class="chinese-word text-chinese">{{ currentQuestion.character }}</span>
        <span class="pinyin-hint text-pinyin">{{ currentQuestion.pinyin }}</span>
      </div>

      <!-- Options -->
      <div class="options-grid">
        <button
          v-for="(opt, i) in currentOptions"
          :key="i"
          class="option-btn"
          :class="{
            correct: answered && opt.id === currentQuestion.id,
            wrong: answered && selectedIndex === i && opt.id !== currentQuestion.id
          }"
          :disabled="answered"
          @click="selectAnswer(i)"
        >
          {{ opt.english }}
        </button>
      </div>
    </div>

    <!-- Game over -->
    <div v-if="phase === 'finished'" class="result-screen animate-pop-in">
      <div class="result-icon">🏆</div>
      <h2 class="result-title">Time's Up!</h2>
      <div class="result-stats">
        <div class="result-stat">
          <span class="result-value">{{ totalScore }}</span>
          <span class="result-label">Score</span>
        </div>
        <div class="result-stat">
          <span class="result-value correct-text">{{ correctCount }}</span>
          <span class="result-label">Correct</span>
        </div>
        <div class="result-stat">
          <span class="result-value">{{ wrongCount }}</span>
          <span class="result-label">Wrong</span>
        </div>
        <div class="result-stat">
          <span class="result-value">{{ bestStreak }}</span>
          <span class="result-label">Best Streak</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onUnmounted } from 'vue'
import { vocabulary } from '../../data/vocabulary'
import { getMyVocabulary } from '../../data/myWordsStore'

const props = defineProps({
  hskLevel: { type: String, default: 'Beginner' },
  infinite: { type: Boolean, default: false }
})

const emit = defineEmits(['correct', 'incorrect', 'gameStart', 'gameComplete', 'roundComplete'])

const GAME_DURATION = 60 // seconds

const phase = ref('ready') // ready | playing | finished
const fullPool = ref([])
const usedIds = ref(new Set())
const currentQuestion = ref(null)
const currentOptions = ref([])
const answered = ref(false)
const selectedIndex = ref(-1)
const flashState = ref('')

const totalScore = ref(0)
const correctCount = ref(0)
const wrongCount = ref(0)
const streak = ref(0)
const bestStreak = ref(0)

const globalTimeLeft = ref(GAME_DURATION)
const globalTimerInterval = ref(null)

const globalTimePercent = computed(() => (globalTimeLeft.value / GAME_DURATION) * 100)

function shuffleArray(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function startGame() {
  const source = props.hskLevel === 'MyWords'
    ? getMyVocabulary()
    : (vocabulary[props.hskLevel] || vocabulary.Beginner)
  fullPool.value = source
  usedIds.value = new Set()

  phase.value = 'playing'
  totalScore.value = 0
  correctCount.value = 0
  wrongCount.value = 0
  streak.value = 0
  bestStreak.value = 0
  globalTimeLeft.value = GAME_DURATION

  emit('gameStart')
  loadNextQuestion()
  startGlobalTimer()
}

function startGlobalTimer() {
  globalTimerInterval.value = setInterval(() => {
    globalTimeLeft.value--
    if (globalTimeLeft.value <= 0) {
      endGame()
    }
  }, 1000)
}

function endGame() {
  clearInterval(globalTimerInterval.value)
  globalTimerInterval.value = null
  phase.value = 'finished'
  emit('gameComplete')
}

function pickUnusedQuestion() {
  let available = fullPool.value.filter(w => !usedIds.value.has(w.id))
  if (available.length === 0) {
    // All used — reset pool
    usedIds.value = new Set()
    available = [...fullPool.value]
  }
  const picked = available[Math.floor(Math.random() * available.length)]
  usedIds.value.add(picked.id)
  return picked
}

function loadNextQuestion() {
  answered.value = false
  selectedIndex.value = -1
  flashState.value = ''

  const q = pickUnusedQuestion()
  currentQuestion.value = q

  const others = fullPool.value.filter(w => w.id !== q.id)
  const distractors = shuffleArray(others).slice(0, 3)
  currentOptions.value = shuffleArray([q, ...distractors])
}

function selectAnswer(index) {
  if (answered.value || phase.value !== 'playing') return

  answered.value = true
  selectedIndex.value = index
  const selected = currentOptions.value[index]

  if (selected.id === currentQuestion.value.id) {
    // Correct
    const timeBonus = Math.round((globalTimeLeft.value / GAME_DURATION) * 5)
    const streakBonus = Math.min(streak.value * 2, 10)
    totalScore.value += 10 + timeBonus + streakBonus
    correctCount.value++
    streak.value++
    bestStreak.value = Math.max(bestStreak.value, streak.value)
    flashState.value = 'correct'
    emit('correct', { word: currentQuestion.value.character })
  } else {
    wrongCount.value++
    streak.value = 0
    flashState.value = 'wrong'
    emit('incorrect')
  }

  // Quick advance — speed game should be fast!
  setTimeout(() => {
    if (phase.value === 'playing') {
      loadNextQuestion()
    }
  }, 600)
}

onUnmounted(() => {
  if (globalTimerInterval.value) clearInterval(globalTimerInterval.value)
})
</script>

<style scoped>
.speed-challenge {
  max-width: 500px;
  margin: 0 auto;
  text-align: center;
}

/* Ready screen */
.ready-screen {
  padding: 40px 20px;
}

.ready-icon {
  font-size: 4rem;
  margin-bottom: 16px;
}

.ready-title {
  font-size: 1.8rem;
  font-weight: 700;
  margin-bottom: 12px;
}

.ready-desc {
  color: var(--color-text-secondary);
  font-size: 1rem;
  margin-bottom: 28px;
  line-height: 1.5;
}

.start-btn {
  padding: 14px 40px;
  background: linear-gradient(135deg, var(--color-primary), #e17055);
  color: white;
  border-radius: var(--radius-md);
  font-size: 1.2rem;
  font-weight: 700;
  box-shadow: var(--shadow-md);
  transition: all var(--transition-fast);
}

.start-btn:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

/* Global timer */
.global-timer {
  position: relative;
  width: 100%;
  height: 12px;
  background: var(--color-bg-secondary);
  border-radius: 6px;
  margin-bottom: 16px;
  overflow: hidden;
}

.global-timer-fill {
  height: 100%;
  background: linear-gradient(90deg, #00b894, #00cec9);
  border-radius: 6px;
  transition: width 1s linear;
}

.global-timer-fill.warning {
  background: linear-gradient(90deg, #fdcb6e, #e17055);
}

.global-timer-fill.urgent {
  background: linear-gradient(90deg, #e17055, #d63031);
  animation: pulse-bar 0.5s ease infinite;
}

.global-timer-text {
  position: absolute;
  right: 8px;
  top: -20px;
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--color-text-secondary);
  font-variant-numeric: tabular-nums;
}

@keyframes pulse-bar {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.6; }
}

/* Stats row */
.stats-row {
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-bottom: 16px;
}

.stat-box {
  padding: 6px 16px;
  background: var(--color-surface);
  border: 2px solid var(--color-border);
  border-radius: var(--radius-md);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1px;
  min-width: 70px;
}

.stat-label {
  font-size: 0.65rem;
  color: var(--color-text-light);
  font-weight: 600;
  text-transform: uppercase;
}

.stat-value {
  font-size: 1.2rem;
  font-weight: 700;
  color: var(--color-text);
}

.correct-text { color: var(--color-success); }

.stat-box.on-fire {
  border-color: #e17055;
  background: rgba(225, 112, 85, 0.08);
}

/* Word display */
.word-display {
  margin: 8px 0 16px;
  padding: 20px 16px;
  background: var(--color-surface);
  border: 2px solid var(--color-border);
  border-radius: var(--radius-lg);
  transition: all 0.15s ease;
}

.word-display.flash-correct {
  border-color: var(--color-success);
  background: rgba(0, 184, 148, 0.08);
}

.word-display.flash-wrong {
  border-color: var(--color-error);
  background: rgba(214, 48, 49, 0.05);
  animation: shake 0.4s ease;
}

.chinese-word {
  display: block;
  font-size: 2.8rem;
  font-weight: 700;
  line-height: 1.2;
}

.pinyin-hint {
  display: block;
  font-size: 1rem;
  color: var(--color-primary);
  font-weight: 500;
  margin-top: 4px;
}

/* Options */
.options-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  margin-bottom: 20px;
}

.option-btn {
  padding: 14px 10px;
  background: var(--color-surface);
  border: 2px solid var(--color-border);
  border-radius: var(--radius-md);
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.1s ease;
}

.option-btn:hover:not(:disabled) {
  border-color: var(--color-primary);
  transform: translateY(-1px);
}

.option-btn:disabled { cursor: default; }
.option-btn.correct { border-color: var(--color-success); background: rgba(0, 184, 148, 0.1); }
.option-btn.wrong { border-color: var(--color-error); background: rgba(214, 48, 49, 0.05); }

/* Result screen */
.result-screen {
  padding: 40px 20px;
}

.result-icon { font-size: 4rem; margin-bottom: 12px; }

.result-title {
  font-size: 1.8rem;
  font-weight: 700;
  color: var(--color-primary);
  margin-bottom: 24px;
}

.result-stats {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  max-width: 320px;
  margin: 0 auto;
}

.result-stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 16px;
  background: var(--color-surface);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-sm);
}

.result-value {
  font-size: 2rem;
  font-weight: 700;
  color: var(--color-text);
}

.result-label {
  font-size: 0.75rem;
  color: var(--color-text-secondary);
  text-transform: uppercase;
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  20% { transform: translateX(-5px); }
  40% { transform: translateX(5px); }
  60% { transform: translateX(-3px); }
  80% { transform: translateX(3px); }
}

@media (max-width: 480px) {
  .chinese-word { font-size: 2.2rem; }
  .option-btn { padding: 10px 8px; font-size: 0.85rem; }
}
</style>
