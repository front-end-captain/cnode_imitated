import React, { Component } from 'react';
import axios from 'axios';
import styled from 'styled-components';


const Button = styled.button`
	width: 100px;
	height: 30px;
	background-color: lightblue;
	border-radius: 10px;
	outline: none;
	color: ${(props) => { return props.primary ? 'blue' : 'white'; }};
`;


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
				<Button onClick={ this.getTopics }>topics</Button>
				<Button onClick={ this.login }>login</Button>
				<Button onClick={ this.markall }>markall</Button>
			</div>
		);
	}
}

export default ApiTest;
