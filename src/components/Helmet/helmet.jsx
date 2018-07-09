import React from "react";
import Helmet from "react-helmet";

const HelmetSection = () => {
	return (
		<Helmet>
			<meta name="description" content="this is description" />
			<meta name="description" content="this is another description" />
			<title>cnode</title>
		</Helmet>
	);
};

export default HelmetSection;
