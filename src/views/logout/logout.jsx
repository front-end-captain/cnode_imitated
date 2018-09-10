import React, { Component } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { clearUserInfo, setAuth } from "./../../store/user.store.js";

const LogoutPage = styled.div`
	position: fixed;
	top: 0;
	left: 0;
	bottom: 0;
	right: 0;

	.cover {
		width: 100%;
		height: 100%;
		background: rgba(0, 0, 0, 0.65);
		z-index: 99;
	}

	.logout-panel {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		width: 30%;
		height: 200px;
		background-color: #fff;
		z-index: 99;
		border-radius: 10px;
		display: flex;
		flex-direction: column;

		.text {
			display: flex;
			width: 100%;
			flex: 2 1;
			border-radius: 10px 10px 0 0;
			border-bottom: 2px solid #ccc;
			justify-content: center;
			align-items: center;
			font-size: 18px;
			color: #666;
		}

		.btn-group {
			width: 100%;
			display: flex;
			flex-direction: column;
			flex: 1 1;

			.btn {
				display: flex;
				flex: 1 1;
				justify-content: center;
				align-items: center;
				cursor: pointer;

				&:hover {
					background-color: lightblue;
				}
			}

			.cancel-btn {
				border-right: 0.5px solid #ccc;

				&:hover {
					border-radius: 0 0 0 10px;
				}
			}

			.confirm-btn {
				border-left: 0.5px solid #ccc;

				&:hover {
					border-radius: 0 0 10px 0;
				}
			}
		}
	}
`;

@connect(
	(state) => {
		return state.user;
	},
	{ clearUserInfo, setAuth },
)
class Logout extends Component {
	static propTypes = {
		history: PropTypes.instanceOf(Object).isRequired,
		clearUserInfo: PropTypes.instanceOf(Function).isRequired,
		setAuth: PropTypes.instanceOf(Function).isRequired,
		isAuth: PropTypes.bool.isRequired,
	};

	constructor() {
		super();
		this.state = {};

		this.handleCancel = this.handleCancel.bind(this);
		this.handleConfirm = this.handleConfirm.bind(this);
	}

	componentDidMount() {
		const { isAuth, history } = this.props;
		if (!isAuth) {
			history.replace("/list");
		}
	}

	handleCancel() {
		const { history } = this.props;
		history.goBack();
	}

	handleConfirm() {
		const { clearUserInfo, setAuth } = this.props;
		clearUserInfo();
		setAuth(false);
		this.handleCancel();
	}

	render() {
		return (
			<LogoutPage>
				<div className="cover" />
				<div className="logout-panel">
					<div className="text">
						<p>确定要退出么？</p>
					</div>
					<div className="btn-group">
						<div className="cancel-btn btn" onClick={this.handleCancel}>
							取消
						</div>
						<div className="confirm-btn btn" onClick={this.handleConfirm}>
							确定
						</div>
					</div>
				</div>
			</LogoutPage>
		);
	}
}

export default Logout;
