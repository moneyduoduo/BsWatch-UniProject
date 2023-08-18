<template>
	<view class="login">
		<my-nav-bar :title="$t('pages.login')" onlyTitle></my-nav-bar>
		<view class="container">
			<view class="logo">
				<image :src="logoPic" />
			</view>
			<view class="form">
				<i-form :data="formData" :columns="formColumns" />
			</view>
			<view class="footer">
				<view v-if="isValid" class="submit" @tap="login">{{ $t('login.btn_login') }}</view>
				<view v-else class="submit disable" @tap="login">{{ $t('login.btn_login') }}</view>
				<view class="links">
					<view class="link" @tap="linkTo('注册')">{{ $t('login.link_reg') }}</view>
					<view class="link" @tap="linkTo('忘记密码')">{{ $t('login.link_forg') }}</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup>
	import {
		reactive,
		getCurrentInstance,
		computed
	} from 'vue';
	import {
		onReady
	} from '@dcloudio/uni-app';
	import {
		appLogin
	} from '@/api/login.js'
	import {
		validate
	} from '@/utils/function.js'
	import {
		getPath
	} from '@/config';
	import {
		useStore
	} from '@/store/global.js'
	import IForm from './components/i-form'

	// import logoPic from '@/pages/_image/login/logo.png';
	import logoPic from '@/pages/_image/login/hippo.png';
	import emailPic from '@/pages/_image/login/email.png';
	import pwdPic from '@/pages/_image/login/password.png';

	const store = useStore()


	const {
		proxy
	} = getCurrentInstance()

	const isValid = computed(() => validate(proxy, formData, formColumns, false))

	const formData = reactive({
		username: null,
		password: null
	})

	const formColumns = reactive([{
			key: 'username',
			type: 'input',
			required: true,
			tPlacaholder: 'login.input_email',
			tTip: 'tip.emailEmpty',
			icon: emailPic
		},
		{
			key: 'password',
			type: 'password',
			password: true,
			showPwd: true,
			required: true,
			tPlacaholder: 'login.input_pwd',
			tTip: 'tip.pwdEmpty',
			icon: pwdPic
		}
	])

	const login = () => {
		if (validate(proxy, formData, formColumns)) {
			uni.showLoading({
				title: 'loading'
			});
			appLogin(formData).then(res => {
				uni.hideLoading()
				console.log("llogin------");
				console.log(res);
				if ([5, 200].includes(res.errorCode)) {
					// uni.showToast({
					// 	title: proxy.$i18n.t('tip.logSuccess')
					// });
					store.setToken(res.token);
					store.setPid(res.id);
					store.setUserInfo({
						avatar: res.avatar,
						email: res.email,
						id: res.id,
						userType: res.userType,
						registrationDate: res.registrationDate
					})
					store.setIsRegister(true);

					uni.reLaunch({
						url: getPath('首页')
					})
				} else if ([1, 4, 6].includes(res.errorCode)) {
					uni.showToast({
						title: res.message,
						icon: 'none'
					})
				}
			})
		}

	}

	const linkTo = path => {
		uni.navigateTo({
			url: getPath(path)
		})
	}
</script>

<style lang="scss" scoped>
	.login {
		height: 100%;

		.container {
			.logo {
				@extend .flex-center;
				margin: 196rpx 0 120rpx;

				image {
					// width: 520rpx;
					// height: 92rpx;
					width: 180rpx;
					height: 180rpx;
				}
			}



			.footer {
				padding: 120rpx 32rpx;

				.submit {
					@extend .flex-center;
					height: 100rpx;
					border-radius: 50rpx;
					background: #00D0B5;
					font-size: 32rpx;
					color: #FFFFFF;
				}

				.disable {
					background: #8E8E93;
				}

				.links {
					@extend .flex-between;
					padding-top: 48rpx;

					.link {
						font-size: 28rpx;
						color: #00D0B5;
					}
				}
			}
		}
	}
</style>