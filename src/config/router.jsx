import React from 'react';
import { Route } from 'react-router-dom';

import TopicList from './../views/TopicList/topic_list.jsx';
import TopicDetail from './../views/TopicDetail/topic_detail.jsx';


export default () => (
	<div>
		<Route path="/" exact component={ TopicList } />
		<Route path="/list" component={ TopicList } />
		<Route path="/detail" component={ TopicDetail } />
	</div>
);
