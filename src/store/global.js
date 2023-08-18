import {
	defineStore
} from 'pinia';

export const useStore = defineStore('global', {
	state() {
		return {
			token: null,
			pid: null,
			userInfo: null,
			isRegister: false,
			deviceInfo: null,
			lastSyncTime: null
		}
	},
	actions: {
		setToken(val) {
			this.token = val;
		},
		setDeviceInfo(val) {
			this.deviceInfo = val;
		},
		setUserInfo(val) {
			this.userInfo = val;
		},
		setPid(val) {
			this.pid = val;
		},
		setIsRegister(val) {
			this.isRegister = val;
		},
		setSyncTime(val) {
			this.lastSyncTime = val;
		},
		logOut() {
			this.token = null;
			this.pid = null;
			this.isRegister = false;
			this.userInfo = null;
			this.deviceInfo = null;
			this.lastSyncTime = null;
		}
	},
	persist: {
		enabled: true
	}
});