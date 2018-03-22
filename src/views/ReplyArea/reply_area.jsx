import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import moment from 'moment';
import marked from 'marked';
import { connect } from 'react-redux';
import axios from 'axios';
import { message } from 'antd';
import { throttle } from './../../common/js/topicList.js';
import CustomEditor from './../../components/Editor/editor.jsx';
import { updateCommentsOfTopic } from './../../store/topicDetail.store.js';


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
		display: none;
		box-sizing: border-box;
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

	/* eslint-disable no-cond-assign */
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
	(state) => {
		return {
			user: state.user,
			comments: state.topicDetailComments.topicComments,
		};
	},
	{ updateCommentsOfTopic },
)
class ReplyArea extends Component {
	static propTypes = {
		comments: PropTypes.instanceOf(Array).isRequired,
		user: PropTypes.instanceOf(Object).isRequired,
		author: PropTypes.instanceOf(Object).isRequired,
		topicId: PropTypes.string.isRequired,
		updateCommentsOfTopic: PropTypes.func.isRequired,
	};

	constructor() {
		super();

		this.handleLike = this.handleLike.bind(this);
		this.toggleEditor = this.toggleEditor.bind(this);
	}

	// handleLike 方法包装器  用于函数节流 防止用户快速重复点击
	handleLikeWrapper(id, loginname) {
		throttle( this.handleLike, this, id, loginname );
	}

	// 点赞
	async handleLike(args) {
		if ( !this.props.user.isAuth ) {
			message.warning('请先登录');
			return;
		}

		const loginname = args[1];

		if ( this.props.user.loginname === loginname ) {
			message.warning('不能自己给自己的评论点赞喔~');
			return;
		}

		const replyId = args[0];
		const userId = this.props.user.userInfo.id;
		const replies = this.props.comments;
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
					this.props.updateCommentsOfTopic(newReplies);
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
					this.props.updateCommentsOfTopic(newReplies);
					message.warning('取消点赞');
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
		// const submitReplyBtn = parent.querySelector('.submit-reply-btn');
		this.isEditorDisplay = !this.isEditorDisplay;
		if ( this.isEditorDisplay ) {
			editorArea.style.display = 'block';
			// submitReplyBtn.style.visibility = 'visible';
		} else {
			editorArea.style.display = 'none';
			// submitReplyBtn.style.visibility = 'hidden';
		}
	}

	// 判断编辑器显示和隐藏的标志位
	isEditorDisplay = false


	render() {
		const replies = this.props.comments || [];
		const author = this.props.author;

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
							<div className="editor-area">
								<CustomEditor
									isAuth={this.props.user.isAuth}
									toReplyUsername={loginname}
									replyId={id}
									topicId={this.props.topicId}
								/>
							</div>
						</ReplyItem>
					);
				})}
			</div>
		);
	}
}

export default ReplyArea;
