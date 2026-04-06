import { ref, computed } from 'vue'

export function useGameState() {
  const state = ref('idle') // idle | playing | complete

  const isPlaying = computed(() => state.value === 'playing')
  const isComplete = computed(() => state.value === 'complete')
  const isIdle = computed(() => state.value === 'idle')

  function start() {
    state.value = 'playing'
  }

  function complete() {
    state.value = 'complete'
  }

  function reset() {
    state.value = 'idle'
  }

  return { state, isPlaying, isComplete, isIdle, start, complete, reset }
}
