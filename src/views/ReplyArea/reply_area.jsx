/* eslint-disable no-useless-return */
/* eslint-disable no-unreachable */
/* eslint-disable no-debugger */
/* eslint-disable no-unused-vars */
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
`;
const TypeBtn = styled.span`
	font-size: 12px;
	padding: 1px 4px;
	border-radius: 3px;
	color: ${( props ) => { return props.primary ? '#fff' : '#999'; }};
	background-color: ${( props ) => { return props.primary ? '#80bd01' : '#e5e5e5'; }};
`;

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
	};

	constructor() {
		super();
		this.state = {
			replies: [],
			index: -1,
		};
		this.handleSubmitReply = this.handleSubmitReply.bind( this );
		this.handleLike = this.handleLike.bind( this );
		this.toggleEditor = this.toggleEditor.bind(this);
	}

	// 为什么不可以在 componentDidMount 调用 setState 方法
	componentWillMount() {
		this.setState({ replies: this.props.replies });
	}

	handleSubmitReply() {
		// do something
	}

	// handleLike 方法包装器  用于函数节流 防止用户快速重复点击
	handleLikeWrapper(id, loginname) {
		throttle( this.handleLike, this, id, loginname );
	}

	async handleLike(...args) {
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
			console.log( error );
			message.error(`操作失败${error.message}`);
		}
	}

	toggleEditor(index) {
		this.setState({ index });
	}

	isEditorDisplay = false

	render() {
		const replies = this.state.replies;
		const author = this.props.author;
		const editorOptions = {
			height: 300,
      initialContent: null,
      onChange: this.handleChange,
			onHTMLChange: this.handleHTMLChange,
			placeholder: this.props.isAuth ? '输入回复内容...' : '登录后才可以创建话题~',
			disabled: !this.props.isAuth,
		};
		const key = this.state.index;

		return (
			<div className="topic-reply">
				{replies.map((item, index) => {
					const id = item.id;
					const loginname = item.author.loginname;
					return (
						<ReplyItem key={id}>
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
								<span className="reply-btn" title="回复" onClick={ () => this.toggleEditor(index) } />
								<span className="ups" title="赞" onClick={ () => this.handleLikeWrapper(id, loginname) } >
									{item.ups.length > 0 && item.ups.length}
								</span>
							</div>
							<div
								className="content"
								dangerouslySetInnerHTML={{ __html: marked(item.content) }}
							/>
							<div className="editor-area" style={ { display: key === index ? 'block' : 'none' } } >
								<BraftEditor {...editorOptions} />
							</div>
						</ReplyItem>
					);
				})}
			</div>
		);
	}
}

export default ReplyArea;
