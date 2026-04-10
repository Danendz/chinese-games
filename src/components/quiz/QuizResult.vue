<template>
  <div class="result-card">
    <div class="food-badge">{{ food.name }}</div>
    <div class="food-sub">{{ food.trait }}</div>

    <QuizFoodArt :css-class="food.cssClass" :food-id="food.id" />

    <div class="desc">{{ food.desc }}</div>
    <div class="wuhan-slang">{{ food.slang }}</div>

    <button class="btn primary restart-btn" @click="$emit('restart')">
      🔁 再测一回
    </button>
  </div>
</template>

<script setup>
import QuizFoodArt from './QuizFoodArt.vue'

defineProps({
  food: { type: Object, required: true }
})

defineEmits(['restart'])
</script>

<style scoped>
.result-card {
  background: #fff9ef;
  border-radius: 36px;
  padding: 30px 18px 20px;
  box-shadow: 0 12px 0 #8b5e2e, 0 4px 16px rgba(0, 0, 0, 0.15);
  border: 3px solid #c9a87c;
  text-align: center;
  position: relative;
}

.food-badge {
  font-size: 42px;
  font-weight: 900;
  color: #a8351f;
  text-shadow: 3px 3px 0 #e8c48a;
  margin-bottom: 6px;
  letter-spacing: 4px;
}

.food-sub {
  color: #7a5a3a;
  font-weight: 600;
  margin-bottom: 20px;
  border-bottom: 2px dotted #c9a87c;
  padding-bottom: 14px;
}

.desc {
  background: #f4e8d8;
  padding: 18px 16px;
  border-radius: 28px;
  font-size: 15px;
  color: #3d2b14;
  margin: 20px 0 12px;
  border: 2px solid #c9a87c;
  line-height: 1.6;
  text-align: left;
}

.wuhan-slang {
  background: #a8351f;
  color: #fef7e9;
  padding: 14px 16px;
  border-radius: 40px;
  font-weight: 600;
  font-size: 16px;
  margin: 12px 0;
  border: 2px solid #631e0e;
  text-align: center;
}

.btn {
  flex: 1;
  padding: 16px;
  border-radius: 60px;
  font-weight: 700;
  font-size: 18px;
  border: none;
  background: #c9a87c;
  color: #3d2b14;
  cursor: pointer;
  box-shadow: 0 6px 0 #7a5a3a;
  border: 2px solid #e8c48a;
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

.restart-btn {
  width: 100%;
  margin-top: 16px;
}
</style>
