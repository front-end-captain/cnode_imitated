const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const webpack = require("webpack");
const autoprefixer = require("autoprefixer");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const NameAllModulesPlugin = require("name-all-modules-plugin");
const HappyPack = require("happypack");
const ModuleConcatenationPlugin = require("webpack/lib/optimize/ModuleConcatenationPlugin");
// const DLLReferencePlugin = require("webpack/lib/DllReferencePlugin");
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer")
	.BundleAnalyzerPlugin;
// const AddAssetsPlugin = require("add-asset-html-webpack-plugin");
// const cdnConfig = require("./../config").cdn;
const {
	ROOT_PATH,
	SRC_PATH,
	BUILD_PATH,
	ASSETS_PATH,
} = require("./../config/constant.js");

// 线上资源根目录 命名一般为(public / static / assets)  / 必须存在 否则 hmr 将失效
// const ASSETS_PATH = cdnConfig.host;

const config = {
	context: ROOT_PATH,
	target: "web",
	entry: {
		app: SRC_PATH + "/app.js",
		vendor: [
			"react",
			"react-dom",
			"react-router",
			"react-router-dom",
			"redux",
			"react-redux",
			"axios",
			"marked",
			"styled-components",
			"react-simplemde-editor",
		],
	},

	output: {
		path: BUILD_PATH,
		filename: "[name]-[chunkhash:8].js",
		// chunkFilename: '[name]-[hash:8].chunk.js',
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
				exclude: /node_modules/,
				use: ["happypack/loader?id=babel"],
				},
			{
				test: /\.css$/,
				loader: ExtractTextPlugin.extract(
					Object.assign(
						{
							fallback: {
								loader: require.resolve("style-loader"),
								options: {
									hmr: false,
								},
							},
							use: [
								{
									loader: "css-loader",
									options: {
										importLoaders: 1,
										minimize: true,
										sourceMap: false,
									},
								},
								{
									loader: "postcss-loader",
									options: {
										ident: "postcss",
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
						{},
					),
				),
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

	plugins: [
		new CleanWebpackPlugin([BUILD_PATH], {
			root: ROOT_PATH,
			verbose: true,
			dry: false,
		}),
		new HappyPack({
			id: "babel",
			loaders: ["babel-loader?compact=true"]
		}),
		new ModuleConcatenationPlugin(),
		// new DLLReferencePlugin({
		// 	manifest: require(`${DLL_PATH}/dll-manifest.json`),
		// }),
		// new AddAssetsPlugin({
		// 	filepath: DLL_PATH + "/dll.dll.js",
		// 	includeSourcemap: false,
		// }),
		new webpack.DefinePlugin({
			"process.env": {
				NODE_ENV: JSON.stringify("production"),
			},
		}),
		new HtmlWebpackPlugin({
			title: "cnode",
			inject: true,
			template: path.join(SRC_PATH, "/template.html"),
			favicon: path.join(ROOT_PATH, "/cnode.ico"),
			minify: {
				removeComments: true,
				collapseWhitespace: true,
				removeRedundantAttributes: true,
				useShortDoctype: true,
				removeEmptyAttributes: true,
				removeStyleLinkTypeAttributes: true,
				keepClosingSlash: true,
				minifyJS: true,
				minifyCSS: true,
				minifyURLs: true,
			},
		}),
		new HtmlWebpackPlugin({
			template:
				"!!ejs-compiled-loader!" + path.join(SRC_PATH, "/server.template.ejs"),
			filename: "server.ejs",
			favicon: path.join(ROOT_PATH, "/cnode.ico"),
		}),
		new webpack.optimize.UglifyJsPlugin({
			compress: {
				warnings: false,
				comparisons: false,
			},
			output: {
				comments: false,
				ascii_only: true,
			},
			sourceMap: true,
		}),
		new webpack.optimize.CommonsChunkPlugin({
			name: "vendor",
		}),
		new webpack.optimize.CommonsChunkPlugin({
			name: "manifest",
			minChunks: Infinity,
		}),
		new webpack.NamedModulesPlugin(),
		new NameAllModulesPlugin(),
		new webpack.NamedChunksPlugin((chunk) => {
			if (chunk.name) {
				return chunk.name;
			}
			return chunk
				.mapModules((m) => path.relative(m.context, m.request))
				.join("_");
		}),
		new ExtractTextPlugin({
			filename: "[name]-[contenthash:5].css",
			ignoreOrder: true,
			allChunks: true,
		}),
		new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
		new BundleAnalyzerPlugin(),
	],
};

module.exports = config;
