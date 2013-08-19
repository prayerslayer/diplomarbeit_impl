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

		count: 0,
		spinner: null,

		initialize: function() {
			this.once( "itemview:imagesloaded", this.animate, this );
		},

		onBeforeClose: function() {
			this.options.creator.collection.unlock();
		},

		getItemView: function( item ) {
			if ( item.get( "type" ) === "caption" ) {
				return assistance.CaptionPanelView;
			}
			return assistance.OperationPanelView;
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
				var wrapper = v.ui.wrapper;
				// each image has 1.5s for its animation: .5s image, .5s zoom
				wrapper.css( "-webkit-transition-delay", i+"s" );
				wrapper.one( "webkitTransitionEnd", function() {
					v.zoom();
					setTimeout( function() {
						v.showCaption();
					}, 500 );
				});
				model.get( "type" ) === "caption" ? wrapper.css( "left", "0px" ) : 
				wrapper.css( "top", "0px" );
			});
		},

		// create panel models and render views
		init: function() {
			var that = this,
				data = that.options.data;

			this.spinner = new assistance.Spinner({
				"caller": this.$el
			});

			this.count = this.collection.size();
			console.log( this.collection );
			that.render();
		}
	});
})( jQuery );