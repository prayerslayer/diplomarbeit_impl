/*
*	Text Annotation View
*	===================
*
*	Displays a text annotation (area based).
*
*	@author npiccolotto
*/

var assistance = assistance || {};

( function( $ ) {
	assistance.TextAnnotationView = Backbone.Marionette.ItemView.extend({
		
		tagName: "div",
		className: "assistance-comment__textannotation",
		template: "#textannotationViewTemplate",

		onRender: function() {
			this.$el.css( "left", this.model.get( "x" ) +"%" );
			this.$el.css( "top", this.model.get( "y" ) + "%" );
		}

	});
})( jQuery );