var assistance = assistance || {};

( function( $ ) {
	assistance.HowtoList = Backbone.View.extend( {
		"el": "ol#halp",
		initialize: function() {
			this.render();
		},
		render: function() {
			return this;
		}
	});
})( jQuery );