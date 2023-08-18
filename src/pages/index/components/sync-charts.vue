<template>
	<view class="sync-charts">
		<view class="chart">
			<hd-circle :modelValue="rate" :clockwise="true" size="320rpx" strokeWidth="30" color="#01cfb5"
				layerColor="transparent" strokeLinecap="butt" />
		</view>
		<view class="content" v-if="rate || rate === 0">
			<view class="rate">
				<text>{{ rate }}</text>
			</view>
		</view>
		<view class="content" v-else @tap="syncUpdate">
			<view class="icon">
				<image :src="updateSyncIcon"></image>
			</view>
			<view class="text">{{ $t('index.sync') }}</view>
		</view>
	</view>
</template>

<script setup>
	import {
		ref
	} from 'vue';
	import updateSyncIcon from '@/pages/_image/index/updateSync.png'

	const emits = defineEmits(['sync'])
	const props = defineProps({
		rate: {
			type: Number || String
		}
	})

	const syncUpdate = () => {
		emits('sync')
	}
</script>

<style lang="scss" scoped>
	.sync-charts {
		@extend .flex-center;
		position: relative;
		margin: 0 auto;
		width: 416rpx;
		height: 416rpx;
		border-radius: 50%;
		background: linear-gradient(360deg, rgba(0, 208, 181, 0) 0%, rgba(0, 208, 181, 0.2) 100%);

		.chart {
			width: 320rpx;
			height: 320rpx;
			border-radius: 50%;
			background: rgba(0, 0, 0, 0.06);
		}

		.content {
			@extend .flex-center;
			flex-direction: column;
			width: 100%;
			height: 100%;
			position: absolute;
			top: 0;
			left: 0;

			.icon {
				padding-bottom: 8rpx;

				image {
					width: 64rpx;
					height: 64rpx;
				}
			}

			.text {
				font-size: 24rpx;
				color: #00D0B5;
			}

			.rate {
				position: relative;
				font-size: 64rpx;
				font-weight: bold;
				color: #00D0B5;

				&::after {
					content: '%';
					position: absolute;
					top: 0;
					right: -28rpx;
					font-size: 28rpx;
					color: #8E8E93;
					font-weight: bold;
				}
			}
		}
	}
</style>