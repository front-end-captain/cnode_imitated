const path = require("path");

// 源代码根目录
const SRC_PATH = path.resolve( 'src' );

// 打包后的输出文件存放目录
const BUILD_PATH = path.resolve( 'build' );

// 线上资源根目录
const ASSETS_PATH = '/assets/';


module.exports = {
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
	}
};
