// 保存话题的评论列表数据
const SAVE_COMMENTS_OF_TOPIC = "SAVE_COMMENTS_OF_TOPIC";

const UPDATE_COMMENTS_OF_TOPIC = "UPDATE_COMMENTS_OF_TOPIC";

const initState = {
	topicComments: [],
};
export const topicDetailReducer = (state = initState, action) => {
	switch (action.type) {
		case SAVE_COMMENTS_OF_TOPIC:
			return { ...state, topicComments: action.payload };
		case UPDATE_COMMENTS_OF_TOPIC:
			return {
				...state,
				topicComments: [...state.topicComments, action.payload],
			};
		default:
			return state;
	}
};

export const saveCommentsOfTopic = (data) => {
	return (dispatch) => {
		dispatch({ type: SAVE_COMMENTS_OF_TOPIC, payload: data });
	};
};

export const updateCommentsOfTopic = (newReplies) => {
	return (dispatch) => {
		dispatch({ type: UPDATE_COMMENTS_OF_TOPIC, payload: newReplies });
	};
};
