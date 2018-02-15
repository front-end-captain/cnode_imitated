const router = require('express').Router();
const axios = require('axios');


const baseUrl = 'https://cnodejs.org/api/v1';

router.use( '/login', ( request, response, next ) => {
	axios.post( `${baseUrl}/accesstoken`, { accesstoken: request.body.accessToken })
	.then( res => {
		if ( res.status === 200 && res.data.success ) {
			request.session.user = {
				accessToken: request.body.accessToken,
				loginName: res.data.loginname,
				id: res.data.id,
				avatarUrl: res.data.avatar_url
			}
			response.json({
				success: true,
				data: res.data
			})
		}
	})
	.catch( error => {
		if ( error.response ) {
			response.json({
				success: false,
				data: error.response.data
			})
		} else {
			naxt( error );
		}
	})
})

module.exports = router;
