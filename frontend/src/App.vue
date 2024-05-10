<template>
  <MainCard />
</template>

<script setup>
import MainCard from '@/components/MainCard.vue'
</script>

<style>
@import url('https://fonts.googleapis.com/css?family=Manrope:700|Manrope:400');

:root {
  --text: hsl(0, 0%, 99%);
  --primaryHi: hsla(155, 100%, 75%, 25%);
  --primaryFg: hsl(155, 100%, 85%);
  --accentBg: hsla(155, 100%, 94%, 1%);
  --accentHi: hsla(155, 100%, 100%, 25%);
  font-size: 20px;
}

#app {
  background-image: url("@/assets/background.jpg");
  height: 100vh;
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  font-family: 'Manrope';
  font-weight: 400;
  color: var(--text);
  line-height: 1.5;
}
</style>
