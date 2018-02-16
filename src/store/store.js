import AppStateClass from './appState.js';

export const AppState = AppStateClass;

export default {
	AppState,
};

export const createStoreMap = () => {
	return {
		appState: new AppStateClass(),
	};
};
