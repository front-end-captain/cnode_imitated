import React from 'react';
import { NavLink } from 'react-router-dom';
import styled from 'styled-components';

const TabSection = styled.div`
	width: 100%;
	height: 40px;
	line-height: 40px;
	background-color: #f6f6f6;
	border-radius: 10px 10px 0 0;

	a {
		color: green;
		margin: 0 20px;
		&.active {
			span {
				padding: 2px 3px;
				border-radius: 3px;
				color: white;
				background-color: #80bd01;
			}
		}
	}
`;

function Tab() {
	return (
		<TabSection>
			<NavLink to="/list/all">
				<span>全部</span>
			</NavLink>
			<NavLink to="/list/good">
				<span>精华</span>
			</NavLink>
			<NavLink to="/list/share">
				<span>分享</span>
			</NavLink>
			<NavLink to="/list/ask">
				<span>问答</span>
			</NavLink>
			<NavLink to="/list/job">
				<span>招聘</span>
			</NavLink>
		</TabSection>
	);
}

export default Tab;
