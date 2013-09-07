/*
 *	Spinner
 *	=======
 *
 *	A simple spinner. Create it and tell it where to render, close when appropriate.
 *
 *	@author npiccolotto
*/
var assistance = assistance || {};

( function( $ ) {
	assistance.Spinner = Backbone.Marionette.ItemView.extend({
		tagName: "div",
		className: "assistance-spinner",
		template: "#spinnerTemplate",

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