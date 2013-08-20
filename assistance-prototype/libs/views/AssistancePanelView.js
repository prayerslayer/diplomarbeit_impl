/*
	Panel View
=======================	
 	Base for other panels

	@author npiccolotto
*/

var assistance = assistance || {};

(function( $ ) {
	assistance.PanelView = Backbone.Marionette.ItemView.extend({
		tagName: "div",
		className: "assistance-comic__panel",
		template: "#panelViewTemplate",

		ui: {
			"caption": ".assistance-comic__panel-caption",
			"wrapper": ".assistance-comic__panel-wrapper",
			"image": ".assistance-comic__panel-image" 
		},

		// triggers event when image is completely loaded
		onRender: function() {
			var that = this;
			var callback = function() {
				if ( typeof that.ui.image === "string" ) {
					// somehow this may get called before ui hash is bound to elements
					that.bindUIElements();
				}
				that.trigger( "imgloaded" );
				that.applyBBox( "source_bbox", true );
			};
			this.ui.image.imagesLoaded().done( callback );
		},

		applyBBox: function( box_type, animate ) {
			var img = this.ui.image,
				that = this,
				duration = that.ui.image.css( "-webkit-transition-duration" );

			if ( !animate ) {
				that.ui.image.css( "-webkit-transition-duration", "0s" );
			}

			// get original image dimensions
			var original = new Image();
			original.src = img.attr( "src" );
			var aspect = original.width / original.height;

			var	img_w = original.width,
				img_h = original.height,
				bbox = this.model.get( box_type ),
				w = ( bbox[2]/100 ) * img_w,
				h = ( bbox[3]/100 ) * img_h,
				x = bbox[0]/100,
				y = bbox[1]/100;

			if ( w > h ) {
				// width is longest side
				var new_width = (img_w*150)/w;
				img.css( "width", new_width + "px" );
				img.css( "height", "auto" );
				img.css( "left", -x*new_width + "px" );
				img.css( "top",  -y*new_width/aspect + "px" );
			} else if ( h > w ) {
				// height is longest side
				var new_height = (img_h*150)/h;
				img.css( "width", "auto" );
				img.css( "height", new_height + "px" );
				img.css( "left", -x*new_height*aspect + "px" );
				img.css( "top",  -y*new_height + "px" );
			}

			if ( !animate ) {
				this.ui.image.css( "-webkit-transition-duration", ".5s" );
			}
		},

		// animates "viewport" to target bounding box of model
		zoom: function() {
			if ( this.model.get( "animate" ) )
				this.applyBBox( "target_bbox", true );
		},

		showCaption: function() {
			if ( this.model.get( "type" ) === "caption" ) {
				this.ui.caption.css( "opacity", 1 );
			}
			else {
				this.ui.caption.css( "top", "-30px" );
			}
		}

	});

})( jQuery );