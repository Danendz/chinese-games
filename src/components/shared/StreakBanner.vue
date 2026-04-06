<template>
  <section class="streak-banner animate-fade-in-up">
    <div class="streak-main">
      <span class="streak-fire animate-flame">🔥</span>
      <div class="streak-info">
        <span class="streak-count text-chinese">连续 {{ streak.current }} 天</span>
        <span class="streak-label">Day Streak</span>
      </div>
      <div v-if="milestone" class="milestone-badge animate-pop-in">
        <span class="milestone-icon">{{ milestone.icon }}</span>
        <span class="milestone-text">{{ milestone.label }}</span>
      </div>
    </div>
    <div class="streak-week">
      <div
        v-for="day in last7"
        :key="day.date"
        class="day-dot-wrapper"
      >
        <div class="day-dot" :class="{ active: day.checkedIn, today: day.isToday }">
          <span v-if="day.checkedIn" class="dot-check">✓</span>
        </div>
        <span class="day-label">{{ day.dayName }}</span>
      </div>
    </div>
    <router-link to="/stats" class="stats-link">
      View Full Stats →
    </router-link>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { checkIn, getStreak, getMonthlyCheckins, getMilestone } from '../../data/statsStore'

const streak = ref({ current: 0, longest: 0 })
const last7 = ref([])
const milestone = ref(null)

onMounted(() => {
  checkIn()
  streak.value = getStreak()
  last7.value = getMonthlyCheckins().slice(-7)
  milestone.value = getMilestone(streak.value.current)
})
</script>

<style scoped>
.streak-banner {
  background: var(--color-surface);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
  padding: 20px 24px;
  margin-bottom: 24px;
  max-width: 1080px;
  margin-left: auto;
  margin-right: auto;
}

.streak-main {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.streak-fire {
  font-size: 2.5rem;
  line-height: 1;
}

.streak-info {
  display: flex;
  flex-direction: column;
}

.streak-count {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-text);
}

.streak-label {
  font-size: 0.8rem;
  color: var(--color-text-secondary);
  font-weight: 500;
}

.milestone-badge {
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  background: linear-gradient(135deg, #fdcb6e, #e17055);
  border-radius: 20px;
  color: white;
  font-size: 0.8rem;
  font-weight: 600;
}

.milestone-icon {
  font-size: 1.2rem;
}

.streak-week {
  display: flex;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 12px;
}

.day-dot-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  flex: 1;
}

.day-dot {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: var(--color-bg-secondary);
  border: 2px solid var(--color-border);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--transition-fast);
  font-size: 0.8rem;
}

.day-dot.active {
  background: var(--color-primary);
  border-color: var(--color-primary);
  color: white;
}

.day-dot.today {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(214, 48, 49, 0.2);
}

.day-dot.today.active {
  box-shadow: 0 0 0 3px rgba(214, 48, 49, 0.3);
}

.dot-check {
  font-weight: 700;
  font-size: 0.85rem;
}

.day-label {
  font-size: 0.65rem;
  color: var(--color-text-light);
  font-weight: 500;
}

.stats-link {
  display: block;
  text-align: center;
  font-size: 0.85rem;
  color: var(--color-primary);
  font-weight: 500;
  padding: 4px 0;
  transition: opacity var(--transition-fast);
}

.stats-link:hover {
  opacity: 0.7;
}

@keyframes flameFlicker {
  0%, 100% { transform: scale(1) rotate(0deg); }
  25% { transform: scale(1.1) rotate(-3deg); }
  50% { transform: scale(1.05) rotate(2deg); }
  75% { transform: scale(1.08) rotate(-1deg); }
}

.animate-flame {
  animation: flameFlicker 1.5s ease infinite;
  display: inline-block;
}

@media (max-width: 480px) {
  .streak-banner { padding: 16px; }
  .streak-count { font-size: 1.2rem; }
  .day-dot { width: 30px; height: 30px; }
  .milestone-badge { padding: 4px 10px; font-size: 0.7rem; }
}
</style>
