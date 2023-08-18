<template>
	<view class="nav-bar">
		<view :style="navStyle" class="my-navbar-wrap">
			<status-bar v-if="props.statusBar" />
			<view v-if="!isHiddenNav" :style="{height: navbarHeight}" class="my-navbar">
				<view v-if="!onlyTitle" class="left">
					<slot name="left">
						<view class="icon-wrap" @tap="back">
							<view v-if="props.leftIcon === 'back'" :style="leftIconStyle" class="icon"></view>
							<view class="text">{{ props.leftText }}</view>
						</view>
					</slot>
				</view>
				<view v-if="props.title" class="content">
					<slot>
						<text :style="titleStyle" class="text">{{ props.title }}</text>
					</slot>
				</view>
				<view v-if="!onlyTitle" class="right">
					<slot name="right"></slot>
				</view>
			</view>
		</view>

		<!-- fixed定位时 用于占位 -->
		<view v-if="props.fixed && props.isHold" class="my-navbar-wrap">
			<status-bar v-if="props.statusBar" />
			<view v-if="!isHiddenNav" :style="{height: navbarHeight}" class="my-navbar">
			</view>
		</view>
	</view>
</template>

<script setup>
	import {
		ref,
		computed
	} from 'vue';
	import {
		onPageScroll
	} from '@dcloudio/uni-app';
	import StatusBar from './status-bar.vue';

	const props = defineProps({
		onlyTitle: {
			type: [Boolean, String],
			default: false
		},
		title: {
			type: String,
			default: ''
		},
		leftText: {
			type: String,
			default: ''
		},
		rightText: {
			type: String,
			default: ''
		},
		leftIcon: {
			type: String,
			default: ''
		},
		fixed: {
			type: [Boolean, String],
			default: true
		},
		color: {
			type: String,
			default: '#000000'
		},
		backgroundColor: {
			type: String,
			default: '#ffffff'
		},
		gradualBgColor: {
			type: String,
			default: ''
		},
		gradualColor: {
			type: String,
			default: ''
		},
		statusBar: {
			type: [Boolean, String],
			default: true
		},
		height: {
			type: [Number, String],
			default: 44
		},
		leftWidth: {
			type: [Number, String],
			default: 60
		},
		rightWidth: {
			type: [Number, String],
			default: 60
		},
		isHold: {
			type: Boolean,
			default: true
		},
		isHiddenNav: {
			type: Boolean,
			default: false
		},
		border: {
			type: Boolean,
			default: false
		},
		zIndex: {
			type: [Number, String],
			default: 9999
		},
		stateBarTheme: {
			type: String,
			default: 'dark'
		},
		delta: {
			type: Number,
			default: 1
		}
	});

	/* 左侧样式 */
	const leftIconStyle = computed(() => {
		return {
			'border-color': `${ fontColor.value }`,
			'border-style': 'solid',
			'border-width': '2px 2px 0 0'
		};
	});

	/* 背景颜色 */
	const navStyle = computed(() => {
		return {
			position: props.fixed ? 'fixed' : '',
			borderBottom: props.border ? '1px solid #e5e5e5' : '',
			backgroundColor: bgColor.value,
			color: fontColor.value,
			zIndex: props.zIndex
		};
	});

	/* 标题样式 */
	const titleStyle = computed(() => {
		return {
			// textAlign: props.onlyTitle ? 'left' : 'right',
			padding: '0 30rpx'
		};
	});

	/* 导航栏高度 */
	const navbarHeight = computed(() => {
		let height = typeof props.height === 'number' ? props.height + 'px' : props.height;
		/* 微信小程序获取导航栏高度 */
		// #ifdef MP-WEIXIN
		uni.getSystemInfo({
			success: e => {
				const custom = wx.getMenuButtonBoundingClientRect();
				height = (custom.bottom + custom.top - 2 * e.statusBarHeight) + 'px';
			}
		});
		// #endif
		return height;
	});

	/* 是否处于滚动 */
	const isScroll = ref(false);

	/* 背景颜色 */
	const bgColor = computed(() => {
		if (isScroll.value && props.gradualBgColor) {
			return props.gradualBgColor;
		} else {
			return props.backgroundColor;
		}
	});

	/* 字体颜色 */
	const fontColor = computed(() => {
		if (isScroll.value && props.gradualBgColor) {
			return props.gradualColor || '#000';
		} else {
			return props.color;
		}
	});

	/* 滚动后自定义导航栏颜色渐变 */
	let scrolling = false;
	let scrollTimer;
	onPageScroll(
		e => {
			clearInterval(scrollTimer);
			scrolling = true;
			if (props.gradualBgColor) {
				isScroll.value = e.scrollTop > 120;
			}
			scrollTimer = setTimeout(() => {
				// isScroll.value ? setNavigationBarColor('dark') : setNavigationBarColor('light');
				if (props.stateBarTheme === 'dark') {
					setNavigationBarColor('dark');
				} else {
					setNavigationBarColor('light');
				}
			}, 30);
		}
	);

	/* 返回 */
	const back = () => {
		uni.navigateBack({
			delta: props.delta,
			fail() {
				uni.reLaunch({
					url: '/pages/launch/launch'
				});
			}
		});
	};

	/**
	 * 设置状态栏字体颜色
	 * @property {String} type light/dark
	 */
	function setNavigationBarColor(type) {
		// #ifdef APP-PLUS
		plus.navigator.setStatusBarStyle(type);
		// #endif
		// #ifdef MP-WEIXIN
		wx.setNavigationBarColor({
			frontColor: type === 'light' ? '#ffffff' : '#000000',
			backgroundColor: '#FFFFFF',
			animation: {
				duration: 400,
				timingFunc: 'easeIn'
			}
		});
		// #endif
	}
</script>

<style lang="scss" scoped>
	.nav-bar {
		width: 100%;
		position: relative;
		z-index: 1;

		.my-navbar-wrap {
			box-sizing: border-box;
			width: 100%;
			transition: all .5s linear;

			.my-navbar {
				display: flex;
				justify-content: space-between;
				align-items: center;

				.left,
				.content,
				.right {
					display: flex;
					justify-content: space-around;
					align-items: center;
					height: 100%;
					overflow: hidden;
					font-size: 36rpx;
					font-weight: bold;
				}

				.left {
					justify-content: flex-start;

					.icon-wrap {
						padding: 10rpx 10rpx 10rpx 50rpx;
						display: flex;
						justify-content: space-around;
						align-items: center;
						line-height: 1;

						.icon {
							width: 20rpx;
							height: 20rpx;
							transform: matrix(-0.71, 0.71, 0.71, 0.71, 0, 0);
						}

						.text {
							margin-left: 20rpx;
						}
					}
				}

				.content {
					flex: 1;

					.text {
						overflow: hidden;
						white-space: nowrap;
						width: 100%;
						text-overflow: ellipsis;
						text-align: center;
					}
				}

				.right {
					width: 80rpx;
					justify-content: flex-end;
				}
			}
		}
	}
</style>