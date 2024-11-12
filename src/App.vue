<script setup>
  import Chooser from './chooser.vue'
  import Customizer from './customizer.vue'
  import Viewer from './viewer.vue'
</script>

<template>
  <Suspense>
    <Chooser />
    <Customizer />
    <Viewer />
  </Suspense>
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
