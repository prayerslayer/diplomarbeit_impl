/*
	Comment Badge
	====================	
 	
 	Represents a comment badge. It holds an URI (of the instance), some comments, a number and a bool if it's visible.

	@author npiccolotto
*/

var assistance = assistance || {};

( function( $ ) {
	assistance.CommentBadge = Backbone.Model.extend({
		defaults: {
			"uri": "testinstance4",
			"text": 4,
			"visible": false
		}
	});
})( jQuery );