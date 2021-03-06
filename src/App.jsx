import React, { Component } from "react";

import Header from "./components/Header/header.jsx";
import HelmetSection from "./components/Helmet/helmet.jsx";
import Router from "./router/index.js";

class App extends Component {
	constructor() {
		super();
		this.state = { hasError: false };
	}

	componentDidCatch(error, info) {
		if (error) {
			console.error(error, info);
			this.setState({ hasError: true });
		}
	}

	render() {
		const { hasError } = this.state;
		return hasError ? (
			<div>404 error</div>
		) : (
			[
				<Header key="header" />,
				<HelmetSection key="helmetsection" />,
				<Router key="router" />,
			]
		);
	}
}

export default App;
