const express = require( 'express' );
const fs = require( 'fs' );
const path = require( 'path' );
const ReactSSR = require( 'react-dom/server' );
const serverEntry = require( './../build/server-entry' ).default;

const template = fs.readFileSync( path.resolve( __dirname, './../build/index.html' ), 'utf8' );

const app = express();
app.use( '/assets', express.static( path.resolve( __dirname, './../build' ) ) );

app.get( '*', function( request, response ) {
	const appString = ReactSSR.renderToString( serverEntry );
	response.send( template.replace( '<!-- app -->', appString ) );
})

app.listen( 3000, () => {
	console.log( 'The server is listening at port: 3000' );
})

