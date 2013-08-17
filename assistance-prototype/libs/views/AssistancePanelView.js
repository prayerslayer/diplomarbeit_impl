/*
	Panel View
=======================	
 	View of a panel. Basically it displays the image and caption and centers the image horizontally and vertically.

	@author npiccolotto
*/

var assistance = assistance || {};

(function( $ ) {
	assistance.PanelView = Backbone.Marionette.ItemView.extend({
		tagName: "div",
		className: "assistance-comic__panel",
		template: "#panelViewTemplate",

		initialize: function() {
			this.render();
		},

		// triggers event when image is completely loaded
		onRender: function() {
			var that = this;
			var img = this.$el.find( "img" ).first();

			img.imagesLoaded( function() {
				that.trigger( "imagesloaded" );
			});
		},

		// centers image if necessary
		resize: function() {
			var img = this.$el.find( "img" ).first(),
				w = img.width(),
				h = img.height();

			if ( w < 150 ) {
				img.css( "margin-left", (150-w)/2 );
			}
			if ( h < 150 ) {
				img.css( "margin-top", (150-h)/2 );
			}
		},

		showCaption: function() {
			var caption = this.$el.find( ".assistance-comic__panel-caption");
			caption.css( "visibility", "visible" );
			caption.css( "margin-top", "0px" );
		}
	});
})( jQuery );