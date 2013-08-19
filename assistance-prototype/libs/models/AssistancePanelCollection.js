var assistance = assistance || {};

( function( $ ) {
	assistance.PanelCollection = Backbone.Collection.extend({
		model: assistance.Panel
	});
})( jQuery );