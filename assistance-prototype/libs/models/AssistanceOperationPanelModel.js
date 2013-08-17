var assistance = assistance || {};

( function( $ ) {
	assistance.OperationPanel = Backbone.Model.extend({
		defaults: {
			"image_url": "http://placehold.it/1000/1000/",
			"type": "operation",
			"bbox": [ 40, 20, 48, 28 ],
			"operation": "click"
		}
	});
})( jQuery );