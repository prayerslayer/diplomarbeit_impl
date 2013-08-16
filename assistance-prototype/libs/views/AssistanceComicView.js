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

				var base = "http://baconmockup.com/",
					initial = base + "500/500/",
					result = base + "750/750/",
					operations = [ {
						"img": base + "/300/200/",
						"operation": "click",
						"bbox": [44,55]
					}, {
						"img": base + "/749/129/",
						"bbox": [34, 20],
						"operation": "double click"
					}
					];

				var m_initial = new assistance.Panel({
					"image_url": initial,
					"type": "initial",
					"task": that.options.task
				});
				var v_initial = new assistance.PanelView({
					"model": m_initial
				});

				var views = [];
				views.push( v_initial );

				for( var i = 0, len = operations.length; i < len; i++ ) {
					var op = operations[ i ],
						model = new assistance.OperationPanel({
							"image_url": op.img,
							"bbox": op.bbox,
							"operation": op.operation
						}),
						view = new assistance.PanelView({
							"model": model
						});
					views.push( view );
				}
				var m_result = new assistance.Panel({
					"image_url": result,
					"type": "result",
					"task": that.options.task
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