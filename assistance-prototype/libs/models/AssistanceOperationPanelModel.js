/*
	Operation Panel
=======================	
 	Represents a comic panel of an operation.

	@author npiccolotto
*/

var assistance = assistance || {};

( function( $ ) {
	assistance.OperationPanel = assistance.Panel.extend({
		defaults: {
			"image_url": "http://placehold.it/1000/1000/",	// url to screenshot of elements needed for operation
			"type": "operation",							// other types are initial and result
			"bbox": [ 40, 20, 48, 28 ],						// bounding box of elements in screenshot
			"operation": "click"							// name of operation
		}
	});
})( jQuery );