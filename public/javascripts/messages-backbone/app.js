define([
	'backbone',
	'underscore',
	'collections/MessageList',
	'views/AppView'
], function (
	Backbone,
	_,
	MessageList,
	AppView
) {
	return function () {

		/**
		 * Initialize the message collection
		 */
		var messages = new MessageList();

		/**
		 * Kick off the message app
		 */
		var appView = new AppView({
			'collection': messages,
			'dispatcher': _.clone(Backbone.Events)
		});

	};
});