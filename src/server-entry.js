import React from 'react';
import { StaticRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ServerStyleSheet, StyleSheetManager } from 'styled-components';
import App from './App.jsx';
import rootReducer from './store/index.js';


const sheet = new ServerStyleSheet();

export default ( store, routerContenxt, url ) => (
	<Provider store={ store }>
		<StaticRouter context={routerContenxt} location={url}>
			<StyleSheetManager sheet={sheet.instance}>
				<App />
			</StyleSheetManager>
		</StaticRouter>
	</Provider>
);

export { rootReducer };
