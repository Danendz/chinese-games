<template>
  <div class="speed-challenge" v-if="currentQuestion">
    <div class="progress-bar">
      <div class="progress-fill" :style="{ width: progressPercent + '%' }"></div>
      <span class="progress-text">
        <template v-if="infinite">Round {{ pool.round.value }} -- </template>
        {{ currentIndex + 1 }} / {{ questions.length }}
      </span>
    </div>

    <transition name="toast">
      <div v-if="pool.poolExhausted.value" class="pool-toast">
        All words completed! Starting over with fresh shuffle...
      </div>
    </transition>

    <div class="stats-row">
      <div class="stat-box score-box">
        <span class="stat-label">Score</span>
        <span class="stat-value">{{ totalScore }}</span>
      </div>
      <div class="stat-box streak-box" :class="{ 'on-fire': streak >= 3 }">
        <span class="stat-label">Streak</span>
        <span class="stat-value">{{ streak }}{{ streak >= 3 ? ' &#x1F525;' : '' }}</span>
      </div>
    </div>

    <div class="timer-bar-container">
      <div
        class="timer-bar-fill"
        :class="{ urgent: timeRatio < 0.3, warning: timeRatio < 0.5 && timeRatio >= 0.3 }"
        :style="{ width: (timeRatio * 100) + '%' }"
      ></div>
    </div>

    <div
      class="word-display"
      :class="{ 'flash-correct': flashState === 'correct', 'flash-wrong': flashState === 'wrong' }"
    >
      <span class="chinese-word text-chinese">{{ currentQuestion.character }}</span>
      <span class="pinyin-hint">{{ currentQuestion.pinyin }}</span>
    </div>

    <p class="quiz-prompt">Select the correct meaning:</p>

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

    <div v-if="answered && selectedIndex !== -1" class="answer-info animate-pop-in">
      <div class="answer-word text-chinese">{{ currentQuestion.character }}</div>
      <div class="answer-pinyin">{{ currentQuestion.pinyin }}</div>
      <div class="answer-english">{{ currentQuestion.english }}</div>
      <div v-if="lastBonus > 0" class="speed-bonus">+{{ lastBonus }} speed bonus!</div>
    </div>

    <div v-if="answered && selectedIndex === -1" class="timeout-info animate-pop-in">
      <div class="timeout-label">Time's up!</div>
      <div class="answer-word text-chinese">{{ currentQuestion.character }}</div>
      <div class="answer-pinyin">{{ currentQuestion.pinyin }}</div>
      <div class="answer-english">{{ currentQuestion.english }}</div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { vocabulary } from '../../data/vocabulary'
import { getMyVocabulary } from '../../data/myWordsStore'
import { useInfinitePool } from '../../composables/useInfinitePool'

const props = defineProps({
  hskLevel: { type: String, default: 'Beginner' },
  infinite: { type: Boolean, default: false }
})

const emit = defineEmits(['correct', 'incorrect', 'gameStart', 'gameComplete', 'roundComplete'])

const fullPool = ref([])
const questions = ref([])
const currentIndex = ref(0)
const currentOptions = ref([])
const answered = ref(false)
const selectedIndex = ref(-1)
const gameStarted = ref(false)

const totalScore = ref(0)
const streak = ref(0)
const lastBonus = ref(0)
const flashState = ref('')   // 'correct', 'wrong', or ''

// Timer state
const timeLimit = ref(3000)   // ms, starts at 3s
const timeRemaining = ref(3000)
const timerInterval = ref(null)

const pool = useInfinitePool(fullPool, 15, computed(() => props.infinite))

const currentQuestion = computed(() => questions.value[currentIndex.value])
const progressPercent = computed(() => (currentIndex.value / questions.value.length) * 100)
const timeRatio = computed(() => timeRemaining.value / timeLimit.value)

function shuffleArray(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function calcTimeLimit() {
  // 3s -> 2.5s -> 2s -> 1.5s (min)
  const idx = currentIndex.value
  const limit = Math.max(1500, 3000 - idx * 500)
  return limit
}

function startTimer() {
  stopTimer()
  timeLimit.value = calcTimeLimit()
  timeRemaining.value = timeLimit.value
  const tickMs = 50
  timerInterval.value = setInterval(() => {
    timeRemaining.value = Math.max(0, timeRemaining.value - tickMs)
    if (timeRemaining.value <= 0) {
      onTimeout()
    }
  }, tickMs)
}

function stopTimer() {
  if (timerInterval.value) {
    clearInterval(timerInterval.value)
    timerInterval.value = null
  }
}

function onTimeout() {
  stopTimer()
  answered.value = true
  selectedIndex.value = -1
  flashState.value = 'wrong'
  streak.value = 0
  emit('incorrect')
  setTimeout(() => {
    flashState.value = ''
    advanceQuestion()
  }, 1800)
}

function loadQuestion() {
  answered.value = false
  selectedIndex.value = -1
  flashState.value = ''
  lastBonus.value = 0
  const q = currentQuestion.value
  if (!q) return

  const distractorSource = questions.value.length >= 4 ? questions.value : fullPool.value
  const others = distractorSource.filter(w => w.id !== q.id)
  const distractors = shuffleArray(others).slice(0, 3)
  currentOptions.value = shuffleArray([q, ...distractors])

  startTimer()
}

function selectAnswer(index) {
  if (answered.value) return
  stopTimer()

  if (!gameStarted.value) {
    gameStarted.value = true
    emit('gameStart')
  }

  answered.value = true
  selectedIndex.value = index
  const selected = currentOptions.value[index]

  if (selected.id === currentQuestion.value.id) {
    // Correct - calculate speed bonus
    const ratio = timeRemaining.value / timeLimit.value
    const bonus = Math.round(ratio * 20)  // up to 20 bonus points
    const basePoints = 10
    lastBonus.value = bonus
    totalScore.value += basePoints + bonus
    streak.value++
    flashState.value = 'correct'
    emit('correct', { word: currentQuestion.value.character })
  } else {
    streak.value = 0
    flashState.value = 'wrong'
    emit('incorrect')
  }

  setTimeout(() => {
    flashState.value = ''
    advanceQuestion()
  }, 1500)
}

function advanceQuestion() {
  if (currentIndex.value < questions.value.length - 1) {
    currentIndex.value++
    loadQuestion()
  } else if (props.infinite) {
    startNextRound()
  } else {
    emit('gameComplete')
  }
}

function startNextRound() {
  const batch = pool.nextBatch()
  if (batch.length === 0) return
  questions.value = batch
  currentIndex.value = 0
  loadQuestion()
  emit('roundComplete', { round: pool.round.value })
}

onMounted(() => {
  const source = props.hskLevel === 'MyWords'
    ? getMyVocabulary()
    : (vocabulary[props.hskLevel] || vocabulary.Beginner)
  fullPool.value = source

  if (props.infinite) {
    questions.value = pool.nextBatch()
  } else {
    questions.value = shuffleArray(source).slice(0, Math.min(15, source.length))
  }
  loadQuestion()
})

onUnmounted(() => {
  stopTimer()
})
</script>

<style scoped>
.speed-challenge {
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

.pool-toast {
  position: fixed; top: 80px; left: 50%; transform: translateX(-50%);
  background: linear-gradient(135deg, #fdcb6e, #e17055); color: white;
  padding: 12px 24px; border-radius: var(--radius-md); font-size: 0.9rem;
  font-weight: 600; box-shadow: var(--shadow-lg); z-index: 500;
}
.toast-enter-active { animation: slideDown 0.3s ease; }
.toast-leave-active { animation: slideDown 0.3s ease reverse; }

/* Stats row */
.stats-row {
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-bottom: 16px;
}

.stat-box {
  padding: 8px 20px;
  background: var(--color-surface);
  border: 2px solid var(--color-border);
  border-radius: var(--radius-md);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  min-width: 80px;
}

.stat-label {
  font-size: 0.7rem;
  color: var(--color-text-secondary);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.stat-value {
  font-size: 1.3rem;
  font-weight: 700;
  color: var(--color-text-primary);
}

.streak-box.on-fire {
  border-color: #e17055;
  background: rgba(225, 112, 85, 0.08);
}

.streak-box.on-fire .stat-value {
  color: #e17055;
}

/* Timer bar */
.timer-bar-container {
  width: 100%;
  height: 8px;
  background: var(--color-bg-secondary);
  border-radius: 4px;
  margin-bottom: 20px;
  overflow: hidden;
}

.timer-bar-fill {
  height: 100%;
  background: linear-gradient(90deg, #00b894, #00cec9);
  border-radius: 4px;
  transition: width 0.05s linear;
}

.timer-bar-fill.warning {
  background: linear-gradient(90deg, #fdcb6e, #e17055);
}

.timer-bar-fill.urgent {
  background: linear-gradient(90deg, #e17055, #d63031);
  animation: pulse-bar 0.4s ease infinite;
}

@keyframes pulse-bar {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}

/* Word display */
.word-display {
  margin: 12px 0 20px;
  padding: 24px 16px;
  background: var(--color-surface);
  border: 2px solid var(--color-border);
  border-radius: var(--radius-lg);
  transition: all 0.2s ease;
}

.word-display.flash-correct {
  border-color: var(--color-success);
  background: rgba(0, 184, 148, 0.1);
}

.word-display.flash-wrong {
  border-color: var(--color-error);
  background: rgba(214, 48, 49, 0.05);
  animation: shake 0.5s ease;
}

.chinese-word {
  display: block;
  font-size: 2.8rem;
  font-weight: 700;
  line-height: 1.3;
}

.pinyin-hint {
  display: block;
  font-size: 1rem;
  font-family: var(--font-pinyin);
  color: var(--color-primary);
  font-weight: 500;
  margin-top: 4px;
}

.quiz-prompt {
  font-size: 0.95rem;
  color: var(--color-text-secondary);
  margin-bottom: 16px;
}

/* Options */
.options-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-bottom: 24px;
}

.option-btn {
  padding: 16px 12px;
  background: var(--color-surface);
  border: 2px solid var(--color-border);
  border-radius: var(--radius-md);
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.option-btn:hover:not(:disabled) {
  border-color: var(--color-primary);
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.option-btn:disabled { cursor: default; }

.option-btn.correct {
  border-color: var(--color-success);
  background: rgba(0, 184, 148, 0.1);
  animation: glow 1s ease infinite;
}

.option-btn.wrong {
  border-color: var(--color-error);
  background: rgba(214, 48, 49, 0.05);
  animation: shake 0.5s ease;
}

/* Answer info */
.answer-info {
  padding: 16px;
  background: linear-gradient(135deg, #f0fff4, #e6fffa);
  border-radius: var(--radius-md);
  border: 1px solid var(--color-success-light);
}

.timeout-info {
  padding: 16px;
  background: linear-gradient(135deg, #fff5f5, #ffe0e0);
  border-radius: var(--radius-md);
  border: 1px solid var(--color-error);
}

.timeout-label {
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--color-error);
  margin-bottom: 6px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.answer-word { font-size: 1.6rem; font-weight: 700; margin-bottom: 4px; }
.answer-pinyin { font-size: 1rem; font-family: var(--font-pinyin); color: var(--color-primary); font-weight: 500; margin-bottom: 2px; }
.answer-english { font-size: 0.9rem; color: var(--color-text-secondary); }

.speed-bonus {
  margin-top: 6px;
  font-size: 0.85rem;
  font-weight: 700;
  color: #e17055;
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  20% { transform: translateX(-6px); }
  40% { transform: translateX(6px); }
  60% { transform: translateX(-4px); }
  80% { transform: translateX(4px); }
}

@media (max-width: 480px) {
  .chinese-word {
    font-size: 2.2rem;
  }

  .option-btn {
    padding: 12px 8px;
    font-size: 0.9rem;
  }

  .stats-row {
    gap: 10px;
  }

  .stat-box {
    padding: 6px 14px;
    min-width: 60px;
  }
}
</style>
