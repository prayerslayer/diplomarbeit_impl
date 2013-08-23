/*
*	Comment
*	===================
*
*	This represents a comment from the backend.
*
*	@author npiccolotto
*/

var assistance = assistance || {};

( function( $ ) {
	assistance.Comment = Backbone.Model.extend({
		defaults: {
			hr_timestamp: "",
			hr_score: ""
		},

		formatScore: function() {
			this.set( "hr_score", numeral( this.get( "score" ) ).format( "0.[00]a" ) );
		},


		initialize: function( data ) {
			this.set( "hr_timestamp", "on " + moment( data.timestamp ).format( "MMMM Do YYYY" ) );
			this.formatScore();
			this.on( "change:score", this.formatScore );
			this.on( "change:component", this.updateComponent, this );
			this.on( "change:visualization", this.updateVisualization, this );
		},

		updateComponent: function( m, value ) {
			this.tellChildren( "component", value );
		},

		updateVisualization: function( m, value ) {
			this.tellChildren( "visualization", value );
		},

		tellChildren: function( key, value ) {
			this.get( "annotations" ).each( function( anno ) {
				anno.set( key, value );
			});
		}
	});
})( jQuery );