import {
	createI18n
} from 'vue-i18n'
import en from './en.json'
import ja from './ja.json'
import zhHans from './zh-Hans.json'

const messages = {
	en,
	// ja,
	'zh-Hans': zhHans
}


const i18n =
	createI18n({
		locale: uni.getLocale(), // 获取已设置的语言
		messages
	})

export {
	i18n
}