import React from 'react';
import ReactDOM from 'react-dom';
import {
	BrowserRouter as Router,
} from 'react-router-dom';
import { AppContainer } from 'react-hot-loader';
import { composeWithDevTools } from 'redux-devtools-extension';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import reducer from './store/index.js';

import App from './App.jsx';
import './common/style/index.css';

const initialState = window.__INITIAL__STATE__ || {};

const store = createStore(reducer, initialState, composeWithDevTools(applyMiddleware( thunk )));

const root = document.getElementById( 'root' );

// 使用 hydrate  Warning: Expected server HTML to contain a matching <div> in <div>.
const render = ( Component ) => {

	// 对 HMR 进行判断 否则会在客户端报出警告
	// Warning: Expected server HTML to contain a matching <div> in <div>
	const renderMethod = module.hot ? ReactDOM.render : ReactDOM.hydrate;
  renderMethod(
    <AppContainer>
			<Provider store={ store }>
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
