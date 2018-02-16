import React from 'react';
import ReactDOM from 'react-dom';
import {
	BrowserRouter as Router,
} from 'react-router-dom';
import { AppContainer } from 'react-hot-loader';
import { Provider } from 'mobx-react';
import AppStateClass from './store/appState.js';

import App from './App.jsx';

const initialState = window.__INITIAL__STATE__ || {}; // eslint-disable-line

const root = document.getElementById( 'root' );

// 使用 hydrate  Warning: Expected server HTML to contain a matching <div> in <div>.
const render = ( Component ) => {
  ReactDOM.hydrate(
    <AppContainer>
			<Provider appState={ new AppStateClass( initialState.appState ) }>
				<Router>
					<Component />
				</Router>
			</Provider>
    </AppContainer>,
    root,
  );
};

render( App );


if ( module.hot ) {
  module.hot.accept( './App.jsx', () => {
    // reuire 方式引入模块 必须使用 default 因为 App 是通过 ES6 模块导出的
    const NextApp = require( './App.jsx' ).default;
    render( NextApp );
  });
}

// if ( module.hot ) {
// 	module.hot.accept( './App.jsx', () => { render( App ) } );
// }
