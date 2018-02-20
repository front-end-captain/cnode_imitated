/**
 * 		action types
 */

const SAVE_TOPICLIST_ALL = 'SAVE_TOPICLIST_ALL';

const SAVE_TOPICLIST_GOOD = 'SAVE_TOPICLIST_GOOD';

const SAVE_TOPICLIST_ASK = 'SAVE_TOPICLIST_ASK';

const SAVE_TOPICLIST_SHARE = 'SAVE_TOPICLIST_SHARE';

const SAVE_TOPICLIST_JOB = 'SAVE_TOPICLIST_JOB';


/**
 * 		reducer
 */
const initState = {
	topicListAll: [],
	topicListGood: [],
	topicListAsk: [],
	topicListShare: [],
	topicListJob: [],
};
export const topicListReducer = ( state = initState, action ) => {
	switch ( action.type ) {
		case SAVE_TOPICLIST_ALL:
			return { ...state, topicListAll: action.payload };
		case SAVE_TOPICLIST_GOOD:
			return { ...state, topicListGood: action.payload };
		case SAVE_TOPICLIST_ASK:
			return { ...state, topicListAsk: action.payload };
		case SAVE_TOPICLIST_SHARE:
			return { ...state, topicListShare: action.payload };
		case SAVE_TOPICLIST_JOB:
			return { ...state, topicListJob: action.payload };
		default:
			return state;
	}
};

/**
 * 		dispatcher
 */
export const saveTopicListAll = ( data ) => {
	return ( dispatch ) => {
		dispatch({ type: SAVE_TOPICLIST_ALL, payload: data });
	};
};

export const saveTopicListGood = ( data ) => {
	return ( dispatch ) => {
		dispatch({ type: SAVE_TOPICLIST_GOOD, payload: data });
	};
};

export const saveTopicListAsk = ( data ) => {
	return ( dispatch ) => {
		dispatch({ type: SAVE_TOPICLIST_ASK, payload: data });
	};
};

export const saveTopicListShare = ( data ) => {
	return ( dispatch ) => {
		dispatch({ type: SAVE_TOPICLIST_SHARE, payload: data });
	};
};

export const saveTopicListJob = ( data ) => {
	return ( dispatch ) => {
		dispatch({ type: SAVE_TOPICLIST_JOB, payload: data });
	};
};
