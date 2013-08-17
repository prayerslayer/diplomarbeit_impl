/*
	Operation Panel View
=======================	
 	View of an operation panel. They are different from regular (e.g. the initial and result) panels, as the caption is layed over the panel instead of located at the bottm.

	@author npiccolotto
*/

var assistance = assistance || {};

(function( $ ) {
	assistance.OperationPanelView = Backbone.Marionette.ItemView.extend({
		tagName: "div",
		className: "assistance-comic__operation-panel",
		template: "#panelViewTemplate",

		initialize: function() {
			this.render();
		},

		onRender: function() {
			var that = this,
				img = that.$el.find( "img" ).first();

			// wait for image to load, we don't know size until that happens
			img.imagesLoaded( function() {

				var wrap = that.$el.find( ".assistance-comic__panel-wrapper" ),
					img_w = img.width(),
					img_h = img.height(),
					bbox = that.model.get( "bbox" ),
					w = ( bbox[2]/100 ) * img_w,
					h = ( bbox[3]/100 ) * img_h,
					x = bbox[0]/100,
					y = bbox[1]/100;

				if ( w > h ) {
					// width is longest side
					img.css( "width", (img_w*150)/w + "px" );
					img.css( "height", "auto" );
					img.css( "margin-left", -x*img.width() + "px" );
					img.css( "margin-top",  -y*img.height()+h/2 + "px" );
				} else if ( h > w ) {
					// height is longest side
					img.css( "width", "auto" );
					img.css( "height", (img_h*150)/h + "px" );
					img.css( "margin-left", -x*img.width()+w/2 + "px" );
					img.css( "margin-top",  -y*img.height() + "px" );
				}				
				// everything is fine if image is square
			});
		}
	});
})( jQuery );