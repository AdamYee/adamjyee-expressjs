define([
	'views/MessageRowView',
	'backbone'
	],
function (MessageRowView, Backbone) {
	return Backbone.View.extend({
		el: '#message-app',
		rows: {},
		dispatcher: null,
		
		events: {
			'click #submit'		: 'saveMessage',
		},
		
		initialize: function() {
			this.input = $("#msg");

			this.listenTo(this.collection, 'add', this.addMessage);
			this.listenTo(this.collection, 'remove', this.removeMessage);

			this.timer = null;
			
			this.dispatcher = arguments[0].dispatcher;
			this.dispatcher.on('stop:polling', this.resetPoll, this);
			this.dispatcher.on('begin:polling', this.pollMessages, this);

			this.dispatcher.trigger('begin:polling');
		},
		
		pollMessages: function() {
			var view = this;
			// console.log('polled');
			// console.log(Messages);
			this.collection.fetch({
				success: function(collection, response, options) {
					// console.log('successfully fetched messages');
				},
				error: function() {
					console.log('error on fetching messages');
				},
				complete: function() {
					// console.log('recursed');
					view.timer = setTimeout(function() {
						view.pollMessages(view);
					}, 1000);
				}
			});
		},
		
		resetPoll: function() {
			// stop the polling until otherwise notified
			clearTimeout(this.timer);
		},
		
		render: function() {
			return this;
		},
		
		addMessage: function(msg) {
			var view = new MessageRowView({
				'model': msg,
				'dispatcher': this.dispatcher
			});
			this.$('#message-list').append(view.render().el);
			view.$el.slideDown('default');
			this.rows[msg.id] = view;
		},
		
		removeMessage: function(msg) {
			var view = this.rows[msg.id];
			view.$el.slideUp('default', function(){
				view.remove();
			});
		},
		
		saveMessage: function(e) {
			e.preventDefault();
			if (!this.input.val()) {
				$('#msg').fadeOut(70).fadeIn(70).fadeOut(70).fadeIn(70);
				return;
			}
			
			if (this.collection.lessFive()) {
				
				this.collection.create(
					{	message: this.input.val()	},
					{ // options
						wait: true,
						success: function() {
							$('#notification:visible').slideUp();
							$('#form')[0].reset();
						},
						error: function(m, response) {
							$('#notify-text').text($.parseJSON(response.responseText).message);
							$('#notification:hidden').slideDown();
						}
					}
				);
			}
			else {
				$('#notify-text').text('Five messages are enough...');
				$('#notification:hidden').slideDown();
				$('#form')[0].reset();
			}
		}
	});
});
