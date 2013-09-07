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

		count: 0,	// used to wait for all the panels to load
		spinner: null,

		initialize: function() {
			this.once( "itemview:imgloaded", this._animate, this );
		},

		onBeforeClose: function() {
			this.options.creator.collection.unlock();	// causes the itemview to reset
		},

		getItemView: function( item ) {
			if ( item.get( "type" ) === "caption" ) {
				return assistance.CaptionPanelView;
			}
			return assistance.OperationPanelView;
		},

		// animate the panels
		_animate: function() {
			// wait until every image is there
			this.count--;
			if ( this.count > 0 ) {
				// ensure that this function is only called once after count is 0
				this.once( "itemview:imgloaded", this._animate, this );
				return;
			}

			this.spinner.close();
			this.spinner = null;

			var that = this,
				size = this.collection.size();
			// animate the images
			this.collection.each( function( model, i ) {
				var v = that.children.findByModel( model );
				var wrapper = v.ui.wrapper;
				// each image has 1.5s for its animation: .5s image, .5s zoom, .5s caption
				wrapper.css( "-webkit-transition-delay", i*1.5+"s" );
				setTimeout( function() {
					v.zoom();
				}, i * 1500 + 500 ); 
				// show caption after zoom finished
				setTimeout( function() {
					v.showCaption();
				}, i*1500 + 500 );
				// start animation
				if ( model.get( "type" ) === "caption" )
					wrapper.css( "left", "0px" );
				else
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
		}
	});
})( jQuery );