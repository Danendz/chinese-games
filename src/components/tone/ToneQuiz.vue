<template>
  <div class="tone-quiz" v-if="currentQuestion">
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

    <div class="character-display">
      <div class="character text-chinese">{{ currentQuestion.character }}</div>
      <div class="character-english">{{ currentQuestion.english }}</div>
      <div v-if="answered" class="character-pinyin animate-pop-in">{{ currentQuestion.pinyin }}</div>
    </div>

    <p class="quiz-prompt">Select the correct tone:</p>

    <div class="tone-grid">
      <button
        v-for="t in 4"
        :key="t"
        class="tone-btn"
        :class="{
          correct: answered && t === currentQuestion.tone,
          wrong: answered && selectedTone === t && t !== currentQuestion.tone
        }"
        :disabled="answered"
        @click="selectTone(t)"
      >
        <span class="tone-number">{{ t }}</span>
        <span class="tone-example">{{ toneNames[t].example }}</span>
        <span class="tone-desc">{{ toneNames[t].desc }}</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { toneQuizData, toneNames } from '../../data/tones'
import { useInfinitePool } from '../../composables/useInfinitePool'

const props = defineProps({
  hskLevel: { type: String, default: 'Beginner' },
  infinite: { type: Boolean, default: false }
})

const emit = defineEmits(['correct', 'incorrect', 'gameStart', 'gameComplete', 'roundComplete'])

const fullPool = ref([])
const questions = ref([])
const currentIndex = ref(0)
const answered = ref(false)
const selectedTone = ref(-1)
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
  if (!currentQuestion.value) return
  const utterance = new SpeechSynthesisUtterance(currentQuestion.value.character)
  utterance.lang = 'zh-CN'
  utterance.rate = 0.8
  window.speechSynthesis.cancel()
  window.speechSynthesis.speak(utterance)
}

function startNextRound() {
  const batch = pool.nextBatch()
  if (batch.length === 0) return
  questions.value = batch
  currentIndex.value = 0
  answered.value = false
  selectedTone.value = -1
  emit('roundComplete', { round: pool.round.value })
}

function selectTone(tone) {
  if (answered.value) return
  if (!gameStarted.value) {
    gameStarted.value = true
    emit('gameStart')
  }

  answered.value = true
  selectedTone.value = tone

  if (tone === currentQuestion.value.tone) {
    emit('correct', { word: currentQuestion.value.character })
    speakWord()
  } else {
    emit('incorrect')
  }

  setTimeout(() => {
    if (currentIndex.value < questions.value.length - 1) {
      currentIndex.value++
      answered.value = false
      selectedTone.value = -1
    } else if (props.infinite) {
      startNextRound()
    } else {
      emit('gameComplete')
    }
  }, 1500)
}

onMounted(() => {
  const source = (toneQuizData[props.hskLevel] || toneQuizData.Beginner)
    .map((item, i) => ({ ...item, id: props.hskLevel + '_' + i }))
  fullPool.value = source

  if (props.infinite) {
    questions.value = pool.nextBatch()
  } else {
    questions.value = shuffleArray(source).slice(0, Math.min(10, source.length))
  }
})

onUnmounted(() => {
  window.speechSynthesis.cancel()
})
</script>

<style scoped>
.tone-quiz {
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

.character-display {
  margin: 16px 0 24px;
  padding: 24px;
  background: linear-gradient(135deg, var(--color-bg-secondary), var(--color-surface));
  border-radius: var(--radius-lg);
  border: 2px solid var(--color-border);
}

.character {
  font-size: 4rem;
  font-weight: 700;
  line-height: 1.2;
  margin-bottom: 8px;
}

.character-english {
  font-size: 1.1rem;
  color: var(--color-text-secondary);
  font-weight: 500;
}

.character-pinyin {
  font-size: 1.2rem;
  font-family: var(--font-pinyin);
  color: var(--color-primary);
  font-weight: 600;
  margin-top: 8px;
}

.quiz-prompt {
  font-size: 0.95rem;
  color: var(--color-text-secondary);
  margin-bottom: 16px;
}

.tone-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-bottom: 24px;
}

.tone-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 16px 12px;
  background: var(--color-surface);
  border: 2px solid var(--color-border);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.tone-btn:hover:not(:disabled) {
  border-color: var(--color-primary);
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.tone-btn:disabled { cursor: default; }

.tone-btn.correct {
  border-color: var(--color-success);
  background: rgba(0, 184, 148, 0.1);
  animation: glow 1s ease infinite;
}

.tone-btn.wrong {
  border-color: var(--color-error);
  background: rgba(214, 48, 49, 0.05);
  animation: shake 0.5s ease;
}

.tone-number {
  font-size: 1.4rem;
  font-weight: 700;
  color: var(--color-text);
}

.tone-example {
  font-size: 1.2rem;
  font-family: var(--font-pinyin);
  color: var(--color-primary);
  font-weight: 600;
}

.tone-desc {
  font-size: 0.75rem;
  color: var(--color-text-secondary);
  font-weight: 500;
}
</style>
