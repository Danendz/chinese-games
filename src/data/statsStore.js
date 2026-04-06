const CHECKINS_KEY = 'chineseGames_checkins'
const SESSIONS_KEY = 'chineseGames_gameSessions'

// Helper: today's date as YYYY-MM-DD in local timezone
export function getTodayStr() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

// Helper: date string for N days ago
function daysAgoStr(n) {
  const d = new Date()
  d.setDate(d.getDate() - n)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

// Helper: get day name (Mon, Tue, ...)
export function getDayName(dateStr) {
  const d = new Date(dateStr + 'T00:00:00')
  return ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][d.getDay()]
}

// --- Check-ins ---
export function getCheckins() {
  try {
    return JSON.parse(localStorage.getItem(CHECKINS_KEY) || '[]')
  } catch {
    return []
  }
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
  const today = getTodayStr()

  // Current streak: walk backward from today
  let current = 0
  for (let i = 0; i < 1000; i++) {
    if (checkins.has(daysAgoStr(i))) {
      current++
    } else {
      break
    }
  }

  // Longest streak: scan all checkins
  const sorted = [...checkins].sort()
  let longest = 0
  let run = 0
  for (let i = 0; i < sorted.length; i++) {
    if (i === 0) {
      run = 1
    } else {
      const prev = new Date(sorted[i - 1] + 'T00:00:00')
      const curr = new Date(sorted[i] + 'T00:00:00')
      const diff = (curr - prev) / (1000 * 60 * 60 * 24)
      run = diff === 1 ? run + 1 : 1
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
    days.push({
      date,
      checkedIn: checkins.has(date),
      isToday: date === today,
      dayName: getDayName(date)
    })
  }
  return days
}

// --- Game Sessions ---
function getSessions() {
  try {
    return JSON.parse(localStorage.getItem(SESSIONS_KEY) || '[]')
  } catch {
    return []
  }
}

export function addGameSession(game, timeSeconds, wordsCount) {
  if (timeSeconds <= 0 && wordsCount <= 0) return
  const sessions = getSessions()
  sessions.push({
    date: getTodayStr(),
    game,
    time: Math.round(timeSeconds),
    words: wordsCount,
    ts: Date.now()
  })
  try {
    localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions))
  } catch {
    // localStorage full — drop oldest 100 entries
    sessions.splice(0, 100)
    localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions))
  }
}

export function getTodayStats() {
  const today = getTodayStr()
  const sessions = getSessions().filter(s => s.date === today)
  return {
    totalTime: sessions.reduce((sum, s) => sum + s.time, 0),
    wordsLearned: sessions.reduce((sum, s) => sum + s.words, 0),
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
      wordsLearned: daySessions.reduce((sum, s) => sum + s.words, 0),
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
    totalWords: sessions.reduce((sum, s) => sum + s.words, 0),
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

// Format seconds to readable string
export function formatTime(seconds) {
  if (seconds < 60) return `${seconds}s`
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  if (mins < 60) return secs > 0 ? `${mins}m ${secs}s` : `${mins}m`
  const hrs = Math.floor(mins / 60)
  const remainMins = mins % 60
  return remainMins > 0 ? `${hrs}h ${remainMins}m` : `${hrs}h`
}
