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
			this.on( "change:visible", this.triggerVisible, this );
		},

		triggerVisible: function() {
			var visible_comments = [];
			_.each( this.models, function( b ) {
				if ( b.get( "visible" ) )
					visible_comments.push.apply( visible_comments, b.get( "comments" ) );
			});
			this.trigger( "showcomments", visible_comments );
		}
	});
})( jQuery );