import React, { Component } from "react";
import { Switch, Route, Redirect } from "react-router-dom";

import TopicList from "./views/TopicList/topic_list.jsx";
import TopicDetail from "./views/TopicDetail/topic_detail.jsx";
import Header from "./components/Header/header.jsx";
import HelmetSection from "./components/Helmet/helmet.jsx";
import Login from "./views/login/login.jsx";
import Logout from "./views/logout/logout.jsx";

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
				<Switch key="switch">
					<Route
						path="/"
						exact
						render={() => {
							return <Redirect to="/list" />;
						}}
					/>
					<Route path="/list" component={TopicList} />
					<Route path="/detail/:id" component={TopicDetail} />
					<Route path="/login" component={Login} />
					<Route path="/logout" component={Logout} />
				</Switch>,
			]
		);
	}
}

export default App;
