/* eslint-disable no-useless-return */
/* eslint-disable no-unreachable */
/* eslint-disable no-debugger */
/* eslint-disable no-unused-vars */
/* eslint-disable no-cond-assign */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import moment from 'moment';
import marked from 'marked';
import { connect } from 'react-redux';
import axios from 'axios';
import { message } from 'antd';
import BraftEditor from 'braft-editor';
import 'braft-editor/dist/braft.css';
import { throttle } from './../../common/js/topicList.js';

const replyBtnIcon = require('./reply-btn.png');
const likeBtnIcon = require('./like.png');

const ReplyItem = styled.div`
	position: relative;
	padding: 10px;
	font-size: 14px;
	border-top: 1px solid #f0f0f0;
	min-height: 70px;

	.header {
		display: flex;
		height: 30px;
		line-height: 30px;

		.user-avatar {
			img {
				width: 30px;
				height: 30px;
				border-radius: 3px;
			}
		}

		.info {
			.loginname {
				font-weight: 700;
				color: #666;
			}

			margin-left: 10px;
			display: inline-block;
		}

		.ups {
			width: 40px;
			height: 30px;
			font-size: 12px;
			line-height: 36px;
			cursor: pointer;
			position: absolute;
			right: 40px;
			color: blue;
			background: url(${likeBtnIcon});
			background-repeat: no-repeat;
			background-size: 20px 20px;
			background-position: right center;
		}

		.reply-btn {
			width: 30px;
			height: 30px;
			cursor: pointer;
			position: absolute;
			right: 10px;
			background: url(${replyBtnIcon});
			background-repeat: no-repeat;
			background-size: 20px 20px;
			background-position: center;
		}
	}

	.content {
		padding-left: 50px;
	}

	.editor-area {
		position: relative;
		height: 0;
		padding-bottom: 30px;
		box-sizing: border-box;
		transition: all 0.5s;

		.submit-reply-btn {
			position: absolute;
			width: 80px;
			height: 30px;
			line-height: 30px;
			text-align: center;
			right: 0;
			bottom: 0;
			background-color: lightblue;
			border-radius: 6px;
			user-select: none;
			cursor: pointer;
			visibility: hidden;

			&:hover {
				background-color: lightcyan;
			}
		}
	}
`;
const TypeBtn = styled.span`
	font-size: 12px;
	padding: 1px 4px;
	border-radius: 3px;
	color: ${( props ) => { return props.primary ? '#fff' : '#999'; }};
	background-color: ${( props ) => { return props.primary ? '#80bd01' : '#e5e5e5'; }};
`;

/**
 * @description 获取元素节点的指定父节点
 * @param {DOMelement} element
 * @param {String} selector
 */
const parents = (element, selector) => {
  const elements = [];
  let elem = element;
  const isWithSelector = selector !== undefined;

  while ((elem = elem.parentElement) !== null) {
    if (elem.nodeType === Node.ELEMENT_NODE) {
      if (!isWithSelector || elem.matches(selector)) {
        elements.push(elem);
      }
    }
  }

  return elements.length === 1 ? elements[0] : elements;
};

@connect(
	state => state.user,
	null,
)
class ReplyArea extends Component {
	static propTypes = {
		replies: PropTypes.instanceOf(Array).isRequired,
		author: PropTypes.instanceOf(Object).isRequired,
		isAuth: PropTypes.bool.isRequired,
		userInfo: PropTypes.instanceOf(Object).isRequired,
		topicId: PropTypes.number.isRequired,
	};

	constructor() {
		super();
		this.state = {
			replies: [],
			replyPlainContent: '',
			replyHtmlContent: '',
		};
		this.handleSubmitReply = this.handleSubmitReply.bind(this);
		this.handleLike = this.handleLike.bind(this);
		this.toggleEditor = this.toggleEditor.bind(this);
		this.handleSubmitReplyWrapper = this.handleSubmitReplyWrapper.bind(this);
		this.postReply = this.postReply.bind(this);
		this.onChange = this.onChange.bind(this);
		this.onHTMLChange = this.onHTMLChange.bind(this);
	}

	// 为什么不可以在 componentDidMount 调用 setState 方法
	componentWillMount() {
		this.setState({ replies: this.props.replies });
	}

	onChange(content) {
		console.log( content );
		const replysArr = content.blocks.map( block => block.text );
		const replyStr = replysArr.join('');
		this.setState({ replyPlainContent: replyStr });
	}

	onHTMLChange(html) {
		this.setState({ replyHtmlContent: html });
	}

	// handleSubmitReply 方法包装器
	handleSubmitReplyWrapper(id) {
		throttle(this.handleSubmitReply, this, id);
	}

	handleSubmitReply(args) {
		if ( !this.props.isAuth ) {
			message.warning('登录后才可以进行回复~');
			return;
		}

		const { replyPlainContent, replyHtmlContent } = this.state;
		debugger;
		if ( replyPlainContent.trim().length === 0 ) {
			message.warning('请输入评论内容');
			return;
		}

		const topicId = this.props.topicId;
		const replyId = args[0];

		this.postReply(topicId, replyId, replyHtmlContent);
	}

	async postReply(topicId, replyId, content) {
		let res = null;
		try {
			res = await axios.post(`/api/topic/${topicId}/replies`, { content, replyId });
			if ( res.status === 200 && res.data.sucess ) {
				// 回复成功
				message.success('回复成功');
			} else {
				// 回复失败
				message.warning('回复失败');
				this.replyEditor.focus();
			}
		} catch (error) {
			if ( error.response ) {
				// 回复失败
				message.error(`回复失败${error.response.message}`);
				this.replyEditor.focus();
			}
		}
	}

	// handleLike 方法包装器  用于函数节流 防止用户快速重复点击
	handleLikeWrapper(id, loginname) {
		throttle( this.handleLike, this, id, loginname );
	}

	// 点赞
	async handleLike(args) {
		if ( !this.props.isAuth ) {
			message.warning('请先登录');
			return;
		}

		const loginname = args[1];

		if ( this.props.userInfo.loginname === loginname ) {
			message.warning('不能自己给自己的评论点赞喔~');
			return;
		}

		const replyId = args[0];
		const userId = this.props.userInfo.id;
		const replies = this.state.replies;
		const targetReply = replies.find(item => item.id === replyId );

		let res = null;
		try {
			res = await axios.post(`/api/reply/${replyId}/ups?needAccessToken=true`);
			if ( res.status === 200 && res.data.success ) {

				// 点赞成功
				if ( res.data.action === 'up' ) {
					targetReply.ups.push(userId);
					const newReplies = replies.map((item) => {
						if ( item.id === replyId ) {
							return targetReply;
						}
						return item;
					});
					this.setState({ replies: newReplies });
					message.success('点赞成功');
				}	else if ( res.data.action === 'down' ) {

					// 取消点赞
					const newUps = targetReply.ups.filter(item => item !== userId );
					targetReply.ups = newUps;
					const newReplies = replies.map((item) => {
						if ( item.id === replyId ) {
							return targetReply;
						}
						return item;
					});
					this.setState({ replies: newReplies });
					message.success('取消点赞');
				}
			} else {
				// 操作失败
				message.error('操作失败~');
			}
		} catch ( error ) {
			message.error(`操作失败${error.message}`);
		}
	}

	// 切换编辑器显示和隐藏
	toggleEditor(event) {
		const parent = parents(event.target, '.reply-item');
		const editorArea = parent.querySelector('.editor-area');
		const submitReplyBtn = parent.querySelector('.submit-reply-btn');
		this.isEditorDisplay = !this.isEditorDisplay;
		if ( !this.isEditorDisplay ) {
			editorArea.style.height = '160px';
			submitReplyBtn.style.visibility = 'visible';
		} else {
			editorArea.style.height = '0';
			submitReplyBtn.style.visibility = 'hidden';
		}
	}

	// 判断编辑器显示和隐藏的标志位
	isEditorDisplay = false


	render() {
		const replies = this.state.replies;
		const author = this.props.author;
		const editorOptions = {
			height: 150,
      initialContent: null,
      onChange: this.handleChange,
			onHTMLChange: this.handleHTMLChange,
			disabled: !this.props.isAuth,
		};

		return (
			<div className="topic-reply">
				{replies.map((item, index) => {
					const id = item.id;
					const loginname = item.author.loginname;
					return (
						<ReplyItem key={id} className="reply-item" >
							<div className="header">
								<a href="" className="user-avatar">
									<img
										src={item.author.avatar_url}
										alt={loginname}
									/>
								</a>
								<p className="info">
									<span className="loginname">
										{loginname}&nbsp;
									</span>
									{index + 1}楼 · {moment(item.create_at).fromNow()}
									{loginname === author.loginname && (
										<TypeBtn primary>作者</TypeBtn>
									)}
								</p>
								<span className="reply-btn" title="回复" onClick={ this.toggleEditor } />
								<span className="ups" title="赞" onClick={ () => this.handleLikeWrapper(id, loginname) } >
									{item.ups.length > 0 && item.ups.length}
								</span>
							</div>
							<div
								className="content"
								dangerouslySetInnerHTML={{ __html: marked(item.content) }}
							/>
							<div className="editor-area" >
								<BraftEditor
									placeholder={this.props.isAuth ? `@${loginname}` : '登录后才可以创建话题~'}
									{...editorOptions}
								/>
								<div className="submit-reply-btn" onClick={ () => this.handleSubmitReplyWrapper(id) } >回复</div>
							</div>
						</ReplyItem>
					);
				})}
			</div>
		);
	}
}

export default ReplyArea;
