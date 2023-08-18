import {
	computed
} from 'vue';
import {
	useStore
} from '@/store/global';
import {
	getPath
} from '@/config/index.js';

export const useRegister = () => {
	const store = useStore();
	const isRegister = computed(() => store.isRegister);
	/**
	 * 对未注册进行拦截
	 * @param fn {Function} 点击执行的函数
	 * @return {void}
	 */
	const click = fn => {
		if (isRegister.value) {
			fn();
		} else {
			// #ifdef MP
			uni.showModal({
				content: '注册登录后即可解锁更多功能，是否立即注册？',
				confirmText: '登录',
				cancelColor: '#0099ff',
				confirmColor: '#0099ff',
				success(res) {
					if (res.confirm) {
						uni.navigateTo({
							url: getPath('登录跳转', {
								type: 1
							})
						});
					}
				}
			});
			// #endif
			// #ifndef MP
			uni.$showModal({
				content: '注册登录后即可解锁更多功能，\n' + '是否立即注册？',
				confirmVal: '登录'
			}).then(() => {
				uni.navigateTo({
					url: getPath('登录app', {
						type: 1
					})
				});
			});
			// #endif
		}
	};
	/**
	 * app端启动时 根据登录状态跳转首页
	 * @return {void}
	 */
	const handleAppRegister = () => {
		if (!isRegister.value) {
			uni.reLaunch({
				url: getPath('登录app', {
					type: 1
				}),
				complete: () => {
					plus.navigator.closeSplashscreen();
				}
			});
		} else {
			plus.navigator.closeSplashscreen();
		}
	};
	return {
		handleAppRegister,
		isRegister,
		click
	};
};