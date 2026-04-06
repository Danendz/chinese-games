<template>
  <div class="stats-view">
    <div class="page-header">
      <h1 class="page-title text-chinese">学习统计</h1>
      <p class="page-subtitle">My Learning Stats</p>
    </div>

    <!-- Daily Quote -->
    <section class="quote-section">
      <div class="quote-card" :style="{ background: `linear-gradient(135deg, ${quoteColors.from}, ${quoteColors.to})` }">
        <p class="quote-zh text-chinese">「{{ quote.zh }}」</p>
        <p class="quote-en">{{ quote.en }}</p>
      </div>
    </section>

    <!-- Today's Summary -->
    <section class="today-section">
      <h2 class="section-title">Today</h2>
      <div class="stat-cards">
        <div class="stat-card">
          <span class="stat-icon">⏱️</span>
          <span class="stat-value">{{ formatTime(today.totalTime) }}</span>
          <span class="stat-label">Learning Time</span>
        </div>
        <div class="stat-card highlight">
          <span class="stat-icon">✅</span>
          <span class="stat-value">{{ today.wordsLearned }}</span>
          <span class="stat-label">Words Learned</span>
          <span class="stat-hint">answered correctly 4+ times</span>
        </div>
        <div class="stat-card">
          <span class="stat-icon">📝</span>
          <span class="stat-value">{{ today.wordsInProgress }}</span>
          <span class="stat-label">In Progress</span>
          <span class="stat-hint">1-3 times, keep practicing!</span>
        </div>
        <div class="stat-card">
          <span class="stat-icon">🎮</span>
          <span class="stat-value">{{ today.gamesPlayed }}</span>
          <span class="stat-label">Games Played</span>
        </div>
      </div>
    </section>

    <!-- Weekly Chart -->
    <section class="chart-section">
      <h2 class="section-title">This Week</h2>
      <div class="chart-container">
        <svg viewBox="0 0 350 180" class="bar-chart">
          <g v-for="(day, i) in weekly" :key="day.date">
            <!-- Bar -->
            <rect
              :x="i * 50 + 10"
              :y="150 - barHeight(day.totalTime)"
              width="30"
              :height="barHeight(day.totalTime)"
              rx="4"
              :fill="day.date === todayStr ? '#d63031' : '#ff7675'"
              opacity="0.85"
            />
            <!-- Time label -->
            <text
              :x="i * 50 + 25"
              :y="145 - barHeight(day.totalTime)"
              text-anchor="middle"
              fill="#636e72"
              font-size="9"
              font-weight="600"
            >{{ day.totalTime > 0 ? formatTimeShort(day.totalTime) : '' }}</text>
            <!-- Day label -->
            <text
              :x="i * 50 + 25"
              y="170"
              text-anchor="middle"
              fill="#b2bec3"
              font-size="10"
              font-weight="500"
            >{{ day.dayName }}</text>
          </g>
          <!-- Baseline -->
          <line x1="5" y1="150" x2="345" y2="150" stroke="#dfe6e9" stroke-width="1" />
        </svg>
      </div>
    </section>

    <!-- 30-Day Calendar -->
    <section class="calendar-section">
      <h2 class="section-title">30-Day Check-in Calendar</h2>
      <div class="calendar-grid">
        <div
          v-for="day in monthly"
          :key="day.date"
          class="calendar-cell"
          :class="{ active: day.checkedIn, today: day.isToday }"
          :title="day.date"
        >
          <span class="cell-day">{{ day.date.split('-')[2] }}</span>
        </div>
      </div>
      <div class="calendar-legend">
        <span class="legend-item"><span class="legend-dot active"></span> Checked in</span>
        <span class="legend-item"><span class="legend-dot"></span> Missed</span>
      </div>
    </section>

    <!-- All-Time Stats -->
    <section class="alltime-section">
      <h2 class="section-title">All Time</h2>
      <div class="stat-cards">
        <div class="stat-card">
          <span class="stat-icon">📅</span>
          <span class="stat-value">{{ allTime.totalDays }}</span>
          <span class="stat-label">Days Checked In</span>
        </div>
        <div class="stat-card">
          <span class="stat-icon">⏳</span>
          <span class="stat-value">{{ formatTime(allTime.totalTime) }}</span>
          <span class="stat-label">Total Learning Time</span>
        </div>
        <div class="stat-card">
          <span class="stat-icon">📖</span>
          <span class="stat-value">{{ allTime.totalWords }}</span>
          <span class="stat-label">Total Words</span>
        </div>
        <div class="stat-card">
          <span class="stat-icon">🔥</span>
          <span class="stat-value">{{ allTime.longestStreak }}</span>
          <span class="stat-label">Longest Streak</span>
        </div>
      </div>
    </section>

    <!-- Share Button -->
    <section class="share-section">
      <button class="share-btn" @click="handleShare" :disabled="generating">
        {{ generating ? 'Generating...' : '📤 Share My Progress / 分享学习成绩' }}
      </button>
    </section>

    <!-- Share Modal -->
    <div v-if="shareImageUrl" class="share-overlay" @click.self="shareImageUrl = null">
      <div class="share-modal animate-pop-in">
        <img :src="shareImageUrl" class="share-preview" alt="Stats Card" />
        <div class="share-actions">
          <button class="btn-download" @click="handleDownload">💾 Save Image</button>
          <button class="btn-close" @click="shareImageUrl = null">Close</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import {
  getTodayStats, getWeeklyData, getMonthlyCheckins,
  getAllTimeStats, getStreak, getTodayStr, formatTime
} from '../data/statsStore'
import { generateShareCard, downloadShareCard } from '../composables/useShareCard'
import { getTodayQuote, themeColors } from '../data/dailyQuotes'

const todayStr = getTodayStr()
const today = ref({ totalTime: 0, wordsLearned: 0, wordsInProgress: 0, gamesPlayed: 0 })
const weekly = ref([])
const monthly = ref([])
const allTime = ref({ totalDays: 0, totalTime: 0, totalWords: 0, longestStreak: 0 })
const streak = ref({ current: 0, longest: 0 })
const shareImageUrl = ref(null)
const generating = ref(false)
const quote = getTodayQuote()
const quoteColors = themeColors[quote.theme] || themeColors.sunrise

function formatTimeShort(s) {
  if (s < 60) return `${s}s`
  return `${Math.floor(s / 60)}m`
}

function barHeight(seconds) {
  const maxTime = Math.max(...weekly.value.map(d => d.totalTime), 60)
  return Math.max((seconds / maxTime) * 130, seconds > 0 ? 4 : 0)
}

async function handleShare() {
  generating.value = true
  try {
    const url = await generateShareCard({
      streak: streak.value.current,
      todayTime: today.value.totalTime,
      todayWords: today.value.wordsLearned,
      date: todayStr
    })
    shareImageUrl.value = url
  } finally {
    generating.value = false
  }
}

function handleDownload() {
  if (shareImageUrl.value) {
    downloadShareCard(shareImageUrl.value)
  }
}

onMounted(() => {
  today.value = getTodayStats()
  weekly.value = getWeeklyData()
  monthly.value = getMonthlyCheckins()
  allTime.value = getAllTimeStats()
  streak.value = getStreak()
})
</script>

<style scoped>
.stats-view {
  max-width: 700px;
  margin: 0 auto;
  padding-bottom: 40px;
}

.page-header { text-align: center; margin-bottom: 28px; }
.page-title { font-size: 1.8rem; font-weight: 700; }
.page-subtitle { color: var(--color-text-secondary); font-size: 0.95rem; }

/* Quote */
.quote-section { margin-bottom: 24px; }
.quote-card {
  border-radius: var(--radius-lg);
  padding: 24px 28px;
  text-align: center;
  box-shadow: var(--shadow-md);
}
.quote-zh {
  font-size: 1.3rem;
  font-weight: 700;
  color: white;
  margin-bottom: 6px;
  text-shadow: 0 1px 4px rgba(0,0,0,0.15);
}
.quote-en {
  font-size: 0.9rem;
  font-style: italic;
  color: rgba(255,255,255,0.75);
}

.section-title {
  font-size: 1rem;
  font-weight: 600;
  color: var(--color-text-secondary);
  margin-bottom: 12px;
  text-transform: uppercase;
  letter-spacing: 0.03em;
}

/* Stat Cards */
.stat-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 12px;
  margin-bottom: 28px;
}

.stat-card {
  background: var(--color-surface);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-sm);
  padding: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  text-align: center;
}

.stat-icon { font-size: 1.6rem; }
.stat-value { font-size: 1.5rem; font-weight: 700; color: var(--color-text); }
.stat-label { font-size: 0.75rem; color: var(--color-text-secondary); font-weight: 500; }
.stat-hint { font-size: 0.65rem; color: var(--color-text-light); margin-top: 2px; }
.stat-card.highlight { border: 2px solid var(--color-success); background: rgba(0, 184, 148, 0.03); }

/* Chart */
.chart-section { margin-bottom: 28px; }
.chart-container {
  background: var(--color-surface);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-sm);
  padding: 16px;
}
.bar-chart { width: 100%; height: auto; }

/* Calendar */
.calendar-section { margin-bottom: 28px; }
.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 6px;
  background: var(--color-surface);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-sm);
  padding: 16px;
}

.calendar-cell {
  aspect-ratio: 1;
  border-radius: var(--radius-sm);
  background: var(--color-bg-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.7rem;
  color: var(--color-text-light);
  transition: all var(--transition-fast);
}

.calendar-cell.active {
  background: var(--color-primary);
  color: white;
  font-weight: 600;
}

.calendar-cell.today {
  box-shadow: 0 0 0 2px var(--color-primary);
}

.cell-day { font-size: 0.7rem; }

.calendar-legend {
  display: flex;
  gap: 16px;
  justify-content: center;
  margin-top: 8px;
  font-size: 0.75rem;
  color: var(--color-text-light);
}

.legend-item { display: flex; align-items: center; gap: 4px; }
.legend-dot {
  width: 12px; height: 12px; border-radius: 3px;
  background: var(--color-bg-secondary);
}
.legend-dot.active { background: var(--color-primary); }

/* All-time */
.alltime-section { margin-bottom: 28px; }

/* Share */
.share-section { text-align: center; margin-bottom: 20px; }
.share-btn {
  padding: 14px 32px;
  background: linear-gradient(135deg, var(--color-primary), #e17055);
  color: white;
  border-radius: var(--radius-md);
  font-weight: 600;
  font-size: 1rem;
  box-shadow: var(--shadow-md);
  transition: all var(--transition-fast);
}
.share-btn:hover:not(:disabled) { transform: translateY(-2px); box-shadow: var(--shadow-lg); }
.share-btn:disabled { opacity: 0.7; }

/* Share Modal */
.share-overlay {
  position: fixed; inset: 0; background: rgba(0,0,0,0.6);
  display: flex; align-items: center; justify-content: center; z-index: 1000;
  backdrop-filter: blur(4px);
}

.share-modal {
  background: var(--color-surface);
  border-radius: var(--radius-xl);
  padding: 24px;
  max-width: 90%;
  width: 500px;
  text-align: center;
}

.share-preview {
  width: 100%;
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-md);
  margin-bottom: 16px;
}

.share-actions { display: flex; gap: 10px; justify-content: center; }
.btn-download {
  padding: 10px 24px; background: var(--color-primary); color: white;
  border-radius: var(--radius-md); font-weight: 600; transition: background var(--transition-fast);
}
.btn-download:hover { background: var(--color-primary-dark); }
.btn-close {
  padding: 10px 24px; background: var(--color-bg-secondary); color: var(--color-text-secondary);
  border-radius: var(--radius-md); font-weight: 600;
}
.btn-close:hover { background: var(--color-border); }

@media (max-width: 480px) {
  .stat-cards { grid-template-columns: repeat(2, 1fr); }
  .calendar-grid { gap: 4px; padding: 10px; }
}
</style>
