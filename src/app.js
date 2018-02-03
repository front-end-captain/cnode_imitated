import React from 'react';
import ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';

import App from './App.jsx';

const root = document.getElementById( 'root' );

// 使用 hydrate  Warning: Expected server HTML to contain a matching <div> in <div>.
const render = ( Component ) => {
  ReactDOM.hydrate(
    <AppContainer>
      <Component />
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
