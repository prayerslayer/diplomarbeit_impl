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
	assistance.AnnotationCollection = Backbone.Collection.extend({
		model: assistance.Annotation
	});
})( jQuery );