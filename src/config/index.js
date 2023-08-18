import {
	paramToStr,
	getUrlParam
} from '@/utils/string';
import {
	andObj
} from '@/utils/obj';

export const DESIGN_WIDTH = 750; // 设计图宽度

export const MODE_NAME = {
	dev: 'development',
	prod: 'production'
};
export const __MODE__ = process.env.NODE_ENV;

export const RESOURCE_HOST = {
	[MODE_NAME.dev]: 'https://open.glunovoshare.com/opensdk',
	[MODE_NAME.prod]: 'https://open.glunovoshare.com/opensdk' //正式

} [__MODE__];

export const BASE_URL = {
	[MODE_NAME.dev]: 'https://open.glunovoshare.com/opensdk',
	[MODE_NAME.prod]: 'https://open.glunovoshare.com/opensdk'
} [__MODE__];


export const __PATHS__ = {
	/* 主包 */
	'启动': 'pages/launch/launch',
	'首页': 'pages/index/index',
	'登录': 'pages/login/login',
	'注册': 'pages/login/register',
	'忘记密码': 'pages/login/forget',
	'我的': 'pages/user/user',
};

export const getPath = (name, opt) => {
	const path = __PATHS__[name];
	if (!path) {
		uni.showToast({
			title: '未找到页面',
			icon: 'none'
		});
		console.error('未找到页面');
		return '';
	}
	const defaultSearch = getUrlParam(path);
	const search = paramToStr(andObj(defaultSearch, opt));
	const [_path] = path.split('?');
	return '/' + _path + (search ? '?' : '') + search;
};