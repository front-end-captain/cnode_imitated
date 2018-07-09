import React from "react";
import styled from "styled-components";

const LoadingSection = styled.div`
	width: 200px;
	height: 200px;
	opacity: 1;
	border-radius: 10%;

	.loadEffect {
		width: 100px;
		height: 100px;
		position: relative;
		margin: 25% auto;
	}

	.loadEffect span {
		display: inline-block;
		width: 16px;
		height: 16px;
		border-radius: 50%;
		background: #48a5f4;
		position: absolute;
		animation: load 1.04s ease infinite;
	}

	@keyframes load {
		0% {
			opacity: 1;
		}

		100% {
			opacity: 0.2;
		}
	}

	.loadEffect span:nth-child(1) {
		left: 0;
		top: 50%;
		margin-top: -8px;
		animation-delay: 0.13s;
	}

	.loadEffect span:nth-child(2) {
		left: 14px;
		top: 14px;
		animation-delay: 0.26s;
	}

	.loadEffect span:nth-child(3) {
		left: 50%;
		top: 0;
		margin-left: -8px;
		animation-delay: 0.39s;
	}

	.loadEffect span:nth-child(4) {
		top: 14px;
		right: 14px;
		animation-delay: 0.52s;
	}

	.loadEffect span:nth-child(5) {
		right: 0;
		top: 50%;
		margin-top: -8px;
		animation-delay: 0.65s;
	}

	.loadEffect span:nth-child(6) {
		right: 14px;
		bottom: 14px;
		animation-delay: 0.78s;
	}

	.loadEffect span:nth-child(7) {
		bottom: 0;
		left: 50%;
		margin-left: -8px;
		animation-delay: 0.91s;
	}

	.loadEffect span:nth-child(8) {
		bottom: 14px;
		left: 14px;
		animation-delay: 1.04s;
	}
`;

function Loading() {
	return (
		<LoadingSection>
			<div className="loadEffect">
				<span />
				<span />
				<span />
				<span />
				<span />
				<span />
				<span />
				<span />
			</div>
		</LoadingSection>
	);
}

export default Loading;
