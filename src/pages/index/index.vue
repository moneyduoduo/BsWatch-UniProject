<template>
	<view class="index">
		<view class="banner"></view>
		<view class="header">
			<user-header :param="userInfo" />
		</view>
		<view class="sync">
			<sync-charts :rate="syncRate" @sync="authClick(syncUpdate, 'syncUpdate')" />
			<view v-if="lastSyncTime" class="sync-time">Last Update at {{ lastSyncTime }}</view>
		</view>
		<!-- <view>
			<Button @tap="testJump(1)">获取CGM</Button>
			<Button @tap="testJump(2)">获取数据</Button>
		</view> -->
		<view class="option">
			<options @handleE="authClick(handleOptions, $event)" :url="versionUrl" />
		</view>
		<tip-popup v-model="bleTipVisible" />
		<progress-popup v-model="progressVisible" :percent="updPercent" :type="updType" />
		<bs-popup v-model="calibrationVisible" @handle="calibration" />
		<watch-picker v-model="watchPickerVisible" :device="currentDeviceMac" @change="setDevice" />
	</view>
</template>

<script setup>
	const hippoWatch = uni.requireNativePlugin("hippo-watch");
	import {
		computed,
		onMounted,
		reactive,
		ref
	} from 'vue';

	import dayjs from 'dayjs';

	import {
		useStore
	} from '@/store/global';

	// #ifdef APP-PLUS
	import {
		checkHasIntegration,
		initClient,
		connectBle,
		watchSettingTime,
		healthHistoryData,
		appBloodSugarCalibration,
		getConnectState,
		upgradeFirmware,
		disconnectBle,
		initUpdate,
		checkPromise
	} from "@/uni_modules/uts-bswatch";
	import {
		chooseFile
	} from '@/utils/common.js'
	import {
		sycAndUpload,
		getVersion
	} from '@/api/home.js';
	// #endif

	import UserHeader from './components/user-header.vue';
	import SyncCharts from './components/sync-charts.vue';
	import Options from './components/options.vue';
	import TipPopup from './components/tip-popup.vue';
	import ProgressPopup from './components/progress-popup.vue';
	import BsPopup from './components/bs-popup.vue';
	import watchPicker from './components/watch-picker.vue';

	const store = useStore();

	onMounted(() => {
		hippoWatch.isPermission(() => {});
		hippoWatch.initClient(res => {
			console.log('initClient');
			console.log(res);
			getHeaderInfo();
		});
	})

	const testJump = type => {
		if (type === 1) {
			uni.navigateTo({
				url: '/pages/index/test/test?key=1'
			})
		}
		if (type === 2) {
			uni.navigateTo({
				url: '/pages/index/test/test?key=2'
			})
		}
	}

	// 同步上传
	const lastSyncTime = computed(() => store.lastSyncTime)
	let updateArray = [];
	const syncRate = ref('');
	const syncUpdate = () => {
		syncRate.value = 0;
		console.log('syncUpdate上传结果');
		// hippoWatch.deleteCustomizeData(res => {
		// 	console.log('deleteCustomizeData');
		// 	console.log(res);
		// });
		// return;

		hippoWatch.customizeCGM(cgmRes => {
			console.log('发射器');
			console.log(cgmRes);
			if (cgmRes.code === 0) {
				hippoWatch.healthHistoryData(res => {
					if (res.code === 0) {
						console.log('上传结果');
						console.log(res);
						if (!res.data.data.length) {
							syncRate.value = '';
							return uni.showToast({
								title: "No data available",
								icon: "none"
							})
						}
						// let validData = res.data.data.filter(item => item.cgm);
						// if (!validData.length) {
						// 	syncRate.value = '';
						// 	return uni.showToast({
						// 		title: "No valid data available",
						// 		icon: "none"
						// 	})
						// }
						const serial = cgmRes.data.serial;
						const startTime = cgmRes.data.startTime;
						const timeZone = -(new Date().getTimezoneOffset() / 60);
						let uploadData = res.data.data.map(item => {
							let handleTime = startTime + (item.offset * 180000);
							return {
								transmitterId: serial,
								uploadTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
								dateStr: dayjs(handleTime).format('YYYY-MM-DD HH:mm:ss'),
								time: handleTime,
								startTime: startTime,
								value: item.cgm,
								idWithinSession: item.offset,
								isAbnormal: (item.ele < 0.1 || item.ele > 50) ? true : false,
								isCalibration: item.ele === 0 ? true : false,
								rawValue: item.ele,
								trend: 0,
								unitsOfMeasure: 1,
								startTimeZone: timeZone,
								dataTimeZone: timeZone
							}
						})
						// console.log(uploadData[0]);
						// console.log(uploadData[uploadData.length - 1]);
						// return
						sycAndUpload(store.userInfo.id, uploadData).then(resp => {
							console.log("res------------");
							console.log(resp);
							if ([8].includes(resp.errorCode)) {
								syncRate.value = 100;
								uni.showToast({
									title: "success"
								})
								store.setSyncTime(dayjs().format('YYYY-MM-DD HH:mm:ss'));
								setTimeout(() => {
									syncRate.value = '';
									// hippoWatch.deleteCustomizeData(delRes => {
									// 	console.log('删除记录');
									// 	console.log(delRes);
									// })
								}, 3000);
							}
						})
					} else {
						uni.showToast({
							title: "No data available",
							icon: "none"
						})
						syncRate.value = '';
					}
				})
			} else {
				uni.showToast({
					title: "The device is not connected",
					icon: "none"
				})
				syncRate.value = '';
			}

		})
	}

	/* 选择切换设备时设置当前设备 */
	const currentDeviceMac = ref('');
	const currentDevice = computed(() => store.deviceInfo)
	const setDevice = param => {
		console.log('set');
		console.log(param);
		store.setDeviceInfo(param);
		setCurrentDevice(param.deviceName, param.deviceMac);
	}

	/* 设置当前设备显示信息 */
	const setCurrentDevice = (deviceName, deviceMac) => {
		userInfo.device = deviceName;
		currentDeviceMac.value = deviceMac;
		checkVersion();
	}

	/* 检测固件版本并获取下载地址 */
	const versionUrl = ref('');
	const checkVersion = () => {
		getVersion().then(res => {
			console.log(res);
			if (res.code === 0) {
				hippoWatch.getDeviceInfo(device => {
					if (device.code === 0) {
						console.log("version info");
						console.log(device);
						if (device.data.deviceSubVersion < res.verNo) {
							versionUrl.value = res.url;
							console.log(versionUrl.value);
						}
					}
				})
			}
		})

	}

	/* 获取头部信息 */
	const userInfo = reactive({
		userName: null,
		device: null
	})
	const getHeaderInfo = () => {
		userInfo.userName = store.userInfo?.email;
		if (currentDevice.value) {
			hippoWatch.getConnectState(stateRes => {
				console.log('连接状态', stateRes);
				if (stateRes.code < 6) {
					hippoWatch.disconnectBle(() => {});
					hippoWatch.connectBle(currentDevice.value.deviceMac, res => {
						console.log(res);
						if (res.code === 0) {
							setCurrentDevice(currentDevice.value.deviceName, currentDevice.value.deviceMac);
						} else {
							store.setDeviceInfo(null);
							uni.showToast({
								title: 'connection failed',
								icon: 'none'
							})
						}
					})
				} else {
					setCurrentDevice(currentDevice.value.deviceName, currentDevice.value.deviceMac);
				}
			})
		}
	}

	/* 判断是否打开蓝牙 */
	const bleTipVisible = ref(false);
	const checkBleState = () => {
		uni.openBluetoothAdapter({
			fail(err) {
				if (err.code === 10001) {
					bleTipVisible.value = true;
				}
			}
		})
	}

	/* 蓝牙开启时才允许点击 */
	const authClick = (fn, e) => {
		const content = this;
		console.log(e, '-----');
		uni.openBluetoothAdapter({
			success(res) {
				if (['device'].includes(e)) {
					return fn.call(content, e);
				}
				if (currentDeviceMac.value) {
					fn.call(content, e);
				} else {
					uni.showToast({
						title: 'device not connected',
						icon: 'none'
					})
				}
			},
			fail(err) {
				console.log(err);
				if ([10000, 10001].includes(err.code)) {
					checkBleState();
				}
			}
		})
	}

	/* 功能选项点击处理 */
	const watchPickerVisible = ref(false);
	const calibrationVisible = ref(false);
	const handleOptions = e => {
		// device update sync calibration
		console.log(e);
		switch (e) {
			case 'device':
				hippoWatch.isPermission(res => {
					watchPickerVisible.value = true;
				});
				break;
			case 'update':
				updateHandle();
				break;
			case 'sync':
				hippoWatch.settingTime(res => {
					console.log(res);
				})
				uni.showLoading({
					title: 'sync time'
				});
				setTimeout(function() {
					uni.hideLoading();
					uni.showToast({
						title: 'Time Updated',
						icon: 'none'
					})
				}, 500);
				break;
			case 'calibration':
				calibrationVisible.value = true;
				break;
		}
	}

	/* 更新处理 */
	const progressVisible = ref(false);
	const updPercent = ref(0);
	const updType = ref(1);
	const updateHandle = () => {
		console.log('handle');
		console.log(versionUrl.value);
		progressVisible.value = true;
		const downloadTask = uni.downloadFile({
			timeout: 1000,
			url: versionUrl.value,
			success: (file) => {
				if (file.statusCode === 200) {
					console.log('下载成功');
					setTimeout(() => {
						updType.value = 0;
						updPercent.value = 0;
					}, 300)
					const path = plus.io.convertLocalFileSystemURL(file.tempFilePath);
					console.log(path);
					hippoWatch.upgradeFirmware(path, res => {
						console.log(res);
						if ([2, 7].includes(res.code)) {
							uni.showToast({
								title: res.msg,
								icon: "none"
							})
							progressVisible.value = false;
						} else {
							if (res.code === 1) {
								uni.showToast({
									title: 'Update done'
								})
								progressVisible.value = false;
								updPercent.value = 0;
								updType.value = 1;
								versionUrl.value = '';
								getHeaderInfo();
							} else if (res.code === 0) {
								updPercent.value = res.progress;
							}
						}
					});

				}
			},
			complete: (res) => {
				if (res.statusCode !== 200) {
					uni.showToast({
						title: "Download error",
						icon: "none"
					});
					progressVisible.value = false;
					updPercent.value = 0;
				}
				console.log('voer');
				console.log(res);
			}
		});
		downloadTask.onProgressUpdate((res) => {
			console.log('下载进度' + res.progress);
			updPercent.value = res.progress;
		});
		// hippoWatch.isAllFilePermission(res => {
		// 	console.log('isupdate');
		// 	console.log(res);
		// 	if (res.code === 0) {
		// 		chooseFile(path => {
		// 			console.log("chooseFile", path);
		// 			if (path) {
		// 				progressVisible.value = true;
		// 				hippoWatch.upgradeFirmware(path, res => {
		// 					console.log(res);
		// 					if ([2, 7].includes(res.code)) {
		// 						uni.showToast({
		// 							title: res.msg,
		// 							icon: "none"
		// 						})
		// 						progressVisible.value = false;
		// 					} else {
		// 						if (res.code === 1) {
		// 							uni.showToast({
		// 								title: 'successful'
		// 							})
		// 							progressVisible.value = false;
		// 							updPercent.value = 0;
		// 							getHeaderInfo();
		// 						} else if (res.code === 0) {
		// 							updPercent.value = res.progress;
		// 						}
		// 					}
		// 				});
		// 			}
		// 		});
		// 	}
		// });
	}

	/* 手动血糖校验 */
	const calibration = val => {
		let bsNumber = Number(val);
		let nums = bsNumber.toString().split('.')
		let intNum = Number.parseInt(nums[0])
		let floatNum = 0
		if (nums.length > 1) {
			floatNum = Number.parseInt(nums[1])
		}
		hippoWatch.appBloodSugarCalibration(intNum, floatNum, 0, res => {
			console.log(intNum, floatNum);
			console.log(res);
			if (res.code === 0) {
				uni.showToast({
					title: 'success'
				})
			}
		})
	}
</script>

<style lang="scss" scoped>
	.index {
		padding-bottom: 100rpx;
		position: relative;

		.banner {
			position: absolute;
			top: 0;
			left: 0;
			width: 750rpx;
			height: 520rpx;
			background: linear-gradient(180deg, rgba(0, 208, 181, 0.5) 0%, rgba(0, 208, 181, 0) 100%);
		}

		.header {
			padding: 154rpx 16rpx 0;
		}

		.sync {
			position: relative;
			padding: 120rpx 0;

			.sync-time {
				position: absolute;
				left: 0;
				bottom: 68rpx;
				text-align: center;
				width: 100%;
				font-size: 24rpx;
				color: #8E8E93;
			}
		}
	}
</style>