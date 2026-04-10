import { ref, computed } from 'vue'
import { questions, scoreMap, foods } from '../data/quizData'

export function useQuiz() {
  const phase = ref('quiz') // 'quiz' | 'result'
  const currentIndex = ref(0)
  const answers = ref(new Array(questions.length).fill(null))

  const currentQuestion = computed(() => questions[currentIndex.value])
  const progress = computed(() => ((currentIndex.value + 1) / questions.length) * 100)
  const isFirst = computed(() => currentIndex.value === 0)
  const isLast = computed(() => currentIndex.value === questions.length - 1)
  const currentAnswer = computed(() => answers.value[currentIndex.value])

  const result = computed(() => {
    const traitScores = new Array(17).fill(0)
    for (let i = 0; i < questions.length; i++) {
      const ans = answers.value[i]
      if (ans !== null) {
        traitScores[scoreMap[i][ans]]++
      }
    }
    let maxScore = -1
    let bestTrait = 1
    for (let i = 1; i <= 16; i++) {
      if (traitScores[i] > maxScore) {
        maxScore = traitScores[i]
        bestTrait = i
      }
    }
    return { ...foods[bestTrait], id: bestTrait }
  })

  function selectOption(optIdx) {
    const arr = [...answers.value]
    arr[currentIndex.value] = optIdx
    answers.value = arr
  }

  function next() {
    if (currentAnswer.value === null) return false
    if (isLast.value) {
      phase.value = 'result'
      return true
    }
    currentIndex.value++
    return true
  }

  function prev() {
    if (!isFirst.value) currentIndex.value--
  }

  function restart() {
    currentIndex.value = 0
    answers.value = new Array(questions.length).fill(null)
    phase.value = 'quiz'
  }

  return {
    phase, currentIndex, answers,
    currentQuestion, progress, isFirst, isLast, currentAnswer, result,
    selectOption, next, prev, restart
  }
}
