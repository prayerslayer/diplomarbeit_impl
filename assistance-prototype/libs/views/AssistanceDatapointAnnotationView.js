/*
*	Datapoint View
*	===================
*
*	This is just for fewer edge cases. Datapoint annotations are not explicitly
* 	shown, instead they are used by comment badges.
*
*	@author npiccolotto
*/

var assistance = assistance || {};

( function( $ ) {
	assistance.DatapointAnnotationView = Backbone.Marionette.ItemView.extend({
		tagName: "div",
		className: "assistance-comment__datapointannotation",
		template: "#pointannotationViewTemplate"

	});
})( jQuery );