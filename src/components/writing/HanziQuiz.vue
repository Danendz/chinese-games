<template>
  <div class="hanzi-quiz">
    <template v-if="currentQ">
      <div class="progress-bar">
        <div class="progress-fill" :style="{ width: progressPercent + '%' }"></div>
        <span class="progress-text">{{ currentIndex + 1 }} / {{ questions.length }}</span>
      </div>

      <!-- Word info -->
      <div class="word-info">
        <div class="word-pinyin text-pinyin">{{ currentQ.pinyin }}</div>
        <div class="word-meaning">{{ tr(currentQ) }}</div>
        <div v-if="currentQ.character.length > 1" class="char-progress">
          {{ t('hanzi.character') }} {{ currentCharIndex + 1 }} / {{ currentQ.character.length }}
        </div>
      </div>

      <!-- Writing canvas + hint character -->
      <div class="writing-area">
        <div ref="writerEl" class="writer-container"></div>
      </div>

      <!-- Action buttons -->
      <div class="actions">
        <button class="btn-ghost" @click="showHint" :disabled="!writer || finished">
          💡 {{ t('hanzi.hint') }}
        </button>
        <button class="btn-ghost" @click="animateCharacter" :disabled="!writer || finished">
          ▶️ {{ t('hanzi.showMe') }}
        </button>
        <button class="btn-ghost" @click="resetCurrentCharacter" :disabled="!writer || finished">
          🔄 {{ t('hanzi.restart') }}
        </button>
        <button class="btn-primary" @click="skipToNext">
          {{ t('hanzi.skip') }} →
        </button>
      </div>

      <!-- Feedback -->
      <div v-if="feedback === 'complete'" class="feedback animate-pop-in">
        <span class="fb-icon">🎉</span>
        <span class="fb-text">{{ t('hanzi.wellWritten') }}</span>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick, watch } from 'vue'
import HanziWriter from 'hanzi-writer'
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
const currentCharIndex = ref(0)
const feedback = ref('')
const gameStarted = ref(false)
const finished = ref(false)
const writerEl = ref(null)
let writer = null
let hintShown = false

const currentQ = computed(() => questions.value[currentIndex.value])
const currentChar = computed(() => currentQ.value?.character[currentCharIndex.value] || '')
const progressPercent = computed(() => (currentIndex.value / questions.value.length) * 100)

function shuffleArray(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

// Filter: HanziWriter can only render single CJK characters,
// and skip entries with non-CJK (e.g. 二维码, English letters)
function isCJK(ch) {
  const code = ch.charCodeAt(0)
  return code >= 0x4e00 && code <= 0x9fff
}

function isValidForWriting(entry) {
  return entry.character && [...entry.character].every(isCJK)
}

function createWriter(char) {
  if (!writerEl.value) return
  // Clean up previous writer
  writerEl.value.innerHTML = ''
  writer = null
  hintShown = false

  try {
    writer = HanziWriter.create(writerEl.value, char, {
      width: 280,
      height: 280,
      padding: 12,
      showOutline: true,
      showCharacter: false,
      strokeColor: '#e63946',
      radicalColor: '#e63946',
      highlightColor: '#00b894',
      outlineColor: '#d0d0d0',
      drawingColor: '#e63946',
      drawingWidth: 22,
      strokeAnimationSpeed: 1.2,
    })
    // Quiz mode: user traces character stroke by stroke
    writer.quiz({
      onComplete: () => {
        if (!gameStarted.value) {
          gameStarted.value = true
          emit('gameStart')
        }
        // Move to next character in word, or next word
        if (currentCharIndex.value < currentQ.value.character.length - 1) {
          emit('correct')
          currentCharIndex.value++
          nextTick(() => createWriter(currentChar.value))
        } else {
          emit('correct', { word: currentQ.value.character })
          feedback.value = 'complete'
          setTimeout(() => advanceQuestion(), 1400)
        }
      },
      onMistake: () => {
        emit('incorrect')
      },
    })
  } catch (e) {
    console.warn('[HanziQuiz] cannot create writer for', char, e)
    // Skip characters that aren't in the HanziWriter database
    skipToNext()
  }
}

function showHint() {
  if (!writer) return
  writer.showOutline()
  hintShown = true
}

function animateCharacter() {
  if (!writer) return
  writer.animateCharacter()
}

function resetCurrentCharacter() {
  if (currentQ.value) {
    createWriter(currentChar.value)
  }
}

function advanceQuestion() {
  feedback.value = ''
  currentCharIndex.value = 0
  if (currentIndex.value < questions.value.length - 1) {
    currentIndex.value++
    nextTick(() => createWriter(currentChar.value))
  } else {
    finished.value = true
    emit('gameComplete')
  }
}

function skipToNext() {
  if (!gameStarted.value) {
    gameStarted.value = true
    emit('gameStart')
  }
  advanceQuestion()
}

onMounted(() => {
  const source = props.hskLevel === 'MyWords'
    ? getMyVocabulary()
    : (vocabulary[props.hskLevel] || vocabulary.Beginner)
  const valid = source.filter(isValidForWriting)
  questions.value = shuffleArray(valid).slice(0, Math.min(10, valid.length))
  nextTick(() => {
    if (currentQ.value) createWriter(currentChar.value)
  })
})

onUnmounted(() => {
  if (writerEl.value) writerEl.value.innerHTML = ''
  writer = null
})

watch(() => props.hskLevel, () => {
  // Parent rerenders this component via :key, so this shouldn't fire,
  // but guard just in case.
  currentIndex.value = 0
  currentCharIndex.value = 0
  finished.value = false
})
</script>

<style scoped>
.hanzi-quiz { max-width: 500px; margin: 0 auto; text-align: center; }

/* Progress */
.progress-bar { position: relative; height: 6px; background: var(--color-bg-secondary); border-radius: 3px; margin-bottom: 24px; overflow: hidden; }
.progress-fill { height: 100%; background: var(--color-primary); border-radius: 3px; transition: width var(--transition-medium); }
.progress-text { position: absolute; right: 0; top: 12px; font-size: 0.8rem; color: var(--color-text-secondary); }

/* Word info */
.word-info {
  padding: 16px; margin-bottom: 18px;
  background: var(--color-surface); border: 2px solid var(--color-border); border-radius: var(--radius-lg);
}
.word-pinyin { font-size: 1.6rem; color: var(--color-primary); font-weight: 600; margin-bottom: 4px; }
.word-meaning { font-size: 1rem; color: var(--color-text-secondary); }
.char-progress {
  margin-top: 8px;
  display: inline-block;
  padding: 3px 12px;
  border-radius: 12px;
  background: var(--color-bg-secondary);
  font-size: 0.8rem;
  color: var(--color-text-secondary);
}

/* Writing canvas */
.writing-area {
  display: flex; justify-content: center; margin-bottom: 18px;
}
.writer-container {
  width: 280px; height: 280px;
  background: var(--color-surface);
  border: 2px dashed var(--color-border);
  border-radius: var(--radius-lg);
  display: flex; align-items: center; justify-content: center;
  touch-action: none; /* prevent scrolling while writing on mobile */
}

/* Actions */
.actions {
  display: flex; flex-wrap: wrap; gap: 8px; justify-content: center;
  margin-bottom: 16px;
}
.btn-ghost, .btn-primary {
  padding: 10px 18px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
  transition: all var(--transition-fast);
}
.btn-ghost {
  background: var(--color-bg-secondary);
  color: var(--color-text);
  border: 1px solid var(--color-border);
}
.btn-ghost:hover:not(:disabled) { background: var(--color-border); }
.btn-ghost:disabled { opacity: 0.5; cursor: not-allowed; }
.btn-primary {
  background: var(--color-primary);
  color: white;
}
.btn-primary:hover { background: var(--color-primary-dark); }

/* Feedback */
.feedback {
  padding: 14px 20px;
  border-radius: var(--radius-md);
  display: flex; align-items: center; justify-content: center; gap: 10px;
  background: linear-gradient(135deg, rgba(0, 184, 148, 0.12), rgba(0, 206, 201, 0.08));
  border: 2px solid var(--color-success);
}
.fb-icon { font-size: 1.6rem; }
.fb-text { font-size: 1.05rem; font-weight: 700; color: var(--color-success); }

@media (max-width: 480px) {
  .writer-container { width: 240px; height: 240px; }
  .word-pinyin { font-size: 1.4rem; }
}
</style>
