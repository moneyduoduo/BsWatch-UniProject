/**
 * @desc 函数防抖---“立即执行版本” 和 “非立即执行版本” 的组合版本
 * @param func 需要执行的函数
 * @param wait 延迟执行时间（毫秒）
 * @param immediate---true 表立即执行，false 表非立即执行
 **/
export function debounce(func, wait, immediate) {
	let timer;

	return function() {
		let context = this;
		let args = arguments;
		if (timer) clearTimeout(timer);
		if (immediate) {
			let callNow = !timer;
			timer = setTimeout(() => {
				timer = null;
			}, wait);
			if (callNow) func.apply(context, args);
		} else {
			timer = setTimeout(function() {
				func.apply(context, args);
			}, wait);
		}
	};
}

/**
 * @desc 函数延迟防抖
 * @param {number} wait 延迟执行毫秒数
 * @param {function} func 要执行的回调函数
 * @returns {function} 返回一个接受防抖的执行函数
 */
export const antiShake = (wait, func) => {
	let timer = null;
	return (...args) => {
		timer && clearTimeout(timer);
		timer = setTimeout(func.bind(null, ...args), wait);
	};
};

export const antiShakeNow = (delay, fn) => {
	let timer = null;
	let isPlay = true;
	return (...args) => {
		timer && clearTimeout(timer);
		timer = setTimeout(() => {
			isPlay = true;
		}, delay);
		if (isPlay) {
			isPlay = false;
			fn(...args);
		}
	};
};

export const throttle = function(fn, delay) {
	let flag = true;
	return function() {
		let th = this;
		let args = arguments;
		if (!flag) {
			//未超过时间间隔，flag无效，不执行fn
			return false;
		}
		fn.apply(th, args);
		flag = false; //在时间间隔内把状态位flag设为无效（false）
		setTimeout(() => {
			flag = true; //超过时间间隔把状态位flag设为有效（true）
		}, delay);
	};
};

/**
 * @desc 自定义表单校验
 * @param {Object} proxy this上下文
 * @param {Object} data 数据
 * @param {Array<Object>} formColumns 校验格式
 * @returns {Boolean} 是否通过校验
 */
export const validate = (proxy, data, formColumns, isToast = true) => {
	for (let item of formColumns) {
		if (item.required) {
			// 为空
			if (!data[item.key] && data[item.key] !== 0) {
				if (isToast) {
					uni.showToast({
						title: proxy.$i18n.t(item.tTip) || `${item.key} is null`,
						icon: 'none'
					})
				}
				return false
			}
			// 正则校验
			if (item.reg) {
				if (!item.reg.rule.test(data[item.key])) {
					if (isToast) {
						uni.showToast({
							title: proxy.$i18n.t(item.reg.tTip) || `Invalid ${item.key} format`,
							icon: 'none'
						})
					}
					return false
				}
			}
		}
	}
	return true;
}