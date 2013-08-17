/*
	Comic View
=======================	
 	Holds some comic panels together.
 	
	@author npiccolotto
*/

var assistance = assistance || {};

( function( $ ) {
	assistance.ComicView = Backbone.Marionette.ItemView.extend({
		tagName: "div",
		className: "assistance-comic__content",
		template: "#comicViewTemplate",

		onClose: function() {
			this.options.creator.collection.unlock();
		},

		onRender: function() {
			var that = this;
			// fake http request
			setTimeout( function() {

				var data = that.options.data;

				var m_initial = new assistance.Panel({
					"image_url": data.initial,
					"type": "initial",
					"task": that.options.task,
					"caption": "Use this element..."
				});
				var v_initial = new assistance.PanelView({
					"model": m_initial
				});

				var views = [];
				views.push( v_initial );

				for( var i = 0, len = data.operations.length; i < len; i++ ) {
					var op = data.operations[ i ],
						model = new assistance.OperationPanel({
							"image_url": op.url,
							"bbox": op.bbox,
							"operation": op.operation,
							"caption": op.operation
						}),
						view = new assistance.OperationPanelView({
							"model": model
						});
					views.push( view );
				}
				var m_result = new assistance.Panel({
					"image_url": data.result,
					"type": "result",
					"task": that.options.task,
					"caption": "...to " + that.options.task + "."
				});
				var v_result = new assistance.PanelView({
					"model": m_result
				});

				that.$el.append( v_initial.el );
				for( var i = 0, len = views.length; i < len; i++ ) {
					that.$el.append( views[ i ].el );
				}
				that.$el.append( v_result.el );

			}, 1500 );
		}
	});
})( jQuery );