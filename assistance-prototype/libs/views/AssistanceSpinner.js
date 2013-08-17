var assistance = assistance || {};

( function( $ ) {
	assistance.Spinner = Backbone.Marionette.ItemView.extend({
		tagName: "div",
		className: "assistance-spinner",
		template: "#spinnerTemplate",

		initialize: function() {
			this.render();
		},

		onRender: function() {
			$( "body" ).append( this.$el );
			this.$el.position({
				"of": $( this.options.caller ),
				"my": "center center",
				"at": "center center"
			});
		}
	});
})( jQuery );