const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const webpack = require("webpack");
const autoprefixer = require("autoprefixer");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const {
	SRC_PATH,
	BUILD_PATH,
	ASSETS_PATH,
	ROOT_PATH,
} = require("./constant.js");

const config = {
	devtool: "cheap-module-source-map",

	mode: "development",

	// 依赖入口文件 使用 react-hot-loader 启用 HMR
	entry: {
		app: ["react-hot-loader/patch", SRC_PATH + "/app.js"],
	},

	output: {
		path: BUILD_PATH,

		filename: "[name]-[hash:8].js",

		// publicPath 为项目发布到线上所有资源的 URL 前缀， 为 String 类型
		// publicPath: '/assets/'     // 放到制定目录下
		// publicPath: ''             // 放到根目录下
		// publicPath: 'https://cdn.example.com'  // 放到 cdn 上
		publicPath: ASSETS_PATH,
	},

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
				include: SRC_PATH,
				exclude: /node_modules/,
				loader: require.resolve("babel-loader"),
				options: {
					cacheDirectory: true,
				},
			},
			{
				test: /\.(js|jsx)$/,
				loader: require.resolve("stylelint-custom-processor-loader"),
				exclude: /node_modules/,
			},
			// 由于使用 styled-components 所以要将 css 抽取出来 从外部引入
			// 同时启用 sourceMap 方便调试 css 代码
			{
				test: /\.css$/,
				use: [
					{
						loader: "css-hot-loader",
					},
					{
						loader: MiniCssExtractPlugin.loader,
					},
					{
						loader: require.resolve("css-loader"),
						options: {
							importLoaders: 1,
							sourceMap: true,
							// 确保 css 生效，所有生成的 css 类名保持原有类名
							// 使用其他标识模板或者无此配置项 css 样式将无效!!!
							localIdentName: "[local]",
						},
					},
					{
						loader: require.resolve("postcss-loader"),
						options: {
							ident: "postcss",
							sourceMap: true,
							plugins: () => [
								require("postcss-flexbugs-fixes"),
								autoprefixer({
									browsers: [
										">1%",
										"last 4 versions",
										"Firefox ESR",
										"not ie < 9", // React doesn't support IE8 anyway
									],
									flexbox: "no-2009",
								}),
							],
						},
					},
				],
			},
			{
				test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
				loader: require.resolve("url-loader"),
				options: {
					limit: 10000,
					name: "[name].[hash:7].[ext]",
				},
			},
		],
	},

	devServer: {
		open: false,
		host: "0.0.0.0",
		port: "8080",
		contentBase: BUILD_PATH,
		hot: true,
		overlay: {
			errors: true,
		},
		publicPath: ASSETS_PATH,
		historyApiFallback: {
			index: ASSETS_PATH + "index.html",
		},
		proxy: {
			"/api": "http://localhost:3000",
		},
	},

	plugins: [
		// 开发环境下仍然清除 build 目录 防止浏览器请求 build 目录下过期的文件
		// dev-server 会检测计算机硬盘上的打包后的目录
		// 若是存在打包后的目录文件夹
		// dev-server 打包后的文件 hash 和 已经存在的打包目录中的文件 hash 将不一致 将会导致 404 错误
		// 所以在开发环境下应该删除打包目录文件夹
		new CleanWebpackPlugin([BUILD_PATH], {
			root: ROOT_PATH,
			verbose: true,
			dry: false,
		}),
		// 非服务端渲染情况下 生产环境和开发环境的入口文件
		new HtmlWebpackPlugin({
			title: "cnode",
			template: path.join(SRC_PATH, "/template.html"),
			favicon: path.join(ROOT_PATH, "/cnode.ico"),
		}),
		// 开发环境和生产环境下的服务端渲染模版文件
		new HtmlWebpackPlugin({
			template:
				"!!ejs-compiled-loader!" + path.join(SRC_PATH, "/server.template.ejs"),
			filename: "server.ejs",
			favicon: path.join(ROOT_PATH, "/cnode.ico"),
		}),
		new MiniCssExtractPlugin({
			filename: "[name].css",
			chunkFilename: "[id].css",
		}),
		new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
		new webpack.NamedModulesPlugin(),
		new webpack.HotModuleReplacementPlugin(),
	],
};

module.exports = config;
