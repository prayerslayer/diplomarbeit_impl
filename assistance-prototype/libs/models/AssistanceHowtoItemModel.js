/*
	Howto Item
=======================	
	Represents an item in the instruction list view.

	@author npiccolotto
*/

var assistance = assistance || {};

( function( $ ) {
	assistance.HowtoItem = Backbone.Model.extend({
		defaults: {
			action: "defaultAction",		// label for the action, e.g. sort
			capability: "someCapability",	// id of the capability
			variable: "",
			displayed: false
		}
	});
})(jQuery);