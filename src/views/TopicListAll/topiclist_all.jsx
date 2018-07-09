import React, { Component } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import styled from "styled-components";
import { connect } from "react-redux";
import Pagination from "rc-pagination";
import "rc-pagination/assets/index.css";
import ListView from "./../../components/ListView/list_view.jsx";
import Loading from "./../../components/Loading/loading.jsx";
import NoResult from "./../../components/NoResult/no_result.jsx";
import {
	saveTopicListAll,
	changeTopicListAllPageIndex,
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
	{ saveTopicListAll, changeTopicListAllPageIndex },
)
class TopicListAll extends Component {
	static propTypes = {
		location: PropTypes.instanceOf(Object).isRequired,
		topicListAll: PropTypes.instanceOf(Array),
		saveTopicListAll: PropTypes.instanceOf(Function),
		changeTopicListAllPageIndex: PropTypes.instanceOf(Function),
		topicListAllPageIndex: PropTypes.number,
	};

	constructor() {
		super();
		this.state = {
			// 数据是否加载失败 默认 false 表示成功
			loadFail: false,

			// 网络请求进行中 默认 false 表示响应已经到来 并且数据已经准备好展示
			loading: false,
		};

		this.getTopicListAll = this.getTopicListAll.bind(this);
		this.onPageNumChange = this.onPageNumChange.bind(this);
	}

	componentDidMount() {
		const type = this.props.location.pathname.split("/")[2];
		this.type = type;
		this.getTopicListAll();
	}

	async onPageNumChange(current, pageSize) {
		this.setState({ loading: true });
		const { type } = this;
		const page = current;
		const limit = pageSize;
		let res = null;
		try {
			res = await axios.get(`/api/topics?tab=${type}&page=${page}&limit=${limit}`);
			if (res.status === 200 && res.data.success) {
				this.props.saveTopicListAll(normalizeTopicList(res.data.data));
				this.props.changeTopicListAllPageIndex(current);
				this.setState({ loading: false });
			} else {
				this.setState({ loadFail: true });
			}
		} catch (error) {
			console.error(error);
			this.setState({ loadFail: true });
		}
	}

	async getTopicListAll() {
		if (this.props.topicListAll.length > 0) {
			return;
		}
		this.setState({ loading: true });
		const { type } = this;
		const page = 1;
		const limit = this.LIMIT;
		let res = null;

		if (type === "all") {
			try {
				res = await axios.get(`/api/topics?tab=${type}&page=${page}&limit=${limit}`);
				if (res.status === 200 && res.data.success) {
					this.props.saveTopicListAll(normalizeTopicList(res.data.data));
					this.setState({ loading: false });
				} else {
					this.setState({ loadFail: true });
				}
			} catch (error) {
				console.error(error);
				this.setState({ loadFail: true });
			}
		}
	}

	type = "";
	LIMIT = 15;

	render() {
		if (this.state.loadFail) {
			return (
				<LoadingContainer>
					<NoResult text="数据加载失败了" />
				</LoadingContainer>
			);
		}
		if (this.state.loading) {
			return (
				<LoadingContainer>
					<Loading />
				</LoadingContainer>
			);
		}
		return [
			<ListView key={1} dataList={this.props.topicListAll} />,
			<PaginationWrapper key={2}>
				<Pagination
					defaultPageSize={this.LIMIT}
					defaultCurrent={this.props.topicListAllPageIndex}
					total={96 * 20}
					onChange={this.onPageNumChange}
				/>
			</PaginationWrapper>,
		];
	}
}

export default TopicListAll;
