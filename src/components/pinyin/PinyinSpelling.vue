<template>
  <div class="pinyin-game" v-if="currentQ">
    <div class="progress-bar">
      <div class="progress-fill" :style="{ width: progressPercent + '%' }"></div>
      <span class="progress-text">{{ currentIndex + 1 }} / {{ questions.length }}</span>
    </div>

    <!-- Question display -->
    <div class="question-area">
      <template v-if="currentQ.type === 'full'">
        <div class="q-char text-chinese">{{ currentQ.character }}</div>
        <div class="q-hint">{{ tr(currentQ) }}</div>
        <p class="q-prompt">{{ t('pinyin.typeFullPinyin') }}</p>
      </template>
      <template v-else-if="currentQ.type === 'initial'">
        <div class="q-partial text-pinyin">
          <span class="q-blank">___</span><span>{{ currentQ.character.replace('___', '') }}</span>
        </div>
        <div class="q-hint">{{ currentQ.hint }} = {{ tr(currentQ) }}</div>
        <p class="q-prompt">{{ t('pinyin.typeInitial') }}</p>
      </template>
      <template v-else-if="currentQ.type === 'final'">
        <div class="q-partial text-pinyin">
          <span>{{ currentQ.character.replace('___', '') }}</span><span class="q-blank">___</span>
        </div>
        <div class="q-hint">{{ currentQ.hint }} = {{ tr(currentQ) }}</div>
        <p class="q-prompt">{{ t('pinyin.typeFinal') }}</p>
      </template>
    </div>

    <!-- Input -->
    <div class="input-area">
      <input
        ref="inputRef"
        v-model="userInput"
        class="pinyin-input text-pinyin"
        :class="{ correct: feedback === 'correct', wrong: feedback === 'wrong' }"
        :placeholder="t('pinyin.placeholder')"
        @keyup.enter="checkAnswer"
        :disabled="feedback !== ''"
        autocomplete="off"
        autocapitalize="off"
      />
      <button class="check-btn" @click="checkAnswer" :disabled="!userInput.trim() || feedback !== ''">
        {{ t('pinyin.check') }}
      </button>
    </div>

    <!-- Tone helper buttons -->
    <div class="tone-helper">
      <span class="tone-label">{{ t('pinyin.toneHelp') }}:</span>
      <button v-for="ch in toneChars" :key="ch" class="tone-char-btn" @click="insertChar(ch)">{{ ch }}</button>
    </div>

    <!-- Feedback -->
    <div v-if="feedback === 'correct'" class="feedback correct-fb animate-pop-in">
      <span class="fb-icon">✅</span>
      <span class="fb-text">{{ t('game.correct') }}</span>
      <span class="fb-answer text-pinyin">{{ currentQ.answer }}</span>
    </div>
    <div v-if="feedback === 'wrong'" class="feedback wrong-fb animate-pop-in">
      <span class="fb-icon">❌</span>
      <span class="fb-text">{{ t('pinyin.wrong') }}</span>
      <div class="fb-compare">
        <span>{{ t('pinyin.yourAnswer') }}: <strong class="text-pinyin">{{ userInput }}</strong></span>
        <span>{{ t('pinyin.correctAnswer') }}: <strong class="text-pinyin correct-text">{{ currentQ.answer }}</strong></span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import { pinyinExercises } from '../../data/pinyinExercises'
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

const toneChars = ['ā','á','ǎ','à','ē','é','ě','è','ī','í','ǐ','ì','ō','ó','ǒ','ò','ū','ú','ǔ','ù','ǖ','ǘ','ǚ','ǜ']

function shuffleArray(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function insertChar(ch) {
  userInput.value += ch
  nextTick(() => inputRef.value?.focus())
}

function normalize(s) {
  return s.trim().toLowerCase().replace(/\s+/g, ' ')
}

function checkAnswer() {
  if (!userInput.value.trim() || feedback.value) return
  if (!gameStarted.value) {
    gameStarted.value = true
    emit('gameStart')
  }

  const correct = normalize(currentQ.value.answer)
  const user = normalize(userInput.value)

  if (user === correct) {
    feedback.value = 'correct'
    emit('correct', { word: currentQ.value.character })
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
  const source = pinyinExercises[props.hskLevel] || pinyinExercises.Beginner
  questions.value = shuffleArray(source).slice(0, Math.min(15, source.length))
  nextTick(() => inputRef.value?.focus())
})
</script>

<style scoped>
.pinyin-game { max-width: 500px; margin: 0 auto; text-align: center; }

.progress-bar { position: relative; height: 6px; background: var(--color-bg-secondary); border-radius: 3px; margin-bottom: 28px; overflow: hidden; }
.progress-fill { height: 100%; background: var(--color-primary); border-radius: 3px; transition: width var(--transition-medium); }
.progress-text { position: absolute; right: 0; top: 12px; font-size: 0.8rem; color: var(--color-text-secondary); }

.question-area {
  padding: 24px; margin-bottom: 20px;
  background: var(--color-surface); border: 2px solid var(--color-border);
  border-radius: var(--radius-lg);
}
.q-char { font-size: 3.5rem; font-weight: 700; line-height: 1.2; margin-bottom: 8px; }
.q-partial { font-size: 2rem; font-weight: 600; margin-bottom: 8px; }
.q-blank { color: var(--color-primary); border-bottom: 3px dashed var(--color-primary); padding: 0 4px; }
.q-hint { font-size: 0.95rem; color: var(--color-text-secondary); margin-bottom: 8px; }
.q-prompt { font-size: 0.85rem; color: var(--color-text-light); }

.input-area { display: flex; gap: 8px; margin-bottom: 12px; }
.pinyin-input {
  flex: 1; padding: 12px 16px; border: 2px solid var(--color-border);
  border-radius: var(--radius-md); font-size: 1.2rem; text-align: center;
  transition: all var(--transition-fast); background: var(--color-surface);
  color: var(--color-text);
}
.pinyin-input:focus { outline: none; border-color: var(--color-primary); }
.pinyin-input.correct { border-color: var(--color-success); background: rgba(0, 184, 148, 0.05); }
.pinyin-input.wrong { border-color: var(--color-error); background: rgba(214, 48, 49, 0.05); animation: shake 0.5s ease; }

.check-btn {
  padding: 12px 20px; background: var(--color-primary); color: white;
  border-radius: var(--radius-md); font-weight: 600; font-size: 0.95rem;
  transition: all var(--transition-fast);
}
.check-btn:hover:not(:disabled) { background: var(--color-primary-dark); }
.check-btn:disabled { opacity: 0.5; }

.tone-helper {
  display: flex; flex-wrap: wrap; gap: 6px; justify-content: center;
  margin-bottom: 20px; align-items: center;
}
.tone-label { font-size: 0.75rem; color: var(--color-text-light); margin-right: 6px; width: 100%; text-align: center; margin-bottom: 2px; }
.tone-char-btn {
  width: 36px; height: 36px; border-radius: var(--radius-sm);
  font-size: 1.05rem; background: var(--color-bg-secondary); color: var(--color-text);
  display: flex; align-items: center; justify-content: center;
  transition: all var(--transition-fast); font-family: var(--font-pinyin);
}
.tone-char-btn:hover { background: var(--color-primary); color: white; }
.tone-char-btn:active { transform: scale(0.9); }

.feedback {
  padding: 16px; border-radius: var(--radius-md); margin-top: 12px;
}
.correct-fb { background: linear-gradient(135deg, #f0fff4, #e6fffa); border: 1px solid var(--color-success-light); }
.wrong-fb { background: linear-gradient(135deg, #fff5f5, #ffe0e0); border: 1px solid var(--color-error-light); }
.fb-icon { font-size: 1.5rem; margin-right: 8px; }
.fb-text { font-size: 1.1rem; font-weight: 600; }
.fb-answer { display: block; font-size: 1.3rem; font-weight: 700; margin-top: 4px; color: var(--color-success); }
.fb-compare { display: flex; flex-direction: column; gap: 4px; margin-top: 8px; font-size: 0.9rem; }
.correct-text { color: var(--color-success); }

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  20% { transform: translateX(-5px); }
  40% { transform: translateX(5px); }
  60% { transform: translateX(-3px); }
  80% { transform: translateX(3px); }
}

@media (max-width: 480px) {
  .q-char { font-size: 2.5rem; }
  .pinyin-input { font-size: 1rem; }
  .tone-char-btn { width: 32px; height: 32px; font-size: 0.95rem; }
}
</style>
