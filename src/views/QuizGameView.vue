<template>
  <div class="quiz-page">
    <div class="quiz-app">
      <!-- Quiz phase -->
      <template v-if="phase === 'quiz'">
        <h1 class="quiz-title text-chinese">{{ '\u{1F962}' }} 你是哪道 <br>武汉味道？</h1>
        <div class="quiz-subtitle">
          <span class="badge">活结</span>
          <span class="badge">蒜鸟</span>
          <span class="badge">蛮扎实</span>
        </div>

        <QuizProgress :current="currentIndex" :total="20" />

        <QuizQuestion
          :question="currentQuestion"
          :index="currentIndex"
          :selected="currentAnswer"
          @select="selectOption"
        />

        <div class="nav-buttons">
          <button class="btn" :disabled="isFirst" @click="prev">{{ t('quiz.prev') }}</button>
          <button
            class="btn primary"
            :disabled="currentAnswer === null"
            @click="handleNext"
          >
            {{ isLast ? t('quiz.seeResult') : t('quiz.next') }}
          </button>
        </div>
      </template>

      <!-- Result phase -->
      <QuizResult v-else :food="result" @restart="handleRestart" />

      <div class="quiz-footer">—— 拐子, 蛮有味！——</div>
    </div>
  </div>
</template>

<script setup>
import { watch, nextTick } from 'vue'
import QuizProgress from '../components/quiz/QuizProgress.vue'
import QuizQuestion from '../components/quiz/QuizQuestion.vue'
import QuizResult from '../components/quiz/QuizResult.vue'
import { useQuiz } from '../composables/useQuiz'
import { useI18n } from '../composables/useI18n'

const { t } = useI18n()
const {
  phase, currentIndex, currentQuestion, currentAnswer,
  progress, isFirst, isLast, result,
  selectOption, next, prev, restart
} = useQuiz()

function handleNext() {
  next()
}

function handleRestart() {
  restart()
  nextTick(() => window.scrollTo({ top: 0, behavior: 'smooth' }))
}

watch(phase, (val) => {
  if (val === 'result') {
    nextTick(() => window.scrollTo({ top: 0, behavior: 'smooth' }))
  }
})
</script>

<style scoped>
.quiz-page {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 16px 12px;
}

.quiz-app {
  max-width: 500px;
  width: 100%;
  background: #fef7e9;
  border-radius: 48px 48px 32px 32px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3), 0 0 0 2px #c9a87c inset;
  overflow: hidden;
  padding: 24px 16px 32px;
  position: relative;
}

.quiz-app::before {
  content: '\1F962';
  position: absolute;
  top: 16px;
  right: 20px;
  font-size: 40px;
  opacity: 0.15;
  transform: rotate(25deg);
}

.quiz-app::after {
  content: '\1F35C';
  position: absolute;
  bottom: 10px;
  left: 16px;
  font-size: 50px;
  opacity: 0.1;
  transform: rotate(-15deg);
}

.quiz-title {
  font-size: 32px;
  font-weight: 800;
  color: #4a2c0f;
  text-align: center;
  margin-bottom: 4px;
  letter-spacing: 2px;
  text-shadow: 3px 3px 0 #e8c48a;
  position: relative;
  z-index: 2;
}

.quiz-subtitle {
  text-align: center;
  color: #7a5a3a;
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 20px;
  border-bottom: 2px dashed #c9a87c;
  padding-bottom: 16px;
  position: relative;
  z-index: 2;
}

.badge {
  background: #a8351f;
  color: #fef7e9;
  padding: 4px 12px;
  border-radius: 30px;
  font-size: 14px;
  margin: 0 4px;
}

.nav-buttons {
  display: flex;
  gap: 12px;
  margin-top: 8px;
  position: relative;
  z-index: 2;
}

.btn {
  flex: 1;
  padding: 16px;
  border-radius: 60px;
  font-weight: 700;
  font-size: 18px;
  border: 2px solid #e8c48a;
  background: #c9a87c;
  color: #3d2b14;
  cursor: pointer;
  box-shadow: 0 6px 0 #7a5a3a;
  transition: all 0.1s;
  text-align: center;
}

.btn:active {
  transform: translateY(4px);
  box-shadow: 0 2px 0 #7a5a3a;
}

.btn.primary {
  background: #a8351f;
  color: white;
  border-color: #d9624a;
  box-shadow: 0 6px 0 #631e0e;
}

.btn:disabled {
  opacity: 0.5;
  transform: none;
  box-shadow: 0 4px 0 #7a5a3a;
  cursor: not-allowed;
}

.quiz-footer {
  text-align: center;
  margin-top: 16px;
  color: #8b5e2e;
  font-size: 13px;
  position: relative;
  z-index: 2;
}
</style>
