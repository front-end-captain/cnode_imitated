/**
 * 		action types
 */

const SAVE_TOPICLIST_ALL = 'SAVE_TOPICLIST_ALL';

const SAVE_TOPICLIST_GOOD = 'SAVE_TOPICLIST_GOOD';

const SAVE_TOPICLIST_ASK = 'SAVE_TOPICLIST_ASK';

const SAVE_TOPICLIST_SHARE = 'SAVE_TOPICLIST_SHARE';

const SAVE_TOPICLIST_JOB = 'SAVE_TOPICLIST_JOB';

const SAVE_TOPICLIST_TEST = 'SAVE_TOPICLIST_TEST';

const CHANGE_TOPICLIST_ALL_PAGE_INDEX = 'CHANGE_TOPICLIST_ALL_PAGE_INDEX';

const CHANGE_TOPICLIST_GOOD_PAGE_INDEX = 'CHANGE_TOPICLIST_GOOD_PAGE_INDEX';

const CHANGE_TOPICLIST_ASK_PAGE_INDEX = 'CHANGE_TOPICLIST_ASK_PAGE_INDEX';

const CHANGE_TOPICLIST_SHARE_PAGE_INDEX = 'CHANGE_TOPICLIST_SHARE_PAGE_INDEX';

const CHANGE_TOPICLIST_JOB_PAGE_INDEX = 'CHANGE_TOPICLIST_JOB_PAGE_INDEX';

const CHANGE_TOPICLIST_TEST_PAGE_INDEX = 'CHANGE_TOPICLIST_TEST_PAGE_INDEX';


/**
 * 		reducer
 */
const initState = {
	topicListAll: [],
	topicListGood: [],
	topicListAsk: [],
	topicListShare: [],
	topicListJob: [],
	topicListTest: [],
	topicListAllPageIndex: 1,
	topicListGoodPageIndex: 1,
	topicListAskPageIndex: 1,
	topicListSharePageIndex: 1,
	topicListJobPageIndex: 1,
	topicListTestPageIndex: 1,
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
		case SAVE_TOPICLIST_TEST:
			return { ...state, topicListTest: action.payload };
		case CHANGE_TOPICLIST_ALL_PAGE_INDEX:
			return { ...state, topicListAllPageIndex: action.payload };
		case CHANGE_TOPICLIST_GOOD_PAGE_INDEX:
			return { ...state, topicListGoodPageIndex: action.payload };
		case CHANGE_TOPICLIST_ASK_PAGE_INDEX:
			return { ...state, topicListAskPageIndex: action.payload };
		case CHANGE_TOPICLIST_SHARE_PAGE_INDEX:
			return { ...state, topicListSharePageIndex: action.payload };
		case CHANGE_TOPICLIST_JOB_PAGE_INDEX:
			return { ...state, topicListJobPageIndex: action.payload };
		case CHANGE_TOPICLIST_TEST_PAGE_INDEX:
			return { ...state, topicListTestPageIndex: action.payload };
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

export const saveTopicListTest = ( data ) => {
	return ( dispatch ) => {
		dispatch({ type: SAVE_TOPICLIST_TEST, payload: data });
	};
};

export const changeTopicListAllPageIndex = ( index ) => {
	return ( dispatch ) => {
		dispatch({ type: CHANGE_TOPICLIST_ALL_PAGE_INDEX, payload: index });
	};
};

export const changeTopicListGoodPageIndex = ( index ) => {
	return ( dispatch ) => {
		dispatch({ type: CHANGE_TOPICLIST_GOOD_PAGE_INDEX, payload: index });
	};
};

export const changeTopicListSharePageIndex = ( index ) => {
	return ( dispatch ) => {
		dispatch({ type: CHANGE_TOPICLIST_SHARE_PAGE_INDEX, payload: index });
	};
};

export const changeTopicListAskPageIndex = ( index ) => {
	return ( dispatch ) => {
		dispatch({ type: CHANGE_TOPICLIST_ASK_PAGE_INDEX, payload: index });
	};
};

export const changeTopicListJobPageIndex = ( index ) => {
	return ( dispatch ) => {
		dispatch({ type: CHANGE_TOPICLIST_JOB_PAGE_INDEX, payload: index });
	};
};

export const changeTopicListTestPageIndex = ( index ) => {
	return ( dispatch ) => {
		dispatch({ type: CHANGE_TOPICLIST_TEST_PAGE_INDEX, payload: index });
	};
};
