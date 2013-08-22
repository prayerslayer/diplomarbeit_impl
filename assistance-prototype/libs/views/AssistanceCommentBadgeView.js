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
			"click": "toggleComments",
		},

		show: function() {
			this.$el.show();
		},

		hide: function() {
			this.$el.hide();
		},

		onRender: function() {
			this.$el.text( this.model.get( "comments" ).length );
			$( this.model.get("component" ) ).append( this.$el );
			this.$el.position({
				"of": $( "[resource=" + this.model.get("uri" ) + "]" ),
				"my": "center center",
				"at": "right top"	// this does not work with SVG, sadly
			});
		},

		toggleComments: function() {
			if ( this.toggled ) {
				// now untoggle
				this.$el.removeClass( "vizboard-badge-selected" );
				this.model.set( "visible", false );
			} else {
				this.$el.addClass( "vizboard-badge-selected" );
				this.model.set( "visible", true );
			}
			this.toggled = !this.toggled;
		}
	});
})( jQuery );