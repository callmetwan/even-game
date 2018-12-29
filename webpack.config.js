const path = require('path')
const hwp = require('html-webpack-plugin')

module.exports = {
	entry: path.join(__dirname, '/src/index.js'),
	output: {
		filename: 'build.js',
		path: path.join(__dirname, '/dist')
	},
	module: {
		rules: [{
			exclude: /node_modules/,
			test: /\.js$/,
			use: {
				loader: 'babel-loader',
				options: {
					presets: ["env", "flow"]
				}
			}
		}]
	},
	plugins: [
		new hwp({template: path.join(__dirname, '/src/index.html')})
	]
}
