/**
 * Dictionary lookup utility.
 * Uses all existing game data as a lookup dictionary for auto-fill.
 */
import { vocabulary } from './vocabulary'
import { radicalPuzzles } from './radicals'
import { sentences } from './sentences'

// Build flat arrays from all levels
function flattenData(dataObj) {
  const result = []
  for (const level of Object.values(dataObj)) {
    if (Array.isArray(level)) result.push(...level)
  }
  return result
}

const allVocab = flattenData(vocabulary)
const allRadicals = flattenData(radicalPuzzles)
const allSentences = flattenData(sentences)

// === Vocabulary Lookup ===

/**
 * Look up by Chinese character(s). Returns { pinyin, english } or null.
 */
export function lookupByChinese(chinese) {
  if (!chinese || !chinese.trim()) return null
  const q = chinese.trim()
  const match = allVocab.find(v => v.character === q)
  if (match) return { pinyin: match.pinyin, english: match.english }
  return null
}

/**
 * Look up by English. Returns { character, pinyin } or null.
 */
export function lookupByEnglish(english) {
  if (!english || !english.trim()) return null
  const q = english.trim().toLowerCase()
  // Exact match first
  let match = allVocab.find(v => v.english.toLowerCase() === q)
  if (match) return { character: match.character, pinyin: match.pinyin }
  // Partial match (english contains query or query contains english)
  match = allVocab.find(v =>
    v.english.toLowerCase().includes(q) || q.includes(v.english.toLowerCase())
  )
  if (match) return { character: match.character, pinyin: match.pinyin }
  return null
}

/**
 * Look up by pinyin. Returns { character, english } or null.
 */
export function lookupByPinyin(pinyin) {
  if (!pinyin || !pinyin.trim()) return null
  const q = pinyin.trim().toLowerCase()
  const match = allVocab.find(v => v.pinyin.toLowerCase() === q)
  if (match) return { character: match.character, english: match.english }
  return null
}

// === Radical Lookup ===

/**
 * Look up radical puzzle by character. Returns full radical data or null.
 */
export function lookupRadicalByCharacter(character) {
  if (!character || !character.trim()) return null
  const q = character.trim()
  const match = allRadicals.find(r => r.character === q)
  if (match) return {
    pinyin: match.pinyin,
    english: match.english,
    structure: match.structure,
    components: match.components,
    distractors: match.distractors,
    hint: match.hint
  }
  return null
}

/**
 * Look up radical by pinyin.
 */
export function lookupRadicalByPinyin(pinyin) {
  if (!pinyin || !pinyin.trim()) return null
  const q = pinyin.trim().toLowerCase()
  const match = allRadicals.find(r => r.pinyin.toLowerCase() === q)
  if (match) return {
    character: match.character,
    english: match.english,
    structure: match.structure,
    components: match.components,
    distractors: match.distractors,
    hint: match.hint
  }
  return null
}

/**
 * Look up radical by English.
 */
export function lookupRadicalByEnglish(english) {
  if (!english || !english.trim()) return null
  const q = english.trim().toLowerCase()
  const match = allRadicals.find(r => r.english.toLowerCase().includes(q))
  if (match) return {
    character: match.character,
    pinyin: match.pinyin,
    structure: match.structure,
    components: match.components,
    distractors: match.distractors,
    hint: match.hint
  }
  return null
}

// === Sentence Lookup ===

/**
 * Look up sentence by Chinese text (joined words or partial).
 */
export function lookupSentenceByChinese(chinese) {
  if (!chinese || !chinese.trim()) return null
  const q = chinese.trim()
  const match = allSentences.find(s => s.words.join('') === q || s.words.join('').includes(q))
  if (match) return {
    words: match.words,
    pinyin: match.pinyin,
    english: match.english,
    grammarPattern: match.grammarPattern,
    grammarNote: match.grammarNote
  }
  return null
}

/**
 * Look up sentence by English.
 */
export function lookupSentenceByEnglish(english) {
  if (!english || !english.trim()) return null
  const q = english.trim().toLowerCase()
  const match = allSentences.find(s => s.english.toLowerCase().includes(q))
  if (match) return {
    words: match.words,
    pinyin: match.pinyin,
    english: match.english,
    grammarPattern: match.grammarPattern,
    grammarNote: match.grammarNote
  }
  return null
}

// === Suggestion lists (for autocomplete dropdowns) ===

/**
 * Get vocabulary suggestions matching a query (Chinese, English, or Pinyin).
 * Returns up to 5 matches.
 */
export function getVocabSuggestions(query) {
  if (!query || query.trim().length === 0) return []
  const q = query.trim().toLowerCase()
  return allVocab.filter(v =>
    v.character.includes(q) ||
    v.english.toLowerCase().includes(q) ||
    v.pinyin.toLowerCase().includes(q)
  ).slice(0, 5)
}

/**
 * Get radical suggestions matching a query.
 */
export function getRadicalSuggestions(query) {
  if (!query || query.trim().length === 0) return []
  const q = query.trim().toLowerCase()
  return allRadicals.filter(r =>
    r.character.includes(q) ||
    r.english.toLowerCase().includes(q) ||
    r.pinyin.toLowerCase().includes(q)
  ).slice(0, 5)
}

/**
 * Get sentence suggestions.
 */
export function getSentenceSuggestions(query) {
  if (!query || query.trim().length === 0) return []
  const q = query.trim().toLowerCase()
  return allSentences.filter(s =>
    s.words.join('').includes(q) ||
    s.english.toLowerCase().includes(q) ||
    s.pinyin.toLowerCase().includes(q)
  ).slice(0, 5)
}
