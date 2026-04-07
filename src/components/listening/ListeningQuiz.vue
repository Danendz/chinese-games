<template>
  <div class="listening-quiz" v-if="currentQuestion">
    <div class="progress-bar">
      <div class="progress-fill" :style="{ width: progressPercent + '%' }"></div>
      <span class="progress-text">
        <template v-if="infinite">Round {{ pool.round.value }} -- </template>
        {{ currentIndex + 1 }} / {{ questions.length }}
      </span>
    </div>

    <transition name="toast">
      <div v-if="pool.poolExhausted.value" class="pool-toast">
        {{ t('game.poolExhausted') }}
      </div>
    </transition>

    <div class="speaker-area">
      <button class="speaker-btn" @click="speakWord" :disabled="speaking">
        <span class="speaker-icon">🔊</span>
        <span class="speaker-label">{{ speaking ? t('listen.playing') : t('listen.playSound') }}</span>
      </button>
    </div>

    <p class="quiz-prompt">{{ mode === 'english' ? t('prompt.selectMeaning') : t('prompt.selectWord') }}</p>

    <div class="options-grid">
      <button
        v-for="(opt, i) in currentOptions"
        :key="i"
        class="option-btn"
        :class="{
          correct: answered && opt.id === currentQuestion.id,
          wrong: answered && selectedIndex === i && opt.id !== currentQuestion.id,
          'text-chinese': mode === 'character'
        }"
        :disabled="answered"
        @click="selectAnswer(i)"
      >
        {{ mode === 'english' ? tr(opt) : opt.character }}
      </button>
    </div>

    <div v-if="answered" class="answer-info animate-pop-in">
      <div class="answer-word text-chinese">{{ currentQuestion.character }}</div>
      <div class="answer-pinyin">{{ currentQuestion.pinyin }}</div>
      <div class="answer-english">{{ tr(currentQuestion) }}</div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { vocabulary } from '../../data/vocabulary'
import { getMyVocabulary } from '../../data/myWordsStore'
import { useInfinitePool } from '../../composables/useInfinitePool'
import { useI18n } from '../../composables/useI18n'
const { t, tr } = useI18n()

const props = defineProps({
  hskLevel: { type: String, default: 'Beginner' },
  mode: { type: String, default: 'english' },
  infinite: { type: Boolean, default: false }
})

const emit = defineEmits(['correct', 'incorrect', 'gameStart', 'gameComplete', 'roundComplete'])

const fullPool = ref([])
const questions = ref([])
const currentIndex = ref(0)
const currentOptions = ref([])
const answered = ref(false)
const selectedIndex = ref(-1)
const speaking = ref(false)
const gameStarted = ref(false)

const pool = useInfinitePool(fullPool, 10, computed(() => props.infinite))

const currentQuestion = computed(() => questions.value[currentIndex.value])
const progressPercent = computed(() => (currentIndex.value / questions.value.length) * 100)

function shuffleArray(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function speakWord() {
  if (!currentQuestion.value || speaking.value) return
  speaking.value = true
  const utterance = new SpeechSynthesisUtterance(currentQuestion.value.character)
  utterance.lang = 'zh-CN'
  utterance.rate = 0.8
  utterance.onend = () => { speaking.value = false }
  utterance.onerror = () => { speaking.value = false }
  window.speechSynthesis.cancel()
  window.speechSynthesis.speak(utterance)
}

function loadQuestion() {
  answered.value = false
  selectedIndex.value = -1
  const q = currentQuestion.value
  if (!q) return

  // Use fullPool for distractors if batch is small
  const distractorSource = questions.value.length >= 4 ? questions.value : fullPool.value
  const others = distractorSource.filter(w => w.id !== q.id)
  const distractors = shuffleArray(others).slice(0, 3)
  currentOptions.value = shuffleArray([q, ...distractors])

  setTimeout(() => speakWord(), 300)
}

function startNextRound() {
  const batch = pool.nextBatch()
  if (batch.length === 0) return
  questions.value = batch
  currentIndex.value = 0
  loadQuestion()
  emit('roundComplete', { round: pool.round.value })
}

function selectAnswer(index) {
  if (answered.value) return
  if (!gameStarted.value) {
    gameStarted.value = true
    emit('gameStart')
  }

  answered.value = true
  selectedIndex.value = index
  const selected = currentOptions.value[index]

  if (selected.id === currentQuestion.value.id) {
    emit('correct', { word: currentQuestion.value.character })
  } else {
    emit('incorrect')
  }

  setTimeout(() => {
    if (currentIndex.value < questions.value.length - 1) {
      currentIndex.value++
      loadQuestion()
    } else if (props.infinite) {
      startNextRound()
    } else {
      emit('gameComplete')
    }
  }, 1500)
}

onMounted(() => {
  const source = props.hskLevel === 'MyWords'
    ? getMyVocabulary()
    : (vocabulary[props.hskLevel] || vocabulary.Beginner)
  fullPool.value = source

  if (props.infinite) {
    questions.value = pool.nextBatch()
  } else {
    questions.value = shuffleArray(source).slice(0, Math.min(10, source.length))
  }
  loadQuestion()
})

onUnmounted(() => {
  window.speechSynthesis.cancel()
})
</script>

<style scoped>
.listening-quiz {
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

.speaker-area { margin: 16px 0 24px; }

.speaker-btn {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 24px 40px;
  background: linear-gradient(135deg, var(--color-primary-light), var(--color-primary));
  color: white;
  border-radius: var(--radius-lg);
  transition: all var(--transition-fast);
  box-shadow: var(--shadow-md);
}

.speaker-btn:hover:not(:disabled) { transform: scale(1.05); box-shadow: var(--shadow-lg); }
.speaker-btn:active:not(:disabled) { transform: scale(0.98); }
.speaker-btn:disabled { opacity: 0.7; }
.speaker-icon { font-size: 3rem; }
.speaker-label { font-size: 0.85rem; font-weight: 600; opacity: 0.9; }
.quiz-prompt { font-size: 0.95rem; color: var(--color-text-secondary); margin-bottom: 16px; }

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

.option-btn.text-chinese { font-size: 1.3rem; }
.option-btn:hover:not(:disabled) { border-color: var(--color-primary); transform: translateY(-2px); box-shadow: var(--shadow-md); }
.option-btn:disabled { cursor: default; }
.option-btn.correct { border-color: var(--color-success); background: rgba(0, 184, 148, 0.1); animation: glow 1s ease infinite; }
.option-btn.wrong { border-color: var(--color-error); background: rgba(214, 48, 49, 0.05); animation: shake 0.5s ease; }

.answer-info {
  padding: 16px;
  background: linear-gradient(135deg, #f0fff4, #e6fffa);
  border-radius: var(--radius-md);
  border: 1px solid var(--color-success-light);
}

.answer-word { font-size: 1.6rem; font-weight: 700; margin-bottom: 4px; }
.answer-pinyin { font-size: 1rem; font-family: var(--font-pinyin); color: var(--color-primary); font-weight: 500; margin-bottom: 2px; }
.answer-english { font-size: 0.9rem; color: var(--color-text-secondary); }
</style>
