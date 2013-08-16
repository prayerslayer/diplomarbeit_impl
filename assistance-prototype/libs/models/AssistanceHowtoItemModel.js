// model of a how to information

var assistance = assistance || {};

( function( $ ) {
	assistance.HowtoItem = Backbone.Model.extend({
		defaults: {
			action: "defaultAction",		// label for the action, e.g. sort
			capability: "someCapability",	// id of the capability
			displayed: false,				// whether this action is currently displayed or not
			variable: ""
		}
	});
})(jQuery);