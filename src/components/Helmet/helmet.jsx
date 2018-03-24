import React from 'react';
import Helmet from 'react-helmet';

const HelmetSection = () => {
	return (
		<Helmet>
			<meta name="description" content="this is description" />
			<meta name="description" content="this is another description" />
			<link rel="stylesheet" href="https://cdn.bootcss.com/simplemde/1.11.2/simplemde.min.css"/>
			<title>cnode</title>
		</Helmet>
	);
};

export default HelmetSection;
