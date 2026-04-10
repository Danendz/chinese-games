<template>
  <div class="food-illustration">
    <div :class="['css-food', cssClass]">
      <!-- 热干面 -->
      <template v-if="foodId === 1">
        <div class="bowl"></div>
        <div class="noodles"></div>
        <div class="sesame"></div>
      </template>
      <!-- 鲜鱼糊汤粉 -->
      <template v-else-if="foodId === 2">
        <div class="bowl"></div>
        <div class="noodles"></div>
        <div class="soup"></div>
      </template>
      <!-- 苕面窝 -->
      <template v-else-if="foodId === 3">
        <div class="donut"></div>
      </template>
      <!-- 生烫牛肉粉 -->
      <template v-else-if="foodId === 4">
        <div class="bowl"></div>
        <div class="noodles"></div>
        <div class="beef-slices"><div class="beef"></div><div class="beef"></div><div class="beef"></div></div>
      </template>
      <!-- 欢喜坨 -->
      <template v-else-if="foodId === 5">
        <div class="ball"></div>
      </template>
      <!-- 糯米鸡 -->
      <template v-else-if="foodId === 6">
        <div class="lump"></div>
      </template>
      <!-- 汽水包 -->
      <template v-else-if="foodId === 7">
        <div class="bun"></div>
      </template>
      <!-- 三鲜豆皮 -->
      <template v-else-if="foodId === 8">
        <div class="square"></div>
      </template>
      <!-- 糯米包油条 -->
      <template v-else-if="foodId === 9">
        <div class="roll"></div>
      </template>
      <!-- 米粑粑 -->
      <template v-else-if="foodId === 10">
        <div class="pair"><div class="cake"></div><div class="cake"></div></div>
      </template>
      <!-- 蛋酒 -->
      <template v-else-if="foodId === 11">
        <div class="cup"></div>
      </template>
      <!-- 鸡冠饺 -->
      <template v-else-if="foodId === 12">
        <div class="cockscomb"></div>
      </template>
      <!-- 长沙臭豆腐 -->
      <template v-else-if="foodId === 13">
        <div class="tofu-block"></div>
      </template>
      <!-- 汤包 -->
      <template v-else-if="foodId === 14">
        <div class="basket"></div>
      </template>
      <!-- 重油烧梅 -->
      <template v-else-if="foodId === 15">
        <div class="siu-mai"></div>
      </template>
      <!-- 排骨藕汤 -->
      <template v-else-if="foodId === 16">
        <div class="pot"></div>
      </template>
    </div>
  </div>
</template>

<script setup>
defineProps({
  cssClass: { type: String, required: true },
  foodId: { type: Number, required: true }
})
</script>

<style scoped>
.food-illustration {
  width: 100%;
  min-height: 140px;
  margin: 10px 0 16px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.css-food {
  width: 100%;
  max-width: 280px;
  margin: 0 auto;
  position: relative;
}

/* 热干面 */
.food-reganmian { display: flex; flex-direction: column; align-items: center; }
.bowl {
  width: 180px; height: 90px;
  background: #e0c9a6;
  border-radius: 0 0 100px 100px;
  border: 5px solid #b68b5c; border-top: none;
  position: relative;
  box-shadow: inset 0 8px 0 #c9a87c, 0 8px 0 #7a5a3a;
}
.noodles {
  width: 160px; height: 50px;
  background: #d4a43a;
  border-radius: 40% 40% 30% 30%;
  margin: -25px auto 0;
  box-shadow: 0 -4px 0 #b8862d, inset 0 4px 8px #f3d27e;
  position: relative; z-index: 2;
}
.noodles::before {
  content: '\1F962'; font-size: 36px;
  position: absolute; right: -18px; top: -18px;
  transform: rotate(25deg);
}
.sesame {
  width: 90px; height: 18px;
  background: #5c3e1f;
  margin: 6px auto 0;
  border-radius: 20px; opacity: 0.8;
}

/* 糊汤粉 */
.food-hutangfen { display: flex; flex-direction: column; align-items: center; }
.food-hutangfen .bowl { background: #f5e6d3; }
.food-hutangfen .noodles { background: #f3e1c2; box-shadow: 0 -4px 0 #d9b382; }
.soup {
  width: 140px; height: 12px;
  background: #d69c4a;
  border-radius: 10px;
  margin: -8px auto 4px; opacity: 0.6;
}

/* 苕面窝 */
.food-shaomianwo { display: flex; justify-content: center; }
.food-shaomianwo .donut {
  width: 120px; height: 120px;
  background: #d99e4c; border-radius: 50%;
  box-shadow: 0 10px 0 #a56e2a, inset 0 0 0 12px #f5c78a;
  border: 6px solid #b57a32;
  position: relative;
}
.food-shaomianwo .donut::after {
  content: '\1F360'; font-size: 48px;
  position: absolute; top: 20px; left: 30px;
}

/* 生烫牛肉粉 */
.food-beefnoodles { display: flex; flex-direction: column; align-items: center; }
.food-beefnoodles .bowl { background: #c9a87c; }
.beef-slices { display: flex; gap: 8px; justify-content: center; margin-top: 8px; }
.beef {
  width: 35px; height: 22px;
  background: #9e3a2b; border-radius: 20px;
  box-shadow: inset 0 2px 4px #c96b5a;
}

/* 欢喜坨 */
.food-huanxituo { display: flex; justify-content: center; }
.food-huanxituo .ball {
  width: 100px; height: 100px;
  background: #e8b45a; border-radius: 50%;
  box-shadow: 0 8px 0 #a56e2a, inset 0 -6px 0 #f3d27e;
  position: relative;
}
.food-huanxituo .ball::after {
  content: '\26AA'; font-size: 60px; color: #f7e3b4;
  position: absolute; left: 20px; top: 12px;
}

/* 糯米鸡 */
.food-nuomiji { display: flex; justify-content: center; }
.food-nuomiji .lump {
  width: 110px; height: 80px;
  background: #bf8f4a;
  border-radius: 50% 50% 40% 40%;
  box-shadow: 0 8px 0 #8b5e2e, inset 0 -4px 0 #e8c48a;
}

/* 汽水包 */
.food-qishuibao { display: flex; justify-content: center; }
.food-qishuibao .bun {
  width: 120px; height: 60px;
  background: #deb887; border-radius: 50%;
  box-shadow: 0 8px 0 #8b5e2e;
}

/* 三鲜豆皮 */
.food-doupi { display: flex; justify-content: center; }
.food-doupi .square {
  width: 130px; height: 100px;
  background: #e0a63b; border-radius: 16px;
  box-shadow: 0 8px 0 #8b5e2e, inset 0 0 0 6px #f5c78a;
}

/* 糯米包油条 */
.food-nuomibaoyoutiao { display: flex; justify-content: center; }
.food-nuomibaoyoutiao .roll {
  width: 160px; height: 50px;
  background: #e8cfb0; border-radius: 30px;
  box-shadow: 0 8px 0 #b68b5c;
  position: relative;
}
.food-nuomibaoyoutiao .roll::after {
  content: '~~~~'; font-size: 30px; letter-spacing: 6px;
  color: #5c3e1f;
  position: absolute; left: 30px; top: 8px;
}

/* 米粑粑 */
.food-mibaba { display: flex; justify-content: center; }
.pair { display: flex; gap: 8px; justify-content: center; }
.food-mibaba .cake {
  width: 60px; height: 60px;
  background: #f5deb3; border-radius: 50%;
  box-shadow: 0 6px 0 #b68b5c, inset 0 -4px 0 #fff0d4;
}

/* 蛋酒 */
.food-danjiu { display: flex; justify-content: center; }
.food-danjiu .cup {
  width: 80px; height: 100px;
  background: #d9c2a7;
  border-radius: 0 0 40px 40px;
  box-shadow: inset 0 16px 0 #f3e1c2, 0 8px 0 #7a5a3a;
}

/* 鸡冠饺 */
.food-jiguanjiao { display: flex; justify-content: center; }
.food-jiguanjiao .cockscomb {
  width: 130px; height: 70px;
  background: #d9a54e;
  border-radius: 50% 50% 0 50%;
  box-shadow: 0 8px 0 #8b5e2e;
  transform: rotate(-5deg);
}

/* 长沙臭豆腐 */
.food-stinkytofu { display: flex; justify-content: center; }
.food-stinkytofu .tofu-block {
  width: 100px; height: 40px;
  background: #2b2b2b;
  margin: 20px auto;
  box-shadow: 0 8px 0 #111, inset 0 0 0 4px #3a3a3a;
}

/* 汤包 */
.food-tangbao { display: flex; justify-content: center; }
.food-tangbao .basket {
  width: 130px; height: 50px;
  background: #b68b5c; border-radius: 20px;
  box-shadow: 0 8px 0 #7a5a3a;
}

/* 重油烧梅 */
.food-shaomei { display: flex; justify-content: center; }
.food-shaomei .siu-mai {
  width: 80px; height: 50px;
  background: #e8cfb0;
  border-radius: 40% 40% 20% 20%;
  box-shadow: 0 8px 0 #a56e2a;
}

/* 排骨藕汤 */
.food-ou-tang { display: flex; justify-content: center; }
.food-ou-tang .pot {
  width: 140px; height: 90px;
  background: #4a2c0f;
  border-radius: 30px 30px 20px 20px;
  box-shadow: inset 0 20px 0 #7a5a3a, 0 8px 0 #2a1e0f;
}
</style>
