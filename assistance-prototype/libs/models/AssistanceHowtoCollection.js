var assistance = assistance || {};

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