/* eslint-disable no-param-reassign */
/* eslint-disable no-unused-expressions */
import md5 from 'js-md5';

export const normalizeTopicList = ( data ) => {
	return data.map( ( item ) => {
		const mockItem = item;
		delete mockItem.content;
		return mockItem;
	});
};

export const normalizeCommentData = ({ content, avatar_url, loginname }) => {
	const replySchema = {
		author: {
			avatar_url,
			loginname,
		},
		content,
		create_at: new Date(),
		id: md5( Math.random() ).substring(0, 24),
		is_uped: false,
		reply_id: null,
	};
	return replySchema;
};


export const throttle = ( method, context, ...args ) => {
	method.timer && clearTimeout(method.timer);
	method.timer = setTimeout(() => {
		method.call(context, args);
	}, 200);
};
