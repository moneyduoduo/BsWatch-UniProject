import {
	defineConfig
} from 'vite'
import uni from '@dcloudio/vite-plugin-uni'

const path = require('path');

export default defineConfig({
	resolve: {
		alias: {
			'@': path.resolve(__dirname, './src')
		},
	},

	plugins: [
		uni(),
	],
})