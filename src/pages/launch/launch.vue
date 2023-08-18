<template>
	<view class="launch">
	</view>
</template>

<script setup>
	import {
		onMounted
	} from 'vue';
	import {
		getPath
	} from '@/config'
	import {
		useStore
	} from '@/store/global.js'

	onMounted(() => {
		setTimeout(() => {
			const store = useStore()
			if (store.isRegister) {
				uni.reLaunch({
					url: getPath('首页')
				})
			} else {
				uni.reLaunch({
					url: getPath('登录')
				})
			}
		}, 0)

	})
</script>

<style lang="scss" scoped>

</style>