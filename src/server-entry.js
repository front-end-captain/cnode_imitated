import React from 'react';
import { StaticRouter } from 'react-router-dom';
import { Provider, useStaticRendering } from 'mobx-react';
import { ServerStyleSheet, StyleSheetManager } from 'styled-components';
import App from './App.jsx';
import { createStoreMap } from './store/store.js';

useStaticRendering( true );

const sheet = new ServerStyleSheet();

export default ( stores, routerContenxt, url ) => (
	<Provider {...stores}>
		<StaticRouter context={routerContenxt} location={url}>
			<StyleSheetManager sheet={ sheet.instance }>
				<App />
			</StyleSheetManager>
		</StaticRouter>
	</Provider>
);


export { createStoreMap };
