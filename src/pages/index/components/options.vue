<template>
	<view class="options">
		<view class="list">
			<view class="item" v-for="(item, index) in options" :key="index" @tap="handleE(item.e)">
				<view class="icon" :style="item.style">
					<image :src="item.icon" />
				</view>
				<view class="title">
					{{ $t(item.tTitle) }}
					<view class="point" v-if="item.more"></view>
				</view>
				<uni-icons type="forward" size="30" color="rgba(60, 60, 67, .3"></uni-icons>
			</view>
		</view>
	</view>
</template>

<script setup>
	import {
		computed,
		reactive
	} from 'vue';

	import wathchIcon from '@/pages/_image/index/wathch.png'
	import updateIcon from '@/pages/_image/index/update.png'
	import syncIcon from '@/pages/_image/index/sync.png'
	import calibrationIcon from '@/pages/_image/index/calibration.png'

	const emits = defineEmits(['handleE'])
	const props = defineProps({
		url: {
			type: String,
			default: ''
		}
	})

	const isUpd = computed(() => !!props.url)

	const handleE = e => {
		if (e === 'update') {
			if (isUpd.value) {
				emits('handleE', e);
			} else {
				uni.showToast({
					title: 'You are using the latest version',
					icon: 'none'
				});
			}
		} else {
			emits('handleE', e);
		}
	}

	const options = reactive([{
			icon: wathchIcon,
			tTitle: 'index.option_device',
			e: 'device',
			style: {
				backgroundColor: '#00ADEF'
			}
		},
		{
			icon: updateIcon,
			tTitle: 'index.option_update',
			e: 'update',
			more: isUpd,
			style: {
				backgroundColor: '#0A83FF'
			}
		},
		{
			icon: syncIcon,
			tTitle: 'index.option_sync',
			e: 'sync',
			style: {
				backgroundColor: '#00BCA1'
			}
		},
		{
			icon: calibrationIcon,
			tTitle: 'index.option_calibration',
			e: 'calibration',
			style: {
				backgroundColor: '#34C759'
			}
		},
	])
</script>

<style lang="scss" scoped>
	.options {
		position: relative;

		.list {
			padding: 0 16rpx;

			.item {
				@extend .flex-between;
				padding: 20rpx 20rpx 20rpx 32rpx;
				margin-bottom: 20rpx;
				width: 100%;
				height: 120rpx;
				background: #FFFFFF;
				box-shadow: 0rpx 4rpx 20rpx 0rpx rgba(0, 0, 0, 0.2);
				border-radius: 16rpx;

				&:last-child {
					margin-bottom: 0;
				}

				.icon {
					@extend .flex-center;
					width: 80rpx;
					height: 80rpx;
					border-radius: 50%;
					background-color: #00ADEF;

					image {
						width: 48rpx;
						height: 48rpx;
					}
				}

				.title {
					position: relative;
					flex: 1;
					padding: 0 34rpx;
					font-size: 28rpx;

					.point {
						position: absolute;
						right: 0;
						top: 50%;
						transform: translateY(-50%);
						width: 16rpx;
						height: 16rpx;
						border-radius: 50%;
						background: #FF3B30;
					}
				}
			}
		}
	}
</style>