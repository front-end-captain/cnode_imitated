import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import styled from "styled-components";
import { connect } from "react-redux";
import PropTypes from "prop-types";

const HeaderSection = styled.div`
	width: 100%;
	padding: 9px 0;
	background-color: #555;

	.header-wrapper {
		width: 90%;
		margin: 0 auto;
		overflow: hidden;
		line-height: 2;
	}

	.logo-area {
		width: 120px;
		height: 34px;
		float: left;
	}

	nav {
		display: block;
		float: right;

		a {
			color: white;
			margin: 0 15px;
			text-decoration: none;

			&:hover {
				color: orange;
			}
		}

		a.active {
			color: orange;
		}
	}
`;

@connect(
	(state) => {
		return state.user;
	},
	null,
)
class Header extends Component {
	static propTypes = {
		isAuth: PropTypes.bool.isRequired,
	};

	render() {
		const { isAuth } = this.props;
		return (
			<HeaderSection>
				<div className="header-wrapper">
					<div className="logo-area">
						<img
							src={require("./cnodejs_light.svg")}
							alt="logo"
							title="cnode"
						/>
					</div>
					<nav>
						<NavLink to="/list">
							<span>首页</span>
						</NavLink>
						<NavLink to="/unread">
							<span>未读消息</span>
						</NavLink>
						<NavLink to="/newer">
							<span>新手入门</span>
						</NavLink>
						<NavLink to="/api">
							<span>API</span>
						</NavLink>
						<NavLink to={isAuth ? "/logout" : "/login"}>
							{isAuth ? <span>退出</span> : <span>登录</span>}
						</NavLink>
					</nav>
				</div>
			</HeaderSection>
		);
	}
}

export default Header;
