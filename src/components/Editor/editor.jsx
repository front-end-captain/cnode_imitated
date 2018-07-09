import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { message } from "antd";
import axios from "axios";
import { connect } from "react-redux";
import moment from "moment";
import ReactSimpleMde from "react-simplemde-editor";

import { updateCommentsOfTopic } from "./../../store/topicDetail.store.js";
import { throttle } from "./../../common/js/topicList.js";

const EditorWrapper = styled.div`
	position: relative;
	padding-bottom: 40px;
	box-sizing: border-box;

	.submit-btn {
		position: absolute;
		width: 80px;
		height: 30px;
		line-height: 30px;
		text-align: center;
		right: 10px;
		bottom: 10px;
		background-color: lightblue;
		border-radius: 6px;
		user-select: none;
		cursor: pointer;

		&:hover {
			background-color: lightcyan;
		}
	}

	.CodeMirror {
		min-height: ${(props) => { return props.reply ? "140px" : "200px"; }};
		height: ${(props) => { return props.reply ? "140px" : "200px"; }};
	}
`;

const createReply = (id, loginname, avatar_url, content, reply_id = "") => {
	return {
		id,
		author: {
			loginname,
			avatar_url,
		},
		content,
		create_at: moment(),
		reply_id,
		is_uped: false,
		ups: [],
	};
};

@connect(
	(state) => {
		return state.user;
	},
	{ updateCommentsOfTopic },
)
class CustomEditor extends Component {
	static propTypes = {
		// 应用中是否由用户登录 false 表示未登录；true 表示由用户登录
		isAuth: PropTypes.bool.isRequired,

		// 当前操作是评论还是回复 默认为 true 表示当前操作是回复；false 表示操作是评论
		isReply: PropTypes.bool,

		// 回复操作中 被回复人用户名
		toReplyUsername: PropTypes.string,

		// 当前话题 id
		topicId: PropTypes.string.isRequired,

		// 当前评论 id
		replyId: PropTypes.string,

		updateCommentsOfTopic: PropTypes.func.isRequired,

		userInfo: PropTypes.instanceOf(Object).isRequired,
	};

	static defaultProps = {
		isReply: true,
		toReplyUsername: "",
	};

	constructor() {
		super();

		this.state = {
			// 评论内容破
			commentContent: "",
		};

		this.createEditorPlaceholder = this.createEditorPlaceholder.bind(this);
		this.handleEditorContentChange = this.handleEditorContentChange.bind(this);
		this.handleSubmitWrapper = this.handleSubmitWrapper.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	handleSubmitWrapper() {
		throttle(this.handleSubmit, this);
	}

	// 提交评论或者回复的处理程序
	handleSubmit() {
		// 登录状态判断
		if (!this.props.isAuth) {
			message.warning("请登录后再进行操作");
			return;
		}

		const { commentContent } = this.state;

		// 非空判断
		if (commentContent.trim().length === 0) {
			message.warning("内容不能为空");
			return;
		}

		// 当前操作是评论 交给 postComment 函数处理
		// 当前操作是回复 交给 postReply 函数处理

		const { topicId, replyId } = this.props;

		if (this.props.isReply) {
			this.postReply(topicId, replyId, commentContent);
		} else {
			this.postComment(topicId, commentContent);
		}
		// 评论 URL
		// axios.post(`/api/topic/${topicId}/replies?needAccessToken=true`, { content });
		// 回复 URL
		// axios.post(`/api/topic/${topicId}/replies`, { content, replyId });
	}

	async postComment(topicId, content) {
		let res = null;
		const { loginname, avatar_url } = this.props.userInfo;
		try {
			res = await axios.post(
				`/api/topic/${topicId}/replies?needAccessToken=true`,
				{ content },
			);
			if (res.status === 200 && res.data.success) {
				const newReply = createReply(
					res.data.reply_id,
					loginname,
					avatar_url,
					content,
				);
				this.props.updateCommentsOfTopic(newReply);
				message.success("评论成功");
			} else {
				message.warning("评论失败");
				this.editor.focus();
			}
		} catch (error) {
			if (error.response) {
				message.error(`评论失败${error.response.data.error_msg}`);
				this.editor.focus();
			}
		}
	}

	async postReply(topicId, replyId, content) {
		let res = null;
		const replyUserName = this.props.toReplyUsername;
		const { loginname, avatar_url } = this.props.userInfo;
		const reply_id = replyId;
		const newContent = `@${replyUserName} ${content}`;
		const mockContent = `<a href='/user/${replyUserName}'>@${replyUserName}</a> ${content}`;
		try {
			res = await axios.post(
				`/api/topic/${topicId}/replies?needAccessToken=true`,
				{ content: newContent, reply_id },
			);
			if (res.status === 200 && res.data.success) {
				const newReply = createReply(
					res.data.reply_id,
					loginname,
					avatar_url,
					mockContent,
					reply_id,
				);
				this.props.updateCommentsOfTopic(newReply);
				message.success("回复成功");
			} else {
				message.warning("回复失败");
				this.editor.focus();
			}
		} catch (error) {
			console.dir(error);
			if (error.response) {
				message.error(`回复失败${error.response.data.error_msg}`);
				this.editor.focus();
			}
		}
	}

	// 创建编辑器初始占位内容
	createEditorPlaceholder() {
		let placeholderText = "";

		/* eslint-disable no-lonely-if */
		if (!this.props.isAuth) {
			if (this.props.isReply) {
				placeholderText = "请登录后再来回复~";
			} else {
				placeholderText = "请登录后再来评论~";
			}
		} else {
			if (this.props.isReply) {
				placeholderText = `@${this.props.toReplyUsername}`;
			} else {
				placeholderText = "请输入您的评论内容~";
			}
		}

		return placeholderText;
	}

	handleEditorContentChange(content) {
		this.setState({ commentContent: content });
	}

	render() {
		const editoId = `editor_${Math.random().toFixed(2)}`;

		// 编辑器配置项
		const editorOptions = {
			id: editoId,
			onChange: this.handleEditorContentChange,
			options: {
				placeholder: this.createEditorPlaceholder(),
			},
		};

		return (
			<EditorWrapper className="editor-wrapper" reply={this.props.isReply}>
				<ReactSimpleMde
					{...editorOptions}
					ref={(editor) => {
						return (this.editor = editor);
					}}
				/>
				<div className="submit-btn" onClick={this.handleSubmitWrapper}>
					{this.props.isReply ? "回复" : "评论"}
				</div>
			</EditorWrapper>
		);
	}
}

export default CustomEditor;
