import React, { Component } from 'react';
import styled from 'styled-components';
import BraftEditor from 'braft-editor';
import 'braft-editor/dist/braft.css';
import axios from 'axios';
import { message } from 'antd';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { throttle } from './../../common/js/topicList.js';

const CreateTopicSection = styled.div`
	padding: 20px;
	.header {
		width: 100%;
		height: 30px;
		line-height: 30px;
		text-indent: 1rem;
		background-color: #d4e2e2;
		border-bottom: 1px solid #ccc;
	}
	.title {
		margin-top: 10px;
		height: 40px;
		line-height: 40px;

		label {
			input {
				margin-left: 20px;
				text-indent: 1rem;
				height: 30px;
				width: 500px;
				border-bottom: 1px solid #666;
				outline: none;
			}
		}
	}
	.tab {
		margin-top: 10px;
		height: 40px;
		line-height: 40px;
		padding-bottom: 10px;
		label {
			select {
				width: 100px;
				text-align: center;
				margin-left: 20px;
				text-indent: 1rem;
				height: 30px;
				border-bottom: 1px solid #666;
				outline: none;
			}
		}
	}
	.submit-btn {
		width: 100px;
		height: 40px;
		border-radius: 10px;
		line-height: 40px;
		cursor: pointer;
		outline: none;
		user-select: none;
		background-color: lightblue;
		text-align: center;
		transition: all 0.5s;
		&:hover {
			background: lightcoral;
		}
	}
	.BraftEditor-container {
		margin-top: 10px;
		border-top: 1px solid #ccc;
	}
`;

@connect(
	state => state.user,
	null,
)
class CreateTopic extends Component {
	static propTypes = {
		isAuth: PropTypes.bool.isRequired,
	}

	constructor() {
		super();

		this.state = {
			title: '',
			htmlContent: '',
			tab: 'dev',
			plainText: '',
		};
		this.handleHTMLChange = this.handleHTMLChange.bind( this );
		this.handleSubmit = this.handleSubmit.bind( this );
		this.createTocpic = this.createTocpic.bind( this );
		this.handleTitleChange = this.handleTitleChange.bind( this );
		this.handleSelectChange = this.handleSelectChange.bind( this );
		this.handleChange = this.handleChange.bind( this );
		this.handleSubmitWrapper = this.handleSubmitWrapper.bind( this );
	}

  handleHTMLChange(html) {
		this.setState({ htmlContent: html });
	}

	handleChange( content ) {
		const topicArr = content.blocks.map((block) => {
			return block.text;
		});
		const topicStr = topicArr.join('');
		this.setState({ plainText: topicStr });
	}

	handleSubmitWrapper() {
		throttle( this.handleSubmit, this );
	}

	handleSubmitWrapper() {
		throttle( this.handleSubmit, this );
	}

	handleSubmit() {
		if ( !this.props.isAuth ) {
			message.warning('请登录后在进行操作');
			return;
		}

		const {
			title,
			tab,
			htmlContent,
			plainText,
		} = this.state;

		if ( !this.props.isAuth ) {
			message.warning('您还没有登录，登录后方可评论');
			return;
		}

		if ( !title.trim() ) {
			message.warning('标题内容不能为空');
			this.titleInput.focus();
			return;
		}

		if ( title.trim().length < 10 ) {
			message.warning('标题字数不能少于十个字');
			this.titleInput.focus();
			return;
		}

		if ( !htmlContent || !plainText ) {
			message.warning('话题内容不能为空');
			this.editor.focus();
			return;
		}

		const decodeHtmlContent = decodeURIComponent( htmlContent );
		this.createTocpic( title, tab, decodeHtmlContent );
	}

	async createTocpic( title, tab, html ) {
		let res = null;
		try {
			res = await axios.post('/api/topics?needAccessToken=true', { title, tab, content: html });
			if ( res.status === 200 && res.data.success ) {
				message.success('话题创建成功');
			} else {
				message.warning('话题创建失败');
			}
		} catch ( error ) {
			console.log( error );
			message.warning('话题创建失败');
		}
	}

	handleTitleChange( event ) {
		this.setState({ title: event.target.value.trim() });
	}

	handleSelectChange( event ) {
		this.setState({ tab: event.target.value });
	}

	render() {
		const editorProps = {
      height: 300,
      initialContent: null,
      onChange: this.handleChange,
			onHTMLChange: this.handleHTMLChange,
			placeholder: this.props.isAuth ? '输入话题内容...' : '登录后才可以创建话题~',
			disabled: !this.props.isAuth,
		};

		return (
			<CreateTopicSection>
				<div className="header">发布话题</div>
				<div className="title">
					<label htmlFor="topic_title">
						标题
						<input
							type="text"
							id="topic_title"
							placeholder="帖子标题"
							onChange={ this.handleTitleChange }
							ref={ (input) => { this.titleInput = input; } }
						/>
					</label>
				</div>
				<div className="tab">
					<label htmlFor="tab_selected">
						请选择板块
						<select id="tab_selected" disabled value={ this.state.tab } onChange={ this.handleSelectChange } >
							<option value="share">分享</option>
							<option value="ask">问答</option>
							<option value="job">招聘</option>
							<option value="dev">客户端测试</option>
						</select>
					</label>
				</div>
				<BraftEditor {...editorProps} ref={ (editor) => { this.editor = editor; } } />
				<div className="submit-btn" onClick={ this.handleSubmitWrapper } >提交</div>
			</CreateTopicSection>
		);
	}
}

export default CreateTopic;
