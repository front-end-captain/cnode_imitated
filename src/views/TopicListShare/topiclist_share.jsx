import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import axios from 'axios';
import { connect } from 'react-redux';
import ListView from './../../components/ListView/list_view.jsx';
import NoResult from './../../components/NoResult/no_result.jsx';
import Loading from './../../components/Loading/loading.jsx';
import { saveTopicListShare } from './../../store/topicList.store.js';

const LoadingContainer = styled.div`
	width: 100%;
	min-height: 300px;
	display: flex;
	align-items: center;
	justify-content: center;
`;

@connect(
	state => state.topicList,
	{ saveTopicListShare },
)
class TopicListShare extends Component {
	constructor() {
		super();
		this.state = {
			loadFail: false,
		};

		this.getTopicListShare = this.getTopicListShare.bind( this );
	}

	componentDidMount() {
		const type = this.props.location.pathname.split('/')[2];
		this.getTopicListShare( type );
	}

	async getTopicListShare( type ) {
		if ( this.props.topicListShare.length > 0 ) {
			return;
		}
		let res = null;
		try {
			res = await axios.get(`/api/topics?tab=${type}`);
			if ( res.status === 200 && res.data.success ) {
				this.props.saveTopicListShare( res.data.data );
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
		if ( this.props.topicListShare.length === 0 ) {
			return <LoadingContainer><Loading /></LoadingContainer>;
		}
		return <ListView dataList={ this.props.topicListShare } />;
	}
}

TopicListShare.propTypes = {
	location: PropTypes.instanceOf( Object ).isRequired,
	topicListShare: PropTypes.instanceOf( Object ),
	saveTopicListShare: PropTypes.instanceOf( Function ),
};

export default TopicListShare;
