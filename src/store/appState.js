import {
	observable,
	computed,
	action,
} from 'mobx';


class AppStateClass {
	constructor( { count, name } = { count: 0, name: 'viking' } ) {
		this.name = name;
		this.count = count;
	}
	@observable count
	@observable name
	@computed get msg() {
		return `${this.name} say count is ${this.count}`;
	}
	@action add() {
		this.count += 1;
	}
	@action changeName( name ) {
		this.name = name;
	}
	toJson() {
		return {
			count: this.count,
			name: this.name,
		};
	}
}

export default AppStateClass;
