<template>
  <div class="game-view">
    <div class="game-header">
      <h1 class="game-title text-chinese">拼音拼写</h1>
      <p class="game-subtitle">{{ t('view.pinyin') }}</p>
    </div>
    <GameToolbar :score="score.score.value" :timer="timer.formatted.value" :is-playing="gameState.isPlaying.value" />
    <HskLevelPicker v-model="hskLevel" :show-my-words="false" @update:model-value="resetGame" />
    <PinyinSpelling
      :hsk-level="hskLevel" :key="gameKey"
      @correct="onCorrect" @incorrect="onIncorrect"
      @game-start="onGameStart" @game-complete="onGameComplete"
    />
    <GameOverModal
      v-if="gameState.isComplete.value" :title="t('game.wellDone')"
      :score="score.score.value" :time="timer.formatted.value" :accuracy="score.accuracy.value"
      @play-again="resetGame" @go-home="$router.push('/')"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import GameToolbar from '../components/shared/GameToolbar.vue'
import GameOverModal from '../components/shared/GameOverModal.vue'
import HskLevelPicker from '../components/shared/HskLevelPicker.vue'
import PinyinSpelling from '../components/pinyin/PinyinSpelling.vue'
import { useTimer } from '../composables/useTimer'
import { useScore } from '../composables/useScore'
import { useGameState } from '../composables/useGameState'
import { addGameSession, recordWordCorrect } from '../data/statsStore'
import { useI18n } from '../composables/useI18n'

const { t } = useI18n()
const timer = useTimer()
const score = useScore()
const gameState = useGameState()
const hskLevel = ref('Beginner')
const gameKey = ref(0)

function onGameStart() { gameState.start(); timer.start() }
function onCorrect(payload) { score.addCorrect(15); if (payload?.word) recordWordCorrect(payload.word) }
function onIncorrect() { score.addIncorrect() }
function onGameComplete() {
  timer.pause(); gameState.complete()
  addGameSession('pinyin', timer.elapsed.value, score.correct.value)
}
function resetGame() { timer.reset(); score.reset(); gameState.reset(); gameKey.value++ }
</script>

<style scoped>
.game-view { max-width: 800px; margin: 0 auto; }
.game-header { text-align: center; margin-bottom: 20px; }
.game-title { font-size: 1.8rem; font-weight: 700; }
.game-subtitle { color: var(--color-text-secondary); font-size: 0.95rem; }
</style>
