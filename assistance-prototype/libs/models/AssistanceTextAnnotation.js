/*
*	Text Annotation
*	===================
*
*	Represents a text annotation (area based).
*
*	@author npiccolotto
*/

var assistance = assistance || {};

( function( $ ) {
	assistance.TextAnnotation = Backbone.Model.extend({
		defaults: {
			"component": "#barchart",
			"x": 24,
			"y": 42,
			"text": "Looooser"
		}

	});
})( jQuery );