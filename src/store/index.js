import { combineReducers } from 'redux';
import { topicListReducer } from './topicList.store.js';
import { userReducer } from './user.store.js';


const rootReducer = combineReducers({
	topicList: topicListReducer,
	user: userReducer,
});

export default rootReducer;
