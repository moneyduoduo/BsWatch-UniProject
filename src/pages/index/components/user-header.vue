<template>
	<view class="user-header">
		<view class="avator">
			<image :src="avatarIcon" />
		</view>
		<view class="content">
			<view class="user">{{ `${$t('index.account')}: ${param?.userName || '--'}` }}</view>
			<view class="device">
				{{ `${$t('index.watch')}: ${param?.device || '--'}` }}
				<view class="logout" @tap="logOut">Sign Out</view>
			</view>
		</view>
	</view>
</template>

<script setup>
	import {
		ref
	} from 'vue';
	import {
		useStore
	} from '@/store/global';
	import {
		getPath
	} from '@/config';
	import avatarIcon from '@/pages/_image/index/avator.png'

	const store = useStore()

	const props = defineProps({
		param: {
			type: Object
		}
	})

	const logOut = () => {
		uni.showLoading({
			title: "Exiting"
		});
		setTimeout(() => {
			uni.hideLoading();
			store.logOut();
			uni.reLaunch({
				url: getPath('登录')
			});
		}, 500);
	}
</script>

<style lang="scss" scoped>
	.user-header {
		@extend .flex-start;
		position: relative;
		padding: 28rpx 32rpx;
		height: 128rpx;
		background: #FFFFFF;
		border-radius: 16rpx;

		.avator {
			width: 72rpx;
			height: 72rpx;
			border-radius: 50%;

			image {
				width: 100%;
				height: 100%;
			}
		}

		.content {
			flex: 1;
			padding: 0 40rpx;
			display: flex;
			flex-direction: column;
			align-items: flex-start;
			justify-content: space-between;

			.user {
				font-size: 28rpx;
				color: #000000;
			}

			.device {
				@extend .flex-start;
				padding-top: 12rpx;
				font-size: 24rpx;
				color: #8E8E93;

				.logout {
					@extend .flex-center;
					flex-shrink: 0;
					padding: 0 16rpx;
					margin-left: 36rpx;
					height: 40rpx;
					border-radius: 20rpx;
					border: 2rpx solid #00D0B5;
					font-size: 24rpx;
					color: #00D0B5;
				}
			}


		}
	}
</style>