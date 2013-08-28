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
			this.$el.text( this.model.get( "comments" ).length );
			$( this.model.get("component" ) ).append( this.$el );
			this.$el.position({
				"of": $( "[resource=" + this.model.get("uri" ) + "]" ),
				"my": "center center",
				"at": "right top"	// this does not work with SVG, sadly
			});
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