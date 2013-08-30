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
		},

		// check if this areaannotation has rectangles inside
		hasRects: function() {
			return this.get( "elements" ).some( function( item ) {
				return item.get( "type" ) === "rectangle";
			}) || false;
		}

	});
})( jQuery );