import request from './index.js';

/* 用户登录 */
export const appLogin = (data) => {
	return request.post({
		url: 'login',
		data
	});
};

/* 注册时发送邮件验证 */
export const sendEmailForRegister = (data) => {
	return request.post({
		url: 'sendEmailForRegister',
		data
	});
};

/* 忘记密码时发送邮件验证 */
export const sendEmailVerification = (data) => {
	return request.post({
		url: 'sendEmailVerification',
		data
	});
};

/* 用户注册接口 */
export const register = (data) => {
	return request.post({
		url: 'register',
		data
	});
};


/* 忘记密码时设置新密码 */
export const setNewPassword = (data) => {
	return request.post({
		url: 'setNewPassword',
		data
	});
};