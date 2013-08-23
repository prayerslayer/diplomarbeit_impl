/*
*	Rectangle Annotation View
*	===================
*
*	Displays an Rectangle annotation (area based).
*
*	@author npiccolotto
*/

var assistance = assistance || {};

( function( $ ) {
	assistance.RectangleAnnotationView = Backbone.Marionette.ItemView.extend({
		
		tagName: "rect",
		className: "assistance-comment__rectangleannotation",
		template: "#rectangleannotationViewTemplate",

		/**
			TODO: 	rectangle annotations als clipPaths bauen
					problem: kein richtiger "view" pro rectangle, die sind markup-technisch nur ein clipPath innerhalb der <def> sektion des SVGs. heißt wiederum auch, dass sich nicht jeder rectangle view selber rendern kann, es braucht einen collectionview/compositeview, der das regelt.
		*/

		onRender: function() {
			
		}

	});
})( jQuery );