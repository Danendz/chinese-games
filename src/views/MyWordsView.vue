<template>
  <div class="my-words-view">
    <div class="page-header">
      <h1 class="page-title text-chinese">My Words</h1>
      <p class="page-subtitle">Add your own vocabulary, radicals and sentences to review in games</p>
    </div>

    <!-- Tabs -->
    <div class="tabs">
      <button
        v-for="tab in tabs"
        :key="tab.value"
        class="tab-btn"
        :class="{ active: activeTab === tab.value }"
        @click="activeTab = tab.value"
      >
        {{ tab.label }}
        <span class="tab-count">{{ tab.count }}</span>
      </button>
    </div>

    <!-- Vocabulary Tab -->
    <div v-if="activeTab === 'vocabulary'" class="tab-content">
      <form class="add-form" @submit.prevent="addVocab">
        <h3 class="form-title">Add Vocabulary</h3>
        <div class="form-row">
          <div class="form-group">
            <label>Character(s) <span class="label-zh">汉字</span></label>
            <input v-model="vocabForm.character" placeholder="e.g. 你好" required class="text-chinese" />
          </div>
          <div class="form-group">
            <label>Pinyin <span class="label-zh">拼音</span></label>
            <input v-model="vocabForm.pinyin" placeholder="e.g. nǐ hǎo" required />
          </div>
          <div class="form-group">
            <label>English <span class="label-zh">英文</span></label>
            <input v-model="vocabForm.english" placeholder="e.g. hello" required />
          </div>
        </div>
        <button type="submit" class="btn-add">+ Add Word</button>
      </form>

      <div class="list-section" v-if="myVocabulary.length > 0">
        <h3 class="list-title">Your Vocabulary ({{ myVocabulary.length }})</h3>
        <div class="word-list">
          <div v-for="item in myVocabulary" :key="item.id" class="word-item">
            <span class="word-char text-chinese">{{ item.character }}</span>
            <span class="word-pinyin">{{ item.pinyin }}</span>
            <span class="word-english">{{ item.english }}</span>
            <button class="btn-delete" @click="deleteVocab(item.id)" title="Remove">&times;</button>
          </div>
        </div>
      </div>
      <div v-else class="empty-state">
        <p>No custom vocabulary yet. Add some words above to start reviewing them in games!</p>
      </div>
    </div>

    <!-- Sentences Tab -->
    <div v-if="activeTab === 'sentences'" class="tab-content">
      <form class="add-form" @submit.prevent="addSent">
        <h3 class="form-title">Add Sentence</h3>
        <div class="form-row">
          <div class="form-group form-group-wide">
            <label>Words (separated by spaces) <span class="label-zh">用空格分开每个词</span></label>
            <input v-model="sentForm.wordsRaw" placeholder="e.g. 我 喜欢 学 中文 。" required class="text-chinese" />
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label>Pinyin</label>
            <input v-model="sentForm.pinyin" placeholder="e.g. wǒ xǐhuān xué zhōngwén." required />
          </div>
          <div class="form-group">
            <label>English</label>
            <input v-model="sentForm.english" placeholder="e.g. I like studying Chinese." required />
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label>Grammar Pattern <span class="optional">(optional)</span></label>
            <input v-model="sentForm.grammarPattern" placeholder="e.g. Subject + 喜欢 + Verb + Object" />
          </div>
          <div class="form-group">
            <label>Grammar Note <span class="optional">(optional)</span></label>
            <input v-model="sentForm.grammarNote" placeholder="Explain the grammar point" />
          </div>
        </div>
        <button type="submit" class="btn-add">+ Add Sentence</button>
      </form>

      <div class="list-section" v-if="mySentences.length > 0">
        <h3 class="list-title">Your Sentences ({{ mySentences.length }})</h3>
        <div class="sentence-list">
          <div v-for="item in mySentences" :key="item.id" class="sentence-item">
            <div class="sentence-main">
              <span class="sentence-zh text-chinese">{{ item.words.join('') }}</span>
              <span class="sentence-py">{{ item.pinyin }}</span>
              <span class="sentence-en">{{ item.english }}</span>
            </div>
            <button class="btn-delete" @click="deleteSent(item.id)" title="Remove">&times;</button>
          </div>
        </div>
      </div>
      <div v-else class="empty-state">
        <p>No custom sentences yet. Add some sentences above to practice word ordering in games!</p>
      </div>
    </div>

    <!-- Radicals Tab -->
    <div v-if="activeTab === 'radicals'" class="tab-content">
      <form class="add-form" @submit.prevent="addRad">
        <h3 class="form-title">Add Radical Puzzle</h3>
        <div class="form-row">
          <div class="form-group">
            <label>Target Character <span class="label-zh">目标汉字</span></label>
            <input v-model="radForm.character" placeholder="e.g. 好" required class="text-chinese" />
          </div>
          <div class="form-group">
            <label>Pinyin</label>
            <input v-model="radForm.pinyin" placeholder="e.g. hǎo" required />
          </div>
          <div class="form-group">
            <label>English</label>
            <input v-model="radForm.english" placeholder="e.g. good" required />
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label>Structure</label>
            <select v-model="radForm.structure">
              <option value="left-right">Left-Right (e.g. 好 = 女+子)</option>
              <option value="top-bottom">Top-Bottom (e.g. 花 = 艹+化)</option>
              <option value="enclosed">Enclosed (e.g. 问 = 门+口)</option>
            </select>
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label>Component 1 ({{ radForm.structure === 'left-right' ? 'Left' : radForm.structure === 'top-bottom' ? 'Top' : 'Outer' }})</label>
            <input v-model="radForm.comp1" placeholder="e.g. 女" required class="text-chinese" />
          </div>
          <div class="form-group">
            <label>Component 2 ({{ radForm.structure === 'left-right' ? 'Right' : radForm.structure === 'top-bottom' ? 'Bottom' : 'Inner' }})</label>
            <input v-model="radForm.comp2" placeholder="e.g. 子" required class="text-chinese" />
          </div>
          <div class="form-group">
            <label>Distractors <span class="label-zh">干扰项，逗号分隔</span></label>
            <input v-model="radForm.distractorsRaw" placeholder="e.g. 口,日,木" class="text-chinese" />
          </div>
        </div>
        <div class="form-row">
          <div class="form-group form-group-wide">
            <label>Hint <span class="optional">(optional)</span></label>
            <input v-model="radForm.hint" placeholder="e.g. A woman with a child is good" />
          </div>
        </div>
        <button type="submit" class="btn-add">+ Add Radical Puzzle</button>
      </form>

      <div class="list-section" v-if="myRadicals.length > 0">
        <h3 class="list-title">Your Radical Puzzles ({{ myRadicals.length }})</h3>
        <div class="word-list">
          <div v-for="item in myRadicals" :key="item.id" class="word-item">
            <span class="word-char text-chinese">{{ item.character }}</span>
            <span class="word-pinyin">{{ item.components.map(c => c.radical).join(' + ') }}</span>
            <span class="word-english">{{ item.english }}</span>
            <button class="btn-delete" @click="deleteRad(item.id)" title="Remove">&times;</button>
          </div>
        </div>
      </div>
      <div v-else class="empty-state">
        <p>No custom radical puzzles yet. Add characters above to practice building them from components!</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import {
  getMyVocabulary, addMyVocabulary, removeMyVocabulary,
  getMySentences, addMySentence, removeMySentence,
  getMyRadicals, addMyRadical, removeMyRadical
} from '../data/myWordsStore'

const activeTab = ref('vocabulary')

// Reactive lists
const myVocabulary = ref(getMyVocabulary())
const mySentences = ref(getMySentences())
const myRadicals = ref(getMyRadicals())

const tabs = computed(() => [
  { value: 'vocabulary', label: 'Vocabulary', count: myVocabulary.value.length },
  { value: 'sentences', label: 'Sentences', count: mySentences.value.length },
  { value: 'radicals', label: 'Radicals', count: myRadicals.value.length }
])

// --- Vocabulary ---
const vocabForm = reactive({ character: '', pinyin: '', english: '' })

function addVocab() {
  if (!vocabForm.character || !vocabForm.pinyin || !vocabForm.english) return
  addMyVocabulary({ ...vocabForm })
  myVocabulary.value = getMyVocabulary()
  vocabForm.character = ''
  vocabForm.pinyin = ''
  vocabForm.english = ''
}

function deleteVocab(id) {
  removeMyVocabulary(id)
  myVocabulary.value = getMyVocabulary()
}

// --- Sentences ---
const sentForm = reactive({ wordsRaw: '', pinyin: '', english: '', grammarPattern: '', grammarNote: '' })

function addSent() {
  if (!sentForm.wordsRaw || !sentForm.pinyin || !sentForm.english) return
  const words = sentForm.wordsRaw.trim().split(/\s+/)
  addMySentence({
    words,
    pinyin: sentForm.pinyin,
    english: sentForm.english,
    grammarPattern: sentForm.grammarPattern,
    grammarNote: sentForm.grammarNote
  })
  mySentences.value = getMySentences()
  sentForm.wordsRaw = ''
  sentForm.pinyin = ''
  sentForm.english = ''
  sentForm.grammarPattern = ''
  sentForm.grammarNote = ''
}

function deleteSent(id) {
  removeMySentence(id)
  mySentences.value = getMySentences()
}

// --- Radicals ---
const radForm = reactive({
  character: '', pinyin: '', english: '',
  structure: 'left-right', comp1: '', comp2: '',
  distractorsRaw: '', hint: ''
})

function addRad() {
  if (!radForm.character || !radForm.pinyin || !radForm.english || !radForm.comp1 || !radForm.comp2) return

  const posMap = {
    'left-right': ['left', 'right'],
    'top-bottom': ['top', 'bottom'],
    'enclosed': ['outer', 'inner']
  }
  const positions = posMap[radForm.structure]

  addMyRadical({
    character: radForm.character,
    pinyin: radForm.pinyin,
    english: radForm.english,
    structure: radForm.structure,
    components: [
      { radical: radForm.comp1, position: positions[0], label: radForm.comp1 },
      { radical: radForm.comp2, position: positions[1], label: radForm.comp2 }
    ],
    distractors: radForm.distractorsRaw ? radForm.distractorsRaw.split(/[,，]/).map(s => s.trim()).filter(Boolean) : ['口', '日', '木'],
    hint: radForm.hint
  })
  myRadicals.value = getMyRadicals()
  radForm.character = ''
  radForm.pinyin = ''
  radForm.english = ''
  radForm.comp1 = ''
  radForm.comp2 = ''
  radForm.distractorsRaw = ''
  radForm.hint = ''
}

function deleteRad(id) {
  removeMyRadical(id)
  myRadicals.value = getMyRadicals()
}
</script>

<style scoped>
.my-words-view {
  max-width: 800px;
  margin: 0 auto;
}

.page-header {
  text-align: center;
  margin-bottom: 24px;
}

.page-title {
  font-size: 1.8rem;
  font-weight: 700;
}

.page-subtitle {
  color: var(--color-text-secondary);
  font-size: 0.95rem;
}

/* Tabs */
.tabs {
  display: flex;
  justify-content: center;
  gap: 4px;
  margin-bottom: 24px;
  background: var(--color-bg-secondary);
  border-radius: var(--radius-md);
  padding: 4px;
}

.tab-btn {
  padding: 10px 20px;
  border-radius: var(--radius-sm);
  font-weight: 600;
  font-size: 0.9rem;
  color: var(--color-text-secondary);
  transition: all var(--transition-fast);
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
}

.tab-btn.active {
  background: var(--color-surface);
  color: var(--color-text);
  box-shadow: var(--shadow-sm);
}

.tab-count {
  font-size: 0.75rem;
  background: var(--color-bg-secondary);
  padding: 1px 8px;
  border-radius: 10px;
  font-weight: 500;
}

.tab-btn.active .tab-count {
  background: var(--color-primary);
  color: white;
}

/* Form */
.add-form {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: 20px;
  margin-bottom: 24px;
}

.form-title {
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 14px;
  color: var(--color-text);
}

.form-row {
  display: flex;
  gap: 12px;
  margin-bottom: 12px;
}

.form-group {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.form-group-wide {
  flex: 2;
}

.form-group label {
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--color-text-secondary);
}

.label-zh {
  color: var(--color-text-light);
  font-weight: 400;
}

.optional {
  color: var(--color-text-light);
  font-weight: 400;
  font-style: italic;
}

.form-group input,
.form-group select {
  padding: 8px 12px;
  border: 1.5px solid var(--color-border);
  border-radius: var(--radius-sm);
  font-size: 0.9rem;
  font-family: inherit;
  transition: border-color var(--transition-fast);
  background: var(--color-bg);
}

.form-group input:focus,
.form-group select:focus {
  outline: none;
  border-color: var(--color-primary);
}

.btn-add {
  padding: 8px 20px;
  background: var(--color-primary);
  color: white;
  border-radius: var(--radius-sm);
  font-weight: 600;
  font-size: 0.9rem;
  transition: background var(--transition-fast);
}

.btn-add:hover {
  background: var(--color-primary-dark);
}

/* Lists */
.list-section {
  margin-bottom: 24px;
}

.list-title {
  font-size: 0.95rem;
  font-weight: 600;
  margin-bottom: 12px;
  color: var(--color-text);
}

.word-list,
.sentence-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.word-item,
.sentence-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 14px;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  transition: all var(--transition-fast);
}

.word-item:hover,
.sentence-item:hover {
  border-color: var(--color-primary-light);
}

.word-char {
  font-size: 1.3rem;
  font-weight: 700;
  min-width: 60px;
}

.word-pinyin {
  font-size: 0.9rem;
  color: var(--color-primary);
  font-weight: 500;
  min-width: 80px;
}

.word-english {
  font-size: 0.9rem;
  color: var(--color-text-secondary);
  flex: 1;
}

.sentence-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.sentence-zh {
  font-size: 1.1rem;
  font-weight: 600;
}

.sentence-py {
  font-size: 0.85rem;
  color: var(--color-primary);
}

.sentence-en {
  font-size: 0.85rem;
  color: var(--color-text-secondary);
}

.btn-delete {
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  font-size: 1.2rem;
  color: var(--color-text-light);
  transition: all var(--transition-fast);
  flex-shrink: 0;
}

.btn-delete:hover {
  background: var(--color-error-light);
  color: var(--color-error);
}

.empty-state {
  text-align: center;
  padding: 40px 20px;
  color: var(--color-text-light);
  font-size: 0.95rem;
}

@media (max-width: 640px) {
  .form-row {
    flex-direction: column;
    gap: 10px;
  }

  .tabs {
    flex-direction: column;
  }

  .word-item {
    flex-wrap: wrap;
  }
}
</style>
