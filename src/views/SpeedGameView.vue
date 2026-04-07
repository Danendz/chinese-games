<template>
  <div class="game-view">
    <div class="game-header">
      <h1 class="game-title text-chinese">快速反应</h1>
      <p class="game-subtitle">Speed Challenge - Beat the Clock</p>
    </div>
    <GameToolbar :score="score.score.value" :timer="timer.formatted.value" :is-playing="gameState.isPlaying.value" />
    <HskLevelPicker v-model="hskLevel" @update:model-value="resetGame" />
    <div class="infinite-bar">
      <button class="infinite-btn" :class="{ active: infiniteMode }" @click="toggleInfinite">&#x221E; Infinite</button>
    </div>
    <SpeedChallenge
      :hsk-level="hskLevel" :infinite="infiniteMode" :key="gameKey"
      @correct="onCorrect" @incorrect="onIncorrect"
      @game-start="onGameStart" @game-complete="onGameComplete" @round-complete="onRoundComplete"
    />
    <GameOverModal
      v-if="gameState.isComplete.value && !infiniteMode" title="Well Done!"
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
import SpeedChallenge from '../components/speed/SpeedChallenge.vue'
import { useTimer } from '../composables/useTimer'
import { useScore } from '../composables/useScore'
import { useGameState } from '../composables/useGameState'
import { addGameSession, recordWordCorrect } from '../data/statsStore'

const timer = useTimer()
const score = useScore()
const gameState = useGameState()
const hskLevel = ref('Beginner')
const gameKey = ref(0)
const infiniteMode = ref(false)

function onGameStart() { gameState.start(); timer.start() }
function onCorrect(payload) { score.addCorrect(15); if (payload?.word) recordWordCorrect(payload.word) }
function onIncorrect() { score.addIncorrect() }
function onGameComplete() {
  if (infiniteMode.value) return
  timer.pause(); gameState.complete()
  addGameSession('speed', timer.elapsed.value, score.correct.value)
}
function onRoundComplete() {
  if (infiniteMode.value) addGameSession('speed', timer.elapsed.value, score.correct.value)
}
function toggleInfinite() { infiniteMode.value = !infiniteMode.value; resetGame() }
function resetGame() { timer.reset(); score.reset(); gameState.reset(); gameKey.value++ }
</script>

<style scoped>
.game-view { max-width: 800px; margin: 0 auto; }
.game-header { text-align: center; margin-bottom: 20px; }
.game-title { font-size: 1.8rem; font-weight: 700; }
.game-subtitle { color: var(--color-text-secondary); font-size: 0.95rem; }
.infinite-bar { display: flex; justify-content: center; margin-bottom: 20px; }
.infinite-btn {
  padding: 8px 20px; border-radius: 20px; font-size: 0.85rem; font-weight: 600;
  background: var(--color-bg-secondary); color: var(--color-text-secondary); transition: all var(--transition-fast);
}
.infinite-btn.active { background: #e17055; color: white; }
.infinite-btn:hover:not(.active) { background: var(--color-border); }
</style>
