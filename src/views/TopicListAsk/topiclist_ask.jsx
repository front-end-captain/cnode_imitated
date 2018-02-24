import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import styled from 'styled-components';
import { connect } from 'react-redux';
import Pagination from 'rc-pagination';
import 'rc-pagination/assets/index.css';
import ListView from './../../components/ListView/list_view.jsx';
import Loading from './../../components/Loading/loading.jsx';
import NoResult from './../../components/NoResult/no_result.jsx';
import { saveTopicListAsk, changeTopicListAskPageIndex } from './../../store/topicList.store.js';
import { normalizeTopicList } from './../../common/js/topicList.js';


const LoadingContainer = styled.div`
	width: 100%;
	min-height: 300px;
	display: flex;
	align-items: center;
	justify-content: center;
`;
const PaginationWrapper = styled.div`
	padding: 20px 0 10px 30px;
`;

@connect(
	state => state.topicList,
	{ saveTopicListAsk, changeTopicListAskPageIndex },
)
class TopicListAsk extends Component {
	constructor() {
		super();
		this.state = {
			loadFail: false,
		};
		this.getTopicListAsk = this.getTopicListAsk.bind( this );
		this.onPageNumChange = this.onPageNumChange.bind( this );
	}

	componentDidMount() {
		const type = this.props.location.pathname.split('/')[2];
		this.type = type;
		this.getTopicListAsk();
	}

	async onPageNumChange( current, pageSize ) {
		const type = this.type;
		const page = current;
		const limit = pageSize;
		let res = null;
		try {
			res = await axios.get(`/api/topics?tab=${type}&page=${page}&limit=${limit}`);
			if ( res.status === 200 && res.data.success ) {
				this.props.saveTopicListAsk( normalizeTopicList(res.data.data) );
				this.props.changeTopicListAskPageIndex( current );
			} else {
				this.setState({ loadFail: true });
			}
		} catch ( error ) {
			console.log( error );
			this.setState({ loadFail: true });
		}
	}

	async getTopicListAsk() {
		if ( this.props.topicListAsk.length > 0 ) {
			return;
		}
		const type = this.type;
		const page = 1;
		const limit = this.LIMIT;
		let res = null;
		try {
			res = await axios.get(`/api/topics?tab=${type}&page=${page}&limit=${limit}`);
			if ( res.status === 200 && res.data.success ) {
				this.props.saveTopicListAsk( normalizeTopicList(res.data.data) );
			} else {
				this.setState({ loadFail: true });
			}
		} catch ( error ) {
			console.log( error );
			this.setState({ loadFail: true });
		}
	}

	type = ''
	LIMIT = 15

	render() {
		if ( this.state.loadFail ) {
			return <LoadingContainer><NoResult text="数据加载失败" /></LoadingContainer>;
		}
		if ( this.props.topicListAsk.length === 0 ) {
			return <LoadingContainer><Loading /></LoadingContainer>;
		}
		return [
			<ListView key={1} dataList={ this.props.topicListAsk } />,
			<PaginationWrapper key={2}>
				<Pagination
					defaultPageSize={this.LIMIT}
					defaultCurrent={this.props.topicListAskPageIndex}
					total={62 * 20}
					onChange={ this.onPageNumChange }
				/>
			</PaginationWrapper>,
		];
	}
}

TopicListAsk.propTypes = {
	location: PropTypes.instanceOf( Object ).isRequired,
	topicListAsk: PropTypes.instanceOf( Array ),
	saveTopicListAsk: PropTypes.instanceOf( Function ),
	changeTopicListAskPageIndex: PropTypes.instanceOf( Function ),
	topicListAskPageIndex: PropTypes.number,
};

export default TopicListAsk;
