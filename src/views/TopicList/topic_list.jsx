import React, { Component } from 'react';
import {
	observer,
	inject,
} from 'mobx-react';
import PropTypes from 'prop-types';
import { AppState } from './../../store/appState.js';


@inject('appState') @observer
class TopicList extends Component {
	constructor() {
		super();
		this.handleChange = this.handleChange.bind( this );
	}
	componentDidMount() {
		// do something
	}
	handleChange( event ) {
		this.props.appState.changeName( event.target.value );
	}
	render() {
		return (
			<div>
				<input type="text" onChange={ this.handleChange }/>
				<div>this is TopicList page { this.props.appState.msg } { this.props.appState.name }</div>
			</div>
		);
	}
}

TopicList.propTypes = {
	appState: PropTypes.instanceOf( AppState ),
};

export default TopicList;
