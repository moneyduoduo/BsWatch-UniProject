<template>
	<uni-popup ref="bleOffPopup" @mask-click="close">
		<view class="box">
			<view class="title">Please Enter Calibration</view>
			<view class="content">
				<input v-model="value" class="input" type="number" placeholder="Please enter">
				<view class="unit">mg/dL</view>
			</view>
			<view class="footer">
				<view class="btn other" @tap="close">Cancel</view>
				<view class="btn" @tap="submit">OK</view>
			</view>
		</view>
	</uni-popup>
</template>

<script setup>
	import {
		ref,
		watch
	} from 'vue';

	const emits = defineEmits(['update:modelValue', 'handle'])
	const props = defineProps({
		modelValue: {
			type: Boolean,
			default: false
		}
	})
	const bleOffPopup = ref(null);

	const value = ref('');

	watch(() => props.modelValue, val => {
		if (val) {
			bleOffPopup.value.open();
		} else {
			bleOffPopup.value.close();
		}
	})

	const submit = () => {
		if (value.value !== '') {
			emits('handle', value.value);
		}
	}

	const close = () => {
		value.value = '';
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
			padding: 0 24rpx;
			margin: 32rpx 32rpx 64rpx;
			height: 96rpx;
			background: #F3F3F3;
			border-radius: 8rpx;
			display: flex;
			align-items: center;
			justify-content: space-between;

			.input {
				flex: 1;
				height: 100%;
				text-align: left;
			}

			.unit {
				margin-left: 12rpx;
				color: rgba(0, 0, 0, 0.4);
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

				&.other {
					color: #000000;
				}
			}
		}
	}
</style>