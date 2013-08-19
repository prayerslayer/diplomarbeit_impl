/*
	Operation Panel View
=======================	
 	View of an operation panel. They are different from regular (e.g. the initial and result) panels, as the caption is layed over the panel instead of located at the bottm.

	@author npiccolotto
*/

var assistance = assistance || {};

(function( $ ) {
	assistance.OperationPanelView = assistance.PanelView.extend({
		tagName: "div",
		className: "assistance-comic__operation-panel",
		template: "#panelViewTemplate",

		initialize: function() {
			this.render();
		},

		showCaption: function() {
			var caption = this.$el.find( ".assistance-comic__panel-caption");
			caption.css( "visibility", "visible" );
			caption.css( "margin-top", "-150px" );
		},

		// animates "viewport" to bounding box of model
		resize: function() {
			var that = this,
				wrap = this.$el.find( ".assistance-comic__panel-wrapper" ),
				img = wrap.find( ".assistance-comic__panel-image" ).first(),
				img_w = img.width(),
				img_h = img.height(),
				ratio = img_w/img_h,
				bbox = this.model.get( "target_bbox" ),
				w = ( bbox[2]/100 ) * img_w,
				h = ( bbox[3]/100 ) * img_h,
				x = bbox[0]/100,
				y = bbox[1]/100;

			if ( w > h ) {
				// width is longest side
				var new_width = (img_w*150)/w;
				img.css( "width", new_width + "px" );
				img.css( "height", "auto" );
				img.css( "margin-left", -x*new_width + "px" );
				img.css( "margin-top",  -y*new_width/ratio+h/2 + "px" );
			} else if ( h > w ) {
				// height is longest side
				var new_height = (img_h*150)/h;
				img.css( "width", "auto" );
				img.css( "height", new_height + "px" );
				img.css( "margin-left", -x*new_height/ratio+w/2 + "px" );
				img.css( "margin-top",  -y*new_height + "px" );
			}
		}
	});
})( jQuery );