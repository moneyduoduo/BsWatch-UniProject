<template>
	<view class="content">
		<view class="text-area">
			{{ store.test || 123123 }}
			<button @tap="check">检查</button>
			<button @tap="init">初始化</button>
			<button @tap="scanBle">搜索</button>
			<button @tap="connect">连接</button>
			<button @tap="bsCalibration">校准血糖</button>
			<button @tap="storeTest">store</button>
		</view>
		<view class="list" v-if="bleList.length">
			<view class="item" v-for="item in bleList" :key="item" @tap="bleConnect(item)">
				{{ item.deviceName }}
				<view class="btn">
					<button @tap.stop="watchSetting">设置时间</button>
				</view>
				<view class="btn">
					<button @tap.stop="syncBs">同步血糖</button>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup>
	import {
		onMounted,
		reactive
	} from 'vue';
	import {
		getConnectState,
		checkHasIntegration,
		initClient,
		startScanBle,
		connectBle,
		watchSettingTime,
		healthHistoryData,
		appBloodSugarCalibration
	} from "@/uni_modules/uts-bswatch";
	import {
		useStore
	} from '@/store/global';
	const store = useStore()

	onMounted(() => {
		init()
		scanBle()
	})

	const storeTest = () => {
		store.setTest(22222)
	}
	const check = () => {
		let isPackgeName = checkHasIntegration('com.yucheng.ycbtsdk.YCBTClient')
		console.log("**************");
		console.log(isPackgeName, '??');
	}

	const init = () => {
		initClient()
		console.log('连接状态:', getConnectState());
	}

	const bleList = reactive([])
	const scanBle = () => {
		startScanBle(device => {
			console.log('扫描设备：', device);
			bleList.push(device)
		})
	}

	const bleConnect = item => {
		connectBle(item.deviceMac, res => {
			console.log('连接状态:', getConnectState());
		})
	}

	const watchSetting = () => {
		watchSettingTime()
	}

	const syncBs = () => {
		healthHistoryData(res => {
			console.log(res);
		})
	}

	const bsCalibration = () => {
		appBloodSugarCalibration(12, 1, res => {
			console.log('设置结果');
			console.log(res);
		})
	}
</script>

<style lang="scss">
	.list {
		padding: 20rpx;
		background-color: aquamarine;

		.item {
			padding: 10rpx 20rpx;
			display: flex;
			justify-content: space-between;
			align-items: center;

			.btn {
				width: 200rpx;
				margin-left: 10rpx;
			}
		}
	}
</style>