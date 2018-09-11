const {
	SRC_PATH,
	BUILD_PATH,
	ASSETS_PATH,
	ROOT_PATH,
} = require("./constant.js");

module.exports = {
	context: ROOT_PATH,
	// 永远为开发模式 不对任何的 bundle 进行分割
	mode: "development",
	target: "node",

	entry: {
		app: SRC_PATH + "/server-entry.js",
	},

	output: {
		path: BUILD_PATH,

		filename: "server-entry.js",

		// publicPath 为项目发布到线上所有资源的 URL 前缀， 为 String 类型
		// publicPath: '/assets/'     // 放到制定目录下
		// publicPath: ''             // 放到根目录下
		// publicPath: 'https://cdn.example.com'  // 放到 cdn 上
		publicPath: ASSETS_PATH,

		// 输出的代码将以 module.exports = lib_code 的方式导出
		libraryTarget: "commonjs2",

		library: "server-output",
	},

	// 构建过程中不用被打包的模块
	externals: Object.keys(require("./../package.json").dependencies),

	module: {
		rules: [
			{
				test: /\.(js|jsx)$/,
				enforce: "pre",
				loader: require.resolve("eslint-loader"),
				include: SRC_PATH,
			},
			{
				test: /\.jsx?$/,
				exclude: /node_modules/,
				loader: require.resolve("babel-loader"),
				options: {
					cacheDirectory: true,
				},
			},
			{
				test: /\.css$/,
				loader: "css-loader",
			},
			{
				test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
				loader: "url-loader",
				options: {
					limit: 10000,
					name: "[name].[hash:7].[ext]",
				},
			},
		],
	},
};
