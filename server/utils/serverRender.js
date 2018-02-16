const ReactDOMServer = require( 'react-dom/server' );
const asyncBootstrapper = require('react-async-bootstrapper').default;
const ejs = require('ejs');
const serialize = require('serialize-javascript');
const Helmet = require('react-helmet').default;

const getStoreState = ( stores ) => {
	return Object.keys( stores ).reduce( ( result, storeName ) => {
		result[storeName] = stores[storeName].toJson();
		return result;
	}, {});
}


module.exports = (bundle, template, request, response) => {
	return new Promise((resolve, reject) => {
		const createStoreMap = bundle.createStoreMap;
		const createApp = bundle.default;
		let routerContext = {};

		let stores = createStoreMap();
		const app = createApp(stores, routerContext, request.url);

		asyncBootstrapper(app).then(() => {
			if (routerContext.url) {
				response.status(302).setHeader("Location", routerContext.url);
				response.end();
				return;
			}
			const helmet = Helmet.rewind();
			const state = getStoreState(stores);
			const content = ReactDOMServer.renderToString(app);

			const html = ejs.render(template, {
				appString: content,
				initialState: serialize(state),
				meta: helmet.meta.toString(),
				title: helmet.title.toString(),
				style: helmet.style.toString(),
				link: helmet.link.toString()
			});
			response.send(html);
			resolve();
		}).catch(reject);
	});
};
