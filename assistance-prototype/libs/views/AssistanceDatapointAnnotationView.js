/*
*	Datapoint View
*	===================
*
*	This is actually not a view. It just sets a highlight class on a datapoint.
*
*	@author npiccolotto
*/

var assistance = assistance || {};

( function( $ ) {
	assistance.DatapointAnnotationView = Backbone.Marionette.ItemView.extend({
		tagName: "div",
		className: "assistance-comment__datapointannotation",
		template: "#pointannotationViewTemplate",

		show: function() {
			var el = d3.select( this.model.get( "component" ) ).select( "[resource='" + this.model.get( "uri" ) + "']" );
			if ( !el.attr( "data-vizboard-old-fill" ) ) {

				// cannot set this via css class due to rule specifity
				el.attr( "data-vizboard-old-fill", el.style( "fill" ) );
				el.attr( "data-vizboard-old-bgcolor", el.style( "background-color" ) );
				el.attr( "data-vizboard-old-cursor", el.style( "cursor" ) );

				el.style( "fill", "orange" );
				el.style( "background-color", "orange" );
				el.style( "cursor", "pointer" );
			}
		},

		hide: function() {
			var el = d3.select( this.model.get( "component" ) ).select( "[resource='" + this.model.get( "uri" ) + "']" );
			el.style( "fill", el.attr( "data-vizboard-old-fill" ) || el.style( "fill" ) );
			el.style( "background-color", el.attr( "data-vizboard-old-bgcolor" ) || el.style( "background-color" ) );
			el.style( "cursor", el.attr( "data-vizboard-old-cursor" ) || el.style( "cursor" ) );
			// delete copy
			el.attr( "data-vizboard-old-fill", null );
			el.attr( "data-vizboard-old-bgcolor", null );
			el.attr( "data-vizboard-old-cursor", null );
		},

		onClose: function() {
			this.hide();
		}

	});
})( jQuery );