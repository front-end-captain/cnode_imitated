import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Routes from './config/router.jsx';

class App extends Component {
  componentDidMount() {
		// do something
	}
  render() {
    return (
			<div>
				<div>
					<Link to="/">首页</Link>
					<Link to="/detail">详情页</Link>
				</div>
				<Routes />
			</div>
		);
  }
}

export default App;
