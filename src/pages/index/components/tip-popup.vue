<template>
	<uni-popup ref="bleOffPopup">
		<view class="box">
			<view class="title">Bluetooth off</view>
			<view class="content">Device connection reqiures Bluetooth. Please turn on Bluetooth</view>
			<view class="footer">
				<view class="btn" @tap="close">OK</view>
			</view>
		</view>
	</uni-popup>
</template>

<script setup>
	import {
		ref,
		watch
	} from 'vue';

	const emits = defineEmits(['update:modelValue'])
	const props = defineProps({
		modelValue: {
			type: Boolean,
			default: false
		}
	})
	const bleOffPopup = ref(null);

	watch(() => props.modelValue, val => {
		if (val) {
			bleOffPopup.value.open();
		} else {
			bleOffPopup.value.close();
		}
	})

	const close = () => {
		emits('update:modelValue', false)
	}
</script>

<style lang="scss" scoped>
	.box {
		padding-top: 64rpx;
		margin: 0 50rpx;
		background: #ffffff;
		border-radius: 20rpx;
		text-align: center;

		.title {
			padding: 0 48rpx;
			height: 48rpx;
			line-height: 48rpx;
			font-size: 36rpx;
			font-weight: bold;
		}

		.content {
			padding: 16rpx 48rpx 64rpx;
			font-size: 32rpx;
			line-height: 48rpx;
			color: rgba(0, 0, 0, 0.6);
		}

		.footer {
			height: 114rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			border-top: 1rpx solid #E7E7E7;

			.btn {
				flex: 1;
				height: 48rpx;
				line-height: 48rpx;
				font-size: 32rpx;
				font-weight: bold;
				color: #00D0B5;
			}
		}
	}
</style>