/*
	Comment Collection
	====================	
 	
 	Fetches comments from backend and holds them together.

	@author npiccolotto
*/

var assistance = assistance || {};

( function( $ ) {
	assistance.CommentCollection = Backbone.Collection.extend({
			
		model: assistance.Comment,

		initialize: function( options ) {
			
		}
		
	});
})( jQuery );