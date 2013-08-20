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
		}
	});
})( jQuery );