const VOCAB_KEY = 'chineseGames_myVocabulary'
const SENTENCES_KEY = 'chineseGames_mySentences'
const RADICALS_KEY = 'chineseGames_myRadicals'

// --- Vocabulary ---
export function getMyVocabulary() {
  try {
    return JSON.parse(localStorage.getItem(VOCAB_KEY) || '[]')
  } catch {
    return []
  }
}

export function addMyVocabulary(entry) {
  const list = getMyVocabulary()
  const item = {
    id: 'my_v_' + Date.now(),
    character: entry.character,
    pinyin: entry.pinyin,
    english: entry.english,
    addedAt: Date.now()
  }
  list.push(item)
  localStorage.setItem(VOCAB_KEY, JSON.stringify(list))
  return item
}

export function removeMyVocabulary(id) {
  const list = getMyVocabulary().filter(v => v.id !== id)
  localStorage.setItem(VOCAB_KEY, JSON.stringify(list))
}

// --- Sentences ---
export function getMySentences() {
  try {
    return JSON.parse(localStorage.getItem(SENTENCES_KEY) || '[]')
  } catch {
    return []
  }
}

export function addMySentence(entry) {
  const list = getMySentences()
  const item = {
    id: 'my_s_' + Date.now(),
    words: entry.words,
    pinyin: entry.pinyin,
    english: entry.english,
    grammarPattern: entry.grammarPattern || '',
    grammarNote: entry.grammarNote || '',
    addedAt: Date.now()
  }
  list.push(item)
  localStorage.setItem(SENTENCES_KEY, JSON.stringify(list))
  return item
}

export function removeMySentence(id) {
  const list = getMySentences().filter(s => s.id !== id)
  localStorage.setItem(SENTENCES_KEY, JSON.stringify(list))
}

// --- Radicals ---
export function getMyRadicals() {
  try {
    return JSON.parse(localStorage.getItem(RADICALS_KEY) || '[]')
  } catch {
    return []
  }
}

export function addMyRadical(entry) {
  const list = getMyRadicals()
  const item = {
    id: 'my_r_' + Date.now(),
    character: entry.character,
    pinyin: entry.pinyin,
    english: entry.english,
    structure: entry.structure || 'left-right',
    components: entry.components,
    distractors: entry.distractors || [],
    hint: entry.hint || '',
    addedAt: Date.now()
  }
  list.push(item)
  localStorage.setItem(RADICALS_KEY, JSON.stringify(list))
  return item
}

export function removeMyRadical(id) {
  const list = getMyRadicals().filter(r => r.id !== id)
  localStorage.setItem(RADICALS_KEY, JSON.stringify(list))
}
