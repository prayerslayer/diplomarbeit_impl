var assistance = assistance || {};

( function( $ ) {
	assistance.HowtoCollection = Backbone.Collection.extend({
		model: assistance.HowtoItem,

		lock: function() {
			this.models.each( function( m ) {
				m.set( "lock", true );
			});
		},

		unlock: function() {
			this.models.each( function( m ) {
				m.set( "lock", false );
			});
		}
	});
})( jQuery );