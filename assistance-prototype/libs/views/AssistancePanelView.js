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
			var img = this.$el.find( "img" ).first();

			img.imagesLoaded( function() {
				var w = img.width(),
					h = img.height();

				if ( w < 150 ) {
					img.css( "margin-left", (150-w)/2 );
				}
				if ( h < 150 ) {
					img.css( "margin-top", (150-h)/2 );
				}
			});
		}
	});
})( jQuery );