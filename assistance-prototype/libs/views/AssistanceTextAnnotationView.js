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
			d3.select( this.el ).attr( "x", this.model.get( "x" ) + "%" );
			d3.select( this.el ).attr( "y", this.model.get( "y" ) + "%");
			d3.select( this.el ).text( this.model.get( "text" ) );
			d3.select( this.el ).attr( "class", "assistance-comment__textannotation" );
			this.$el = $( this.el );
		}

	});
})( jQuery );