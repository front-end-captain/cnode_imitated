import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import moment from "moment";

moment.locale("zh-cn");

const ListViewSection = styled.div`
	width: 100%;
	min-height: 300px;

	ul {
		width: 100%;
		min-height: 300px;

		li {
			height: 50px;
			line-height: 50px;
			padding: 0 10px;
			display: flex;
			justify-content: center;
			align-items: center;
			border-bottom: 1px solid #f0f0f0;

			&:hover {
				background-color: #f0f0f0;
			}

			.avatar {
				flex: 1 1;
				display: block;
				position: relative;
				background-color: lightpink;

				img {
					position: absolute;
					top: 50%;
					left: 50%;
					width: 30px;
					height: 30px;
					transform: translate(-50%, -50%);
				}
			}

			.amount {
				flex: 1 1;

				span:first-child {
					color: #9e78c0;
					font-size: 14px;
				}

				span:last-child {
					color: #b4b4b4;
					font-size: 12px;
				}
			}

			.topic-type {
				flex: 0.5 1;
			}

			.title {
				flex: 10 1;
				text-overflow: ellipsis;
				white-space: nowrap;
				overflow: hidden;

				a:hover {
					text-decoration: underline;
				}
			}

			.last-apply {
				flex: 2 1;
				text-align: right;

				a {
					img {
						width: 18px;
						height: 18px;
					}
				}

				span {
					color: #778077;
					font-size: 12px;
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

const renderTypeBtn = (tab) => {
	switch (tab) {
		case "share":
			return <TypeBtn>分享</TypeBtn>;
		case "ask":
			return <TypeBtn>问答</TypeBtn>;
		case "job":
			return <TypeBtn>招聘</TypeBtn>;
		default:
			return <TypeBtn>分享</TypeBtn>;
	}
};

const renderTypeBtnWrapper = (item) => {
	if (item.top) {
		return <TypeBtn primary>置顶</TypeBtn>;
	}
	if (item.good) {
		return <TypeBtn primary>精华</TypeBtn>;
	}
	return renderTypeBtn(item.tab);
};

function ListView({ dataList }) {
	return (
		<ListViewSection>
			<ul>
				{dataList.map((item) => {
					return (
						<li key={item.id}>
							<div className="avatar">
								<a href="">
									<img
										src={item.author.avatar_url}
										alt={item.author.loginname}
										title={item.author.loginname}
									/>
								</a>
							</div>
							<div className="amount">
								<span>{item.reply_count}/</span>
								<span>{item.visit_count}</span>
							</div>
							<div className="topic-type">{renderTypeBtnWrapper(item)}</div>
							<div className="title">
								<Link to={`/detail/${item.id}`}>{item.title}</Link>
							</div>
							<div className="last-apply">
								{/* <a href="">
										<img src="https://avatars1.githubusercontent.com/u/34757631?v=4&s=120" alt=""/>
									</a> */}
								<span>{moment(item.last_reply_at).fromNow()}</span>
							</div>
						</li>
					);
				})}
			</ul>
		</ListViewSection>
	);
}

ListView.propTypes = {
	dataList: PropTypes.instanceOf(Array).isRequired,
};
/*
{
	"id": "5a2403226190c8912ebaceeb", 话题ID
	"author_id": "4f447c2f0a8abae26e01b27d", 作者ID
	"tab": "share", 话题类型
	"content": "<div class=\"markdown-text\">", 话题内容
	"title": "企业级 Node.js 框架 Egg 发布 2.0，性能提升 30%，拥抱 Async", 话题标题
	"last_reply_at": "2018-02-13T11:21:48.061Z", 最后回复时间
	"good": true, 是否为精华话题
	"top": true, 是否置顶
	"reply_count": 116, 回复量
	"visit_count": 22705, 访问量
	"create_at": "2017-12-03T13:58:58.901Z", 创建时间
	"author": {
			"loginname": "atian25",  作者名称
			"avatar_url": "https://avatars1.githubusercontent.com/u/227713?v=3&s=120" 作者头像
	}
*/

export default ListView;
