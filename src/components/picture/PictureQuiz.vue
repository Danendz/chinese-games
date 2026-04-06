<template>
  <div class="picture-quiz" v-if="currentQuestion">
    <div class="progress-bar">
      <div class="progress-fill" :style="{ width: progressPercent + '%' }"></div>
      <span class="progress-text">
        <template v-if="infinite">Round {{ pool.round.value }} -- </template>
        {{ currentIndex + 1 }} / {{ questions.length }}
      </span>
    </div>

    <transition name="toast">
      <div v-if="pool.poolExhausted.value" class="pool-toast">
        All pictures completed! Starting over...
      </div>
    </transition>

    <div class="emoji-display">
      <span class="emoji">{{ currentQuestion.emoji }}</span>
    </div>

    <p class="quiz-prompt">What does this represent in Chinese?</p>

    <div class="options-grid">
      <button
        v-for="(opt, i) in currentOptions"
        :key="i"
        class="option-btn text-chinese"
        :class="{
          correct: answered && opt.word === currentQuestion.word,
          wrong: answered && selectedIndex === i && opt.word !== currentQuestion.word
        }"
        :disabled="answered"
        @click="selectAnswer(i)"
      >
        <span class="option-word">{{ opt.word }}</span>
        <span class="option-pinyin" v-if="answered">{{ opt.pinyin }}</span>
      </button>
    </div>

    <div v-if="answered" class="answer-info animate-pop-in">
      <div class="answer-word text-chinese">{{ currentQuestion.word }}</div>
      <div class="answer-pinyin">{{ currentQuestion.pinyin }}</div>
      <div class="answer-english">{{ currentQuestion.english }}</div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { pictureWords } from '../../data/pictureWords'
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

const pool = useInfinitePool(fullPool, 12, computed(() => props.infinite))

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

function loadQuestion() {
  answered.value = false
  selectedIndex.value = -1
  const q = currentQuestion.value
  if (!q) return

  const distractorSource = questions.value.length >= 4 ? questions.value : fullPool.value
  const others = distractorSource.filter(w => w.id !== q.id)
  const distractors = shuffleArray(others).slice(0, 3)
  currentOptions.value = shuffleArray([q, ...distractors])
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

  if (selected.word === currentQuestion.value.word) {
    emit('correct', { word: currentQuestion.value.word })
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
  const source = pictureWords[props.hskLevel] || pictureWords.Beginner
  fullPool.value = source
  if (props.infinite) {
    questions.value = pool.nextBatch()
  } else {
    questions.value = shuffleArray(source).slice(0, Math.min(12, source.length))
  }
  loadQuestion()
})
</script>

<style scoped>
.picture-quiz {
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

.emoji-display {
  margin: 16px 0 20px;
}

.emoji {
  font-size: 5rem;
  line-height: 1.2;
}

.quiz-prompt {
  font-size: 0.95rem;
  color: var(--color-text-secondary);
  margin-bottom: 20px;
}

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
  font-size: 1.2rem;
  font-weight: 700;
  cursor: pointer;
  transition: all var(--transition-fast);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.option-btn:hover:not(:disabled) {
  border-color: var(--color-primary);
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.option-btn:disabled {
  cursor: default;
}

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

.option-word {
  font-size: 1.3rem;
}

.option-pinyin {
  font-size: 0.75rem;
  color: var(--color-text-secondary);
  font-weight: 400;
}

.answer-info {
  padding: 16px;
  background: linear-gradient(135deg, #f0fff4, #e6fffa);
  border-radius: var(--radius-md);
  border: 1px solid var(--color-success-light);
}

.answer-word {
  font-size: 1.6rem;
  font-weight: 700;
  margin-bottom: 4px;
}

.answer-pinyin {
  font-size: 1rem;
  font-family: var(--font-pinyin);
  color: var(--color-primary);
  font-weight: 500;
  margin-bottom: 2px;
}

.answer-english {
  font-size: 0.9rem;
  color: var(--color-text-secondary);
}

@media (max-width: 480px) {
  .emoji {
    font-size: 3.5rem;
  }

  .option-btn {
    padding: 12px 8px;
  }

  .option-word {
    font-size: 1.1rem;
  }
}
</style>
