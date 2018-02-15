import React, { Component } from 'react';
import axios from 'axios';


class ApiTest extends Component {
	constructor() {
		super();
		this.getTopics = this.getTopics.bind( this );
		this.login = this.login.bind( this );
		this.markall = this.markall.bind( this );
	}
	componentDidMount() {
		// do something
	}

	getTopics() {
		axios.get('/api/topics')
		.then( ( res ) => {
			console.log( res );
		});
	}

	login() {
		axios.post('/api/user/login', {
			accessToken: '25120756-dfb4-44c3-9b20-ec08f0406d06',
		})
		.then( ( res ) => {
			console.log( res );
		});
	}

	markall() {
		axios.post( '/api/message/mark_all?needAccessToken=true')
		.then( ( res ) => {
			console.log( res );
		});
	}

	render() {
		return (
			<div>
				<button onClick={ this.getTopics }>topics</button>
				<button onClick={ this.login }>login</button>
				<button onClick={ this.markall }>markall</button>
			</div>
		);
	}
}

export default ApiTest;
