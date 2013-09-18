/*
*	Data Annotation View
*	==================
*
*	Displays a data-based rectangle.
*
*	@author npicolotto
*/

var assistance = assistance || {};

( function( $ ) {
	assistance.DataAnnotationView = Backbone.Marionette.ItemView.extend({
		tagName: "rect",
		className: "assistance-comment__dataannotation",
		template: "#dataannotationViewTemplate",

		initialize: function( opts ) {
			
		}
	});
})( jQuery );