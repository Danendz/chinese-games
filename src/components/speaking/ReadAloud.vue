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
          <span class="speak-label">
            {{ isListening ? t('speaking.tapToStop') : t('speaking.tapToSpeak') }}
          </span>
        </button>
        <p v-if="isListening" class="listening-hint animate-pulse">
          {{ interimText || t('speaking.speakNow') }}
        </p>
      </div>

      <!-- Feedback: correct -->
      <div v-if="feedback === 'correct'" class="feedback correct-fb animate-pop-in">
        <div class="fb-header">
          <span class="fb-icon">✅</span>
          <span class="fb-title">{{ t('game.correct') }}</span>
        </div>
        <div class="fb-row">
          <span class="fb-label">{{ t('speaking.youSaid') }}:</span>
          <span class="fb-value text-chinese correct-text">{{ recognizedText }}</span>
        </div>
      </div>

      <!-- Feedback: wrong -->
      <div v-if="feedback === 'wrong'" class="feedback wrong-fb animate-pop-in">
        <div class="fb-header">
          <span class="fb-icon">❌</span>
          <span class="fb-title">{{ errorMsg || t('speaking.tryAgainOrSkip') }}</span>
        </div>
        <div v-if="recognizedText" class="fb-row">
          <span class="fb-label">{{ t('speaking.youSaid') }}:</span>
          <span class="fb-value text-chinese wrong-text">{{ recognizedText }}</span>
        </div>
        <div class="fb-row">
          <span class="fb-label">{{ t('speaking.correctIs') }}:</span>
          <span class="fb-value text-chinese correct-text">{{ currentQ.character }}</span>
        </div>
        <div class="fb-actions">
          <button class="retry-btn" @click="retryQuestion">🔄 {{ t('speaking.retry') }}</button>
          <button class="skip-btn" @click="skipToNext">{{ t('speaking.skip') }} →</button>
        </div>
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
const interimText = ref('')
const feedback = ref('')
const errorMsg = ref('')
const gameStarted = ref(false)
let recognition = null
let finalized = false

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

// Normalize Chinese text for comparison (remove punctuation & spaces)
function normalizeChinese(s) {
  if (!s) return ''
  return s.replace(/[\s，。？！、.?!,]/g, '').trim()
}

// Check if two Chinese strings match (loose comparison)
function chineseMatch(spoken, target) {
  const a = normalizeChinese(spoken)
  const b = normalizeChinese(target)
  if (!a || !b) return false
  if (a === b) return true
  // Also accept if spoken contains target or vice versa (for longer utterances)
  if (a.includes(b) || b.includes(a)) return true
  return false
}

let maxTimer = null

function clearTimers() {
  if (maxTimer) { clearTimeout(maxTimer); maxTimer = null }
}

// Finalize the attempt with whatever we heard. Called from onresult(final),
// onend, manual stop, or timeout. Guarded by `finalized` so it only runs once.
function finalize(transcript) {
  if (finalized) return
  finalized = true
  clearTimers()
  isListening.value = false

  const clean = (transcript || '').trim()
  if (!clean) {
    recognizedText.value = ''
    feedback.value = 'wrong'
    errorMsg.value = t('speaking.noSpeech')
    emit('incorrect')
    return
  }

  const target = currentQ.value?.character
  const matched = target && chineseMatch(clean, target)
  recognizedText.value = clean
  console.log('[Speaking] finalize:', clean, 'target:', target, 'matched:', matched)

  if (matched) {
    feedback.value = 'correct'
    emit('correct', { word: target })
    setTimeout(() => advanceQuestion(), 1500)
  } else {
    feedback.value = 'wrong'
    emit('incorrect')
  }
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
  recognition.interimResults = true
  recognition.maxAlternatives = 5
  recognition.continuous = false

  recognition.onresult = (event) => {
    // Build interim and final strings from all results
    let finalText = ''
    let interim = ''
    for (let i = 0; i < event.results.length; i++) {
      const res = event.results[i]
      if (res.isFinal) {
        // Pick the alternative that matches best, else the top
        const target = currentQ.value?.character
        let bestAlt = res[0].transcript
        for (let j = 0; j < res.length; j++) {
          if (target && chineseMatch(res[j].transcript, target)) {
            bestAlt = res[j].transcript
            break
          }
        }
        finalText += bestAlt
      } else {
        interim += res[0].transcript
      }
    }
    interimText.value = (finalText || interim).trim()
    console.log('[Speaking] onresult interim:', interim, 'final:', finalText)

    // If we got a final result, finalize immediately
    if (finalText) {
      finalize(finalText)
      try { recognition.stop() } catch (e) {}
    }
  }

  recognition.onerror = (event) => {
    console.log('[Speaking] onerror:', event.error)
    clearTimers()
    isListening.value = false

    if (event.error === 'aborted') return
    if (finalized) return
    finalized = true

    if (event.error === 'no-speech') {
      recognizedText.value = ''
      feedback.value = 'wrong'
      errorMsg.value = t('speaking.noSpeech')
      emit('incorrect')
    } else if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
      recognizedText.value = ''
      feedback.value = 'wrong'
      errorMsg.value = t('speaking.micDenied')
    } else {
      recognizedText.value = ''
      feedback.value = 'wrong'
      errorMsg.value = `Error: ${event.error}`
      emit('incorrect')
    }
  }

  recognition.onend = () => {
    console.log('[Speaking] onend fired, finalized=', finalized, 'interim:', interimText.value)
    clearTimers()
    isListening.value = false
    // If we never finalized but captured interim text, finalize with it
    if (!finalized) {
      if (interimText.value) {
        finalize(interimText.value)
      } else {
        finalized = true
        recognizedText.value = ''
        feedback.value = 'wrong'
        errorMsg.value = t('speaking.noSpeech')
        emit('incorrect')
      }
    }
  }
}

function toggleListening() {
  if (!recognition) return
  if (!gameStarted.value) {
    gameStarted.value = true
    emit('gameStart')
  }

  if (isListening.value) {
    // Manual stop — finalize immediately with whatever interim text we have
    console.log('[Speaking] manual stop, interim:', interimText.value)
    clearTimers()
    try { recognition.stop() } catch (e) {}
    isListening.value = false
    if (interimText.value) {
      finalize(interimText.value)
    }
    // If no interim yet, onend will eventually run and show no-speech
  } else {
    recognizedText.value = ''
    interimText.value = ''
    feedback.value = ''
    errorMsg.value = ''
    finalized = false
    clearTimers()
    isListening.value = true
    try {
      recognition.start()
      console.log('[Speaking] recognition.start() called, target:', currentQ.value?.character)
      // Safety net: max 8 seconds of listening, then auto-finalize
      maxTimer = setTimeout(() => {
        console.log('[Speaking] max listening time — force stop')
        try { recognition.stop() } catch (e) {}
        // Give onend a moment; if it doesn't fire, finalize manually
        setTimeout(() => {
          if (!finalized) finalize(interimText.value)
        }, 500)
      }, 8000)
    } catch (e) {
      console.error('[Speaking] start error:', e)
      isListening.value = false
      errorMsg.value = 'Could not start recognition: ' + e.message
    }
  }
}

function advanceQuestion() {
  if (currentIndex.value < questions.value.length - 1) {
    currentIndex.value++
    recognizedText.value = ''
    feedback.value = ''
    errorMsg.value = ''
  } else {
    emit('gameComplete')
  }
}

function skipToNext() {
  feedback.value = ''
  recognizedText.value = ''
  interimText.value = ''
  errorMsg.value = ''
  advanceQuestion()
}

function retryQuestion() {
  // Clear feedback on the current question so user can try again
  feedback.value = ''
  recognizedText.value = ''
  interimText.value = ''
  errorMsg.value = ''
  finalized = false
}

onMounted(() => {
  initRecognition()
  const source = props.hskLevel === 'MyWords'
    ? getMyVocabulary()
    : (vocabulary[props.hskLevel] || vocabulary.Beginner)
  questions.value = shuffleArray(source).slice(0, Math.min(10, source.length))
})

onUnmounted(() => {
  clearTimers()
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

/* Feedback */
.feedback { padding: 18px; border-radius: var(--radius-md); display: flex; flex-direction: column; gap: 10px; }
.correct-fb {
  background: linear-gradient(135deg, rgba(0, 184, 148, 0.12), rgba(0, 206, 201, 0.08));
  border: 2px solid var(--color-success);
}
.wrong-fb {
  background: linear-gradient(135deg, rgba(214, 48, 49, 0.08), rgba(225, 112, 85, 0.08));
  border: 2px solid var(--color-error);
}
.fb-header {
  display: flex; align-items: center; gap: 10px; justify-content: center;
  padding-bottom: 8px; border-bottom: 1px solid var(--color-border);
}
.fb-icon { font-size: 1.6rem; }
.fb-title { font-size: 1.05rem; font-weight: 700; color: var(--color-text); }
.fb-row {
  display: flex; align-items: center; justify-content: space-between; gap: 12px;
  padding: 4px 0;
}
.fb-label { font-size: 0.85rem; color: var(--color-text-secondary); font-weight: 500; }
.fb-value { font-size: 1.4rem; font-weight: 700; }
.correct-text { color: var(--color-success); }
.wrong-text { color: var(--color-error); text-decoration: line-through; opacity: 0.7; }
.fb-actions {
  display: flex; gap: 10px; justify-content: center; margin-top: 6px;
}
.retry-btn, .skip-btn {
  padding: 8px 18px; border-radius: 20px; font-size: 0.85rem; font-weight: 600;
  transition: all var(--transition-fast);
}
.retry-btn {
  background: var(--color-bg-secondary); color: var(--color-text);
  border: 1px solid var(--color-border);
}
.retry-btn:hover { background: var(--color-border); }
.skip-btn {
  background: var(--color-primary); color: white;
}
.skip-btn:hover { background: var(--color-primary-dark); }

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
