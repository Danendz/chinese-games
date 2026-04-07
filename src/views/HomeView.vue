<template>
  <div class="home">
    <section class="hero">
      <h1 class="hero-title text-chinese">{{ t('home.title') }}</h1>
      <p class="hero-subtitle">{{ t('home.subtitle') }}</p>
    </section>

    <StreakBanner />

    <section class="games-grid">
      <router-link
        v-for="(game, index) in games"
        :key="game.route"
        :to="game.route"
        class="game-card"
        :style="{ animationDelay: `${index * 0.1}s` }"
      >
        <div class="game-card-icon" :style="{ background: game.gradient }">
          <span class="text-chinese">{{ game.icon }}</span>
        </div>
        <div class="game-card-body">
          <h2 class="game-card-title text-chinese">{{ game.title }}</h2>
          <p class="game-card-subtitle">{{ game.subtitle }}</p>
          <p class="game-card-desc">{{ game.description }}</p>
        </div>
        <div class="game-card-footer">
          <span class="game-card-tag" v-for="tag in game.tags" :key="tag">{{ tag }}</span>
        </div>
      </router-link>
    </section>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import StreakBanner from '../components/shared/StreakBanner.vue'
import { useI18n } from '../composables/useI18n'

const { t } = useI18n()

const games = computed(() => [
  { route: '/memory', icon: '牌', title: '汉字配对翻牌', subtitle: t('card.memory.subtitle'), description: t('card.memory.desc'), gradient: 'linear-gradient(135deg, #e17055, #d63031)', tags: ['Beginner - HSK9', t('tag.vocabulary'), t('tag.memory')] },
  { route: '/radicals', icon: '拼', title: '偏旁组字', subtitle: t('card.radical.subtitle'), description: t('card.radical.desc'), gradient: 'linear-gradient(135deg, #0984e3, #6c5ce7)', tags: ['Beginner - HSK9', t('tag.radicals'), t('tag.structure')] },
  { route: '/sentences', icon: '句', title: '句子排序', subtitle: t('card.sentence.subtitle'), description: t('card.sentence.desc'), gradient: 'linear-gradient(135deg, #00b894, #00cec9)', tags: ['Beginner - HSK9', t('tag.grammar'), t('tag.sentences')] },
  { route: '/listening', icon: '听', title: '听力挑战', subtitle: t('card.listening.subtitle'), description: t('card.listening.desc'), gradient: 'linear-gradient(135deg, #a29bfe, #6c5ce7)', tags: ['Beginner - HSK9', t('tag.listening'), t('tag.pronunciation')] },
  { route: '/idioms', icon: '成', title: '成语填空', subtitle: t('card.idiom.subtitle'), description: t('card.idiom.desc'), gradient: 'linear-gradient(135deg, #fd79a8, #e84393)', tags: ['HSK1-3 - HSK9', t('tag.idioms'), t('tag.vocabulary')] },
  { route: '/pictures', icon: '图', title: '看图猜词', subtitle: t('card.picture.subtitle'), description: t('card.picture.desc'), gradient: 'linear-gradient(135deg, #55efc4, #00b894)', tags: ['Beginner - HSK9', t('tag.visual'), t('tag.vocabulary')] },
  { route: '/tones', icon: '调', title: '声调大师', subtitle: t('card.tone.subtitle'), description: t('card.tone.desc'), gradient: 'linear-gradient(135deg, #e17055, #fdcb6e)', tags: ['Beginner - HSK9', t('tag.tones'), t('tag.pronunciation')] },
  { route: '/antonyms', icon: '反', title: '反义词配对', subtitle: t('card.antonym.subtitle'), description: t('card.antonym.desc'), gradient: 'linear-gradient(135deg, #6c5ce7, #a29bfe)', tags: ['Beginner - HSK9', t('tag.antonyms'), t('tag.vocabulary')] },
  { route: '/sorting', icon: '类', title: '分类游戏', subtitle: t('card.sorting.subtitle'), description: t('card.sorting.desc'), gradient: 'linear-gradient(135deg, #00cec9, #0984e3)', tags: ['Beginner - HSK9', t('tag.categories'), t('tag.vocabulary')] },
  { route: '/speed', icon: '⚡', title: '快速反应', subtitle: t('card.speed.subtitle'), description: t('card.speed.desc'), gradient: 'linear-gradient(135deg, #d63031, #e17055)', tags: ['Beginner - HSK9', t('tag.speed'), t('tag.reading')] },
  { route: '/stats', icon: '📊', title: '学习统计', subtitle: t('card.stats.subtitle'), description: t('card.stats.desc'), gradient: 'linear-gradient(135deg, #fd79a8, #fdcb6e)', tags: [t('tag.progress'), t('tag.streak'), t('tag.share')] },
  { route: '/my-words', icon: '词', title: '我的词库', subtitle: t('card.mywords.subtitle'), description: t('card.mywords.desc'), gradient: 'linear-gradient(135deg, #fdcb6e, #e17055)', tags: [t('tag.custom'), t('tag.review'), t('tag.personal')] },
])
</script>

<style scoped>
.home {
  padding-bottom: 40px;
}

.hero {
  text-align: center;
  padding: 48px 0 40px;
}

.hero-title {
  font-size: 2.2rem;
  font-weight: 700;
  color: var(--color-text);
  margin-bottom: 12px;
}

.hero-subtitle {
  font-size: 1.1rem;
  color: var(--color-text-secondary);
  max-width: 500px;
  margin: 0 auto;
}

.games-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 24px;
  max-width: 1080px;
  margin: 0 auto;
}

.game-card {
  background: var(--color-surface);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
  overflow: hidden;
  transition: all var(--transition-medium);
  display: flex;
  flex-direction: column;
  animation: fadeInUp 0.5s ease forwards;
  opacity: 0;
}

.game-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-hover);
}

.game-card-icon {
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3.5rem;
  color: white;
}

.game-card-body {
  padding: 20px 24px 12px;
  flex: 1;
}

.game-card-title {
  font-size: 1.4rem;
  font-weight: 700;
  margin-bottom: 2px;
}

.game-card-subtitle {
  font-size: 0.85rem;
  color: var(--color-text-secondary);
  margin-bottom: 10px;
}

.game-card-desc {
  font-size: 0.9rem;
  color: var(--color-text-secondary);
  line-height: 1.5;
}

.game-card-footer {
  padding: 12px 24px 20px;
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.game-card-tag {
  font-size: 0.75rem;
  padding: 4px 10px;
  background: var(--color-bg-secondary);
  color: var(--color-text-secondary);
  border-radius: 20px;
  font-weight: 500;
}

@media (max-width: 640px) {
  .hero-title {
    font-size: 1.6rem;
  }

  .games-grid {
    grid-template-columns: 1fr;
  }
}
</style>
