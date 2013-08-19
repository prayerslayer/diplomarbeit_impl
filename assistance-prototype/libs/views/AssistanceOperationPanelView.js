/*
	Operation Panel View
=======================	
 	View of an operation panel. They are different from regular (e.g. the initial and result) panels, as the caption is layed over the panel instead of located at the bottm.

	@author npiccolotto
*/

var assistance = assistance || {};

(function( $ ) {
	assistance.OperationPanelView = assistance.PanelView.extend({
		tagName: "div",
		className: "assistance-comic__operation-panel",
		template: "#panelViewTemplate",

		ui: {
			"caption": ".assistance-comic__panel-caption",
			"wrapper": ".assistance-comic__panel-wrapper",
			"image": ".assistance-comic__panel-image" 
		}
	});
})( jQuery );