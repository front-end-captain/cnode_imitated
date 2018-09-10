import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import axios from "axios";
import { connect } from "react-redux";
import { Pagination } from "antd";
import ListView from "./../../components/ListView/list_view.jsx";
import NoResult from "./../../components/NoResult/no_result.jsx";
import Loading from "./../../components/Loading/loading.jsx";
import {
	saveTopicListShare,
	changeTopicListSharePageIndex,
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
	{ saveTopicListShare, changeTopicListSharePageIndex },
)
class TopicListShare extends Component {
	static propTypes = {
		location: PropTypes.instanceOf(Object).isRequired,
		topicListShare: PropTypes.instanceOf(Object),
		saveTopicListShare: PropTypes.instanceOf(Function),
		changeTopicListSharePageIndex: PropTypes.instanceOf(Function),
		topicListSharePageIndex: PropTypes.number,
	};

	type = "";

	LIMIT = 15;

	constructor() {
		super();
		this.state = {
			loadFail: false,
			loading: false,
		};

		this.getTopicListShare = this.getTopicListShare.bind(this);
		this.onPageNumChange = this.onPageNumChange.bind(this);
	}

	componentDidMount() {
		const { location } = this.props;
		const type = location.pathname.split("/")[2];
		this.type = type;
		this.getTopicListShare();
	}

	async onPageNumChange(current, pageSize) {
		this.setState({ loading: true });
		const { saveTopicListShare, changeTopicListSharePageIndex } = this.props;
		const page = current;
		const limit = pageSize;
		let res = null;
		try {
			res = await axios.get(`/api/topics?tab=${this.type}&page=${page}&limit=${limit}`);
			if (res.status === 200 && res.data.success) {
				saveTopicListShare(normalizeTopicList(res.data.data));
				changeTopicListSharePageIndex(current);
				this.setState({ loading: false });
			} else {
				this.setState({ loadFail: true });
			}
		} catch (error) {
			console.log(error);
			this.setState({ loadFail: true });
		}
	}

	async getTopicListShare() {
		const { topicListShare, saveTopicListShare } = this.props;
		if (topicListShare.length > 0) {
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
				saveTopicListShare(normalizeTopicList(res.data.data));
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
		const { loading, loadFail } = this.state;
		const { topicListShare, topicListSharePageIndex } = this.props;
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
			<ListView key={1} dataList={topicListShare} />,
			<PaginationWrapper key={2}>
				<Pagination
					defaultPageSize={this.LIMIT}
					defaultCurrent={topicListSharePageIndex}
					total={16 * 20}
					onChange={this.onPageNumChange}
				/>
			</PaginationWrapper>,
		];
	}
}

export default TopicListShare;
