import React from 'react';
import styled from 'styled-components';
import { Switch, Route, Redirect } from 'react-router-dom';

import Tab from './../../components/Tab/tab.jsx';
import TopicListAll from './../TopicListAll/topiclist_all.jsx';
import TopicListGood from './../TopicListGood/topiclist_good.jsx';
import TopicListShare from './../TopicListShare/topiclist_share.jsx';
import TopicListAsk from './../TopicListAsk/topiclist_ask.jsx';
import TopicListJob from './../TopicListJob/topiclist_job.jsx';


const TopicListSection = styled.div`
	width: 90%;
	min-height: 300px;
	margin: 10px auto;
	border-radius: 10px;
	background-color: #fff;
`;

function TopicList() {
	return (
		<TopicListSection>
			<Tab />
			<Switch>
				<Route path="/list" exact render={ () => <Redirect to="/list/all" /> } />
				<Route path="/list/all" component={ TopicListAll } />
				<Route path="/list/good" component={ TopicListGood } />
				<Route path="/list/share" component={ TopicListShare } />
				<Route path="/list/ask" component={ TopicListAsk } />
				<Route path="/list/job" component={ TopicListJob } />
				<Route render={ () => <Redirect to="/list/all" /> } />
			</Switch>
		</TopicListSection>
	);
}

export default TopicList;
