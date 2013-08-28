/*
	Comment Badge
	====================	
 	
 	Represents a comment badge. It holds an URI (of the instance), some comments, and the component.

	@author npiccolotto
*/

var assistance = assistance || {};

( function( $ ) {
	assistance.CommentBadge = Backbone.Model.extend({
		defaults: {
			"component": "#barchart",
			"uri": "testinstance4",
			"comments": []
		}
	});
})( jQuery );