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
			"caption": "cap",
			"type": "initial"								// which dings
		},

		initialize: function( opts ) {
			switch ( opts.type ) {
				case "initial": this.set( "caption", "Use this element" );
								break;
				case "result": this.set( "caption", "to " + opts.task );
								break;
				case "operation": this.set( "caption", opts.operation );
								break;
			}
			console.log( "initialized panel", this );
		}
	});
})( jQuery );