const axios = require('axios');

const baseUrl = 'https://cnodejs.org/api/v1';


module.exports = ( request, response, next ) => {
	const path = request.path;
	const user = request.session.user || {};
	const needAccessToken = request.query.needAccessToken;

	if ( needAccessToken && user.accessToken ) {
		response.status(401).send({
			success: false,
			msg: 'need login'
		})
	}

	const query = Object.assign({}, request.query);

	if ( query.needAccessToken ) delete query.needAccessToken;

	axios( `${baseUrl}${path}`, {
		method: request.method,
		params: query,
		data: Object.assign({}, request.body, { accesstoken: user.accessToken }),
		headers: {
			"Content-Type": "application/x-www-form-urlencode"
		}
	})
	.then( res => {
		if ( res.status === 200 ) {
			response.send( res.data );
		} else {
			response.status( res.status ).send( res.data );
		}
	})
	.catch( error => {
		if ( error.response ) {
			response.status( 500 ).send( error.response.data )
		} else {
			response.status( 500 ).send({
				success: false,
				msg: 'unknown error'
			})
		}
	})
}
