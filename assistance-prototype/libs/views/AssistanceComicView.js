/*
	Comic View
=======================	
 	Holds some comic panels together.

	@author npiccolotto
*/

var assistance = assistance || {};

( function( $ ) {
	assistance.ComicView = Backbone.Marionette.CollectionView.extend({
		tagName: "div",
		className: "assistance-comic__content",
		template: "#comicViewTemplate",
		collection: null,

		count: 0,
		spinner: null,

		initialize: function() {
			this.collection = new assistance.PanelCollection();
			this.once( "itemview:imagesloaded", this.animate, this );
		},

		onBeforeClose: function() {
			this.options.creator.collection.unlock();
		},

		getItemView: function( item ) {
			if ( item.get( "type" ) === "operation" ) {
				return assistance.OperationPanelView;
			}
			return assistance.PanelView;
		},

		// animate the panels
		animate: function() {
			// wait until every image is there
			this.count--;
			if ( this.count > 0 ) {
				// ensure that this function is only called once after count is 0
				this.once( "itemview:imagesloaded", this.animate, this );
				return;
			}

			this.spinner.close();
			this.spinner = null;

			var that = this,
				size = this.collection.size();
			// animate the images
			_.each( this.collection.models, function( model, i ) {
				var v = that.children.findByModel( model );
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
				that.children.call( "showCaption" ); // show caption
			}, size*1500 );	// after images are finished
		},

		// create panel models and render views
		init: function() {
			var that = this,
				data = that.options.data;

			this.spinner = new assistance.Spinner({
				"caller": this.$el
			});

			this.count = that.options.data.operations.length+2;

			// construct models and views of panels
			var m_initial = new assistance.Panel({
				"image_url": data.initial,
				"type": "initial",
				"task": that.options.task,
				"caption": "Use this element..."
			});
			this.collection.add( m_initial );

			_.each( data.operations, function( op ) {
				var model = new assistance.OperationPanel({
						"image_url": op.url,
						"bbox": op.bbox,
						"operation": op.operation,
						"caption": op.operation
					});
				that.collection.add( model );
			});

			var m_result = new assistance.Panel({
				"image_url": data.result,
				"type": "result",
				"task": that.options.task,
				"caption": "...to " + that.options.task + "."
			});
			that.collection.add( m_result );
			that.render();
		}
	});
})( jQuery );