import React from 'react';
import { StaticRouter } from 'react-router-dom';
import { Provider, useStaticRendering } from 'mobx-react';
import App from './App.jsx';
import { createStoreMap } from './store/store.js';

useStaticRendering( true );

export default ( stores, routerContenxt, url ) => (
	<Provider {...stores}>
		<StaticRouter context={routerContenxt} location={url}>
			<App />
		</StaticRouter>
	</Provider>
);

export { createStoreMap };
