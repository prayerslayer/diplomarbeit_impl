/*
	Comment Badge Collection
	====================	
 	
 	A collection for the badges.

	@author npiccolotto
*/

var assistance = assistance || {};

( function( $ ) {
	assistance.CommentBadgeCollection = Backbone.Collection.extend({
		model: assistance.CommentBadge
	});
})( jQuery );