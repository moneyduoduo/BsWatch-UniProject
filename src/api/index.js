import {
	computed
} from 'vue';
import {
	BASE_URL,
	getPath
} from '@/config/index.js';
import {
	useStore
} from '@/store/global';

const store = computed(() => useStore());
let isWaiting = false;
let waitTimer = null;

export default {
	config: {
		header: {
			'Content-Type': 'application/json',
			'appId': '556e7ebb-c878-5572-bdac-8b421d12be5a',
			'from': '81',
			'version': '1.0',
			'info': 'android'
		},
		data: {},
		timeout: 60000
	},
	async request(options = {}) {
		if (store.value.token) {
			this.config.header['X-Auth-Token'] = store.value.token;
		}

		return new Promise((resolve, reject) => {
			options.header = options.header || this.config.header;
			options.timeout = this.config.timeout;
			options.success = async (response) => {
				let res = response.data;
				if (res.errorCode || res.code === 0) {
					if (options.url === "https://open.glunovoshare.com/opensdk/login") {
						return resolve({
							...res,
							"token": response.header["X-Auth-Token"]
						});
					} else {
						return resolve(res);
					}
				} else if (res.errorCode === 404) {
					return uni.showToast({
						title: '未知请求 ',
						icon: 'error'
					});
				} else if ([401, 403].includes(res.errorCode)) {
					// uni.showToast({ title: '登录信息已过期！', icon: 'none' });
					// store.value.logOut();
					// return uni.navigateTo({ url: getPath('登录') });
					/* token无感刷新 */
					if (!isWaiting) {
						store.value.handleLogin().complete(() => {
							setTimeout(() => isWaiting = false, 2000);
						});
					}
					isWaiting = true;
					// 阻塞线程 重新请求延迟后再发送
					await new Promise(res => {
						setTimeout(() => res(), 2000);
					});
					return resolve(this.request(options));
				} else {
					console.log('error', res.message);
					uni.showToast({
						title: res.message,
						icon: 'none'
					});
				}
			};
			options.fail = (err) => {
				console.error('请求失败');
				console.log(options);
				console.log(err);
				uni.showToast({
					title: '网络请求失败！',
					icon: 'error'
				});
				return reject(err);
			};
			options.complete = () => {
				// setTimeout(() => {
				//   uni.hideLoading();
				// }, 1000);
			};
			uni.request(options);
		});
	},
	post({
		url,
		data = {},
		options = {}
	}) {
		options.url = `${ BASE_URL }/${ url }`;
		options.data = data;
		options.method = 'POST';
		return this.request(options);
	},
	post2({
		url,
		data = {},
		options = {}
	}) {
		options.url = `${ url }`;
		options.data = data;
		options.method = 'POST';
		return this.request(options);
	},
	get({
		url,
		data = {},
		options = {}
	}) {
		options.url = `${ BASE_URL }/${ url }`;
		options.method = 'GET';
		return this.request(options);
	}

};