const express = require( 'express' );
const fs = require( 'fs' );
const path = require( 'path' );
const ReactSSR = require( 'react-dom/server' );
const favicon = require('serve-favicon');
const bodyParser = require('body-parser');
const session = require('express-session');
const PORT = 3000;

const isDev = process.env.NODE_ENV === 'development';


const app = express();

app.use( function ( request, response, next ) {
	console.log( "The request type is " + request.method + "; request url is " + request.originalUrl );
	next();
});

app.use( bodyParser.json() );
app.use( bodyParser.urlencoded({ extended: false }));
app.use( session({
	maxAge: 10 * 60 * 1000,
	name: 'tid',
	resave: false,
	saveUninitialized: false,
	secret: 'react_cnode'
}));
app.use( favicon( path.resolve(__dirname, './../cnode.ico')));

app.use('/api/user', require('./utils/handle-login'));
app.use('/api', require('./utils/proxy'));


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
