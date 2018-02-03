/**
 * 开发环境下的服务端渲染
 */

const path = require( 'path' );
const axios = require( 'axios' );
const webpack = require( 'webpack' );
const serverConfig = require( './../../config/webpack.config.server.js' );
const MemoryFS = require( 'memory-fs' );
const ReactDOMServer = require( 'react-dom/server' );
const Proxy = require( 'http-proxy-middleware' );

// 获取在硬盘上的 html 模板文件 在 npm run dev:client 之后
// 通过 http 请求的方式请求 webpack-dev-server 拿到 template.html
const getTemplate = () => {
	return new Promise( ( resolve, reject ) => {
		axios.get( 'http://localhost:8080/assets/index.html' )
			.then( ( res ) => {
				resolve( res.data );
			})
			.catch( error => { reject( error ) });
	})
}

const mfs = new MemoryFS();

const Module = module.constructor;

let serverBundle = null;


// serverCompiler 将会监听 server-entry 的依赖变化
// serverCompiler 是一个 webpack Compiler 实例
const serverCompiler = webpack( serverConfig );

// 默认情况下 webpack 的读写文件都是在磁盘上进行
// 这里指定 webpack 的读写文件操作在 内存中进行
serverCompiler.outputFileSystem = mfs;

//
serverCompiler.watch({}, ( error, stats ) => {
	if ( error || stats.hasErrors() ) {
		throw error;
	}

	stats = stats.toJson();
	stats.errors.forEach( error => console.error( error ) );
	stats.warnings.forEach( warn => console.warn( warn ) );

	const bundlePath = path.join(
		serverConfig.output.path,
		serverConfig.output.filename
	);

	// 此时输出的 bundle 为字符串
	const bundle = mfs.readFileSync( bundlePath, 'utf-8' );

	const m = new Module();

	// 编译为一个模块 必须制定模块名称
	m._compile( bundle, 'server-entry.js' );

	serverBundle = m.exports.default;
})

module.exports = ( app ) => {

	// 将静态资源的访问代理到 webpack-dev-server 去访问
	app.use( '/assets/', Proxy({
		target: 'http://localhost:8080'
	}))

	app.get( '*', ( request, response ) => {
		getTemplate().then( template => {
			const content = ReactDOMServer.renderToString( serverBundle );
			response.send( template.replace( '<!-- app -->', content ) );
		})
	})
}
