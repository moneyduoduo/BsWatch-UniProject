<template>
  <view :style="{ height: statusBarHeight }" class="uni-status-bar">
    <slot/>
  </view>
</template>
<script setup>
import { ref, onMounted } from 'vue';

const statusBarHeight = ref('20px');

onMounted(() => {
  statusBarHeight.value = uni.getSystemInfoSync().statusBarHeight + 'px';
});
</script>

<style lang="scss" scoped>
.uni-status-bar {
  // height: 20px;
  height: var(--status-bar-height);
}
</style>
