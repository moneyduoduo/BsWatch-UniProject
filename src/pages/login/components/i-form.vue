<template>
	<view class="form">
		<view class="item" v-for="(item, index) in columns" :key="index">
			<view class="icon">
				<image :src="item.icon"></image>
			</view>
			<view class="input">
				<input v-model="data[item.key]" type="text" :password="item.password" :placeholder="$t(item.tPlacaholder)">
				<view v-if="item.isCode" class="code">
					<slot name="code"></slot>
				</view>
			</view>
			<view v-if="item.showPwd" class="suffix">
				<image :src="eyeOffPic" @tap="() => item.password = !item.password" />
			</view>

		</view>
	</view>
</template>

<script setup>
	import eyeOffPic from '@/pages/_image/login/eye_off.png';
	const props = defineProps({
		columns: {
			type: Array,
			default: []
		},
		data: {
			type: Object,
			default: {}
		}
	})
</script>

<style lang="scss" scoped>
	.form {
		margin: 0 32rpx;
		padding: 28rpx 0 28rpx 32rpx;
		background: #FFFFFF;
		box-shadow: 0rpx 4rpx 20rpx 0rpx rgba(0, 0, 0, 0.2);
		border-radius: 16rpx;

		.item {
			@extend .flex-start;
			height: 88rpx;

			&:last-child {
				.input {
					border-bottom: none;
				}
			}

			.icon {
				@extend .flex-center;
				margin-right: 32rpx;
				width: 56rpx;
				height: 56rpx;
				background: #00D0B5;
				border-radius: 12rpx;

				image {
					width: 48rpx;
					height: 48rpx;
				}
			}

			.input {
				@extend .flex-between;
				padding-right: 32rpx;
				flex: 1;
				height: 100%;
				border-bottom: 2rpx solid rgba(60, 60, 67, 0.36);

				.input-placeholder {
					color: #8E8E93;
				}

				input {
					flex: 1;
					font-size: 28rpx;
					height: 100%;
				}
			}

			.suffix {
				@extend .flex-center;
				padding-right: 32rpx;
				height: 100%;

				image {
					width: 48rpx;
					height: 48rpx;
				}
			}
		}
	}
</style>