/*
	Operation Panel View
=======================	
 	View of an operation panel. Difference to caption panel is the UI of the caption.

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