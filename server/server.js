const express = require( 'express' );
const fs = require( 'fs' );
const path = require( 'path' );
const ReactSSR = require( 'react-dom/server' );

const PORT = 3000;

const isDev = process.env.NODE_ENV === 'development';


const app = express();


// 在非开发环境下 build 目录下才存在服务端要直出的资源（bundle）文件 即生产环境下的服务端渲染（npm run build）
if ( !isDev ) {

	const serverEntry = require( './../build/server-entry' ).default;

	const template = fs.readFileSync( path.resolve( __dirname, './../build/index.html' ), 'utf8' );
	app.use( '/assets', express.static( path.resolve( __dirname, './../build' ) ) );

	app.get( '*', function( request, response ) {
		const appString = ReactSSR.renderToString( serverEntry );
		response.send( template.replace( '<!-- app -->', appString ) );
	})
}

// 开发环境下的服务端渲染（还没有打包 build 目录还没有生成）
else {
	const devStatic = require( './utils/dev-static.js' );
	devStatic( app );
}


const server = app.listen( PORT, "localhost", function () {
	let host = server.address().address;
	let port = server.address().port;
	console.log("The server is listening at http://%s:%s", host, port);
});

