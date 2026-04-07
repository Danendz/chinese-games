/**
 * Dictionary lookup utility.
 * Uses all existing game data + pinyin-pro for auto-fill.
 */
import { vocabulary } from './vocabulary'
import { radicalPuzzles } from './radicals'
import { sentences } from './sentences'
import { extraDict } from './extraDict'
import { extraSentences } from './extraSentences'
import { extraRadicals } from './extraRadicals'
import { pinyin } from 'pinyin-pro'

/**
 * Convert any Chinese text to pinyin with tone marks.
 * Works for ANY Chinese character, even ones not in our dictionary.
 * @param {string} text - Chinese text
 * @returns {string} Pinyin with tone marks (e.g. "bāozi")
 */
export function toPinyin(text) {
  if (!text) return ''
  return pinyin(text, { toneType: 'symbol', type: 'string' })
}

/**
 * Check if a string contains Chinese characters.
 */
export function isChinese(text) {
  return /[\u4e00-\u9fff]/.test(text)
}

// Build flat arrays from all levels
function flattenData(dataObj) {
  const result = []
  for (const level of Object.values(dataObj)) {
    if (Array.isArray(level)) result.push(...level)
  }
  return result
}

const allVocab = [...flattenData(vocabulary), ...extraDict]
const allRadicals = [...flattenData(radicalPuzzles), ...extraRadicals]
const allSentences = [...flattenData(sentences), ...extraSentences]

// === Vocabulary Lookup ===

/**
 * Look up by Chinese character(s). Returns { pinyin, english } or null.
 * Always returns pinyin (via pinyin-pro) even if word is not in dictionary.
 */
export function lookupByChinese(chinese) {
  if (!chinese || !chinese.trim()) return null
  const q = chinese.trim()
  // Try dictionary first
  const match = allVocab.find(v => v.character === q)
  if (match) return { pinyin: match.pinyin, english: match.english }
  // Not in dictionary — still generate pinyin if it's Chinese
  if (isChinese(q)) {
    return { pinyin: toPinyin(q), english: '' }
  }
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
  // Not in radical dictionary — try vocab dictionary for pinyin/english
  if (isChinese(q)) {
    const vocabMatch = allVocab.find(v => v.character === q)
    return {
      pinyin: vocabMatch ? vocabMatch.pinyin : toPinyin(q),
      english: vocabMatch ? vocabMatch.english : '',
      structure: null, components: null, distractors: null, hint: null
    }
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
  // Not in sentence dictionary — still generate pinyin if Chinese
  if (isChinese(q)) {
    return {
      words: null,
      pinyin: toPinyin(q),
      english: '',
      grammarPattern: '',
      grammarNote: ''
    }
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
