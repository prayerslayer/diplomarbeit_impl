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

		views: [],
		count: 0,
		spinner: null,

		onBeforeClose: function() {
			_.each( this.views, function( v ) {
				v.stopListening();
				v.close();
			});
			this.views = [];
			this.options.creator.collection.unlock();
		},

		// animates the panels
		animate: function() {
			// wait until every image is there
			this.count--;
			if ( this.count > 0 )
				return;

			this.spinner.close();
			this.spinner = null;

			var that = this,
				size = this.views.length;
			// animate the images
			_.each( this.views, function( v, i ) {
				var wrapper = v.$el.find( ".assistance-comic__panel-wrapper" );
				// each image has 1.5s for its animation: 1s image, .5s resizing
				wrapper.css( "-webkit-transition-delay", i*1.5+"s" );
				wrapper.one( "webkitTransitionEnd", function() {
					v.resize();	
				});
				// this starts the actual animation (see css)
				wrapper.css( "margin-top", "0px" );
			});
			// ok, i know this doesn't look so good
			setTimeout( function() {
				_.each( that.views, function( v ) {
					v.showCaption();	// show captions
				});
			}, size*1500 );	// after images are finished
		},

		// renders panels
		init: function() {
			var that = this,
				data = that.options.data;

			this.spinner = new assistance.Spinner({
				"caller": this.$el
			});
			this.views = [];
			this.count = that.options.data.operations.length+2;

			// construct models and views of panels
			var m_initial = new assistance.Panel({
				"image_url": data.initial,
				"type": "initial",
				"task": that.options.task,
				"caption": "Use this element..."
			}),
				v_initial = new assistance.PanelView({
				"model": m_initial
			});

			that.views.push( v_initial );

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
				that.views.push( view );
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
			that.views.push( v_result );

			// render views and get notified when images are fully loaded
			_.each( that.views, function( v ) {
				that.listenToOnce( v, "imagesloaded", that.animate );
				that.$el.append( v.el );
			});
		}
	});
})( jQuery );