import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import Loadable from "react-loadable";

import Login from "./../views/login/login.jsx";
import Logout from "./../views/logout/logout.jsx";

const TopicList = Loadable({
	loader: () => {
		return import(/* webpackChunkName: "topic_list" */ "./../views/TopicList/topic_list.jsx");
	},
	loading() {
		return <div>Loading...</div>;
	},
});

const TopicDetail = Loadable({
	loader: () => {
		return import(/* webpackChunkName: "topic_detail" */ "./../views/TopicDetail/topic_detail.jsx");
	},
	loading() {
		return <div>Loading...</div>;
	},
});

const ProdRouter = () => {
	return (
		<Switch>
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
		</Switch>
	);
};

export default ProdRouter;
