/* eslint-disable no-unused-expressions */
/* eslint-disable no-param-reassign */
export const normalizeTopicList = ( data ) => {
	return data.map( ( item ) => {
		const mockItem = item;
		delete mockItem.content;
		return mockItem;
	});
};


export const throttle = ( method, context, ...args ) => {
	method.timer && clearTimeout( method.timer );
	method.timer = setTimeout( () => {
		method.apply( context, args );
	}, 300);
};
