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
const errorMsg = ref('')
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

let gotResult = false
let silenceTimer = null
let maxTimer = null
let latestTranscript = ''

function clearTimers() {
  if (silenceTimer) { clearTimeout(silenceTimer); silenceTimer = null }
  if (maxTimer) { clearTimeout(maxTimer); maxTimer = null }
}

function processTranscript(transcript, isFinal) {
  if (!transcript || !currentQ.value) return
  const target = currentQ.value.character
  latestTranscript = transcript
  const matched = chineseMatch(transcript, target)
  console.log('[Speaking] process:', transcript, 'target:', target, 'matched:', matched, 'final:', isFinal)

  if (matched) {
    // Immediate correct response — don't wait for final
    gotResult = true
    clearTimers()
    try { recognition.stop() } catch (e) {}
    isListening.value = false
    recognizedText.value = transcript
    feedback.value = 'correct'
    emit('correct', { word: target })
    setTimeout(() => advanceQuestion(), 1200)
  } else if (isFinal) {
    // Final result, no match → wrong
    gotResult = true
    clearTimers()
    recognizedText.value = transcript
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
    console.log('[Speaking] onresult fired, resultIndex:', event.resultIndex, 'length:', event.results.length)
    // Collect best transcript from all results so far
    let finalText = ''
    let interimText = ''
    let isFinal = false
    for (let i = 0; i < event.results.length; i++) {
      const res = event.results[i]
      if (res.isFinal) {
        // Check all alternatives for a match against target
        const target = currentQ.value?.character
        let bestAlt = res[0].transcript
        for (let j = 0; j < res.length; j++) {
          if (target && chineseMatch(res[j].transcript, target)) {
            bestAlt = res[j].transcript
            break
          }
        }
        finalText += bestAlt
        isFinal = true
      } else {
        interimText += res[0].transcript
      }
    }
    const transcript = (finalText || interimText).trim()
    if (!transcript) return

    // Reset silence timer on new speech
    if (silenceTimer) clearTimeout(silenceTimer)
    silenceTimer = setTimeout(() => {
      console.log('[Speaking] silence timeout — force stop')
      try { recognition.stop() } catch (e) {}
    }, 1200)

    processTranscript(transcript, isFinal)
  }

  recognition.onerror = (event) => {
    console.log('[Speaking] onerror:', event.error)
    clearTimers()
    isListening.value = false
    gotResult = true // prevent onend from triggering no-result feedback

    if (event.error === 'no-speech') {
      recognizedText.value = ''
      feedback.value = 'wrong'
      errorMsg.value = t('speaking.noSpeech')
      emit('incorrect')
    } else if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
      recognizedText.value = ''
      feedback.value = 'wrong'
      errorMsg.value = t('speaking.micDenied')
    } else if (event.error !== 'aborted') {
      recognizedText.value = ''
      feedback.value = 'wrong'
      errorMsg.value = `Error: ${event.error}`
      emit('incorrect')
    }
  }

  recognition.onend = () => {
    console.log('[Speaking] onend fired, gotResult=', gotResult, 'latestTranscript:', latestTranscript)
    clearTimers()
    isListening.value = false
    // If we captured interim speech but never got final, process it now
    if (!gotResult && latestTranscript) {
      processTranscript(latestTranscript, true)
      return
    }
    // If recognition ended without any result or error, show feedback
    if (!gotResult) {
      recognizedText.value = ''
      feedback.value = 'wrong'
      errorMsg.value = t('speaking.noSpeech')
      emit('incorrect')
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
    clearTimers()
    try { recognition.stop() } catch (e) {}
    isListening.value = false
  } else {
    recognizedText.value = ''
    feedback.value = ''
    errorMsg.value = ''
    gotResult = false
    latestTranscript = ''
    clearTimers()
    isListening.value = true
    try {
      recognition.start()
      console.log('[Speaking] recognition.start() called, target:', currentQ.value?.character)
      // Safety net: max 6 seconds of listening
      maxTimer = setTimeout(() => {
        console.log('[Speaking] max listening time — force stop')
        try { recognition.stop() } catch (e) {}
      }, 6000)
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
  errorMsg.value = ''
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
.skip-btn {
  align-self: center; margin-top: 4px;
  padding: 8px 20px; border-radius: 20px; font-size: 0.85rem; font-weight: 600;
  background: var(--color-primary); color: white; transition: all var(--transition-fast);
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
