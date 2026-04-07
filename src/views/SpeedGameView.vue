<template>
  <div class="game-view">
    <div class="game-header">
      <h1 class="game-title text-chinese">快速反应</h1>
      <p class="game-subtitle">{{ t('view.speed') }}</p>
    </div>
    <HskLevelPicker v-model="hskLevel" @update:model-value="resetGame" />
    <SpeedChallenge
      :hsk-level="hskLevel" :key="gameKey"
      @correct="onCorrect" @incorrect="onIncorrect"
      @game-start="onGameStart" @game-complete="onGameComplete"
    />
    <GameOverModal
      v-if="gameState.isComplete.value" :title="t('speed.timesUp')"
      :score="score.score.value" :time="'60s'" :accuracy="score.accuracy.value"
      @play-again="resetGame" @go-home="$router.push('/')"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import GameOverModal from '../components/shared/GameOverModal.vue'
import HskLevelPicker from '../components/shared/HskLevelPicker.vue'
import SpeedChallenge from '../components/speed/SpeedChallenge.vue'
import { useScore } from '../composables/useScore'
import { useGameState } from '../composables/useGameState'
import { addGameSession, recordWordCorrect } from '../data/statsStore'
import { useI18n } from '../composables/useI18n'

const { t } = useI18n()
const score = useScore()
const gameState = useGameState()
const hskLevel = ref('Beginner')
const gameKey = ref(0)

function onGameStart() { gameState.start() }
function onCorrect(payload) { score.addCorrect(15); if (payload?.word) recordWordCorrect(payload.word) }
function onIncorrect() { score.addIncorrect() }
function onGameComplete() {
  gameState.complete()
  addGameSession('speed', 60, score.correct.value)
}
function resetGame() { score.reset(); gameState.reset(); gameKey.value++ }
</script>

<style scoped>
.game-view { max-width: 800px; margin: 0 auto; }
.game-header { text-align: center; margin-bottom: 20px; }
.game-title { font-size: 1.8rem; font-weight: 700; }
.game-subtitle { color: var(--color-text-secondary); font-size: 0.95rem; }
</style>
