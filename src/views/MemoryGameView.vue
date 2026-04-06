<template>
  <div class="game-view">
    <div class="game-header">
      <h1 class="game-title text-chinese">汉字配对翻牌</h1>
      <p class="game-subtitle">Character Matching Memory Game</p>
    </div>
    <GameToolbar :score="score.score.value" :timer="timer.formatted.value" :is-playing="gameState.isPlaying.value" />
    <HskLevelPicker v-model="hskLevel" @update:model-value="resetGame" />
    <div class="controls-bar">
      <button
        v-for="d in difficulties" :key="d.value"
        class="ctrl-btn" :class="{ active: difficulty === d.value }"
        @click="difficulty = d.value; resetGame()"
      >{{ d.label }}</button>
      <button class="ctrl-btn infinite-btn" :class="{ active: infiniteMode }" @click="toggleInfinite">
        ∞ Infinite
      </button>
    </div>
    <MemoryBoard
      :hsk-level="hskLevel" :difficulty="difficulty" :infinite="infiniteMode" :key="gameKey"
      @match-found="onMatchFound" @mismatch="onMismatch"
      @game-complete="onGameComplete" @game-start="onGameStart" @round-complete="onRoundComplete"
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
import MemoryBoard from '../components/memory/MemoryBoard.vue'
import { useTimer } from '../composables/useTimer'
import { useScore } from '../composables/useScore'
import { useGameState } from '../composables/useGameState'

const timer = useTimer()
const score = useScore()
const gameState = useGameState()

const hskLevel = ref('Beginner')
const difficulty = ref('4x3')
const gameKey = ref(0)
const infiniteMode = ref(false)

const difficulties = [
  { label: 'Easy (4x3)', value: '4x3' },
  { label: 'Medium (4x4)', value: '4x4' },
  { label: 'Hard (6x4)', value: '6x4' }
]

function onGameStart() { gameState.start(); timer.start() }
function onMatchFound() { score.addCorrect(10) }
function onMismatch() { score.addIncorrect() }
function onGameComplete() { if (infiniteMode.value) return; timer.pause(); gameState.complete() }
function onRoundComplete() {}
function toggleInfinite() { infiniteMode.value = !infiniteMode.value; resetGame() }
function resetGame() { timer.reset(); score.reset(); gameState.reset(); gameKey.value++ }
</script>

<style scoped>
.game-view { max-width: 800px; margin: 0 auto; }
.game-header { text-align: center; margin-bottom: 20px; }
.game-title { font-size: 1.8rem; font-weight: 700; }
.game-subtitle { color: var(--color-text-secondary); font-size: 0.95rem; }

.controls-bar {
  display: flex; justify-content: center; gap: 8px; margin-bottom: 24px; flex-wrap: wrap;
}
.ctrl-btn {
  padding: 8px 16px; border-radius: 20px; font-size: 0.85rem; font-weight: 500;
  background: var(--color-bg-secondary); color: var(--color-text-secondary); transition: all var(--transition-fast);
}
.ctrl-btn.active { background: var(--color-primary); color: white; }
.ctrl-btn:hover:not(.active) { background: var(--color-border); }
.infinite-btn.active { background: #e17055; }
</style>
