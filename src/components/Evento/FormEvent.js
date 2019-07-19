export default class Event {
	constructor(event) {
		this._event = event;
	};

	get event() {
		return this._event.toUpperCase();
	};

	set event(newEvent) {
		this._event = newEvent; // validation could be checked here such as only allowing non numerical values
	};
}; 
// Do modifications!
