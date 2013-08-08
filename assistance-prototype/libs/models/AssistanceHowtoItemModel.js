// model of a how to information

var assistance = assistance || {};

( function( $ ) {
	assistance.HowtoItem = Backbone.Model.extend({
		defaults: {
			action: "defaultAction",
			variable: "someVariable",
			capability: "someCapability",
			preview: false,
			active: false
		}
	});
})(jQuery);