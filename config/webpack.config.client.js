const path = require("path");
const HtmlWebpackPlugin = require( 'html-webpack-plugin' );
const CLeanWebpackPlugin = require( 'clean-webpack-plugin' );
const webpack = require( 'webpack' );


// 判断是否为开发环境
const isDev = process.env.NODE_ENV === 'development';


// 源代码根目录
const SRC_PATH = path.resolve( 'src' );

// 打包后的输出文件存放目录
const BUILD_PATH = path.resolve( 'build' );

// 线上资源根目录 命名一般为 public static assets  / 必须存在 否则 hmr 将失效
const ASSETS_PATH = '/assets/';


const config = {
	// 依赖入口文件
	entry: {
		app: SRC_PATH + '/app.js'
	},

	// 打包输出文件
	output: {

		// 输出文件存放目录 绝对路径
		path: BUILD_PATH,

		// 输出文件名称
		filename: '[name]-[hash:8].js',

		// publicPath 为项目发布到线上所有资源的 URL 前缀， 为 String 类型
		// publicPath: '/assets/'     // 放到制定目录下
		// publicPath: ''             // 放到根目录下
		// publicPath: 'https://cdn.example.com'  // 放到 cdn 上
		publicPath: ASSETS_PATH
	},

	module: {
		rules: [
			{
        test: /\.(js|jsx)$/,
        enforce: 'pre',
				loader: require.resolve('eslint-loader'),
        include: SRC_PATH,
      },
			{
				test: /\.jsx?$/,
				exclude: /node_modules/,
				loader: require.resolve( 'babel-loader' ),
				options: {
					cacheDirectory: true,
				}
			}
		]
	},

	plugins: [
		new CLeanWebpackPlugin( ['build'] ),
		new HtmlWebpackPlugin({
			template: path.resolve( __dirname, './../src/template.html' ),
			favicon: path.resolve(__dirname, './../cnode.ico')
		})
	]
};

// 开发环境下配置 dev-sever
// dev-server 会检测计算机硬盘上的打包后的目录
// 若是存在打包后的目录文件夹
// dev-server 打包后的文件hash 和 已经存在的打包目录中的文件 hash 将不一致 将会导致 404 错误
// 所以在开发环境下应该删除打包目录文件夹
if ( isDev ) {
	config.entry = {
		app: [
			'react-hot-loader/patch',
			SRC_PATH + '/app.js'
		]
	};
	config.devServer = {
		host: '0.0.0.0',
		port: '8080',
		contentBase: BUILD_PATH,
		hot: true,
		overlay: {
			errors: true
		},
		publicPath: ASSETS_PATH,
		historyApiFallback: {
			index: ASSETS_PATH + 'index.html'
		}
	}
	config.plugins.push( new webpack.NamedModulesPlugin() );
	config.plugins.push( new webpack.HotModuleReplacementPlugin() );
}


module.exports = config;
