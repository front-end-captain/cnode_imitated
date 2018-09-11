import React, { Component } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import styled from "styled-components";
import marked from "marked";
import moment from "moment";
import { connect } from "react-redux";
import { message } from "antd";
import ReplyArea from "./../ReplyArea/reply_area.jsx";
import NoResult from "./../../components/NoResult/no_result.jsx";
import Loading from "./../../components/Loading/loading.jsx";
import { saveCommentsOfTopic } from "./../../store/topicDetail.store.js";
import CustomEditor from "./../../components/Editor/editor.jsx";
import { throttle } from "./../../common/js/topicList.js";
import MarkdownContent from "./../../components/MarkdownContent/markdownContent.js";

const LoadingContainer = styled.div`
	width: 100%;
	min-height: 300px;
	display: flex;
	align-items: center;
	justify-content: center;
`;
const TopicDetailSection = styled.div`
	width: 90%;
	margin: 10px auto;
	border-radius: 10px;

	.topic-header {
		padding: 10px;
		border-radius: 10px 10px 0 0;
		border-bottom: 2px solid #ccc;
		background-color: #fff;
		position: relative;

		.title {
			font-size: 22px;
			font-weight: 700;
			margin: 8px 0;
			display: inline-block;
			vertical-align: bottom;
			width: 75%;
			line-height: 130%;
		}

		.info {
			font-size: 12px;
			color: #838383;
		}

		.collect-btn {
			position: absolute;
			right: 10px;
			top: 30%;
			border: none;
			background-color: darkseagreen;
			border-radius: 10px;
			padding: 10px 20px;
			cursor: pointer;
			outline: none;

			&:hover {
				background-color: lightgreen;
				color: #fff;
			}
		}
	}

	.topic-reply {
		margin-top: 10px;
		background-color: #fff;
		border-radius: 10px;

		div:first-child {
			border-radius: 10px 10px 0 0;
		}
	}

	.publish-comment-area {
		margin-top: 10px;
		background-color: #fff;
		border-radius: 10px;

		.publish-header {
			position: relative;
			height: 40px;
			border-radius: 10px 10px 0 0;
			background-color: #deeaea;
			line-height: 40px;
			text-indent: 1rem;
			box-shadow: 0 4px 11px 2px #ccc;
			display: flex;
			align-items: center;

			.submit-btn {
				position: absolute;
				right: 10px;
				display: inline-block;
				width: 100px;
				height: 30px;
				line-height: 30px;
				text-indent: 0;
				text-align: center;
				border-radius: 10px;
				cursor: pointer;
				color: #fff;
				background-color: #08c;

				&:hover {
					background-color: lightblue;
				}
			}
		}
	}
`;
const TypeBtn = styled.span`
	font-size: 12px;
	padding: 1px 4px;
	border-radius: 3px;
	color: ${(props) => { return props.primary ? "#fff" : "#999"; }};
	background-color: ${(props) => { return props.primary ? "#80bd01" : "#e5e5e5"; }};
`;

@connect(
	(state) => {
		return { user: state.user };
	},
	{ saveCommentsOfTopic },
)
class TopicDetail extends Component {
	static propTypes = {
		match: PropTypes.instanceOf(Object),
		user: PropTypes.instanceOf(Object).isRequired,
		saveCommentsOfTopic: PropTypes.func.isRequired,
	};

	constructor() {
		super();
		this.state = {
			loadFail: false,
			loading: false,
			topicContent: {},
			isCollected: false,
		};

		this.getArticleDetail = this.getArticleDetail.bind(this);
		this.handleCollectWrapper = this.handleCollectWrapper.bind(this);
		this.handleCollect = this.handleCollect.bind(this);
		this.collectTopic = this.collectTopic.bind(this);
		this.deCollectTopic = this.deCollectTopic.bind(this);
	}

	componentDidMount() {
		const { match } = this.props;
		const { id } = match.params;
		this.getArticleDetail(id);
	}

	// 获取话题详情内容
	async getArticleDetail(id) {
		const { saveCommentsOfTopic } = this.props;
		this.setState({ loading: true });
		let res = null;
		try {
			res = await axios.get(`/api/topic/${id}`);
			if (res.status === 200 && res.data.success) {
				this.setState({ topicContent: res.data.data });
				this.setState({
					loading: false,
					isCollected: res.data.data.is_collect,
				});
				saveCommentsOfTopic(res.data.data.replies);
			} else {
				this.setState({ loadFail: true });
			}
		} catch (error) {
			console.error(error);
			this.setState({ loadFail: true });
		}
	}

	handleCollectWrapper() {
		throttle(this.handleCollect, this);
	}

	// 收藏 / 取消收藏
	handleCollect() {
		const { user } = this.props;
		const { topicContent, isCollected } = this.state;
		// post /api/topic_collect/collect params: { accesstoken, topic_id }
		if (!user.isAuth) {
			message.warning("您还没有登录~");
			return;
		}

		const { id } = topicContent;
		if (isCollected) {
			this.deCollectTopic(id);
		} else {
			this.collectTopic(id);
		}
	}

	async collectTopic(id) {
		let res = null;
		const { topicContent } = this.state;
		try {
			res = axios.post("/api/topic_collect/collect?needAccessToken=true", {
				topic_id: id,
			});
			if (res.status === 200 && res.data.success) {
				// TODO: 收藏成功
				this.setState({
					topicContent: { ...topicContent, is_collect: true },
				});
				message.success("已收藏");
				this.setState({ isCollected: true });
			} else {
				// TODO: 收藏失败
				message.warning("收藏失败");
			}
		} catch (error) {
			if (error.response) {
				message.error(`收藏失败${error.response.data.error_mag}`);
			}
		}
	}

	async deCollectTopic(id) {
		let res = null;
		const { topicContent } = this.state;
		try {
			res = axios.post("/api/topic_collect/de_collect?needAccessToken=true", {
				topic_id: id,
			});
			if (res.status === 200 && res.data.success) {
				// 取消成功
				this.setState({
					topicContent: { ...topicContent, is_collect: false },
				});
				message.success("取消成功");
				this.setState({ isCollected: false });
			} else {
				// 取消失败
				message.warning("取消失败");
			}
		} catch (error) {
			if (error.response) {
				message.error(`取消失败${error.response.data.error_mag}`);
			}
		}
	}

	render() {
		const { loadFail, loading, topicContent, isCollected } = this.state;
		if (loadFail) {
			return (
				<LoadingContainer>
					<NoResult text="数据加载失败了" />
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

		if (Object.keys(topicContent).length > 0) {
			const {
				top,
				good,
				title,
				create_at,
				author,
				visit_count,
				last_reply_at,
				content,
				tab,
				id,
				replies,
			} = topicContent;
			const { user } = this.props;

			const renderTypeBtn = () => {
				if (top) {
					return <TypeBtn primary>置顶</TypeBtn>;
				}
				if (good) {
					return <TypeBtn primary>精华</TypeBtn>;
				}
				return null;
			};

			return (
				<TopicDetailSection>
					{/* 话题详情头部 开始 */}
					<div className="topic-header">
						<h2 className="title">
							{renderTypeBtn()}&nbsp;
							{title}
						</h2>
						<p className="info">
							发布于 {moment(create_at).fromNow()} | 作者 {author.loginname} |
							&nbsp;{visit_count} 浏览 | 最后一次回复是{" "}
							{moment(last_reply_at).fromNow()} | 来自于 {tab}
						</p>
						<button type="button" className="collect-btn" onClick={this.handleCollectWrapper}>
							{isCollected ? "已收藏" : "收藏"}
						</button>
					</div>
					{/* 话题详情头部 结束 */}

					{/* 话题详情内容 开始 */}
					<MarkdownContent>
						<div
							className="markdown-body"
							dangerouslySetInnerHTML={{ __html: marked(content) }}
						/>
					</MarkdownContent>
					{/* 话题详情内容 结束 */}

					{/* 话题详情回复 开始 */}
					<ReplyArea author={author} topicId={id} replies={replies} />
					{/* 话题详情回复 结束 */}

					<div className="publish-comment-area">
						<div className="publish-header">
							<span>发表评论</span>
						</div>
						<CustomEditor
							isAuth={user.isAuth}
							isReply={false}
							topicId={id}
						/>
					</div>
				</TopicDetailSection>
			);
		}
		return <div />;
	}
}

export default TopicDetail;
