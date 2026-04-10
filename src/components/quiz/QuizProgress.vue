<template>
  <div class="quiz-progress">
    <div class="progress-container">
      <div class="progress-bar" :style="{ width: percent + '%' }"></div>
    </div>
    <div class="progress-text">{{ current + 1 }} / {{ total }}</div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  current: { type: Number, required: true },
  total: { type: Number, required: true }
})

const percent = computed(() => ((props.current + 1) / props.total) * 100)
</script>

<style scoped>
.progress-container {
  background: #d9c2a7;
  height: 8px;
  border-radius: 20px;
  margin-bottom: 20px;
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  background: #a8351f;
  border-radius: 20px;
  transition: width 0.3s ease;
  box-shadow: 0 0 6px #e06b4a;
}

.progress-text {
  text-align: right;
  font-size: 13px;
  color: #7a5a3a;
  margin-top: 4px;
  margin-bottom: 8px;
  font-weight: 500;
}
</style>
