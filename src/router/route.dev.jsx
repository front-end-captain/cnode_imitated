import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";

import TopicList from "./../views/TopicList/topic_list.jsx";
import TopicDetail from "./../views/TopicDetail/topic_detail.jsx";
import Login from "./../views/login/login.jsx";
import Logout from "./../views/logout/logout.jsx";

const DevRouter = () => {
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

export default DevRouter;
