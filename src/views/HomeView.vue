<template>
  <div class="home">
    <section class="hero">
      <h1 class="hero-title text-chinese">{{ t('home.title') }}</h1>
      <p class="hero-subtitle">{{ t('home.subtitle') }}</p>
    </section>

    <StreakBanner />

    <!-- View toggle -->
    <div class="view-toggle">
      <button class="toggle-btn" :class="{ active: viewMode === 'large' }" @click="setView('large')" title="Large cards">
        <span>☐</span>
      </button>
      <button class="toggle-btn" :class="{ active: viewMode === 'compact' }" @click="setView('compact')" title="Compact grid">
        <span>▦</span>
      </button>
    </div>

    <!-- Categorized game sections -->
    <div v-for="section in sections" :key="section.key" class="game-section">
      <div class="section-header">
        <span class="section-icon">{{ section.icon }}</span>
        <h2 class="section-title">{{ section.title }}</h2>
        <span class="section-subtitle">{{ section.subtitle }}</span>
      </div>

      <!-- Coming soon for empty sections -->
      <div v-if="section.games.length === 0" class="coming-soon">
        <span class="coming-icon">🚧</span>
        <span>{{ t('home.comingSoon') }}</span>
      </div>

      <div v-else class="games-grid" :class="{ compact: viewMode === 'compact' }">
        <router-link
          v-for="(game, index) in section.games"
          :key="game.route"
          :to="game.route"
          class="game-card"
          :style="{ animationDelay: `${index * 0.05}s` }"
        >
          <!-- Large mode -->
          <template v-if="viewMode === 'large'">
            <div class="game-card-icon" :style="{ background: game.gradient }">
              <span class="text-chinese">{{ game.icon }}</span>
            </div>
            <div class="game-card-body">
              <h2 class="game-card-title text-chinese">{{ game.title }}</h2>
              <p class="game-card-subtitle">{{ game.subtitle }}</p>
              <p class="game-card-desc">{{ game.description }}</p>
            </div>
          </template>
          <!-- Compact mode -->
          <template v-else>
            <div class="compact-icon" :style="{ background: game.gradient }">
              <span>{{ game.icon }}</span>
            </div>
            <div class="compact-body">
              <h3 class="compact-title text-chinese">{{ game.title }}</h3>
              <p class="compact-subtitle">{{ game.subtitle }}</p>
            </div>
          </template>
        </router-link>
      </div>
    </div>

    <!-- Tools section (stats, wordlist, my words) -->
    <div class="game-section">
      <div class="section-header">
        <span class="section-icon">🛠️</span>
        <h2 class="section-title">{{ t('home.tools') }}</h2>
        <span class="section-subtitle">{{ t('home.toolsSub') }}</span>
      </div>
      <div class="games-grid" :class="{ compact: viewMode === 'compact' }">
        <router-link
          v-for="(game, index) in tools"
          :key="game.route"
          :to="game.route"
          class="game-card"
          :style="{ animationDelay: `${index * 0.05}s` }"
        >
          <template v-if="viewMode === 'large'">
            <div class="game-card-icon" :style="{ background: game.gradient }">
              <span class="text-chinese">{{ game.icon }}</span>
            </div>
            <div class="game-card-body">
              <h2 class="game-card-title text-chinese">{{ game.title }}</h2>
              <p class="game-card-subtitle">{{ game.subtitle }}</p>
              <p class="game-card-desc">{{ game.description }}</p>
            </div>
          </template>
          <template v-else>
            <div class="compact-icon" :style="{ background: game.gradient }">
              <span>{{ game.icon }}</span>
            </div>
            <div class="compact-body">
              <h3 class="compact-title text-chinese">{{ game.title }}</h3>
              <p class="compact-subtitle">{{ game.subtitle }}</p>
            </div>
          </template>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import StreakBanner from '../components/shared/StreakBanner.vue'
import { useI18n } from '../composables/useI18n'

const { t } = useI18n()

const VIEW_KEY = 'chineseGames_viewMode'
const viewMode = ref(localStorage.getItem(VIEW_KEY) || 'large')

function setView(mode) {
  viewMode.value = mode
  localStorage.setItem(VIEW_KEY, mode)
}

// Game definitions
const listeningGames = computed(() => [
  { route: '/listening', icon: '听', title: '听力挑战', subtitle: t('card.listening.subtitle'), description: t('card.listening.desc'), gradient: 'linear-gradient(135deg, #a29bfe, #6c5ce7)' },
  { route: '/tones', icon: '调', title: '声调大师', subtitle: t('card.tone.subtitle'), description: t('card.tone.desc'), gradient: 'linear-gradient(135deg, #e17055, #fdcb6e)' },
])

const speakingGames = computed(() => [
  { route: '/speaking', icon: '🎙️', title: '跟读练习', subtitle: t('card.speaking.subtitle'), description: t('card.speaking.desc'), gradient: 'linear-gradient(135deg, #e17055, #d63031)' },
])

const readingGames = computed(() => [
  { route: '/memory', icon: '牌', title: '汉字配对翻牌', subtitle: t('card.memory.subtitle'), description: t('card.memory.desc'), gradient: 'linear-gradient(135deg, #e17055, #d63031)' },
  { route: '/pictures', icon: '图', title: '看图猜词', subtitle: t('card.picture.subtitle'), description: t('card.picture.desc'), gradient: 'linear-gradient(135deg, #55efc4, #00b894)' },
  { route: '/speed', icon: '⚡', title: '快速反应', subtitle: t('card.speed.subtitle'), description: t('card.speed.desc'), gradient: 'linear-gradient(135deg, #d63031, #e17055)' },
  { route: '/antonyms', icon: '反', title: '反义词配对', subtitle: t('card.antonym.subtitle'), description: t('card.antonym.desc'), gradient: 'linear-gradient(135deg, #6c5ce7, #a29bfe)' },
])

const writingGames = computed(() => [
  { route: '/pinyin', icon: '拼', title: '拼音拼写', subtitle: t('card.pinyin.subtitle'), description: t('card.pinyin.desc'), gradient: 'linear-gradient(135deg, #00b894, #fdcb6e)' },
  { route: '/typing', icon: '写', title: '汉字输入', subtitle: t('card.typing.subtitle'), description: t('card.typing.desc'), gradient: 'linear-gradient(135deg, #2d3436, #636e72)' },
  { route: '/hanzi', icon: '✍', title: '汉字手写', subtitle: t('card.hanzi.subtitle'), description: t('card.hanzi.desc'), gradient: 'linear-gradient(135deg, #e17055, #fdcb6e)' },
])

const comprehensiveGames = computed(() => [
  { route: '/radicals', icon: '拼', title: '偏旁组字', subtitle: t('card.radical.subtitle'), description: t('card.radical.desc'), gradient: 'linear-gradient(135deg, #0984e3, #6c5ce7)' },
  { route: '/sentences', icon: '句', title: '句子排序', subtitle: t('card.sentence.subtitle'), description: t('card.sentence.desc'), gradient: 'linear-gradient(135deg, #00b894, #00cec9)' },
  { route: '/idioms', icon: '成', title: '成语填空', subtitle: t('card.idiom.subtitle'), description: t('card.idiom.desc'), gradient: 'linear-gradient(135deg, #fd79a8, #e84393)' },
  { route: '/sorting', icon: '类', title: '分类游戏', subtitle: t('card.sorting.subtitle'), description: t('card.sorting.desc'), gradient: 'linear-gradient(135deg, #00cec9, #0984e3)' },
])

const sections = computed(() => [
  { key: 'listening', icon: '👂', title: t('home.sectionListening'), subtitle: t('home.sectionListeningSub'), games: listeningGames.value },
  { key: 'speaking', icon: '🗣️', title: t('home.sectionSpeaking'), subtitle: t('home.sectionSpeakingSub'), games: speakingGames.value },
  { key: 'reading', icon: '📖', title: t('home.sectionReading'), subtitle: t('home.sectionReadingSub'), games: readingGames.value },
  { key: 'writing', icon: '✍️', title: t('home.sectionWriting'), subtitle: t('home.sectionWritingSub'), games: writingGames.value },
  { key: 'comprehensive', icon: '🧩', title: t('home.sectionComprehensive'), subtitle: t('home.sectionComprehensiveSub'), games: comprehensiveGames.value },
])

const tools = computed(() => [
  { route: '/stats', icon: '📊', title: '学习统计', subtitle: t('card.stats.subtitle'), description: t('card.stats.desc'), gradient: 'linear-gradient(135deg, #fd79a8, #fdcb6e)' },
  { route: '/wordlist', icon: '📋', title: '单词列表', subtitle: t('card.wordlist.subtitle'), description: t('card.wordlist.desc'), gradient: 'linear-gradient(135deg, #636e72, #2d3436)' },
  { route: '/my-words', icon: '词', title: '我的词库', subtitle: t('card.mywords.subtitle'), description: t('card.mywords.desc'), gradient: 'linear-gradient(135deg, #fdcb6e, #e17055)' },
])
</script>

<style scoped>
.home { padding-bottom: 40px; }

.hero { text-align: center; padding: 48px 0 32px; }
.hero-title { font-size: 2.2rem; font-weight: 700; color: var(--color-text); margin-bottom: 12px; }
.hero-subtitle { font-size: 1.1rem; color: var(--color-text-secondary); max-width: 500px; margin: 0 auto; }

/* View toggle */
.view-toggle {
  display: flex; justify-content: flex-end; gap: 4px;
  max-width: 1080px; margin: 0 auto 8px; padding: 0 4px;
}
.toggle-btn {
  width: 36px; height: 36px; border-radius: var(--radius-sm);
  display: flex; align-items: center; justify-content: center; font-size: 1.1rem;
  background: var(--color-bg-secondary); color: var(--color-text-light);
  transition: all var(--transition-fast);
}
.toggle-btn.active { background: var(--color-primary); color: white; }
.toggle-btn:hover:not(.active) { background: var(--color-border); }

/* Section headers */
.game-section {
  max-width: 1080px; margin: 0 auto 28px;
}

.section-header {
  display: flex; align-items: center; gap: 8px;
  margin-bottom: 14px; padding: 0 4px;
}
.section-icon { font-size: 1.4rem; }
.section-title {
  font-size: 1.15rem; font-weight: 700; color: var(--color-text);
}
.section-subtitle {
  font-size: 0.8rem; color: var(--color-text-light); font-weight: 400;
}

.coming-soon {
  display: flex; align-items: center; gap: 8px; justify-content: center;
  padding: 20px; background: var(--color-bg-secondary); border-radius: var(--radius-md);
  color: var(--color-text-light); font-size: 0.9rem;
  border: 2px dashed var(--color-border);
}
.coming-icon { font-size: 1.2rem; }

/* Grid */
.games-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 16px;
}

.game-card {
  background: var(--color-surface); border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm); overflow: hidden;
  transition: all var(--transition-medium);
  display: flex; flex-direction: column;
  animation: fadeInUp 0.4s ease forwards; opacity: 0;
}
.game-card:hover { transform: translateY(-3px); box-shadow: var(--shadow-hover); }

.game-card-icon {
  height: 100px; display: flex; align-items: center;
  justify-content: center; font-size: 2.8rem; color: white;
}
.game-card-body { padding: 14px 18px 14px; flex: 1; }
.game-card-title { font-size: 1.2rem; font-weight: 700; margin-bottom: 2px; }
.game-card-subtitle { font-size: 0.8rem; color: var(--color-text-secondary); margin-bottom: 6px; }
.game-card-desc { font-size: 0.8rem; color: var(--color-text-secondary); line-height: 1.4; }

/* Compact mode */
.games-grid.compact { grid-template-columns: repeat(2, 1fr); gap: 10px; }
.compact .game-card { flex-direction: row; align-items: center; min-height: 64px; }
.compact .game-card:hover { transform: translateY(-2px); }
.compact-icon {
  width: 64px; min-height: 64px; display: flex; align-items: center;
  justify-content: center; font-size: 1.6rem; color: white;
  border-radius: var(--radius-lg) 0 0 var(--radius-lg); flex-shrink: 0;
}
.compact-body { padding: 8px 10px; flex: 1; min-width: 0; }
.compact-title { font-size: 0.85rem; font-weight: 700; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.compact-subtitle { font-size: 0.65rem; color: var(--color-text-secondary); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

@media (max-width: 640px) {
  .hero-title { font-size: 1.6rem; }
  .hero { padding: 32px 0 24px; }
  .games-grid:not(.compact) { grid-template-columns: 1fr; }
  .games-grid.compact { grid-template-columns: repeat(2, 1fr); gap: 8px; }
  .compact-icon { width: 52px; min-height: 52px; font-size: 1.3rem; }
  .section-title { font-size: 1rem; }
}
</style>
