<template>
	<uni-popup ref="bleOffPopup" :mask-click="false">
		<view class="box">
			<view class="title">Device Update</view>
			<view class="content">
				<progress :percent="percent" activeColor="#00D0B5" backgroundColor="#E7E7E7" stroke-width="6"
					border-radius="6" />
				<view class="info">
					<view v-if="type === 1" class="text">Downloading the update</view>
					<view v-else class="text">Updating, please do not turn off the phone or close the App</view>
					<view class="progress">{{ percent }}%</view>
				</view>
			</view>
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
		},
		percent: {
			type: Number,
			default: 0
		},
		type: {
			type: Number
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
		width: 640rpx;
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
			padding: 42rpx 48rpx 64rpx;
			font-size: 32rpx;
			line-height: 48rpx;
			color: rgba(0, 0, 0, 0.6);

			.info {
				margin-top: 12rpx;
				display: flex;
				justify-content: space-between;
				align-items: center;
				font-size: 24rpx;
				color: rgba(0, 0, 0, 0.6);

				.text {
					text-align: left;
				}
			}
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