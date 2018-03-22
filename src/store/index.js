import { combineReducers } from 'redux';
import { topicListReducer } from './topicList.store.js';
import { userReducer } from './user.store.js';
import { topicDetailReducer } from './topicDetail.store.js';


const rootReducer = combineReducers({
	topicList: topicListReducer,
	user: userReducer,
	topicDetailComments: topicDetailReducer,
});

export default rootReducer;
