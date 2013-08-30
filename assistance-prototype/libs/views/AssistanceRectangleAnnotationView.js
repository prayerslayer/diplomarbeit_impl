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

		initialize: function( opts ) {
			// see http://stackoverflow.com/questions/9651167/svg-not-rendering-properly-as-a-backbone-view
			this.setElement( document.createElementNS( "http://www.w3.org/2000/svg", this.tagName ) );
			// the line above also destroys the template ;_;
			d3.select( this.el ).attr( "x", this.model.get( "x1" ) + "%" );
			d3.select( this.el ).attr( "y", this.model.get( "y1" ) + "%" );
			d3.select( this.el ).attr( "width", this.model.get("x2" ) - this.model.get( "x1" ) + "%" );
			d3.select( this.el ).attr( "height", this.model.get( "y2" ) - this.model.get( "y1" ) + "%" );
			this.$el = $( this.el );
		}

	});
})( jQuery );