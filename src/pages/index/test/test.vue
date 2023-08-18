<template>
	<view class="test">
		{{ data }}
	</view>
</template>

<script setup>
	import {
		ref
	} from 'vue';
	const hippoWatch = uni.requireNativePlugin("hippo-watch");
	import {
		onLoad
	} from '@dcloudio/uni-app';

	const data = ref(null);
	onLoad(({
		key
	}) => {
		console.log(key);
		if (key === '1') {
			console.log(111);
			hippoWatch.customizeCGM(res => {
				data.value = JSON.stringify(res);
				console.log(data.value);
			})
		}
		if (key === '2') {
			console.log(222);
			hippoWatch.healthHistoryData(res => {
				data.value = JSON.stringify(res);
				console.log(data.value);
			})
		}
	})
</script>

<style lang="scss" scoped>
	.test {
		height: 100vh;
		overflow: auto;
		padding: 100rpx;
	}
</style>