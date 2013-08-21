/*
*	Datapoint View
*	===================
*
*	Does what you would expect...
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