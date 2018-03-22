/**
 * action types
 */
const SAVE_USER_INFO = 'SAVE_USER_INFO';

const CLEAR_USER_INFO = 'CLEAR_USER_INFO';

const SET_AUTH = 'SET_AUTH';

/**
 * reducer
 */
const initState = {
	isAuth: false,
	userInfo: {},
};
export const userReducer = ( state = initState, action ) => {
	switch ( action.type ) {
		case SAVE_USER_INFO:
			return { ...state, userInfo: action.plyload };
		case CLEAR_USER_INFO:
			return { ...state, userInfo: {} };
		case SET_AUTH:
			return { ...state, isAuth: action.plyload };
		default:
			return state;
	}
};

export const saveUserInfo = ( info ) => {
	return ( dispatch ) => {
		dispatch({ type: SAVE_USER_INFO, plyload: info });
	};
};

export const clearUserInfo = () => {
	return ( dispatch ) => {
		dispatch({ type: CLEAR_USER_INFO });
	};
};

export const setAuth = ( flag ) => {
	return ( dispatch ) => {
		dispatch({ type: SET_AUTH, plyload: flag });
	};
};
