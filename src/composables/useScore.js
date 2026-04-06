import { ref, computed } from 'vue'

export function useScore() {
  const score = ref(0)
  const streak = ref(0)
  const correct = ref(0)
  const attempts = ref(0)

  const accuracy = computed(() => {
    if (attempts.value === 0) return 100
    return Math.round((correct.value / attempts.value) * 100)
  })

  function addCorrect(points = 10) {
    streak.value++
    correct.value++
    attempts.value++
    score.value += points + streak.value * 2
  }

  function addIncorrect() {
    streak.value = 0
    attempts.value++
  }

  function reset() {
    score.value = 0
    streak.value = 0
    correct.value = 0
    attempts.value = 0
  }

  return { score, streak, correct, attempts, accuracy, addCorrect, addIncorrect, reset }
}
