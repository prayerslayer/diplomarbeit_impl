/*
*	Area Annotation
*	===================
*
*	Represents a text annotation (area based).
*
*	@author npiccolotto
*/

var assistance = assistance || {};

( function( $ ) {
	assistance.AreaAnnotation = assistance.Annotation.extend({
		defaults: {
			"visualization_width": 100,
			"visualization_height": 100
		},

		initialize: function() {
			this.set( "elements", new Backbone.Collection([], {
				"model": assistance.AnnotationElement
			}) );
		}

	});
})( jQuery );