<script>
	export default {
		onLaunch: function() {
			console.log('App Launch')
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		},
	}
</script>

<style>
	/*每个页面公共css */
	#app,
	page {
		height: 100%;
		touch-action: pan-y;
		box-sizing: border-box;
		background: #F2F2F2;
		/*padding-bottom: constant(safe-area-inset-bottom); !* 兼容 iOS < 11.2 *!*/
		/*padding-bottom: env(safe-area-inset-bottom); !* 兼容 iOS >= 11.2 *!*/
	}

	* {
		box-sizing: border-box;
	}
</style>