/*
	Comment Badge Collection
	====================	
 	
 	Holds ALL the comment badges. It is mainly used to bundle events from the badges and report them to the readcommentsview.

	@author npiccolotto
*/

var assistance = assistance || {};

( function( $ ) {
	assistance.CommentBadgeCollection = Backbone.Collection.extend({
		model: assistance.CommentBadge,

		initialize: function( opts ) {
			
		}
	});
})( jQuery );