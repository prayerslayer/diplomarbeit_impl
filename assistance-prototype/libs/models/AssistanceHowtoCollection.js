var assistance = assistance || {};

/*
	Howto Collection
========================
	Holds a bunch of HowtoItems, which represent the list items in the instruction view. The collection may be locked and unlocked. If locked, the contained HowtoItems stop reacting to mouseover events.
 
	@author npiccolotto
*/

( function( $ ) {
	assistance.HowtoCollection = Backbone.Collection.extend({
		model: assistance.HowtoItem,

		lock: function() {
			_.each( this.models, function( m ) {
				m.set( "lock", true );
			});
		},

		unlock: function() {
			_.each( this.models, function( m ) {
				m.set( "lock", false );
			});
		}
	});
})( jQuery );