define(['backbone'],function (Backbone) {
	return Backbone.Model.extend({
		urlRoot: '/messages/',
		
		defaults: {
			message: '',
		},

		idAttribute: '_id',
		
		initialize: function() {
			this.on('change:message', function(model) {
				console.log("message text changed to: " + model.get('message'));
			});
		},

		validate: function(attrs, options) {
			if (!attrs.message) {
				return "empty";
			}
		}
	});
});
