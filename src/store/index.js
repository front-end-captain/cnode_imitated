import { combineReducers } from 'redux';
import { topicListReducer } from './topicList.store.js';


const rootReducer = combineReducers({
	topicList: topicListReducer,
});

export default rootReducer;
