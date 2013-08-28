/*
*	Datapoint View
*	===================
*
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
			var dings = d3.select( this.model.get( "component" ) ).select( "[resource=" + this.model.get( "uri" ) + "]" );
			dings.attr( "data-vizboard-old-class", dings.attr( "class" ) );
			dings.attr( "class", "vizboard-highlight");
		},

		hide: function() {
			var dings = d3.select( this.model.get( "component" ) ).select( "[resource=" + this.model.get( "uri" ) + "]" );
			dings
				.attr( "class", dings.attr( "data-vizboard-old-class" ) || dings.attr( "class" ) )
				.attr( "data-vizboard-old-class", null );
		},

		onClose: function() {
			this.hide();
		}

	});
})( jQuery );