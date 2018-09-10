import React, { Component } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import styled from "styled-components";
import { connect } from "react-redux";
import { Pagination } from "antd";
import ListView from "./../../components/ListView/list_view.jsx";
import Loading from "./../../components/Loading/loading.jsx";
import NoResult from "./../../components/NoResult/no_result.jsx";
import {
	saveTopicListAsk,
	changeTopicListAskPageIndex,
} from "./../../store/topicList.store.js";
import { normalizeTopicList } from "./../../common/js/topicList.js";

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
	(state) => {
		return state.topicList;
	},
	{ saveTopicListAsk, changeTopicListAskPageIndex },
)
class TopicListAsk extends Component {
	static propTypes = {
		location: PropTypes.instanceOf(Object).isRequired,
		topicListAsk: PropTypes.instanceOf(Array),
		saveTopicListAsk: PropTypes.instanceOf(Function),
		changeTopicListAskPageIndex: PropTypes.instanceOf(Function),
		topicListAskPageIndex: PropTypes.number,
	};

	type = "";

	LIMIT = 15;

	constructor() {
		super();
		this.state = {
			loadFail: false,
			loading: false,
		};
		this.getTopicListAsk = this.getTopicListAsk.bind(this);
		this.onPageNumChange = this.onPageNumChange.bind(this);
	}

	componentDidMount() {
		const { location } = this.props;
		const type = location.pathname.split("/")[2];
		this.type = type;
		this.getTopicListAsk();
	}

	async onPageNumChange(current, pageSize) {
		this.setState({ loading: true });
		const { type } = this;
		const { saveTopicListAsk, changeTopicListAskPageIndex } = this.props;
		const page = current;
		const limit = pageSize;
		let res = null;
		try {
			res = await axios.get(`/api/topics?tab=${type}&page=${page}&limit=${limit}`);
			if (res.status === 200 && res.data.success) {
				saveTopicListAsk(normalizeTopicList(res.data.data));
				changeTopicListAskPageIndex(current);
				this.setState({ loading: false });
			} else {
				this.setState({ loadFail: true });
			}
		} catch (error) {
			console.log(error);
			this.setState({ loadFail: true });
		}
	}

	async getTopicListAsk() {
		const { topicListAsk, saveTopicListAsk } = this.props;
		if (topicListAsk.length > 0) {
			return;
		}
		this.setState({ loading: true });
		const { type } = this;
		const page = 1;
		const limit = this.LIMIT;
		let res = null;
		try {
			res = await axios.get(`/api/topics?tab=${type}&page=${page}&limit=${limit}`);
			if (res.status === 200 && res.data.success) {
				saveTopicListAsk(normalizeTopicList(res.data.data));
				this.setState({ loading: false });
			} else {
				this.setState({ loadFail: true });
			}
		} catch (error) {
			console.log(error);
			this.setState({ loadFail: true });
		}
	}

	render() {
		const { loadFail, loading } = this.state;
		const { topicListAsk, topicListAskPageIndex } = this.props;
		if (loadFail) {
			return (
				<LoadingContainer>
					<NoResult text="数据加载失败" />
				</LoadingContainer>
			);
		}
		if (loading) {
			return (
				<LoadingContainer>
					<Loading />
				</LoadingContainer>
			);
		}
		return [
			<ListView key={1} dataList={topicListAsk} />,
			<PaginationWrapper key={2}>
				<Pagination
					defaultPageSize={this.LIMIT}
					defaultCurrent={topicListAskPageIndex}
					total={62 * 20}
					onChange={this.onPageNumChange}
				/>
			</PaginationWrapper>,
		];
	}
}

export default TopicListAsk;
