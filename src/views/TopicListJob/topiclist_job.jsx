import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import styled from 'styled-components';
import { connect } from 'react-redux';
import ListView from './../../components/ListView/list_view.jsx';
import Loading from './../../components/Loading/loading.jsx';
import NoResult from './../../components/NoResult/no_result.jsx';
import { saveTopicListJob } from './../../store/topicList.store.js';

const LoadingContainer = styled.div`
	width: 100%;
	min-height: 300px;
	display: flex;
	align-items: center;
	justify-content: center;
`;

@connect(
	state => state.topicList,
	{ saveTopicListJob },
)
class TopicListJob extends Component {
	constructor() {
		super();
		this.state = {
			loadFail: false,
		};
		this.getTopicListJob = this.getTopicListJob.bind( this );
	}

	componentDidMount() {
		const type = this.props.location.pathname.split('/')[2];
		this.getTopicListJob( type );
	}

	async getTopicListJob( type ) {
		if ( this.props.topicListJob.length > 0 ) {
			return;
		}
		let res = null;
		try {
			res = await axios.get(`/api/topics?tab=${type}`);
			if ( res.status === 200 && res.data.success ) {
				this.props.saveTopicListJob( res.data.data );
			} else {
				this.setState({ loadFail: true });
			}
		} catch ( error ) {
			console.log( error );
			this.setState({ loadFail: true });
		}
	}
	render() {
		if ( this.state.loadFail ) {
			return <LoadingContainer><NoResult text="数据加载失败" /></LoadingContainer>;
		}
		if ( this.props.topicListJob.length === 0 ) {
			return <LoadingContainer><Loading /></LoadingContainer>;
		}
		return <ListView dataList={ this.props.topicListJob } />;
	}
}

TopicListJob.propTypes = {
	location: PropTypes.instanceOf( Object ).isRequired,
	topicListJob: PropTypes.instanceOf( Object ),
	saveTopicListJob: PropTypes.instanceOf( Function ),
};

export default TopicListJob;
