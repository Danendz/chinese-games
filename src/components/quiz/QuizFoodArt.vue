<template>
  <div class="food-illustration">
    <img :src="image" :alt="alt" class="food-img" />
  </div>
</template>

<script setup>
defineProps({
  image: { type: String, required: true },
  alt: { type: String, default: '' }
})
</script>

<style scoped>
.food-illustration {
  width: 100%;
  margin: 6px 0 10px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.food-img {
  max-width: 220px;
  width: 100%;
  height: auto;
  border-radius: 20px;
  image-rendering: pixelated;
}
</style>
