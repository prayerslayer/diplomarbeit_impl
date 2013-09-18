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
		
		tagName: "text",
		className: "assistance-comment__textannotation",
		template: "#textannotationViewTemplate",

		initialize: function() {
			// see http://stackoverflow.com/questions/9651167/svg-not-rendering-properly-as-a-backbone-view
			this.setElement( document.createElementNS( "http://www.w3.org/2000/svg", this.tagName ) );
			// the line above also destroys the template ;_;
			d3.select( this.el )
				.attr( "x", this.model.get( "x" ) + "%" )
				.attr( "y", this.model.get( "y" ) + "%")
				.text( this.model.get( "text" ) )
				.attr( "class", this.className );
			this.$el = $( this.el );
		}

	});
})( jQuery );