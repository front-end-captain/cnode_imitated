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
	saveTopicListGood,
	changeTopicListGoodPageIndex,
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
	{ saveTopicListGood, changeTopicListGoodPageIndex },
)
class TopicListGood extends Component {
	static propTypes = {
		location: PropTypes.instanceOf(Object).isRequired,
		topicListGood: PropTypes.instanceOf(Array),
		saveTopicListGood: PropTypes.instanceOf(Function),
		changeTopicListGoodPageIndex: PropTypes.instanceOf(Function),
		topicListGoodPageIndex: PropTypes.number,
	};

	type = "";

	LIMIT = 15;

	constructor() {
		super();
		this.state = {
			loadFail: false,
			loading: false,
		};

		this.getTopicListGood = this.getTopicListGood.bind(this);
		this.onPageNumChange = this.onPageNumChange.bind(this);
	}

	componentDidMount() {
		const { location } = this.props;
		const type = location.pathname.split("/")[2];
		this.type = type;
		this.getTopicListGood();
	}

	async onPageNumChange(current, pageSize) {
		this.setState({ loading: true });
		const { type } = this;
		const { saveTopicListGood, changeTopicListGoodPageIndex } = this.props;
		const page = current;
		const limit = pageSize;
		let res = null;
		try {
			res = await axios.get(`/api/topics?tab=${type}&page=${page}&limit=${limit}`);
			if (res.status === 200 && res.data.success) {
				saveTopicListGood(normalizeTopicList(res.data.data));
				changeTopicListGoodPageIndex(current);
				this.setState({ loading: false });
			} else {
				this.setState({ loadFail: true });
			}
		} catch (error) {
			console.log(error);
			this.setState({ loadFail: true });
		}
	}

	async getTopicListGood() {
		const { topicListGood, saveTopicListGood } = this.props;
		if (topicListGood.length > 0) {
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
				saveTopicListGood(normalizeTopicList(res.data.data));
				this.setState({ loading: false });
			} else {
				this.setState({ loadFail: true });
			}
		} catch (error) {
			this.setState({ loadFail: true });
		}
	}

	render() {
		const { loadFail, loading } = this.state;
		const { topicListGood, topicListGoodPageIndex } = this.props;
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
			<ListView key={1} dataList={topicListGood} />,
			<PaginationWrapper key={2}>
				<Pagination
					defaultPageSize={this.LIMIT}
					defaultCurrent={topicListGoodPageIndex}
					total={16 * 20}
					onChange={this.onPageNumChange}
				/>
			</PaginationWrapper>,
		];
	}
}

export default TopicListGood;
