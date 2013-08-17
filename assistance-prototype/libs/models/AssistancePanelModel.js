var assistance = assistance || {};

( function( $ ) {
	assistance.Panel = Backbone.Model.extend({
		defaults: {
			"image_url": "http://placehold.it/1000/1000/",
			"type": "initial"
		}
	});
})( jQuery );