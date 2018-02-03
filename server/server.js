const express = require( 'express' );
const ReactSSR = require( 'react-dom/server' );
const serverEntry = require( './../build/server-entry' ).default;


const app = express();

app.get( '*', function( request, response ) {
	const appString = ReactSSR.renderToString( serverEntry );
	response.send( appString)
})

app.listen( 3000, () => {
	console.log( 'The server is listening at port: 3000' );
})

