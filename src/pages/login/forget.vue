<template>
	<view class="forget">
		<my-nav-bar :title="$t('pages.forget')" leftIcon="back"></my-nav-bar>
		<view class="container">
			<view class="steps">
				<view class="step" :class="{ 'active': step === 1,'end': step === 2 }">
					<view class="index">1</view>
					<view class="text">{{ $t('login.step1') }}</view>
					<view class="tag"></view>
				</view>
				<view class="step" :class="{ 'active': step === 2 }">
					<view class="index">2</view>
					<view class="text">{{ $t('login.step2') }}</view>
				</view>
			</view>
			<view class="form" v-if="step=== 1">
				<i-form :data="formData" :columns="formColumns">
					<template v-slot:code>
						<view class="send disable" v-if="sendState === 'sending'">{{ $t('login.btn_sending') + sendOutTime + 's' }}
						</view>
						<view class="send" v-else-if="sendState === 'sended'" @tap="sendEmail">{{ $t('login.btn_resend') }}</view>
						<view class="send" v-else @tap="sendEmail">{{ $t('login.btn_send') }}</view>
					</template>
				</i-form>
			</view>
			<view class="form" v-if="step=== 2">
				<i-form :data="formData2" :columns="formColumns2">
				</i-form>
			</view>
			<view class="footer">
				<view v-if="step === 1" class="submit" @tap="next()">{{ $t('login.btn_next') }}</view>
				<view v-if="step === 2" class="submit" @tap="submit()">{{ $t('login.btn_reg') }}</view>
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
		sendEmailVerification,
		setNewPassword
	} from '@/api/login.js'

	import IForm from './components/i-form'
	import emailPic from '@/pages/_image/login/email.png';
	import pwdPic from '@/pages/_image/login/password.png';
	import codePic from '@/pages/_image/login/code.png';
	import {
		useStore
	} from '@/store/global.js';

	const store = useStore();
	const {
		proxy
	} = getCurrentInstance();

	onUnmounted(() => {
		clearInterval(sendTimer);
	})

	/* 下一步 */
	const step = ref(1);
	const next = () => {
		if (validate(proxy, formData, formColumns)) {
			step.value = 2;
		}
	}

	/* 发送验证码 */
	const sendState = ref(''); // sending倒计时 sended已发送过一次
	const sendOutTime = ref(59);
	let sendTimer = null;
	const sendEmail = () => {
		if (emailValid()) {
			clearInterval(sendTimer);
			sendState.value = 'sending';
			sendTimer = setInterval(() => {
				if (sendOutTime.value <= 0) {
					sendState.value = 'sended';
					sendOutTime.value = 59;
					return clearInterval(sendTimer);
				}
				sendOutTime.value--;
			}, 1000);
			uni.showLoading({
				title: 'loading'
			});
			sendEmailVerification({
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
		if (validate(proxy, formData2, formColumns2)) {
			if (formData2.newPassword !== formData2.newPassword2) {
				return uni.showToast({
					title: proxy.$i18n.t('tip.pwdDiff'),
					icon: 'none'
				})
			}
			uni.showLoading({
				title: 'loading'
			});
			setNewPassword({
				...formData,
				newPassword: formData2.newPassword
			}).then(res => {
				uni.hideLoading();
				if (res.errorCode === 18) {
					uni.showToast({
						title: proxy.$i18n.t('tip.pwdNewSuccess')
					})
					uni.reLaunch({
						url: getPath('登录')
					})
					store.logOut();
				} else if ([4, 17].includes(res.errorCode)) {
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
	})

	const formData2 = reactive({
		newPassword: null,
		newPassword2: null,
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
	}])

	const formColumns2 = reactive([{
		key: 'newPassword',
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
		key: 'newPassword2',
		type: 'input',
		required: true,
		tPlacaholder: 'login.input_comfimPwd',
		tTip: 'tip.pwdEmpty',
		icon: pwdPic,
		reg: {
			rule: pwd_reg,
			tTip: 'tip.pwdInvalid'
		}
	}])
</script>

<style lang="scss" scoped>
	.container {
		.steps {
			@extend .flex-between;
			margin-bottom: 60rpx;

			.step {
				@extend .flex-center;
				position: relative;
				flex: 1;
				height: 100rpx;
				background: #E4E4E4;
				font-size: 28rpx;
				color: #8E8E93;

				.index {
					@extend .flex-center;
					margin-right: 8rpx;
					width: 30rpx;
					height: 30rpx;
					border-radius: 50%;
					background-color: #8E8E93;
					color: #FFFFFF;
					font-size: 12rpx;
				}

				.tag {
					position: absolute;
					z-index: 1;
					top: 0;
					right: -20rpx;
					width: 0;
					height: 0;
					border-top: 50rpx solid transparent;
					border-left: 20rpx solid #00D0B5;
					border-bottom: 50rpx solid transparent;
				}

				&.active {
					background: #00D0B5;
					color: #FFFFFF;

					.index {
						background-color: #FFFFFF;
						color: #00D0B5;
					}
				}

				&.end {
					background: #ccf6f0;
					color: #00D0B5;

					.index {
						background-color: #00D0B5;
						color: #cceffc;
					}

					.tag {
						border-left: 20rpx solid #ccf6f0;
					}
				}
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
			padding: 0 32rpx;
			margin-top: 120rpx;

			.submit {
				@extend .flex-center;
				height: 100rpx;
				border-radius: 50rpx;
				background: #00D0B5;
				font-size: 32rpx;
				color: #FFFFFF;
			}
		}
	}
</style>