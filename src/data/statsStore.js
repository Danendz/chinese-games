const CHECKINS_KEY = 'chineseGames_checkins'
const SESSIONS_KEY = 'chineseGames_gameSessions'
const WORD_PROGRESS_KEY = 'chineseGames_wordProgress'

// =============================================================
// Helpers
// =============================================================
export function getTodayStr() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

function daysAgoStr(n) {
  const d = new Date()
  d.setDate(d.getDate() - n)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

export function getDayName(dateStr) {
  const d = new Date(dateStr + 'T00:00:00')
  return ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][d.getDay()]
}

export function formatTime(seconds) {
  if (seconds < 60) return `${seconds}s`
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  if (mins < 60) return secs > 0 ? `${mins}m ${secs}s` : `${mins}m`
  const hrs = Math.floor(mins / 60)
  const remainMins = mins % 60
  return remainMins > 0 ? `${hrs}h ${remainMins}m` : `${hrs}h`
}

// =============================================================
// Check-ins (unchanged)
// =============================================================
export function getCheckins() {
  try { return JSON.parse(localStorage.getItem(CHECKINS_KEY) || '[]') } catch { return [] }
}

export function checkIn() {
  const today = getTodayStr()
  const checkins = getCheckins()
  if (!checkins.includes(today)) {
    checkins.push(today)
    localStorage.setItem(CHECKINS_KEY, JSON.stringify(checkins))
  }
}

export function getStreak() {
  const checkins = new Set(getCheckins())
  let current = 0
  for (let i = 0; i < 1000; i++) {
    if (checkins.has(daysAgoStr(i))) { current++ } else { break }
  }
  const sorted = [...checkins].sort()
  let longest = 0, run = 0
  for (let i = 0; i < sorted.length; i++) {
    if (i === 0) { run = 1 } else {
      const prev = new Date(sorted[i - 1] + 'T00:00:00')
      const curr = new Date(sorted[i] + 'T00:00:00')
      run = ((curr - prev) / 86400000) === 1 ? run + 1 : 1
    }
    longest = Math.max(longest, run)
  }
  return { current, longest }
}

export function getMonthlyCheckins() {
  const checkins = new Set(getCheckins())
  const today = getTodayStr()
  const days = []
  for (let i = 29; i >= 0; i--) {
    const date = daysAgoStr(i)
    days.push({ date, checkedIn: checkins.has(date), isToday: date === today, dayName: getDayName(date) })
  }
  return days
}

// =============================================================
// Game Sessions (for time tracking)
// =============================================================
function getSessions() {
  try { return JSON.parse(localStorage.getItem(SESSIONS_KEY) || '[]') } catch { return [] }
}

export function addGameSession(game, timeSeconds, wordsCount) {
  if (timeSeconds <= 0 && wordsCount <= 0) return
  const sessions = getSessions()
  sessions.push({ date: getTodayStr(), game, time: Math.round(timeSeconds), words: wordsCount, ts: Date.now() })
  try {
    localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions))
  } catch {
    sessions.splice(0, 100)
    localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions))
  }
}

// =============================================================
// Word Progress Tracking (NEW)
//
// Structure: { "猫": { "2026-04-06": 3, "2026-04-05": 5 }, ... }
//
// Each word tracks how many times it was answered correctly per day.
// A word counts as "learned today" when its today-count reaches 4.
// A word that was "learned" on a previous day is NOT counted again.
// =============================================================
function getWordProgress() {
  try { return JSON.parse(localStorage.getItem(WORD_PROGRESS_KEY) || '{}') } catch { return {} }
}

function saveWordProgress(data) {
  try {
    localStorage.setItem(WORD_PROGRESS_KEY, JSON.stringify(data))
  } catch {
    // If storage is full, prune dates older than 60 days
    const cutoff = daysAgoStr(60)
    for (const word of Object.keys(data)) {
      for (const date of Object.keys(data[word])) {
        if (date < cutoff) delete data[word][date]
      }
      if (Object.keys(data[word]).length === 0) delete data[word]
    }
    localStorage.setItem(WORD_PROGRESS_KEY, JSON.stringify(data))
  }
}

/**
 * Record that a word was answered correctly.
 * Call this each time the player gets a word right in any game.
 * @param {string} word — the Chinese character/word (e.g. "猫", "朋友")
 */
export function recordWordCorrect(word) {
  if (!word) return
  const today = getTodayStr()
  const progress = getWordProgress()
  if (!progress[word]) progress[word] = {}
  progress[word][today] = (progress[word][today] || 0) + 1
  saveWordProgress(progress)
}

/**
 * Record multiple words at once (batch).
 * @param {string[]} words — array of Chinese words answered correctly
 */
export function recordWordsCorrect(words) {
  if (!words || words.length === 0) return
  const today = getTodayStr()
  const progress = getWordProgress()
  for (const word of words) {
    if (!word) continue
    if (!progress[word]) progress[word] = {}
    progress[word][today] = (progress[word][today] || 0) + 1
  }
  saveWordProgress(progress)
}

const LEARN_THRESHOLD = 4 // times correct needed to count as "learned"

/**
 * Get today's learned words count.
 * A word is "learned today" if:
 * 1. Today's correct count >= 4
 * 2. It was NOT already learned on a previous day (previous day count >= 4)
 */
export function getTodayLearnedWords() {
  const today = getTodayStr()
  const progress = getWordProgress()
  let count = 0

  for (const word of Object.keys(progress)) {
    const todayCount = progress[word][today] || 0
    if (todayCount < LEARN_THRESHOLD) continue

    // Check if already learned on a previous day
    let learnedBefore = false
    for (const date of Object.keys(progress[word])) {
      if (date !== today && progress[word][date] >= LEARN_THRESHOLD) {
        learnedBefore = true
        break
      }
    }
    if (!learnedBefore) count++
  }
  return count
}

/**
 * Get words currently "in progress" today (1-3 correct, not yet learned).
 */
export function getTodayInProgressWords() {
  const today = getTodayStr()
  const progress = getWordProgress()
  let count = 0
  for (const word of Object.keys(progress)) {
    const todayCount = progress[word][today] || 0
    if (todayCount > 0 && todayCount < LEARN_THRESHOLD) count++
  }
  return count
}

/**
 * Get total unique words ever learned (across all days).
 */
export function getTotalLearnedWords() {
  const progress = getWordProgress()
  let count = 0
  for (const word of Object.keys(progress)) {
    const totalCorrect = Object.values(progress[word]).reduce((s, n) => s + n, 0)
    if (totalCorrect >= LEARN_THRESHOLD) count++
  }
  return count
}

/**
 * Get learned word count for a specific date.
 */
export function getLearnedWordsForDate(dateStr) {
  const progress = getWordProgress()
  let count = 0
  for (const word of Object.keys(progress)) {
    const dayCount = progress[word][dateStr] || 0
    if (dayCount < LEARN_THRESHOLD) continue
    // Check not learned on an earlier day
    let learnedBefore = false
    for (const date of Object.keys(progress[word])) {
      if (date < dateStr && progress[word][date] >= LEARN_THRESHOLD) {
        learnedBefore = true
        break
      }
    }
    if (!learnedBefore) count++
  }
  return count
}

// =============================================================
// Aggregated Stats (updated to use new word system)
// =============================================================
export function getTodayStats() {
  const today = getTodayStr()
  const sessions = getSessions().filter(s => s.date === today)
  return {
    totalTime: sessions.reduce((sum, s) => sum + s.time, 0),
    wordsLearned: getTodayLearnedWords(),
    wordsInProgress: getTodayInProgressWords(),
    gamesPlayed: sessions.length
  }
}

export function getWeeklyData() {
  const sessions = getSessions()
  const result = []
  for (let i = 6; i >= 0; i--) {
    const date = daysAgoStr(i)
    const daySessions = sessions.filter(s => s.date === date)
    result.push({
      date,
      dayName: getDayName(date),
      totalTime: daySessions.reduce((sum, s) => sum + s.time, 0),
      wordsLearned: getLearnedWordsForDate(date),
      gamesPlayed: daySessions.length
    })
  }
  return result
}

export function getAllTimeStats() {
  const sessions = getSessions()
  const checkins = getCheckins()
  const { longest } = getStreak()
  return {
    totalDays: checkins.length,
    totalTime: sessions.reduce((sum, s) => sum + s.time, 0),
    totalWords: getTotalLearnedWords(),
    longestStreak: longest
  }
}

export function getMilestone(streak) {
  const milestones = [
    { days: 50, icon: '🏆', label: '50 Day Streak!' },
    { days: 30, icon: '🥇', label: '30 Day Streak!' },
    { days: 15, icon: '🥈', label: '15 Day Streak!' },
    { days: 7,  icon: '🥉', label: '7 Day Streak!' }
  ]
  for (const m of milestones) {
    if (streak >= m.days) return m
  }
  return null
}
