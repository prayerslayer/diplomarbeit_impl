var assistance = assistance || {};

( function( $ ) {
	assistance.CommentCollection = Backbone.Collection.extend({
			
		model: assistance.Comment,

		initialize: function( options ) {
		}
		
	});
})( jQuery );