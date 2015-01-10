define(['templates/message-row-default',
		'templates/message-row-edit',
		'backbone'
		],
	function (rowDefault, rowEdit, Backbone) {
	return Backbone.View.extend({
		
		tagName: 'div', // generates a new <div> 

		dispatcher: null,

		className: 'message-row',
						
		events: {
			'click a.delete'	: 'byebye',
			'click .edit-btn'	: 'edit',
			'blur .edit'		: 'done',
			'submit .edit-form'	: 'hitenter'
		},
		
		initialize: function() {
			console.log('MessageRowView initialized');
			this.template = rowDefault;
			this.editting = false;
			this.dispatcher = arguments[0].dispatcher;
			this.model.on('change:message', this.afterEditRender, this);
		},
				
		render: function() {
			var t = this.template(this.model.toJSON());
			this.$el.html( t );
			if (this.template === rowEdit) {
				this.input = this.$('#message'+this.model.get('_id'));
				this.input.css({width:0});
			}
			return this;
		},
		
		afterEditRender: function() {
			if (this.model.get('message') !== '' && this.editting === false) {
				//TODO fancy async render
				this.render();
			}
		},
		
		byebye: function(e) {
			if (e) e.preventDefault();
			console.log('----------------destroying: ' + this.model.attributes.message);

			var view = this;
			
			view.model.destroy({
	 			wait: true, // we kinda want to wait for the server to respond before removing the model and associated view
	 			success: function(model, resp, options){
	 				view.$el.slideUp('default', function(){
	 					view.remove();
	 				});
	 				console.log('----------------destroyed and removed');
	 			},
	 			error: function(model, xhr, options) {
	 				console.log('error destroying');
	 				alert(xhr.statusText + ', message not deleted.');
	 			},
	 			complete: function () {
	 				console.log('----------------polling restarted');
 					view.dispatcher.trigger('begin:polling');
	 			}
	 		});
		},
		
		edit: function(e) {
			e.preventDefault();
			this.editting = true;
			this.template = rowEdit;
			this.render();
			this.input.animate({
					width : 626
				}, 200);
			this.input.focus().val(this.input.val());
		},

		hitenter: function(e) {
			e.preventDefault();
			this.input.blur(); // fake the blur 
		},
		
		done: function(e) {
			if (e && e.type == 'submit') {
				e.preventDefault();
			}
			this.dispatcher.trigger('stop:polling');
			this.template = rowDefault;
			this.editting = false;
			
			var view = this;
			var updatedText = this.input.val();
			var textHasChanged = this.model.get('message') !== updatedText;

			// if the message is not empty
			if (updatedText !== "") {
				// AND if the message is different than before
				if (textHasChanged) {
					this.model.set('message', updatedText);
					this.model.save({
						success: function() {
							console.log('successfully edited');
							console.log('model saved');
						},
						error: function() {
							console.log('error editting message');
						}
					});
				}
				view.hideEdit();
			}
			else {
				this.model.set('message', "");
				view.byebye();
			}
		},

		hideEdit: function () {
			var view = this;
			this.input.animate({width : 0}, 350, function(){
				view.render();
				// reset width
				$(this).css('width',''); // this refers to the jquery div selector
				view.dispatcher.trigger('begin:polling');
			});
		}
	});
});
