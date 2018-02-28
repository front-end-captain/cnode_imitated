import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import styled from 'styled-components';
import marked from 'marked';
import NoResult from './../../components/NoResult/no_result.jsx';
import Loading from './../../components/Loading/loading.jsx';

marked.setOptions({
	renderer: new marked.Renderer(),
  gfm: true,
  tables: true,
  breaks: false,
  pedantic: false,
  sanitize: false,
  smartLists: true,
  smartypants: false,
  xhtml: false,
});


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
	background-color: #fff;
	border-radius: 10px;
`;

class TopicDetail extends Component {
	static propTypes = {
		match: PropTypes.instanceOf( Object ),
	}

	constructor() {
		super();
		this.state = {
			loadFail: false,
			articleContent: null,
		};

		this.getArticleDetail = this.getArticleDetail.bind( this );
	}

	componentDidMount() {
		const { id } = this.props.match.params;
		this.getArticleDetail( id );
	}

	async getArticleDetail( id ) {
		let res = null;
		try {
			res = await axios.get(`/api/topic/${id}`);
			console.log( res );
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

	render() {
		if ( this.state.loadFail ) {
			return <LoadingContainer><NoResult text="数据加载失败了" /></LoadingContainer>;
		}
		if ( !this.state.articleContent ) {
			return <LoadingContainer><Loading /></LoadingContainer>;
		}
		return (
			<TopicDetailSection>
				<div className="topic-title">
					标题
				</div>
				<div
					className="topic-content"
					dangerouslySetInnerHTML={{ __html: marked(this.state.articleContent.content) }}
				/>
				<div className="topic-apply">
					回复区域
				</div>
			</TopicDetailSection>
		);
	}
}

export default TopicDetail;
