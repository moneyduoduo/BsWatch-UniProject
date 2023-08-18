/**
 * @file 全局状态管理，一个模块一个pinia实例
 * @example
 *  const store = useStore()
 *  获取xxx：store.xxx
 *  设置xxx: store.setxxx(value)
 */

import {
	createPinia
} from 'pinia';
import piniaPersist from 'pinia-plugin-persist-uni';

const store = createPinia();
store.use(piniaPersist);

export default store;