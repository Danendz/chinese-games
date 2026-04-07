<template>
  <div class="my-words-view">
    <div class="page-header">
      <h1 class="page-title text-chinese">{{ t('mywords.title') }}</h1>
      <p class="page-subtitle">{{ t('mywords.subtitle') }}</p>
      <p class="page-hint">{{ t('mywords.tip') }}</p>
    </div>

    <!-- Tabs -->
    <div class="tabs">
      <button v-for="tab in tabs" :key="tab.value" class="tab-btn" :class="{ active: activeTab === tab.value }" @click="activeTab = tab.value">
        {{ tab.label }}<span class="tab-count">{{ tab.count }}</span>
      </button>
    </div>

    <!-- ==================== Vocabulary Tab ==================== -->
    <div v-if="activeTab === 'vocabulary'" class="tab-content">
      <form class="add-form" @submit.prevent="addVocab">
        <h3 class="form-title">{{ t('mywords.addVocab') }}</h3>
        <div class="form-row">
          <div class="form-group">
            <label>Character(s) <span class="label-zh">汉字</span></label>
            <input v-model="vocabForm.character" placeholder="e.g. 你好" class="text-chinese" />
          </div>
          <div class="form-group">
            <label>Pinyin <span class="label-zh">拼音</span></label>
            <input v-model="vocabForm.pinyin" placeholder="e.g. nǐ hǎo" class="text-pinyin" />
          </div>
          <div class="form-group">
            <label>English <span class="label-zh">英文</span></label>
            <input v-model="vocabForm.english" placeholder="e.g. hello" />
          </div>
        </div>
        <!-- Suggestions -->
        <div v-if="vocabSuggestions.length > 0" class="suggestions">
          <span class="sugg-label">Found in dictionary:</span>
          <button v-for="s in vocabSuggestions" :key="s.id" type="button" class="sugg-btn" @click="applyVocabSuggestion(s)">
            <span class="sugg-char text-chinese">{{ s.character }}</span>
            <span class="sugg-py text-pinyin">{{ s.pinyin }}</span>
            <span class="sugg-en">{{ s.english }}</span>
          </button>
        </div>
        <div class="form-actions">
          <button type="button" class="btn-auto" @click="autoFillVocab" :disabled="!canAutoFillVocab">{{ t('mywords.autoFill') }}</button>
          <button type="submit" class="btn-add" :disabled="!vocabForm.character && !vocabForm.english">{{ t('mywords.addWord') }}</button>
        </div>
      </form>

      <div class="list-section" v-if="myVocabulary.length > 0">
        <h3 class="list-title">Your Vocabulary ({{ myVocabulary.length }})</h3>
        <div class="word-list">
          <div v-for="(item, idx) in myVocabulary" :key="item.id" class="word-item">
            <span class="word-num">{{ idx + 1 }}</span>
            <span class="word-char text-chinese">{{ item.character }}</span>
            <span class="word-pinyin text-pinyin">{{ item.pinyin }}</span>
            <span class="word-english">{{ item.english }}</span>
            <button class="btn-delete" @click="deleteVocab(item.id)" title="Remove">&times;</button>
          </div>
        </div>
      </div>
      <div v-else class="empty-state">
        <p>No custom vocabulary yet. Add words above — they'll appear in games when you select "My Words"!</p>
      </div>
    </div>

    <!-- ==================== Sentences Tab ==================== -->
    <div v-if="activeTab === 'sentences'" class="tab-content">
      <form class="add-form" @submit.prevent="addSent">
        <h3 class="form-title">{{ t('mywords.addSentence') }}</h3>
        <div class="form-row">
          <div class="form-group form-group-wide">
            <label>Words (space-separated) <span class="label-zh">用空格分开每个词</span></label>
            <input v-model="sentForm.wordsRaw" placeholder="e.g. 我 喜欢 学 中文 。" class="text-chinese" />
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label>Pinyin</label>
            <input v-model="sentForm.pinyin" placeholder="e.g. wǒ xǐhuān xué zhōngwén." class="text-pinyin" />
          </div>
          <div class="form-group">
            <label>English</label>
            <input v-model="sentForm.english" placeholder="e.g. I like studying Chinese." />
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
        <!-- Suggestions -->
        <div v-if="sentSuggestions.length > 0" class="suggestions">
          <span class="sugg-label">Found in dictionary:</span>
          <button v-for="s in sentSuggestions" :key="s.id" type="button" class="sugg-btn sugg-btn-wide" @click="applySentSuggestion(s)">
            <span class="sugg-char text-chinese">{{ s.words.join(' ') }}</span>
            <span class="sugg-en">{{ s.english }}</span>
          </button>
        </div>
        <div class="form-actions">
          <button type="button" class="btn-auto" @click="autoFillSent" :disabled="!canAutoFillSent">{{ t('mywords.autoFill') }}</button>
          <button type="submit" class="btn-add" :disabled="!sentForm.wordsRaw && !sentForm.english">{{ t('mywords.addSent') }}</button>
        </div>
      </form>

      <div class="list-section" v-if="mySentences.length > 0">
        <h3 class="list-title">Your Sentences ({{ mySentences.length }})</h3>
        <div class="sentence-list">
          <div v-for="(item, idx) in mySentences" :key="item.id" class="sentence-item">
            <span class="word-num">{{ idx + 1 }}</span>
            <div class="sentence-main">
              <span class="sentence-zh text-chinese">{{ item.words.join('') }}</span>
              <span class="sentence-py text-pinyin">{{ item.pinyin }}</span>
              <span class="sentence-en">{{ item.english }}</span>
            </div>
            <button class="btn-delete" @click="deleteSent(item.id)" title="Remove">&times;</button>
          </div>
        </div>
      </div>
      <div v-else class="empty-state">
        <p>No custom sentences yet. Add sentences above to practice word ordering!</p>
      </div>
    </div>

    <!-- ==================== Radicals Tab ==================== -->
    <div v-if="activeTab === 'radicals'" class="tab-content">
      <form class="add-form" @submit.prevent="addRad">
        <h3 class="form-title">{{ t('mywords.addRadical') }}</h3>
        <div class="form-row">
          <div class="form-group">
            <label>Target Character <span class="label-zh">目标汉字</span></label>
            <input v-model="radForm.character" placeholder="e.g. 好" class="text-chinese" />
          </div>
          <div class="form-group">
            <label>Pinyin</label>
            <input v-model="radForm.pinyin" placeholder="e.g. hǎo" class="text-pinyin" />
          </div>
          <div class="form-group">
            <label>English</label>
            <input v-model="radForm.english" placeholder="e.g. good" />
          </div>
        </div>
        <!-- Suggestions for radicals -->
        <div v-if="radSuggestions.length > 0" class="suggestions">
          <span class="sugg-label">Found in dictionary (click to auto-fill all):</span>
          <button v-for="s in radSuggestions" :key="s.id" type="button" class="sugg-btn" @click="applyRadSuggestion(s)">
            <span class="sugg-char text-chinese">{{ s.character }}</span>
            <span class="sugg-py text-pinyin">{{ s.pinyin }}</span>
            <span class="sugg-en">{{ s.english }}</span>
          </button>
        </div>
        <div class="form-actions" style="margin-bottom: 12px;">
          <button type="button" class="btn-auto" @click="autoFillRad" :disabled="!canAutoFillRad">{{ t('mywords.autoFillAll') }}</button>
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
            <label>Component 1 ({{ radPosLabel1 }})</label>
            <input v-model="radForm.comp1" placeholder="e.g. 女" class="text-chinese" />
          </div>
          <div class="form-group">
            <label>Component 2 ({{ radPosLabel2 }})</label>
            <input v-model="radForm.comp2" placeholder="e.g. 子" class="text-chinese" />
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
        <div class="form-actions">
          <button type="submit" class="btn-add" :disabled="!radForm.character">{{ t('mywords.addRad') }}</button>
        </div>
      </form>

      <div class="list-section" v-if="myRadicals.length > 0">
        <h3 class="list-title">Your Radical Puzzles ({{ myRadicals.length }})</h3>
        <div class="word-list">
          <div v-for="(item, idx) in myRadicals" :key="item.id" class="word-item">
            <span class="word-num">{{ idx + 1 }}</span>
            <span class="word-char text-chinese">{{ item.character }}</span>
            <span class="word-pinyin text-pinyin">{{ item.components.map(c => c.radical).join(' + ') }}</span>
            <span class="word-english">{{ item.english }}</span>
            <button class="btn-delete" @click="deleteRad(item.id)" title="Remove">&times;</button>
          </div>
        </div>
      </div>
      <div v-else class="empty-state">
        <p>No custom radical puzzles yet. Add characters to practice building from components!</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch } from 'vue'
import {
  getMyVocabulary, addMyVocabulary, removeMyVocabulary,
  getMySentences, addMySentence, removeMySentence,
  getMyRadicals, addMyRadical, removeMyRadical
} from '../data/myWordsStore'
import { useI18n } from '../composables/useI18n'
const { t } = useI18n()

import {
  lookupByChinese, lookupByEnglish, lookupByPinyin,
  lookupRadicalByCharacter, lookupRadicalByPinyin, lookupRadicalByEnglish,
  lookupSentenceByChinese, lookupSentenceByEnglish,
  getVocabSuggestions, getRadicalSuggestions, getSentenceSuggestions,
  toPinyin, isChinese
} from '../data/dictLookup'

const activeTab = ref('vocabulary')
const myVocabulary = ref(getMyVocabulary())
const mySentences = ref(getMySentences())
const myRadicals = ref(getMyRadicals())

const tabs = computed(() => [
  { value: 'vocabulary', label: t('mywords.tabVocab'), count: myVocabulary.value.length },
  { value: 'sentences', label: t('mywords.tabSentences'), count: mySentences.value.length },
  { value: 'radicals', label: t('mywords.tabRadicals'), count: myRadicals.value.length }
])

// ============ Vocabulary ============
const vocabForm = reactive({ character: '', pinyin: '', english: '' })
const vocabSuggestions = ref([])

const canAutoFillVocab = computed(() => vocabForm.character || vocabForm.english || vocabForm.pinyin)

watch(() => [vocabForm.character, vocabForm.english, vocabForm.pinyin], () => {
  const q = vocabForm.character || vocabForm.english || vocabForm.pinyin
  vocabSuggestions.value = q ? getVocabSuggestions(q) : []
}, { immediate: false })

function autoFillVocab() {
  if (vocabForm.character) {
    const r = lookupByChinese(vocabForm.character)
    if (r) {
      if (r.pinyin) vocabForm.pinyin = r.pinyin
      if (r.english) vocabForm.english = r.english
      return
    }
    // Fallback: always generate pinyin for Chinese input
    if (isChinese(vocabForm.character) && !vocabForm.pinyin) {
      vocabForm.pinyin = toPinyin(vocabForm.character)
    }
    return
  }
  if (vocabForm.english) {
    const r = lookupByEnglish(vocabForm.english)
    if (r) { vocabForm.character = r.character; vocabForm.pinyin = r.pinyin; return }
  }
  if (vocabForm.pinyin) {
    const r = lookupByPinyin(vocabForm.pinyin)
    if (r) { vocabForm.character = r.character; vocabForm.english = r.english; return }
  }
}

function applyVocabSuggestion(s) {
  vocabForm.character = s.character
  vocabForm.pinyin = s.pinyin
  vocabForm.english = s.english
  vocabSuggestions.value = []
}

function addVocab() {
  if (!vocabForm.character && !vocabForm.english) return
  addMyVocabulary({
    character: vocabForm.character || vocabForm.english,
    pinyin: vocabForm.pinyin || '—',
    english: vocabForm.english || vocabForm.character
  })
  myVocabulary.value = getMyVocabulary()
  vocabForm.character = ''; vocabForm.pinyin = ''; vocabForm.english = ''
}

function deleteVocab(id) { removeMyVocabulary(id); myVocabulary.value = getMyVocabulary() }

// ============ Sentences ============
const sentForm = reactive({ wordsRaw: '', pinyin: '', english: '', grammarPattern: '', grammarNote: '' })
const sentSuggestions = ref([])

const canAutoFillSent = computed(() => sentForm.wordsRaw || sentForm.english)

watch(() => [sentForm.wordsRaw, sentForm.english], () => {
  const q = sentForm.wordsRaw || sentForm.english
  sentSuggestions.value = q ? getSentenceSuggestions(q) : []
}, { immediate: false })

function autoFillSent() {
  if (sentForm.wordsRaw) {
    const q = sentForm.wordsRaw.replace(/\s+/g, '')
    const r = lookupSentenceByChinese(q)
    if (r) {
      if (r.words) applySentData(r)
      else {
        // Not in dictionary but pinyin was generated
        if (r.pinyin && !sentForm.pinyin) sentForm.pinyin = r.pinyin
      }
      return
    }
    // Fallback: always generate pinyin for Chinese input
    if (isChinese(q) && !sentForm.pinyin) {
      sentForm.pinyin = toPinyin(q)
    }
    return
  }
  if (sentForm.english) {
    const r = lookupSentenceByEnglish(sentForm.english)
    if (r) { applySentData(r); return }
  }
}

function applySentData(r) {
  sentForm.wordsRaw = r.words.join(' ')
  sentForm.pinyin = r.pinyin
  sentForm.english = r.english
  sentForm.grammarPattern = r.grammarPattern || ''
  sentForm.grammarNote = r.grammarNote || ''
}

function applySentSuggestion(s) {
  applySentData(s)
  sentSuggestions.value = []
}

function addSent() {
  if (!sentForm.wordsRaw && !sentForm.english) return
  const wordsRaw = sentForm.wordsRaw || sentForm.english
  addMySentence({
    words: wordsRaw.trim().split(/\s+/),
    pinyin: sentForm.pinyin || '—',
    english: sentForm.english || sentForm.wordsRaw,
    grammarPattern: sentForm.grammarPattern, grammarNote: sentForm.grammarNote
  })
  mySentences.value = getMySentences()
  sentForm.wordsRaw = ''; sentForm.pinyin = ''; sentForm.english = ''
  sentForm.grammarPattern = ''; sentForm.grammarNote = ''
}

function deleteSent(id) { removeMySentence(id); mySentences.value = getMySentences() }

// ============ Radicals ============
const radForm = reactive({
  character: '', pinyin: '', english: '',
  structure: 'left-right', comp1: '', comp2: '',
  distractorsRaw: '', hint: ''
})
const radSuggestions = ref([])

const canAutoFillRad = computed(() => radForm.character || radForm.pinyin || radForm.english)

const radPosLabel1 = computed(() => ({ 'left-right': 'Left', 'top-bottom': 'Top', 'enclosed': 'Outer' }[radForm.structure]))
const radPosLabel2 = computed(() => ({ 'left-right': 'Right', 'top-bottom': 'Bottom', 'enclosed': 'Inner' }[radForm.structure]))

watch(() => [radForm.character, radForm.pinyin, radForm.english], () => {
  const q = radForm.character || radForm.pinyin || radForm.english
  radSuggestions.value = q ? getRadicalSuggestions(q) : []
}, { immediate: false })

function autoFillRad() {
  let r = null
  if (radForm.character) r = lookupRadicalByCharacter(radForm.character)
  if (!r && radForm.pinyin) r = lookupRadicalByPinyin(radForm.pinyin)
  if (!r && radForm.english) r = lookupRadicalByEnglish(radForm.english)
  if (r) {
    applyRadData(r)
    return
  }
  // Fallback: always generate pinyin for Chinese character
  if (radForm.character && isChinese(radForm.character) && !radForm.pinyin) {
    radForm.pinyin = toPinyin(radForm.character)
    // Also try vocab dictionary for english
    const vocabMatch = lookupByChinese(radForm.character)
    if (vocabMatch && vocabMatch.english) radForm.english = vocabMatch.english
  }
}

function applyRadData(r) {
  if (r.character) radForm.character = r.character
  if (r.pinyin) radForm.pinyin = r.pinyin
  if (r.english) radForm.english = r.english
  if (r.structure) radForm.structure = r.structure
  if (r.components && r.components.length >= 2) {
    radForm.comp1 = r.components[0].radical
    radForm.comp2 = r.components[1].radical
  }
  if (r.distractors) radForm.distractorsRaw = r.distractors.join(',')
  if (r.hint) radForm.hint = r.hint
}

function applyRadSuggestion(s) {
  radForm.character = s.character
  radForm.pinyin = s.pinyin
  radForm.english = s.english
  const r = lookupRadicalByCharacter(s.character)
  if (r) applyRadData(r)
  radSuggestions.value = []
}

function addRad() {
  if (!radForm.character) return
  // Auto-fill from dictionary if components are missing
  if (!radForm.comp1 || !radForm.comp2) {
    const r = lookupRadicalByCharacter(radForm.character)
    if (r) { applyRadData(r) }
  }
  const posMap = { 'left-right': ['left', 'right'], 'top-bottom': ['top', 'bottom'], 'enclosed': ['outer', 'inner'] }
  const positions = posMap[radForm.structure]
  const comp1 = radForm.comp1 || '?'
  const comp2 = radForm.comp2 || '?'
  addMyRadical({
    character: radForm.character, pinyin: radForm.pinyin || '—', english: radForm.english || radForm.character,
    structure: radForm.structure,
    components: [
      { radical: comp1, position: positions[0], label: comp1 },
      { radical: comp2, position: positions[1], label: comp2 }
    ],
    distractors: radForm.distractorsRaw ? radForm.distractorsRaw.split(/[,，]/).map(s => s.trim()).filter(Boolean) : ['口', '日', '木'],
    hint: radForm.hint
  })
  myRadicals.value = getMyRadicals()
  radForm.character = ''; radForm.pinyin = ''; radForm.english = ''
  radForm.comp1 = ''; radForm.comp2 = ''; radForm.distractorsRaw = ''; radForm.hint = ''
}

function deleteRad(id) { removeMyRadical(id); myRadicals.value = getMyRadicals() }
</script>

<style scoped>
.my-words-view { max-width: 800px; margin: 0 auto; }
.page-header { text-align: center; margin-bottom: 24px; }
.page-title { font-size: 1.8rem; font-weight: 700; }
.page-subtitle { color: var(--color-text-secondary); font-size: 0.95rem; }
.page-hint { color: var(--color-text-light); font-size: 0.8rem; margin-top: 6px; }

.tabs { display: flex; justify-content: center; gap: 4px; margin-bottom: 24px; background: var(--color-bg-secondary); border-radius: var(--radius-md); padding: 4px; }
.tab-btn { padding: 10px 20px; border-radius: var(--radius-sm); font-weight: 600; font-size: 0.9rem; color: var(--color-text-secondary); transition: all var(--transition-fast); flex: 1; display: flex; align-items: center; justify-content: center; gap: 6px; }
.tab-btn.active { background: var(--color-surface); color: var(--color-text); box-shadow: var(--shadow-sm); }
.tab-count { font-size: 0.75rem; background: var(--color-bg-secondary); padding: 1px 8px; border-radius: 10px; font-weight: 500; }
.tab-btn.active .tab-count { background: var(--color-primary); color: white; }

.add-form { background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius-md); padding: 20px; margin-bottom: 24px; }
.form-title { font-size: 1rem; font-weight: 600; margin-bottom: 14px; }
.form-row { display: flex; gap: 12px; margin-bottom: 12px; }
.form-group { flex: 1; display: flex; flex-direction: column; gap: 4px; }
.form-group-wide { flex: 2; }
.form-group label { font-size: 0.8rem; font-weight: 600; color: var(--color-text-secondary); }
.label-zh { color: var(--color-text-light); font-weight: 400; }
.optional { color: var(--color-text-light); font-weight: 400; font-style: italic; }
.form-group input, .form-group select { padding: 8px 12px; border: 1.5px solid var(--color-border); border-radius: var(--radius-sm); font-size: 0.9rem; font-family: inherit; transition: border-color var(--transition-fast); background: var(--color-bg); }
.form-group input:focus, .form-group select:focus { outline: none; border-color: var(--color-primary); }

.form-actions { display: flex; gap: 10px; align-items: center; }
.btn-add { padding: 8px 20px; background: var(--color-primary); color: white; border-radius: var(--radius-sm); font-weight: 600; font-size: 0.9rem; transition: background var(--transition-fast); }
.btn-add:hover:not(:disabled) { background: var(--color-primary-dark); }
.btn-add:disabled { opacity: 0.5; cursor: not-allowed; }
.btn-auto { padding: 8px 16px; background: linear-gradient(135deg, #0984e3, #6c5ce7); color: white; border-radius: var(--radius-sm); font-weight: 600; font-size: 0.85rem; transition: all var(--transition-fast); }
.btn-auto:hover:not(:disabled) { transform: translateY(-1px); box-shadow: var(--shadow-md); }
.btn-auto:disabled { opacity: 0.4; cursor: not-allowed; }

/* Suggestions */
.suggestions { margin-bottom: 12px; padding: 10px; background: var(--color-bg-secondary); border-radius: var(--radius-sm); }
.sugg-label { font-size: 0.75rem; color: var(--color-text-light); display: block; margin-bottom: 6px; }
.sugg-btn { display: inline-flex; align-items: center; gap: 8px; padding: 6px 12px; margin: 2px; background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius-sm); font-size: 0.8rem; cursor: pointer; transition: all var(--transition-fast); }
.sugg-btn:hover { border-color: var(--color-primary); background: rgba(214, 48, 49, 0.03); }
.sugg-btn-wide { display: flex; width: 100%; }
.sugg-char { font-weight: 700; font-size: 0.95rem; }
.sugg-py { color: var(--color-primary); font-size: 0.8rem; }
.sugg-en { color: var(--color-text-secondary); font-size: 0.8rem; }

/* Lists */
.list-section { margin-bottom: 24px; }
.list-title { font-size: 0.95rem; font-weight: 600; margin-bottom: 12px; }
.word-list, .sentence-list { display: flex; flex-direction: column; gap: 6px; }
.word-item, .sentence-item { display: flex; align-items: center; gap: 12px; padding: 10px 14px; background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius-sm); transition: all var(--transition-fast); }
.word-item:hover, .sentence-item:hover { border-color: var(--color-primary-light); }
.word-num { font-size: 0.75rem; color: var(--color-text-light); font-weight: 600; min-width: 20px; }
.word-char { font-size: 1.3rem; font-weight: 700; min-width: 60px; }
.word-pinyin { font-size: 0.9rem; color: var(--color-primary); font-weight: 500; min-width: 80px; }
.word-english { font-size: 0.9rem; color: var(--color-text-secondary); flex: 1; }
.sentence-main { flex: 1; display: flex; flex-direction: column; gap: 2px; }
.sentence-zh { font-size: 1.1rem; font-weight: 600; }
.sentence-py { font-size: 0.85rem; color: var(--color-primary); }
.sentence-en { font-size: 0.85rem; color: var(--color-text-secondary); }
.btn-delete { width: 28px; height: 28px; display: flex; align-items: center; justify-content: center; border-radius: 50%; font-size: 1.2rem; color: var(--color-text-light); transition: all var(--transition-fast); flex-shrink: 0; }
.btn-delete:hover { background: var(--color-error-light); color: var(--color-error); }
.empty-state { text-align: center; padding: 40px 20px; color: var(--color-text-light); font-size: 0.95rem; }

@media (max-width: 640px) {
  .form-row { flex-direction: column; gap: 10px; }
  .tabs { flex-direction: column; }
  .word-item { flex-wrap: wrap; }
}
</style>
