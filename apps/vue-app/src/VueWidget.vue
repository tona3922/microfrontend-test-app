<template>
  <div class="vue-widget">
    <h2>Vue Micro Frontend</h2>
    <p>This component is loaded remotely via Module Federation.</p>
    <button @click="count++">Count: {{ count }}</button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const count = ref(0)
</script>

<style scoped>
.vue-widget {
  border: 2px solid #42b883;
  border-radius: 8px;
  padding: 24px;
  background: #1a1a2e;
  color: #42b883;
}
.vue-widget p {
  color: #fff;
  margin: 0 0 16px;
}
.vue-widget h2 {
  margin: 0 0 12px;
}
button {
  background: #42b883;
  color: #1a1a2e;
  border: none;
  border-radius: 4px;
  padding: 8px 16px;
  cursor: pointer;
  font-weight: bold;
  font-size: 14px;
}
</style>
