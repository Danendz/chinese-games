<template>
  <div class="question-card">
    <div class="q-num">第 {{ index + 1 }} 题</div>
    <div class="q-text">{{ question.q }}</div>
    <div class="options">
      <div
        v-for="(opt, optIdx) in question.opts"
        :key="optIdx"
        class="option"
        :class="{ selected: selected === optIdx }"
        @click="$emit('select', optIdx)"
      >
        {{ String.fromCharCode(65 + optIdx) }}. {{ opt }}
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  question: { type: Object, required: true },
  index: { type: Number, required: true },
  selected: { type: Number, default: null }
})

defineEmits(['select'])
</script>

<style scoped>
.question-card {
  background: #fff9ef;
  border-radius: 24px;
  padding: 24px 16px 16px;
  box-shadow: 0 6px 0 #8b5e2e, 0 4px 12px rgba(0, 0, 0, 0.1);
  border: 2px solid #c9a87c;
  margin-bottom: 12px;
  position: relative;
}

.q-num {
  position: absolute;
  top: -14px;
  left: 24px;
  background: #a8351f;
  color: white;
  font-weight: bold;
  padding: 4px 18px;
  border-radius: 40px;
  font-size: 16px;
  box-shadow: 0 4px 0 #631e0e;
  border: 2px solid #fef7e9;
}

.q-text {
  font-size: 17px;
  font-weight: 700;
  color: #3d2b14;
  margin-bottom: 16px;
  line-height: 1.4;
}

.options {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.option {
  background: #f4e8d8;
  border: 2px solid #b6926e;
  border-radius: 60px;
  padding: 12px 16px;
  font-size: 15px;
  color: #3d2b14;
  font-weight: 500;
  text-align: left;
  cursor: pointer;
  transition: all 0.15s;
  box-shadow: 0 4px 0 #7a5a3a;
  line-height: 1.4;
}

.option:hover {
  background: #ecdcc8;
  transform: translateY(-1px);
  box-shadow: 0 5px 0 #7a5a3a;
}

.option.selected {
  background: #a8351f;
  border-color: #631e0e;
  color: white;
  box-shadow: 0 4px 0 #4f170a;
}
</style>
