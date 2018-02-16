import React, { Component } from 'react';
import {
	observer,
	inject,
} from 'mobx-react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import AppStateClass from './../../store/appState.js';


@inject('appState') @observer
class TopicList extends Component {
	constructor() {
		super();
		this.handleChange = this.handleChange.bind( this );
	}

	componentDidMount() {
		// do something
	}

	asyncBootstrap() {
		return new Promise( ( resolve ) => {
			setTimeout( () => {
				this.props.appState.count = 3;
				resolve( true );
			}, 20);
		});
	}

	handleChange( event ) {
		this.props.appState.changeName( event.target.value );
	}x

	render() {
		return (
			<div>
				<Helmet>
					<title>cnode</title>
					<meta name="description" content="this is description"/>
				</Helmet>
				<input type="text" onChange={ this.handleChange }/>
				<div>this is TopicList page { this.props.appState.count } { this.props.appState.name }</div>
			</div>
		);
	}
}

TopicList.propTypes = {
	appState: PropTypes.instanceOf( AppStateClass ),
};

export default TopicList;
