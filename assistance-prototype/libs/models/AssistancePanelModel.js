/*
	Panel
=======================	
 	Represents a panel in a comic.

	@author npiccolotto
*/

var assistance = assistance || {};

( function( $ ) {
	assistance.Panel = Backbone.Model.extend({
		defaults: {
			"image_url": "http://placehold.it/1000/1000/",	// url to image of component
			"type": "initial"								// which dings
		}
	});
})( jQuery );