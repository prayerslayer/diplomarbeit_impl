var assistance = assistance || {};

( function( $ ) {
	assistance.CommentView = Backbone.Marionette.ItemView.extend({
		tagName: "div",
		className: "assistance-comment__comment",
		template: "#commentViewTemplate"

		
	});
})( jQuery );