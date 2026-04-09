<template>
  <div class="typing-game" v-if="currentQ">
    <div class="progress-bar">
      <div class="progress-fill" :style="{ width: progressPercent + '%' }"></div>
      <span class="progress-text">{{ currentIndex + 1 }} / {{ questions.length }}</span>
    </div>

    <!-- Question: show translation + pinyin, user types Chinese -->
    <div class="question-area">
      <div class="q-translation">{{ tr(currentQ) }}</div>
      <div class="q-pinyin text-pinyin">{{ currentQ.pinyin }}</div>
      <p class="q-prompt">{{ t('typing.prompt') }}</p>
    </div>

    <!-- Input -->
    <div class="input-area">
      <input
        ref="inputRef"
        v-model="userInput"
        class="typing-input text-chinese"
        :class="{ correct: feedback === 'correct', wrong: feedback === 'wrong' }"
        :placeholder="t('typing.placeholder')"
        @keyup.enter="checkAnswer"
        :disabled="feedback !== ''"
        autocomplete="off"
      />
      <button class="check-btn" @click="checkAnswer" :disabled="!userInput.trim() || feedback !== ''">
        {{ t('pinyin.check') }}
      </button>
    </div>

    <!-- Feedback -->
    <div v-if="feedback === 'correct'" class="feedback correct-fb animate-pop-in">
      <span class="fb-icon">✅</span>
      <span class="fb-text">{{ t('game.correct') }}</span>
      <span class="fb-char text-chinese">{{ currentQ.character }}</span>
    </div>
    <div v-if="feedback === 'wrong'" class="feedback wrong-fb animate-pop-in">
      <span class="fb-icon">❌</span>
      <div class="fb-compare">
        <span>{{ t('pinyin.yourAnswer') }}: <strong class="text-chinese">{{ userInput }}</strong></span>
        <span>{{ t('pinyin.correctAnswer') }}: <strong class="text-chinese correct-text">{{ currentQ.character }}</strong></span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import { vocabulary } from '../../data/vocabulary'
import { getMyVocabulary } from '../../data/myWordsStore'
import { useI18n } from '../../composables/useI18n'

const { t, tr } = useI18n()

const props = defineProps({
  hskLevel: { type: String, default: 'Beginner' }
})

const emit = defineEmits(['correct', 'incorrect', 'gameStart', 'gameComplete'])

const questions = ref([])
const currentIndex = ref(0)
const userInput = ref('')
const feedback = ref('')
const inputRef = ref(null)
const gameStarted = ref(false)

const currentQ = computed(() => questions.value[currentIndex.value])
const progressPercent = computed(() => (currentIndex.value / questions.value.length) * 100)

function shuffleArray(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function checkAnswer() {
  if (!userInput.value.trim() || feedback.value) return
  if (!gameStarted.value) {
    gameStarted.value = true
    emit('gameStart')
  }

  const correct = currentQ.value.character.trim()
  const user = userInput.value.trim()

  if (user === correct) {
    feedback.value = 'correct'
    emit('correct', { word: correct })
  } else {
    feedback.value = 'wrong'
    emit('incorrect')
  }

  setTimeout(() => {
    if (currentIndex.value < questions.value.length - 1) {
      currentIndex.value++
      userInput.value = ''
      feedback.value = ''
      nextTick(() => inputRef.value?.focus())
    } else {
      emit('gameComplete')
    }
  }, 2000)
}

onMounted(() => {
  const source = props.hskLevel === 'MyWords'
    ? getMyVocabulary()
    : (vocabulary[props.hskLevel] || vocabulary.Beginner)
  questions.value = shuffleArray(source).slice(0, Math.min(12, source.length))
  nextTick(() => inputRef.value?.focus())
})
</script>

<style scoped>
.typing-game { max-width: 500px; margin: 0 auto; text-align: center; }

.progress-bar { position: relative; height: 6px; background: var(--color-bg-secondary); border-radius: 3px; margin-bottom: 28px; overflow: hidden; }
.progress-fill { height: 100%; background: var(--color-primary); border-radius: 3px; transition: width var(--transition-medium); }
.progress-text { position: absolute; right: 0; top: 12px; font-size: 0.8rem; color: var(--color-text-secondary); }

.question-area {
  padding: 24px; margin-bottom: 20px;
  background: var(--color-surface); border: 2px solid var(--color-border);
  border-radius: var(--radius-lg);
}
.q-translation { font-size: 1.4rem; font-weight: 600; color: var(--color-text); margin-bottom: 8px; }
.q-pinyin { font-size: 1.1rem; color: var(--color-primary); font-weight: 500; margin-bottom: 12px; }
.q-prompt { font-size: 0.85rem; color: var(--color-text-light); }

.input-area { display: flex; gap: 8px; margin-bottom: 16px; }
.typing-input {
  flex: 1; padding: 14px 16px; border: 2px solid var(--color-border);
  border-radius: var(--radius-md); font-size: 1.5rem; text-align: center;
  transition: all var(--transition-fast); background: var(--color-surface);
  color: var(--color-text);
}
.typing-input:focus { outline: none; border-color: var(--color-primary); }
.typing-input.correct { border-color: var(--color-success); background: rgba(0, 184, 148, 0.05); }
.typing-input.wrong { border-color: var(--color-error); background: rgba(214, 48, 49, 0.05); animation: shake 0.5s ease; }

.check-btn {
  padding: 14px 20px; background: var(--color-primary); color: white;
  border-radius: var(--radius-md); font-weight: 600; font-size: 0.95rem;
  transition: all var(--transition-fast);
}
.check-btn:hover:not(:disabled) { background: var(--color-primary-dark); }
.check-btn:disabled { opacity: 0.5; }

.feedback { padding: 16px; border-radius: var(--radius-md); margin-top: 12px; }
.correct-fb { background: linear-gradient(135deg, #f0fff4, #e6fffa); border: 1px solid var(--color-success-light); }
.wrong-fb { background: linear-gradient(135deg, #fff5f5, #ffe0e0); border: 1px solid var(--color-error-light); }
.fb-icon { font-size: 1.5rem; margin-right: 8px; }
.fb-text { font-size: 1.1rem; font-weight: 600; }
.fb-char { display: block; font-size: 2rem; font-weight: 700; margin-top: 4px; color: var(--color-success); }
.fb-compare { display: flex; flex-direction: column; gap: 4px; font-size: 0.9rem; }
.correct-text { color: var(--color-success); }

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  20% { transform: translateX(-5px); }
  40% { transform: translateX(5px); }
  60% { transform: translateX(-3px); }
  80% { transform: translateX(3px); }
}
</style>
