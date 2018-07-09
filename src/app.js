import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router } from "react-router-dom";
import { AppContainer } from "react-hot-loader";
/* eslint-disable import/no-extraneous-dependencies */
import { composeWithDevTools } from "redux-devtools-extension";
import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import { Provider } from "react-redux";
import reducer from "./store/index.js";

import App from "./App.jsx";
import "./common/style/index.css";

const env = process.env.NODE_ENV;

const initialState = window.__INITIAL__STATE__ || {};

// 只在开发环境下启用 redux-devtool
const store =
	env === "production"
		? createStore(reducer, initialState, applyMiddleware(thunk))
		: createStore(
				reducer,
				initialState,
				composeWithDevTools(applyMiddleware(thunk)),
			);

const root = document.getElementById("root");
const render = (Component) => {
	// 对 HMR 进行判断 否则会在客户端报出警告
	// Warning: Expected server HTML to contain a matching <div> in <div>
	const renderMethod = module.hot ? ReactDOM.render : ReactDOM.hydrate;
	renderMethod(
		<AppContainer>
			<Provider store={store}>
				<Router>
					<Component />
				</Router>
			</Provider>
		</AppContainer>,
		root,
	);
};

render(App);

// 在开发环境下启用 HMR
if (env === "development") {
	if (module.hot) {
		module.hot.accept("./App.jsx", () => {
			// require 方式引入模块 必须使用 default 因为 App 是通过 ES6 模块导出的
			const NextApp = require("./App.jsx").default;
			render(NextApp);
		});
	}
}
