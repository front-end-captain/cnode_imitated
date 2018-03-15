/* eslint-disable react/no-unused-state */
/* eslint-disable no-debugger */
/* eslint-disable no-return-assign */
import React, { Component } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import axios from 'axios';
import { connect } from 'react-redux';
import { saveUserInfo, setAuth } from './../../store/user.store.js';

const LoginPage = styled.div`
	position: fixed;
	top: 0;
	height: 0;
	width: 100%;
	height: 100%;

	.cover-layer {
		width: 100%;
		height: 100%;
		background: rgba( 0, 0, 0, 0.65 );
		z-index: 99;
	}
	.login-panel {
		position: absolute;
		left: 50%;
		top: 50%;
		transform: translate( -50%, -50% );
		width: 30%;
		height: 220px;
		background-color: #fff;
		z-index: 99;
		border-radius: 20px;
		padding: 10px;

		input {
			width: 90%;
			margin: 20px;
			border-bottom: 1px solid #ccc;
			outline: none;
			height: 40px;
			text-indent: 1rem;
			color: #666;
			:focus {
				border-bottom-color: lightblue;
			}
		}
		button {
			width: 90%;
			height: 30px;
			border: none;
			background-color: #449898;
			color: #fff;
			font-size: 18px;
			margin: 10px 20px;
			outline: none;
			cursor: pointer;
			border-radius: 5px;
			:hover {
				background-color: lightblue;
				color: #000;
			}
		}
		.tip {
			font-size: 12px;
			color: darkred;
			position: relative;
			left: 20px;
			top: -16px
		}
	}

`;

@connect(
	state => state.user,
	{ saveUserInfo, setAuth },
)
class Login extends Component {

	static propTypes = {
		history: PropTypes.instanceOf( Object ).isRequired,
		saveUserInfo: PropTypes.instanceOf( Function ).isRequired,
		setAuth: PropTypes.instanceOf( Function ).isRequired,
	}

	constructor() {
		super();
		this.state = {
			accessToken: '',
			loginFail: false,
		};

		this.handleChange = this.handleChange.bind( this );
		this.handleLogin = this.handleLogin.bind( this );
		this.handleCancel = this.handleCancel.bind( this );
	}

	componentDidMount() {
		this.input.addEventListener('keydown', ( event ) => {
			if ( event.keyCode === 13 ) {
				this.handleLogin();
			}
		});
	}

	handleChange( event ) {
		this.setState({ accessToken: event.target.value });
	}

	async handleLogin() {
		let res = null;
		try {
			res = await axios.post('/api/user/login', { accessToken: this.state.accessToken });
			if ( res.status === 200 && res.data.success ) {
				this.props.saveUserInfo({
					loginname: res.data.data.loginname,
					id: res.data.data.id,
					avatar_url: res.data.data.avatar_url,
				});
				this.props.setAuth( true );
				this.handleCancel();
			} else {
				this.props.setAuth( false );
				this.setState({ loginFail: true });
			}
		} catch ( error ) {
			console.log( error );
			this.props.setAuth( false );
			this.setState({ loginFail: true });
		}
	}

	handleCancel() {
		this.props.history.goBack();
	}

	render() {
		return (
			<LoginPage>
				<div className="cover-layer" />
				<div className="login-panel">
					<input
						type="text"
						placeholder="请输入 accesstoken"
						onChange={ this.handleChange }
						ref={ input => this.input = input }
					/>
					<span className="tip">{ this.state.loginFail ? '登录失败' : '' }</span>
					<button type="button" onClick={ this.handleLogin } >登&nbsp;&nbsp;录</button>
					<button type="button" onClick={ this.handleCancel } >取&nbsp;&nbsp;消</button>
				</div>
			</LoginPage>
		);
	}
}

export default Login;
