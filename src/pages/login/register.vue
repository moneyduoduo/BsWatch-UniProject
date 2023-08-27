<template>
	<view class="register">
		<my-nav-bar :title="$t('pages.register')" leftIcon="back"></my-nav-bar>
		<view class="container">
			<view class="logo">
				<image :src="logoPic" />
			</view>
			<view class="form">
				<i-form :data="formData" :columns="formColumns">
					<template v-slot:code>
						<view class="send disable" v-if="sendState === 'sending'">{{ $t('login.btn_sending') + sendOutTime + 's' }}
						</view>
						<view class="send" v-else-if="sendState === 'sended'" @tap="sendEmail">{{ $t('login.btn_resend') }}</view>
						<view class="send" v-else @tap="sendEmail">{{ $t('login.btn_send') }}</view>
					</template>
				</i-form>
			</view>
			<view class="footer">
				<view class="links">
					<uni-data-checkbox multiple v-model="isChecked" selectedColor="#00D0B5" :localdata="range"
						@change="checkChange" />
					<view>
						<text class="text">{{ $t('login.link_conditions_pre') }}</text>
						<text class="text link">{{ $t('login.link_conditions') }}</text>
						<text class="text">{{ $t('login.link_conditions_and') }}</text>
						<text class="text link">{{ $t('login.link_privacy') }}</text>
					</view>
				</view>
				<view class="submit" @tap="submit()">{{ $t('login.btn_reg') }}</view>
				<view class="links flex-center">
					<view class="link" @tap="toLogin">{{$t('login.link_toLog')}}</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup>
	import {
		reactive,
		computed,
		shallowRef,
		getCurrentInstance,
		ref,
		onUnmounted
	} from 'vue';
	import {
		validate
	} from '@/utils/function.js'
	import {
		email_reg,
		pwd_reg
	} from '@/utils/regExp.js'
	import {
		getPath
	} from '@/config';
	import {
		sendEmailForRegister,
		register
	} from '@/api/login.js'

	import IForm from './components/i-form'
	import logoPic from '@/pages/_image/login/logo.png';
	// import logoPic from '@/pages/_image/login/hippo.png';
	import emailPic from '@/pages/_image/login/email.png';
	import pwdPic from '@/pages/_image/login/password.png';
	import codePic from '@/pages/_image/login/code.png';
	import store from '@/store';

	const {
		proxy
	} = getCurrentInstance();

	onUnmounted(() => {
		clearInterval(sendTimer);
	})

	/* 勾选协议 */
	const isChecked = shallowRef([0]);
	const range = [{
		value: 0
	}]
	const checkChange = e => {
		console.log(e);
	}

	/* 发送验证码 */
	const sendState = ref(''); // sending倒计时 sended已发送过一次
	const sendOutTime = ref(59);
	let sendTimer = null;
	const sendEmail = () => {
		if (emailValid()) {
			uni.showLoading({
				title: 'loading'
			});
			clearInterval(sendTimer);
			sendState.value = 'sending';
			sendTimer = setInterval(() => {
				if (sendOutTime.value <= 0) {
					sendState.value = 'sended';
					sendOutTime.value = 59;
					return clearInterval(sendTimer);
				}
				sendOutTime.value--;
			}, 1000)
			sendEmailForRegister({
				email: formData.email,
				language: uni.getLocale()
			}).then(res => {
				uni.hideLoading();
				if (res.errorCode === 16) {
					uni.showToast({
						title: proxy.$i18n.t('tip.codeSend')
					})
				} else if ([2, 4].includes(res.errorCode)) {
					uni.showToast({
						title: res.message,
						icon: 'none'
					})
				}
			})
		}
	}

	/* 邮箱格式验证 */
	const emailValid = () => {
		if (!formData.email) {
			uni.showToast({
				title: proxy.$i18n.t('tip.emailEmpty'),
				icon: 'none'
			})
			return false
		}
		if (!email_reg.test(formData.email)) {
			uni.showToast({
				title: proxy.$i18n.t('tip.emailInvalid'),
				icon: 'none'
			})
			return false
		}
		return true;
	}

	/* 提交表单 */
	const submit = type => {
		if (!isChecked.value.length) {
			return uni.showToast({
				title: proxy.$i18n.t('login.link_conditions_all'),
				icon: 'none'
			})
		}
		if (validate(proxy, formData, formColumns)) {
			if (formData.password !== formData.password2) {
				return uni.showToast({
					title: proxy.$i18n.t('tip.pwdDiff'),
					icon: 'none'
				})
			}
			uni.showLoading({
				title: 'loading'
			});
			register(formData).then(res => {
				uni.hideLoading();
				if (res.errorCode === 200) {
					uni.reLaunch({
						url: getPath('登录')
					})
				} else if ([2, 17].includes(res.errorCode)) {
					uni.showToast({
						title: res.message,
						icon: 'none'
					})
				}
			})
		}
	}

	const formData = reactive({
		email: null,
		emailCode: null,
		password: null,
		password2: null,
		country: uni.getLocale()
	})

	const formColumns = reactive([{
			key: 'email',
			type: 'input',
			required: true,
			tPlacaholder: 'login.input_email2',
			tTip: 'tip.emailEmpty',
			icon: emailPic,
			reg: {
				rule: email_reg,
				tTip: 'tip.emailInvalid'
			}
		}, {
			key: 'emailCode',
			type: 'input',
			required: true,
			isCode: true,
			e: 'sendCode',
			tPlacaholder: 'login.input_code',
			tTip: 'tip.codeEmpty',
			icon: codePic
		}, {
			key: 'password',
			type: 'input',
			required: true,
			tPlacaholder: 'login.input_pwd2',
			tTip: 'tip.pwdEmpty',
			icon: pwdPic,
			reg: {
				rule: pwd_reg,
				tTip: 'tip.pwdInvalid'
			}
		}, {
			key: 'password2',
			type: 'input',
			required: true,
			tPlacaholder: 'login.input_comfimPwd',
			tTip: 'tip.pwdEmpty',
			icon: pwdPic,
			reg: {
				rule: pwd_reg,
				tTip: 'tip.pwdInvalid'
			}
		},

	])

	const toLogin = () => {
		uni.navigateTo({
			url: getPath('登录')
		})
	}
</script>

<style lang="scss" scoped>
	.container {
		.logo {
			@extend .flex-center;
			margin: 156rpx 0 100rpx;
			// margin: 100rpx 0 100rpx;

			image {
				width: 520rpx;
				height: 92rpx;
				// width: 180rpx;
				// height: 180rpx;
			}
		}

		.form {
			.send {
				@extend .flex-center;
				padding: 0 14rpx;
				height: 56rpx;
				background: #00D0B5;
				border-radius: 28rpx;
				font-size: 24rpx;
				color: #FFFFFF;

				&.disable {
					background: #F2F2F2;
					color: #8E8E93;
				}
			}
		}

		.footer {
			padding: 238rpx 32rpx 0;

			.submit {
				@extend .flex-center;
				margin: 48rpx 0;
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
				display: flex;

				::v-deep .checklist-box {
					margin-right: 16rpx;
				}

				::v-deep .checkbox__inner {
					width: 32rpx;
					height: 32rpx;
					border-radius: 16rpx;
				}

				::v-deep .checkbox__inner-icon {
					top: 2px !important;
					left: 6px !important;
				}

				::v-deep .uni-data-checklist {
					flex: none;
				}

				.text {
					flex-shrink: 0;
					font-size: 24rpx;
				}

				.link {
					color: #00D0B5;
				}
			}
		}
	}
</style>