/* eslint-disable import/prefer-default-export */

export const normalizeTopicList = ( data ) => {
	return data.map( ( item ) => {
		const mockItem = item;
		delete mockItem.content;
		return mockItem;
	});
};
