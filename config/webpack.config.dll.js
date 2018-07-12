const DLLPlugin = require("webpack/lib/DllPlugin");
const CleanPlugin = require("clean-webpack-plugin");
const path = require("path");
const webpack = require("webpack");
const { DLL_PATH, ROOT_PATH } = require("./constant.js");

const pkg = require("./../package.json");

const dll = Object.keys(pkg.dependencies);

const dllConfig = {
	entry: {
		dll: dll,
	},
	output: {
		filename: "[name].dll.js",
		path: DLL_PATH,
		library: "_dll_[name]",
	},
	plugins: [
		new CleanPlugin([DLL_PATH], {
			root: ROOT_PATH,
		}),
		new webpack.optimize.UglifyJsPlugin({
			mangle: true,
			exclude: /\.min\.js$/,
			output: { comments: false },
			compressor: {
				warnings: false,
				drop_console: true,
				drop_debugger: true,
			},
		}),
		new DLLPlugin({
			name: "_dll_[name]",
			path: path.join(DLL_PATH, "[name]-manifest.json"),
		}),
	],
};

module.exports = dllConfig;
