/*
*	Arrow Annotation View
*	===================
*
*	Displays an arrow annotation (area based).
*
*	@author npiccolotto
*/

var assistance = assistance || {};

( function( $ ) {
	assistance.ArrowAnnotationView = Backbone.Marionette.ItemView.extend({
		
		tagName: "line",
		className: "assistance-comment__arrowannotation",
		template: "#arrowannotationViewTemplate",

		initialize: function( ) {
			// see http://stackoverflow.com/questions/9651167/svg-not-rendering-properly-as-a-backbone-view
			this.setElement( document.createElementNS( "http://www.w3.org/2000/svg", this.tagName ) );
			// the line above also destroys the template ;_;
			d3.select( this.el ).attr( "x1", this.model.get( "x1" ) );
			d3.select( this.el ).attr( "x2", this.model.get( "x2" ) );
			d3.select( this.el ).attr( "y1", this.model.get( "y1" ) );
			d3.select( this.el ).attr( "y2", this.model.get( "y2" ) );
			d3.select( this.el ).attr( "class", "assistance-comment__arrowannotation" );
			this.$el = $( this.el );
		}

	});
})( jQuery );