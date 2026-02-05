<script setup lang="ts">
interface Props {
  size?: 'small' | 'medium' | 'large'
}

withDefaults(defineProps<Props>(), {
  size: 'medium'
})
</script>

<template>
  <div class="spinner-container" :class="size">
    <div class="spinner"></div>
  </div>
</template>

<style scoped>
.spinner-container {
  display: flex;
  justify-content: center;
  align-items: center;
}

.spinner {
  border-radius: 50%;
  border-style: solid;
  border-color: #E8F5E9;
  border-top-color: #2E7D32;
  animation: spin 0.8s linear infinite;
}

.small .spinner {
  width: 20px;
  height: 20px;
  border-width: 2px;
}

.medium .spinner {
  width: 32px;
  height: 32px;
  border-width: 3px;
}

.large .spinner {
  width: 48px;
  height: 48px;
  border-width: 4px;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
