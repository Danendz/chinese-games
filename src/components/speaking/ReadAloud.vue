<template>
  <div class="speaking-game">
    <!-- Browser not supported -->
    <div v-if="!supported" class="not-supported">
      <span class="ns-icon">🎙️</span>
      <p class="ns-title">{{ t('speaking.notSupported') }}</p>
      <p class="ns-desc">{{ t('speaking.useChrome') }}</p>
    </div>

    <template v-else-if="currentQ">
      <div class="progress-bar">
        <div class="progress-fill" :style="{ width: progressPercent + '%' }"></div>
        <span class="progress-text">{{ currentIndex + 1 }} / {{ questions.length }}</span>
      </div>

      <!-- Listen first -->
      <div class="listen-section">
        <button class="listen-btn" @click="playWord" :disabled="isListening">
          🔊 {{ t('speaking.listenFirst') }}
        </button>
      </div>

      <!-- Character display -->
      <div class="char-display">
        <div class="char-main text-chinese">{{ currentQ.character }}</div>
        <div class="char-pinyin text-pinyin">{{ currentQ.pinyin }}</div>
        <div class="char-meaning">{{ tr(currentQ) }}</div>
      </div>

      <!-- Speak button -->
      <div class="speak-section">
        <button
          class="speak-btn"
          :class="{ recording: isListening, correct: feedback === 'correct', wrong: feedback === 'wrong' }"
          @click="toggleListening"
          :disabled="feedback !== ''"
        >
          <span class="speak-icon">{{ isListening ? '⏹️' : '🎙️' }}</span>
          <span class="speak-label">{{ isListening ? t('speaking.listening') : t('speaking.tapToSpeak') }}</span>
        </button>
        <p v-if="isListening" class="listening-hint animate-pulse">{{ t('speaking.speakNow') }}</p>
      </div>

      <!-- Result display -->
      <div v-if="recognizedText" class="recognized">
        <span class="rec-label">{{ t('speaking.youSaid') }}:</span>
        <span class="rec-text text-chinese">{{ recognizedText }}</span>
      </div>

      <!-- Feedback -->
      <div v-if="feedback === 'correct'" class="feedback correct-fb animate-pop-in">
        <span class="fb-icon">✅</span> {{ t('game.correct') }}
      </div>
      <div v-if="feedback === 'wrong'" class="feedback wrong-fb animate-pop-in">
        <span class="fb-icon">❌</span> {{ t('speaking.tryAgainOrSkip') }}
        <button class="skip-btn" @click="skipToNext">{{ t('speaking.skip') }} →</button>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { vocabulary } from '../../data/vocabulary'
import { getMyVocabulary } from '../../data/myWordsStore'
import { useI18n } from '../../composables/useI18n'

const { t, tr } = useI18n()

const props = defineProps({
  hskLevel: { type: String, default: 'Beginner' }
})

const emit = defineEmits(['correct', 'incorrect', 'gameStart', 'gameComplete'])

const supported = ref(false)
const questions = ref([])
const currentIndex = ref(0)
const isListening = ref(false)
const recognizedText = ref('')
const feedback = ref('')
const gameStarted = ref(false)
let recognition = null

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

function playWord() {
  if (!currentQ.value) return
  const utterance = new SpeechSynthesisUtterance(currentQ.value.character)
  utterance.lang = 'zh-CN'
  utterance.rate = 0.75
  window.speechSynthesis.cancel()
  window.speechSynthesis.speak(utterance)
}

function initRecognition() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
  if (!SpeechRecognition) {
    supported.value = false
    return
  }
  supported.value = true
  recognition = new SpeechRecognition()
  recognition.lang = 'zh-CN'
  recognition.interimResults = false
  recognition.maxAlternatives = 3
  recognition.continuous = false

  recognition.onresult = (event) => {
    isListening.value = false
    const results = event.results[0]
    // Check all alternatives
    let matched = false
    const target = currentQ.value.character
    for (let i = 0; i < results.length; i++) {
      const transcript = results[i].transcript.trim()
      if (transcript.includes(target) || target.includes(transcript)) {
        matched = true
        recognizedText.value = transcript
        break
      }
    }
    if (!matched) {
      recognizedText.value = results[0].transcript.trim()
    }

    if (matched) {
      feedback.value = 'correct'
      emit('correct', { word: target })
      setTimeout(() => advanceQuestion(), 1500)
    } else {
      feedback.value = 'wrong'
      emit('incorrect')
    }
  }

  recognition.onerror = (event) => {
    isListening.value = false
    if (event.error !== 'no-speech' && event.error !== 'aborted') {
      recognizedText.value = '...'
      feedback.value = 'wrong'
      emit('incorrect')
    }
  }

  recognition.onend = () => {
    isListening.value = false
  }
}

function toggleListening() {
  if (!recognition) return
  if (!gameStarted.value) {
    gameStarted.value = true
    emit('gameStart')
  }

  if (isListening.value) {
    recognition.stop()
    isListening.value = false
  } else {
    recognizedText.value = ''
    feedback.value = ''
    isListening.value = true
    recognition.start()
  }
}

function advanceQuestion() {
  if (currentIndex.value < questions.value.length - 1) {
    currentIndex.value++
    recognizedText.value = ''
    feedback.value = ''
  } else {
    emit('gameComplete')
  }
}

function skipToNext() {
  feedback.value = ''
  recognizedText.value = ''
  advanceQuestion()
}

onMounted(() => {
  initRecognition()
  const source = props.hskLevel === 'MyWords'
    ? getMyVocabulary()
    : (vocabulary[props.hskLevel] || vocabulary.Beginner)
  questions.value = shuffleArray(source).slice(0, Math.min(10, source.length))
})

onUnmounted(() => {
  if (recognition) recognition.abort()
  window.speechSynthesis.cancel()
})
</script>

<style scoped>
.speaking-game { max-width: 500px; margin: 0 auto; text-align: center; }

/* Not supported */
.not-supported { padding: 40px 20px; }
.ns-icon { font-size: 3rem; display: block; margin-bottom: 16px; }
.ns-title { font-size: 1.2rem; font-weight: 700; color: var(--color-text); margin-bottom: 8px; }
.ns-desc { font-size: 0.9rem; color: var(--color-text-secondary); }

/* Progress */
.progress-bar { position: relative; height: 6px; background: var(--color-bg-secondary); border-radius: 3px; margin-bottom: 24px; overflow: hidden; }
.progress-fill { height: 100%; background: var(--color-primary); border-radius: 3px; transition: width var(--transition-medium); }
.progress-text { position: absolute; right: 0; top: 12px; font-size: 0.8rem; color: var(--color-text-secondary); }

/* Listen */
.listen-section { margin-bottom: 16px; }
.listen-btn {
  padding: 10px 24px; border-radius: 20px; font-size: 0.9rem; font-weight: 600;
  background: var(--color-bg-secondary); color: var(--color-text); transition: all var(--transition-fast);
}
.listen-btn:hover:not(:disabled) { background: var(--color-border); }

/* Character display */
.char-display {
  padding: 24px; margin-bottom: 24px;
  background: var(--color-surface); border: 2px solid var(--color-border); border-radius: var(--radius-lg);
}
.char-main { font-size: 3.5rem; font-weight: 700; line-height: 1.2; margin-bottom: 8px; }
.char-pinyin { font-size: 1.1rem; color: var(--color-primary); font-weight: 500; margin-bottom: 4px; }
.char-meaning { font-size: 0.95rem; color: var(--color-text-secondary); }

/* Speak button */
.speak-section { margin-bottom: 20px; }
.speak-btn {
  display: inline-flex; flex-direction: column; align-items: center; gap: 8px;
  padding: 20px 40px; border-radius: var(--radius-xl);
  background: linear-gradient(135deg, var(--color-primary-light), var(--color-primary));
  color: white; font-weight: 600; transition: all var(--transition-fast);
  box-shadow: var(--shadow-md);
}
.speak-btn:hover:not(:disabled) { transform: scale(1.05); box-shadow: var(--shadow-lg); }
.speak-btn.recording {
  background: linear-gradient(135deg, #d63031, #e17055);
  animation: pulse-ring 1.5s ease infinite;
}
.speak-btn.correct { background: var(--color-success); }
.speak-btn.wrong { background: var(--color-error); }
.speak-btn:disabled { opacity: 0.7; }
.speak-icon { font-size: 2rem; }
.speak-label { font-size: 0.85rem; }

@keyframes pulse-ring {
  0%, 100% { box-shadow: 0 0 0 0 rgba(214, 48, 49, 0.4); }
  50% { box-shadow: 0 0 0 15px rgba(214, 48, 49, 0); }
}

.listening-hint { font-size: 0.85rem; color: var(--color-primary); margin-top: 8px; }

/* Recognized text */
.recognized {
  padding: 12px; background: var(--color-bg-secondary); border-radius: var(--radius-md);
  margin-bottom: 16px;
}
.rec-label { font-size: 0.8rem; color: var(--color-text-light); }
.rec-text { font-size: 1.3rem; font-weight: 700; display: block; margin-top: 4px; }

/* Feedback */
.feedback { padding: 16px; border-radius: var(--radius-md); }
.correct-fb { background: linear-gradient(135deg, #f0fff4, #e6fffa); border: 1px solid var(--color-success-light); }
.wrong-fb { background: linear-gradient(135deg, #fff5f5, #ffe0e0); border: 1px solid var(--color-error-light); display: flex; flex-direction: column; align-items: center; gap: 8px; }
.fb-icon { font-size: 1.3rem; }
.skip-btn {
  padding: 6px 16px; border-radius: 20px; font-size: 0.8rem; font-weight: 600;
  background: var(--color-bg-secondary); color: var(--color-text-secondary); transition: all var(--transition-fast);
}
.skip-btn:hover { background: var(--color-border); }

@keyframes animate-pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}
.animate-pulse { animation: animate-pulse 1.5s ease infinite; }

@media (max-width: 480px) {
  .char-main { font-size: 2.5rem; }
  .speak-btn { padding: 16px 32px; }
}
</style>
