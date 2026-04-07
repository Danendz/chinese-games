import { ref, computed } from 'vue'
import { messages } from '../data/i18n'

const STORAGE_KEY = 'chineseGames_locale'

function detectLocale() {
  const saved = localStorage.getItem(STORAGE_KEY)
  if (saved && messages[saved]) return saved
  const lang = navigator.language || navigator.languages?.[0] || 'en'
  if (lang.startsWith('ru')) return 'ru'
  return 'en'
}

// Module-level singleton — shared across all components
const locale = ref(detectLocale())

export function useI18n() {
  /** Translate a UI string by key */
  function t(key) {
    return messages[locale.value]?.[key] || messages.en?.[key] || key
  }

  /** Get translated field from a data item (returns russian or english) */
  function tr(item) {
    if (!item) return ''
    if (locale.value === 'ru' && item.russian) return item.russian
    return item.english || ''
  }

  /** For antonym pairs: get russianA/englishA or russianB/englishB */
  function trA(item) {
    if (!item) return ''
    if (locale.value === 'ru' && item.russianA) return item.russianA
    return item.englishA || ''
  }

  function trB(item) {
    if (!item) return ''
    if (locale.value === 'ru' && item.russianB) return item.russianB
    return item.englishB || ''
  }

  /** Get the field name string ('russian' or 'english') */
  const dataField = computed(() => locale.value === 'ru' ? 'russian' : 'english')

  function setLocale(newLocale) {
    locale.value = newLocale
    localStorage.setItem(STORAGE_KEY, newLocale)
  }

  function toggleLocale() {
    setLocale(locale.value === 'en' ? 'ru' : 'en')
  }

  return { locale, t, tr, trA, trB, dataField, setLocale, toggleLocale }
}
