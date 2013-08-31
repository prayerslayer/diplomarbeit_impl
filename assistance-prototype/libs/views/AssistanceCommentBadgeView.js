/*
	Comment Badge View
	====================	
 	
 	Look and feel of a Comment Badge.

	@author npiccolotto
*/

var assistance = assistance || {};

( function( $ ) {
	assistance.CommentBadgeView = Backbone.Marionette.ItemView.extend({
		tagName: "div",
		className: "vizboard-badge",
		template: "#badgeViewTemplate",

		toggled: false,

		initialize: function( opts ) {
			this.render();
		},

		events: {
			"click": "selectComments",
		},

		show: function() {
			this.$el.show();
		},

		hide: function() {
			this.$el.hide();
		},

		onRender: function() {
			var $comp = $( this.model.get("component" ) );
			var $vis = $comp.find( this.model.get( "visualization" ) ).first();
			this.$el.text( this.model.get( "comments" ).length );
			$comp.append( this.$el );
			var $point = $( "[resource=" + this.model.get("uri" ) + "]" );
			// check if svg visualization
			if ( assistance.Utility.isSvgElement( $point[0] ) ) {
				// use bounding box to position badge at top right
				var bbox = assistance.Utility.transformedBoundingBox( $point[0] );
				var offsetLeft = $vis[0].offsetLeft,
					offsetTop = $vis[ 0 ].offsetTop;
				this.$el.css( "left", offsetLeft + bbox.x + bbox.width - this.$el.width()/2 );
				this.$el.css( "top", offsetTop + bbox.y - this.$el.height()/2);
				console.log( bbox );
			} else {
				// if html, just use jquery ui -.-
				this.$el.position({
					"of": $point,
					"my": "center center",
					"at": "right top"
				});	
			}
		},

		unselect: function() {
			this.$el.removeClass( "vizboard-badge-selected" );
			this.toggled = false;
		},

		select: function() {
			this.$el.addClass( "vizboard-badge-selected" );
			this.toggled = true;
		},

		selectComments: function() {
			if ( this.toggled ) {
				// now untoggle
				this.unselect()
				this.trigger( "unselectcomments", this );
			} else {
				this.select();
				this.trigger( "selectcomments", this );
			}
		}
	});
})( jQuery );