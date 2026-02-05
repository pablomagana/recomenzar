<script setup lang="ts">
import TabBar from '@/components/common/TabBar.vue'
</script>

<template>
  <div class="tabs-layout">
    <router-view v-slot="{ Component }">
      <keep-alive>
        <component :is="Component" />
      </keep-alive>
    </router-view>
    <TabBar />
  </div>
</template>

<style scoped>
.tabs-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #F5F5F5;
}
</style>
