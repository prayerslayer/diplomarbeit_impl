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

		onRender: function() {
			this.$el.text( this.model.get( "comments" ).length );
			$( this.model.get("component" ) ).append( this.$el );
			this.$el.position({
				"of": $( "[resource=" + this.model.get("uri" ) + "]" ),
				"my": "center center",
				"at": "right top"
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