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

		initialize: function( opts ) {
			// see http://stackoverflow.com/questions/9651167/svg-not-rendering-properly-as-a-backbone-view
			this.setElement( document.createElementNS( "http://www.w3.org/2000/svg", this.tagName ) );
			// the line above also destroys the template ;_;
			d3.select( this.el )
				.attr( "x1", this.model.get( "x1" ) + "%" )
				.attr( "x2", this.model.get( "x2" ) + "%" )
				.attr( "y1", this.model.get( "y1" ) + "%" )
				.attr( "y2", this.model.get( "y2" ) + "%" )
				.attr( "class", this.className );
			this.$el = $( this.el );
		},

		// this is necessary to reference the proper arrow head.
		setParent: function( parentId ) {
			d3.select( this.el ).attr( "marker-end", "url(#" + parentId + "arrowhead)");
		}

	});
})( jQuery );