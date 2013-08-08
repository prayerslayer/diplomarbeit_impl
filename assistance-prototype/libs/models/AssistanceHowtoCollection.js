var assistance = assistance || {};

( function( $ ) {
	assistance.HowtoCollection = Backbone.Collection.extend({
		model: assistance.HowtoItem
	});
})( jQuery );