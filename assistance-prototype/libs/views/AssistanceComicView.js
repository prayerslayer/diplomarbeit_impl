var assistance = assistance || {};

( function( $ ) {
	assistance.ComicView = assistance.BaseView.extend({
		tagName: "div",
		className: "assistance-comic",

		template: null,

		render: function() {
			assistance.BaseView.prototype.render.call( this );
		}
	});
})( jQuery );