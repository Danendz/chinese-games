<template>
  <div class="wordlist-view">
    <div class="page-header">
      <h1 class="page-title text-chinese">单词列表</h1>
      <p class="page-subtitle">{{ t('wordlist.subtitle') }}</p>
    </div>

    <!-- Level filter -->
    <HskLevelPicker v-model="hskLevel" :show-my-words="false" />

    <!-- Tabs: Learning / Mastered / Not Started -->
    <div class="tabs">
      <button v-for="tab in tabs" :key="tab.key" class="tab-btn" :class="{ active: activeTab === tab.key }" @click="activeTab = tab.key">
        <span class="tab-icon">{{ tab.icon }}</span>
        {{ tab.label }}
        <span class="tab-count">{{ tab.count }}</span>
      </button>
    </div>

    <!-- Search -->
    <div class="search-bar">
      <input v-model="search" :placeholder="t('wordlist.search')" class="search-input" />
    </div>

    <!-- Word list -->
    <div class="word-list" v-if="filteredWords.length > 0">
      <div v-for="word in filteredWords" :key="word.id" class="word-row">
        <button class="play-btn" @click="speak(word.character)" :title="t('wordlist.play')">
          🔊
        </button>
        <div class="word-main" @click="toggleExpand(word.id)">
          <span class="word-char text-chinese">{{ word.character }}</span>
          <span class="word-py text-pinyin">{{ word.pinyin }}</span>
          <span class="word-tr">{{ tr(word) }}</span>
        </div>
        <div class="word-status">
          <span v-if="getWordStatus(word.character) === 'mastered'" class="status-badge mastered">✅</span>
          <span v-else-if="getWordStatus(word.character) === 'learning'" class="status-badge learning">📝</span>
          <span v-else class="status-badge new">—</span>
        </div>
        <button class="detail-btn" @click="goToDetail(word)">
          ▶
        </button>
      </div>
    </div>

    <div v-else class="empty-state">
      <p>{{ t('wordlist.empty') }}</p>
    </div>

    <!-- Word detail modal -->
    <div v-if="selectedWord" class="detail-overlay" @click.self="selectedWord = null">
      <div class="detail-modal animate-pop-in">
        <div class="detail-header">
          <button class="detail-close" @click="selectedWord = null">&times;</button>
        </div>
        <div class="detail-char text-chinese">{{ selectedWord.character }}</div>
        <div class="detail-pinyin text-pinyin">{{ selectedWord.pinyin }}</div>
        <button class="detail-play" @click="speak(selectedWord.character)">🔊 {{ t('wordlist.play') }}</button>
        <div class="detail-translation">{{ tr(selectedWord) }}</div>

        <div class="detail-section" v-if="wordProgress">
          <h3>{{ t('wordlist.progress') }}</h3>
          <div class="progress-info">
            <span>{{ t('wordlist.totalCorrect') }}: <strong>{{ wordProgress.total }}</strong></span>
            <span>{{ t('wordlist.status') }}: <strong>{{ wordProgress.total >= 4 ? t('wordlist.mastered') : t('wordlist.inProgress') }}</strong></span>
          </div>
          <div class="progress-bar-mini">
            <div class="progress-fill-mini" :style="{ width: Math.min(wordProgress.total / 4 * 100, 100) + '%' }"></div>
          </div>
          <span class="progress-hint">{{ wordProgress.total }}/4 {{ t('wordlist.toMaster') }}</span>
        </div>

        <div class="detail-section" v-if="selectedWordExamples.length > 0">
          <h3>{{ t('wordlist.examples') }}</h3>
          <div v-for="(ex, i) in selectedWordExamples" :key="i" class="example-item">
            <div class="example-zh text-chinese">{{ ex.words.join('') }}</div>
            <div class="example-py text-pinyin">{{ ex.pinyin }}</div>
            <div class="example-tr">{{ tr(ex) }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { vocabulary } from '../data/vocabulary'
import { sentences } from '../data/sentences'
import { useI18n } from '../composables/useI18n'
import HskLevelPicker from '../components/shared/HskLevelPicker.vue'

const { t, tr } = useI18n()

const hskLevel = ref('Beginner')
const activeTab = ref('all')
const search = ref('')
const selectedWord = ref(null)

// Get word progress from localStorage
function getWordProgressData() {
  try {
    return JSON.parse(localStorage.getItem('chineseGames_wordProgress') || '{}')
  } catch { return {} }
}

function getWordStatus(character) {
  const progress = getWordProgressData()
  const wordData = progress[character]
  if (!wordData) return 'new'
  const total = Object.values(wordData).reduce((s, n) => s + n, 0)
  if (total >= 4) return 'mastered'
  if (total > 0) return 'learning'
  return 'new'
}

function getWordTotalCorrect(character) {
  const progress = getWordProgressData()
  const wordData = progress[character]
  if (!wordData) return 0
  return Object.values(wordData).reduce((s, n) => s + n, 0)
}

// Current vocabulary pool
const allWords = computed(() => vocabulary[hskLevel.value] || vocabulary.Beginner)

const categorizedWords = computed(() => {
  const mastered = []
  const learning = []
  const notStarted = []
  for (const w of allWords.value) {
    const status = getWordStatus(w.character)
    if (status === 'mastered') mastered.push(w)
    else if (status === 'learning') learning.push(w)
    else notStarted.push(w)
  }
  return { mastered, learning, notStarted }
})

const tabs = computed(() => [
  { key: 'all', icon: '📚', label: t('wordlist.all'), count: allWords.value.length },
  { key: 'learning', icon: '📝', label: t('wordlist.learningTab'), count: categorizedWords.value.learning.length },
  { key: 'mastered', icon: '✅', label: t('wordlist.masteredTab'), count: categorizedWords.value.mastered.length },
  { key: 'new', icon: '🆕', label: t('wordlist.newTab'), count: categorizedWords.value.notStarted.length },
])

const filteredWords = computed(() => {
  let list
  if (activeTab.value === 'learning') list = categorizedWords.value.learning
  else if (activeTab.value === 'mastered') list = categorizedWords.value.mastered
  else if (activeTab.value === 'new') list = categorizedWords.value.notStarted
  else list = allWords.value

  if (search.value.trim()) {
    const q = search.value.trim().toLowerCase()
    list = list.filter(w =>
      w.character.includes(q) ||
      w.pinyin.toLowerCase().includes(q) ||
      w.english.toLowerCase().includes(q) ||
      (w.russian && w.russian.toLowerCase().includes(q))
    )
  }
  return list
})

// Speech
function speak(text) {
  const utterance = new SpeechSynthesisUtterance(text)
  utterance.lang = 'zh-CN'
  utterance.rate = 0.8
  window.speechSynthesis.cancel()
  window.speechSynthesis.speak(utterance)
}

// Word detail
const wordProgress = computed(() => {
  if (!selectedWord.value) return null
  return { total: getWordTotalCorrect(selectedWord.value.character) }
})

const selectedWordExamples = computed(() => {
  if (!selectedWord.value) return []
  const char = selectedWord.value.character
  const allSentences = []
  for (const level of Object.values(sentences)) {
    for (const s of level) {
      if (s.words.join('').includes(char)) {
        allSentences.push(s)
      }
    }
  }
  return allSentences.slice(0, 3)
})

function goToDetail(word) {
  selectedWord.value = word
}

function toggleExpand(id) {
  // Could expand inline in the future
}
</script>

<style scoped>
.wordlist-view { max-width: 700px; margin: 0 auto; padding-bottom: 40px; }

.page-header { text-align: center; margin-bottom: 20px; }
.page-title { font-size: 1.8rem; font-weight: 700; }
.page-subtitle { color: var(--color-text-secondary); font-size: 0.95rem; }

/* Tabs */
.tabs {
  display: flex; gap: 4px; margin-bottom: 16px;
  background: var(--color-bg-secondary); border-radius: var(--radius-md); padding: 4px;
  overflow-x: auto;
}
.tab-btn {
  padding: 8px 12px; border-radius: var(--radius-sm); font-weight: 600; font-size: 0.8rem;
  color: var(--color-text-secondary); transition: all var(--transition-fast); flex: 1;
  display: flex; align-items: center; justify-content: center; gap: 4px; white-space: nowrap;
}
.tab-btn.active { background: var(--color-surface); color: var(--color-text); box-shadow: var(--shadow-sm); }
.tab-icon { font-size: 0.9rem; }
.tab-count {
  font-size: 0.7rem; background: var(--color-bg-secondary); padding: 1px 6px;
  border-radius: 10px; font-weight: 500;
}
.tab-btn.active .tab-count { background: var(--color-primary); color: white; }

/* Search */
.search-bar { margin-bottom: 16px; }
.search-input {
  width: 100%; padding: 10px 14px; border: 1.5px solid var(--color-border);
  border-radius: var(--radius-md); font-size: 0.9rem; font-family: inherit;
  background: var(--color-surface); transition: border-color var(--transition-fast);
}
.search-input:focus { outline: none; border-color: var(--color-primary); }

/* Word list */
.word-list { display: flex; flex-direction: column; }
.word-row {
  display: flex; align-items: center; gap: 10px; padding: 12px 8px;
  border-bottom: 1px solid var(--color-border); transition: background var(--transition-fast);
}
.word-row:hover { background: var(--color-bg-secondary); }

.play-btn {
  width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center;
  justify-content: center; font-size: 1rem; background: var(--color-bg-secondary);
  transition: all var(--transition-fast); flex-shrink: 0;
}
.play-btn:hover { background: var(--color-primary-light); color: white; }

.word-main { flex: 1; cursor: pointer; display: flex; flex-direction: column; gap: 2px; }
.word-char { font-size: 1.2rem; font-weight: 700; }
.word-py { font-size: 0.8rem; color: var(--color-primary); }
.word-tr { font-size: 0.8rem; color: var(--color-text-secondary); }

.word-status { flex-shrink: 0; }
.status-badge { font-size: 1rem; }
.status-badge.new { color: var(--color-text-light); font-size: 0.8rem; }

.detail-btn {
  width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center;
  justify-content: center; font-size: 0.8rem; color: var(--color-text-light);
  background: var(--color-bg-secondary); transition: all var(--transition-fast); flex-shrink: 0;
}
.detail-btn:hover { background: var(--color-primary); color: white; }

.empty-state { text-align: center; padding: 40px 20px; color: var(--color-text-light); }

/* Detail Modal */
.detail-overlay {
  position: fixed; inset: 0; background: rgba(0,0,0,0.5); display: flex;
  align-items: center; justify-content: center; z-index: 1000; backdrop-filter: blur(4px);
}
.detail-modal {
  background: var(--color-surface); border-radius: var(--radius-xl); padding: 28px;
  max-width: 420px; width: 90%; max-height: 80vh; overflow-y: auto; text-align: center;
}
.detail-header { display: flex; justify-content: flex-end; }
.detail-close {
  font-size: 1.5rem; color: var(--color-text-light); width: 32px; height: 32px;
  display: flex; align-items: center; justify-content: center;
}
.detail-close:hover { color: var(--color-text); }

.detail-char { font-size: 3.5rem; font-weight: 700; margin: 8px 0; }
.detail-pinyin { font-size: 1.2rem; color: var(--color-primary); font-weight: 500; margin-bottom: 8px; }
.detail-play {
  padding: 8px 20px; background: linear-gradient(135deg, var(--color-primary-light), var(--color-primary));
  color: white; border-radius: 20px; font-size: 0.85rem; font-weight: 600;
  margin-bottom: 12px; transition: transform var(--transition-fast);
}
.detail-play:hover { transform: scale(1.05); }
.detail-translation { font-size: 1.1rem; color: var(--color-text); font-weight: 500; margin-bottom: 20px; }

.detail-section { text-align: left; margin-top: 16px; }
.detail-section h3 {
  font-size: 0.85rem; font-weight: 600; color: var(--color-text-secondary);
  text-transform: uppercase; letter-spacing: 0.03em; margin-bottom: 8px;
}

.progress-info { display: flex; justify-content: space-between; font-size: 0.85rem; color: var(--color-text-secondary); margin-bottom: 8px; }
.progress-bar-mini { height: 6px; background: var(--color-bg-secondary); border-radius: 3px; overflow: hidden; margin-bottom: 4px; }
.progress-fill-mini { height: 100%; background: var(--color-success); border-radius: 3px; transition: width 0.3s; }
.progress-hint { font-size: 0.75rem; color: var(--color-text-light); }

.example-item {
  padding: 10px; background: var(--color-bg-secondary); border-radius: var(--radius-sm);
  margin-bottom: 8px;
}
.example-zh { font-size: 1rem; font-weight: 600; margin-bottom: 2px; }
.example-py { font-size: 0.8rem; color: var(--color-primary); margin-bottom: 2px; }
.example-tr { font-size: 0.8rem; color: var(--color-text-secondary); }

@media (max-width: 480px) {
  .tabs { flex-wrap: nowrap; }
  .tab-btn { padding: 6px 8px; font-size: 0.7rem; }
  .word-char { font-size: 1rem; }
}
</style>
