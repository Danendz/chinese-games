import { ref, computed, onUnmounted } from 'vue'

export function useTimer() {
  const elapsed = ref(0)
  const isRunning = ref(false)
  let intervalId = null

  const formatted = computed(() => {
    const mins = Math.floor(elapsed.value / 60)
    const secs = elapsed.value % 60
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
  })

  function start() {
    if (isRunning.value) return
    isRunning.value = true
    intervalId = setInterval(() => {
      elapsed.value++
    }, 1000)
  }

  function pause() {
    isRunning.value = false
    if (intervalId) {
      clearInterval(intervalId)
      intervalId = null
    }
  }

  function reset() {
    pause()
    elapsed.value = 0
  }

  onUnmounted(() => {
    if (intervalId) clearInterval(intervalId)
  })

  return { elapsed, isRunning, formatted, start, pause, reset }
}
