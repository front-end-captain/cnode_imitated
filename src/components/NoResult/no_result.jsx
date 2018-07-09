import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";

const NoResultSection = styled.div`
	width: 128px;
	height: 128px;

	p {
		margin-top: 10px;
		color: green;
		text-align: center;
	}
`;

function NoResult({ text }) {
	return (
		<NoResultSection>
			<img src={require("./no_result.png")} alt="no result" title="no result" />
			<p>{text}</p>
		</NoResultSection>
	);
}

NoResult.propTypes = {
	text: PropTypes.string,
};

export default NoResult;
