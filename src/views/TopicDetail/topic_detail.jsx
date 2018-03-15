/* eslint-disable no-unused-vars */
/* eslint-disable no-debugger */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import styled from 'styled-components';
import marked from 'marked';
import moment from 'moment';
import BraftEditor from 'braft-editor';
import 'braft-editor/dist/braft.css';
import { connect } from 'react-redux';
import { message } from 'antd';
import NoResult from './../../components/NoResult/no_result.jsx';
import Loading from './../../components/Loading/loading.jsx';
import ReplyArea from './../ReplyArea/reply_area.jsx';


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
			box-shadow: 0px 4px 11px 2px #ccc;
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
				background-color: #0088cc;
				&:hover {
					background-color: lightblue;
				}
			}
		}
	}

`;
const TopicDetailContent = styled.div`

	padding: 10px;
	font-size: 16px;
	font-family: "Open Sans", "Clear Sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
	color: rgb(51, 51, 51);
	line-height: 1.6;
	background-color: #fff;
	border-radius: 0 0 10px 10px;

	#write {
		max-width: 860px;
		margin: 0 auto;
		padding: 20px 30px 40px 30px;
		padding-top: 20px;
		padding-bottom: 100px;
	}
	#write > ul:first-child,
	#write > ol:first-child {
		margin-top: 30px;
	}

	.markdown-content > *:first-child {
		margin-top: 0 !important;
	}
	.markdown-content > *:last-child {
		margin-bottom: 0 !important;
	}
	a {
		color: #4183c4;
	}
	h1,
	h2,
	h3,
	h4,
	h5,
	h6 {
		position: relative;
		margin-top: 1rem;
		margin-bottom: 1rem;
		font-weight: bold;
		line-height: 1.4;
		cursor: text;
	}
	h1:hover a.anchor,
	h2:hover a.anchor,
	h3:hover a.anchor,
	h4:hover a.anchor,
	h5:hover a.anchor,
	h6:hover a.anchor {
		text-decoration: none;
	}
	h1 tt,
	h1 code {
		font-size: inherit;
	}
	h2 tt,
	h2 code {
		font-size: inherit;
	}
	h3 tt,
	h3 code {
		font-size: inherit;
	}
	h4 tt,
	h4 code {
		font-size: inherit;
	}
	h5 tt,
	h5 code {
		font-size: inherit;
	}
	h6 tt,
	h6 code {
		font-size: inherit;
	}
	h1 {
		padding-bottom: 0.3em;
		font-size: 2.25em;
		line-height: 1.2;
		border-bottom: 1px solid #eee;
	}
	h2 {
		padding-bottom: 0.3em;
		font-size: 1.75em;
		line-height: 1.225;
		border-bottom: 1px solid #eee;
	}
	h3 {
		font-size: 1.5em;
		line-height: 1.43;
	}
	h4 {
		font-size: 1.25em;
	}
	h5 {
		font-size: 1em;
	}
	h6 {
		font-size: 1em;
		color: #777;
	}
	p,
	blockquote,
	ul,
	ol,
	dl,
	table {
		margin: 0.8em 0;
	}
	li > ol,
	li > ul {
		margin: 0 0;
	}
	ul > li,
	ol > li {
		line-height: 2rem;
		font-size: 14px;
	}
	hr {
		height: 4px;
		padding: 0;
		margin: 16px 0;
		background-color: #e7e7e7;
		border: 0 none;
		overflow: hidden;
		box-sizing: content-box;
		border-bottom: 1px solid #ddd;
	}

	.markdown-content > h2:first-child {
		margin-top: 0;
		padding-top: 0;
	}
	.markdown-content > h1:first-child {
		margin-top: 0;
		padding-top: 0;
	}
	.markdown-content > h1:first-child + h2 {
		margin-top: 0;
		padding-top: 0;
	}
	.markdown-content > h3:first-child,
	.markdown-content > h4:first-child,
	.markdown-content > h5:first-child,
	.markdown-content > h6:first-child {
		margin-top: 0;
		padding-top: 0;
	}
	a:first-child h1,
	a:first-child h2,
	a:first-child h3,
	a:first-child h4,
	a:first-child h5,
	a:first-child h6 {
		margin-top: 0;
		padding-top: 0;
	}
	h1 p,
	h2 p,
	h3 p,
	h4 p,
	h5 p,
	h6 p {
		margin-top: 0;
	}
	li p.first {
		display: inline-block;
	}
	ul,
	ol {
		padding-left: 30px;
	}
	ul:first-child,
	ol:first-child {
		margin-top: 0;
	}
	ul:last-child,
	ol:last-child {
		margin-bottom: 0;
	}
	blockquote {
		border-left: 4px solid #dddddd;
		padding: 0 15px;
		color: #777777;
	}
	blockquote blockquote {
		padding-right: 0;
	}
	table {
		padding: 0;
		word-break: initial;
	}
	table tr {
		border-top: 1px solid #cccccc;
		margin: 0;
		padding: 0;
	}
	table tr:nth-child(2n) {
		background-color: #f8f8f8;
	}
	table tr th {
		font-weight: bold;
		border: 1px solid #cccccc;
		border-bottom: 0;
		text-align: left;
		margin: 0;
		padding: 6px 13px;
	}
	table tr td {
		border: 1px solid #cccccc;
		text-align: left;
		margin: 0;
		padding: 6px 13px;
	}
	table tr th:first-child,
	table tr td:first-child {
		margin-top: 0;
	}
	table tr th:last-child,
	table tr td:last-child {
		margin-bottom: 0;
	}

	.CodeMirror-gutters {
		border-right: 1px solid #ddd;
	}

	.md-fences,
	code,
	tt {
		background-color: #f8f8f8;
		border-radius: 3px;
		padding: 0;
		font-family: Consolas, "Liberation Mono", Courier, monospace;
		padding: 2px 4px 0px 4px;
		font-size: 0.9em;
	}
	pre.prettyprint {
		font-size: 14px;
    border-radius: 0;
    padding: 0 15px;
    border: none;
    margin: 20px 10px;
    border-width: 1px 0;
    background: #f7f7f7;
    -o-tab-size: 4;
    -moz-tab-size: 4;
    tab-size: 4;
	}

	.md-fences {
		margin-bottom: 15px;
		margin-top: 15px;
		padding: 0.2em 1em;
		padding-top: 8px;
		padding-bottom: 6px;
	}
	.task-list {
		padding-left: 0;
	}

	.task-list-item {
		padding-left: 32px;
	}

	.task-list-item input {
		top: 3px;
		left: 8px;
	}

	.md-fences {
		background-color: #f8f8f8;
	}
	#write pre.md-meta-block {
		padding: 1rem;
		font-size: 85%;
		line-height: 1.45;
		background-color: #f7f7f7;
		border: 0;
		border-radius: 3px;
		color: #777777;
		margin-top: 0 !important;
	}

	.mathjax-block > .code-tooltip {
		bottom: 0.375rem;
	}

	#write > h3.md-focus:before {
		left: -1.5625rem;
		top: 0.375rem;
	}
	#write > h4.md-focus:before {
		left: -1.5625rem;
		top: 0.285714286rem;
	}
	#write > h5.md-focus:before {
		left: -1.5625rem;
		top: 0.285714286rem;
	}
	#write > h6.md-focus:before {
		left: -1.5625rem;
		top: 0.285714286rem;
	}
	.md-image > .md-meta {
		border: 1px solid #ddd;
		border-radius: 3px;
		font-family: Consolas, "Liberation Mono", Courier, monospace;
		padding: 2px 4px 0px 4px;
		font-size: 0.9em;
		color: inherit;
	}

	.md-tag {
		color: inherit;
	}

	.md-toc {
		margin-top: 20px;
		padding-bottom: 20px;
	}

	.sidebar-tabs {
		border-bottom: none;
	}

	/** focus mode */
	.on-focus-mode blockquote {
		border-left-color: rgba(85, 85, 85, 0.12);
	}

	header,
	.context-menu,
	.megamenu-content,
	footer {
		font-family: "Segoe UI", "Arial", sans-serif;
	}

	.file-node-content:hover .file-node-icon,
	.file-node-content:hover .file-node-open-state {
		visibility: visible;
	}

	.mac-seamless-mode #typora-sidebar {
		background-color: #fafafa;
		background-color: var(--side-bar-bg-color);
	}

	.md-lang {
		color: #b4654d;
	}
	p img {
		max-width: 100%;
	}
`;
const TypeBtn = styled.span`
	font-size: 12px;
	padding: 1px 4px;
	border-radius: 3px;
	color: ${( props ) => { return props.primary ? '#fff' : '#999'; }};
	background-color: ${( props ) => { return props.primary ? '#80bd01' : '#e5e5e5'; }};
`;


const emptyContent = ( initText = '' ) => {
	return {
		blocks: [
			{
				data: {},
				depth: 0,
				entityRanges: [],
				inlineStyleRanges: [],
				key: '',
				text: initText,
				type: 'unstyled',
			},
		],
		entityMap: {},
	};
};

@connect(
	state => state.user,
	null,
)
class TopicDetail extends Component {
	static propTypes = {
		match: PropTypes.instanceOf( Object ),
		isAuth: PropTypes.bool.isRequired,
		userInfo: PropTypes.instanceOf( Object ).isRequired,
	}

	constructor() {
		super();
		this.state = {
			loadFail: false,
			articleContent: null,
			commentHtmlContent: '',
			commentPlainContent: '',
		};

		this.getArticleDetail = this.getArticleDetail.bind( this );
		this.handleSubmitComment = this.handleSubmitComment.bind( this );
		this.handleChange = this.handleChange.bind( this );
		this.handleHTMLChange = this.handleHTMLChange.bind( this );
		this.postComment = this.postComment.bind( this );
		this.createReply = this.createReply.bind( this );
	}

	componentDidMount() {
		const { id } = this.props.match.params;
		this.getArticleDetail( id );
	}

	async getArticleDetail( id ) {
		let res = null;
		try {
			res = await axios.get(`/api/topic/${id}`);
			if ( res.status === 200 && res.data.success ) {
				this.setState({ articleContent: res.data.data });
			} else {
				this.setState({ loadFail: true });
			}
		} catch ( error ) {
			console.log( error );
			this.setState({ loadFail: true });
		}
	}

	handleHTMLChange( html ) {
		this.setState({ commentHtmlContent: html });
	}

	handleChange( content ) {
		const commentsArr = content.blocks.map( block => block.text );
		const commentStr = commentsArr.join('');
		this.setState({ commentPlainContent: commentStr });
	}

	handleSubmitComment() {
		// 非空判断
		const { commentHtmlContent, commentPlainContent } = this.state;
		if ( !this.props.isAuth ) {
			message.error('登录后才可以评论~');
			return;
		}
		if ( commentPlainContent.trim().length === 0 ) {
			message.warning('评论内容不能为空');
			this.editor.focus();
			return;
		}

		const { id } = this.state.articleContent;
		this.postComment( id, commentHtmlContent );
	}

	createReply( id ) {
		return {
			author: {
				avatar_url: this.props.userInfo.avatar_url,
				loginname: this.props.userInfo.loginname,
			},
			content: this.state.commentHtmlContent,
			create_at: moment.utc(),
			id,
			is_uped: false,
			reply_id: null,
			ups: [],
		};
	}

	async postComment( replyId, content ) {
		let res = null;
		try {
			res = await axios.post(`/api/topic/${replyId}/replies?needAccessToken=true`, { content });
			if ( res.status === 200 && res.data.success ) {
				const id = res.data.reply_id;
				const newComments = this.createReply(id);
				const replies = this.state.articleContent.replies;
				replies.push( newComments );
				const topicDetail = this.state.articleContent;
				topicDetail.replies = replies;
				this.setState({ articleContent: topicDetail });
				// 评论成功
				message.success('评论成功');
				this.editor.setContent( emptyContent() );
			} else {
				// 评论失败
				message.error('评论失败');
			}
		} catch ( error ) {
			console.log( error );
			// 评论失败
			message.error('评论失败');
		}
	}

	render() {
		if ( this.state.loadFail ) {
			return <LoadingContainer><NoResult text="数据加载失败了" /></LoadingContainer>;
		}
		if ( !this.state.articleContent ) {
			return <LoadingContainer><Loading /></LoadingContainer>;
		}

		const {
			top, good, title, create_at, author, visit_count, last_reply_at, content, tab, replies,
		} = this.state.articleContent;

		const editorProps = {
      height: 200,
      initialContent: null,
      onChange: this.handleChange,
			onHTMLChange: this.handleHTMLChange,
			placeholder: this.props.isAuth ? '输入您的评论内容...' : '登录后可以评论',
			disabled: !this.props.isAuth,
		};

		return (
			<TopicDetailSection>

				{/* 话题详情头部 开始 */}
				<div className="topic-header">
					<h2 className="title">
						{
							top
								? <TypeBtn primary>置顶</TypeBtn>
								: (
									good
										? <TypeBtn primary>精华</TypeBtn>
										: null
									)
						}&nbsp;
						{ title }
					</h2>
					<p className="info">
						发布于 { moment(create_at).fromNow() } |
						作者 { author.loginname } |
						&nbsp;{ visit_count } 浏览 |
						最后一次回复是 { moment(last_reply_at).fromNow() } |
						来自于 { tab }
					</p>
					<button className="collect-btn">收藏</button>
				</div>
				{/* 话题详情头部 结束 */}

				{/* 话题详情内容 开始 */}
				<TopicDetailContent
					className="markdown-content"
					dangerouslySetInnerHTML={{ __html: marked(content) }}
				/>
				{/* 话题详情内容 结束 */}

				{/* 话题详情回复 开始 */}
				<ReplyArea
					replies={ replies }
					author={ author }
					ref={ replyarea => this.replyarea = replyarea }
				/>
				{/* 话题详情回复 结束 */}

				<div className="publish-comment-area">
					<div className="publish-header">
						<span>发表评论</span>
						<div className="submit-btn"title="发表评论" onClick={ this.handleSubmitComment} >
							发表
						</div>
					</div>
					<div className="editor-wrapper">
						<BraftEditor { ...editorProps } ref={ editor => this.editor = editor} />
					</div>
				</div>

			</TopicDetailSection>
		);
	}
}

export default TopicDetail;
