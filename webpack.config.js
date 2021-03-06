const path = require('path')
const hwp = require('html-webpack-plugin')

module.exports = {
	entry: path.join(__dirname, '/src/index.js'),
	output: {
		filename: 'build.js',
		path: path.join(__dirname, '/')
	},
	module: {
		rules: [{
			exclude: /node_modules/,
			test: /\.js$/,
			use: {
				loader: 'babel-loader',
				options: {
					presets: ["@babel/preset-env", "@babel/preset-flow"],
					plugins: ["@babel/proposal-class-properties"]
				}
			}
		}]
	},
	plugins: [
		new hwp({template: path.join(__dirname, '/src/index.html')})
	]
}
