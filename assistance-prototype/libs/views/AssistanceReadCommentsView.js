var assistance = assistance || {};

( function( $ ) {
	assistance.ReadCommentsView = Backbone.Marionette.CollectionView.extend({
		tagName: "div",
		className: "assistance-comment__read-comments",
		itemView: assistance.CommentView,

		init: function() {
			//TODO put ajax calls here
			var spinner = new assistance.Spinner({
				"caller": this.$el
			});
			this.collection.fetch({
				"success": function( collection, response ) {
					spinner.close();
				},
				"error": function( col, res) {
					console.debug( col, res );
				}
			});
		},


	});
})( jQuery );