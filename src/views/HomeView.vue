<template>
  <div class="home">
    <section class="hero">
      <h1 class="hero-title text-chinese">Learn Chinese Through Games</h1>
      <p class="hero-subtitle">
        Master Chinese characters, radicals, and sentence structures with fun interactive games.
      </p>
    </section>

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
const games = [
  {
    route: '/memory',
    icon: '牌',
    title: '汉字配对翻牌',
    subtitle: 'Character Matching',
    description: 'Flip cards to match Chinese characters with their pinyin and meaning. Train your memory while learning new words!',
    gradient: 'linear-gradient(135deg, #e17055, #d63031)',
    tags: ['Beginner - HSK9', 'Vocabulary', 'Memory']
  },
  {
    route: '/radicals',
    icon: '拼',
    title: '偏旁组字',
    subtitle: 'Radical Puzzle',
    description: 'Drag and combine radicals to build Chinese characters. Understand how characters are constructed!',
    gradient: 'linear-gradient(135deg, #0984e3, #6c5ce7)',
    tags: ['Beginner - HSK9', 'Radicals', 'Structure']
  },
  {
    route: '/sentences',
    icon: '句',
    title: '句子排序',
    subtitle: 'Sentence Ordering',
    description: 'Arrange jumbled words into correct Chinese sentences. Master grammar patterns and word order!',
    gradient: 'linear-gradient(135deg, #00b894, #00cec9)',
    tags: ['Beginner - HSK9', 'Grammar', 'Sentences']
  },
  {
    route: '/listening',
    icon: '听',
    title: '听力挑战',
    subtitle: 'Listening Quiz',
    description: 'Listen to Chinese words spoken aloud and select the correct meaning. Train your listening comprehension!',
    gradient: 'linear-gradient(135deg, #a29bfe, #6c5ce7)',
    tags: ['Beginner - HSK9', 'Listening', 'Pronunciation']
  },
  {
    route: '/idioms',
    icon: '成',
    title: '成语填空',
    subtitle: 'Idiom Fill',
    description: 'Complete Chinese idioms by filling in the missing character. Master common expressions and proverbs!',
    gradient: 'linear-gradient(135deg, #fd79a8, #e84393)',
    tags: ['HSK1-3 - HSK9', 'Idioms', 'Vocabulary']
  },
  {
    route: '/pictures',
    icon: '图',
    title: '看图猜词',
    subtitle: 'Picture Quiz',
    description: 'See an emoji or image and guess the Chinese word it represents. A fun visual learning experience!',
    gradient: 'linear-gradient(135deg, #55efc4, #00b894)',
    tags: ['Beginner - HSK9', 'Visual', 'Vocabulary']
  },
  {
    route: '/my-words',
    icon: '词',
    title: '我的词库',
    subtitle: 'My Words',
    description: 'Add your own vocabulary, sentences and radical puzzles. Review them in any game with custom content!',
    gradient: 'linear-gradient(135deg, #fdcb6e, #e17055)',
    tags: ['Custom', 'Review', 'Personal']
  }
]
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
