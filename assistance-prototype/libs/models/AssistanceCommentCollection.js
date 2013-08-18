var assistance = assistance || {};

( function( $ ) {
	assistance.CommentCollection = Backbone.Collection.extend({
			
		model: assistance.Comment,

		initialize: function( options ) {
		},

		parse: function( res ) {
			_.each( res, function( comment ) {
				// prettify date
				comment.hr_timestamp = moment( comment.timestamp ).fromNow() + " on " + moment( comment.timestamp ).format( "L" );
			});
			return res;
		}
		

	});
})( jQuery );