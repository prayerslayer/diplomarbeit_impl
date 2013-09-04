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
			this.set( "latest", data.versions[ 0 ] );
			var day = moment( data.versions[0].timestamp ).format( "MMMM Do YYYY" );
			var time = moment( data.versions[ 0 ].timestamp).format("HH:mm" );
			this.set( "hr_timestamp", "on " + day + " at " + time );
			this.formatScore();
			this.on( "change:score", this.formatScore );
			this.on( "change:component", this.updateComponent, this );
			this.on( "change:visualization", this.updateVisualization, this );

			this.urlRoot = data.urlRoot;
			this.updateComponent( data.component );
			this.updateVisualization( data.visualization );
		},

		updateComponent: function( value ) {
			this.tellChildren( "component", value );
		},

		updateVisualization: function( value ) {
			this.tellChildren( "visualization", value );
		},

		tellChildren: function( key, value ) {
			_.each( this.get( "versions" ), function( v ) {
				_.each( v.annotations.models, function( anno ) {
					anno.set( key, value );
				});
			});
		},

		// construct request for voting
		vote: function( vote ) {
			var that = this;
			var data = { "amount": vote };
			return $.ajax({
				"url": this.urlRoot + "/vote/" + this.get("comment_id" ),
				"type": "PUT",
				"beforeSend": function( xhr, settings ) {
					var auth = btoa( that.get( "current_user" ) );
					xhr.setRequestHeader( "Authorization", "Basic " + auth );
				},
				"contentType": "application/json;charset=UTF-8",
				"data": JSON.stringify( data ),
				"success": function( data, text, xhr ) {
					console.debug( "voting succeeded" );
				},
				"error": function( xhr, text, error ) {
					console.error( "voting failed", error );
				}
			});
		}
	});
})( jQuery );