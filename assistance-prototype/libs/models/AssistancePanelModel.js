/*
	Panel
=======================	
 	Represents a panel in a comic.

	@author npiccolotto
*/

var assistance = assistance || {};

( function( $ ) {
	assistance.Panel = Backbone.Model.extend({
		defaults: {
			"image_url": "http://placehold.it/1000/1000/",	// url to image of component,
			"caption": "cap"
		},

		initialize: function( opts ) {
			switch ( opts.type ) {
				case "operation": this.set( "caption", this.get( "is_subsequent" ) ? "Then use this element..." : "Use this element..." );
								break;
				case "result": this.set( "caption", "...to " + opts.task + "." );
								break;
				case "caption": this.set( "caption", opts.operation );
								break;
			}
		}
	});
})( jQuery );