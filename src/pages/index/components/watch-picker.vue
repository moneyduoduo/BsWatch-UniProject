<template>
	<uni-popup ref="picker" @maskClick="close">
		<view class="box">
			<view class="header">
				<view class="cancel" @tap="close">Cancel</view>
				<view class="title">Select Watch</view>
				<view class="submit" @tap="close">OK</view>
			</view>
			<view class="list">
				<view class="item" v-for="(item, index) in deviceList" :key="index" @tap="connect(index)">
					<view class="name">{{ item.deviceName }}</view>
					<view class="state">
						<uni-load-more v-if="item.state === 'loading'" iconType="snow" status="loading" :showText="false" />
						<view class="text" v-else-if="item.deviceMac === device">connected</view>
						<view class="text" v-else>Not connected</view>
						<uni-icons class="icon" type="right" size="24" color="rgba(60,60,67,0.3)"></uni-icons>
					</view>
				</view>
			</view>
		</view>
	</uni-popup>
</template>

<script setup>
	const hippoWatch = uni.requireNativePlugin("hippo-watch");
	import {
		startScanBle,
		stopScanBle,
		connectBle,
		getConnectState,
		disconnectBle,
	} from "@/uni_modules/uts-bswatch";
	import {
		reactive,
		ref,
		watch
	} from 'vue';

	const emits = defineEmits(['update:modelValue', 'change'])
	const props = defineProps({
		modelValue: {
			type: Boolean,
			default: true
		},
		device: {
			type: String,
			default: ''
		}
	})
	const picker = ref(null);

	const deviceList = reactive([])
	watch(() => props.modelValue, val => {
		if (val) {
			console.log("startScanBle");
			hippoWatch.startScanBle(res => {
				console.log("startScanBle res");
				console.log(res);
				let isExist = deviceList.find(item => item.deviceMac === res.deviceMac);
				if (!isExist) {
					deviceList.push(res);
				}
			});
			picker.value.open('bottom');
		} else {
			picker.value.close();
		}
	})

	const connect = index => {
		const currentDevice = deviceList[index];
		if (props.device === currentDevice.deviceMac) {
			return
		};
		disconnectBle();
		deviceList[index].state = 'loading'
		hippoWatch.connectBle(currentDevice.deviceMac, res => {
			console.log(res);
			deviceList[index].state = ''
			if (res.code === 0) {
				emits('change', currentDevice);
				uni.showToast({
					title: 'connected'
				})
				close();
			} else {
				uni.showToast({
					title: 'connection failed',
					icon: 'none'
				})
			}
		})
	}

	const close = () => {
		hippoWatch.stopScanBle();
		emits('update:modelValue', false)
	}
</script>

<style lang="scss" scoped>
	.box {
		padding-bottom: 120rpx;
		height: 608rpx;
		background-color: #ffffff;

		.header {
			padding: 24rpx 32rpx;
			display: flex;
			justify-content: space-between;
			align-items: center;
			border-bottom: 1rpx solid #E7E7E7;
			font-size: 32rpx;

			.cancel {
				min-width: 110rpx;
				color: rgba(0, 0, 0, 0.6);
			}

			.title {
				flex: 1;
				font-size: 40rx;
				font-weight: bold;
				text-align: center;
			}

			.submit {
				min-width: 110rpx;
				text-align: right;
				font-weight: bold;
				color: #00D0B5;
			}
		}

		.list {
			padding: 52rpx 32rpx 40rpx;

			.item {
				display: flex;
				align-items: center;
				justify-content: space-between;
				height: 100rpx;
				border-bottom: 2rpx solid rgba(60, 60, 67, 0.36);
				font-size: 28rpx;

				.name {
					font-weight: bold;
				}

				.state {
					display: flex;
					justify-content: flex-end;
					align-items: center;
					color: #8E8E93;

					.icon {
						margin-left: 20rpx;
					}
				}
			}
		}
	}
</style>