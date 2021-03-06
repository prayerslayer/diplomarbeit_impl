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
	assistance.TextAnnotation = assistance.AnnotationElement.extend({
		defaults: {
			"component": "#barchart",
			"x": 24,
			"y": 42,
			"text": "Looooser"
		},

		onRender: function() {
			this.$el.hide();
		}

	});
})( jQuery );