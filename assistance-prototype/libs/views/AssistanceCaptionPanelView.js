/*
	Panel View
=======================	
 	View of a panel. Basically it displays the image and caption and centers the image horizontally and vertically.

	@author npiccolotto
*/

var assistance = assistance || {};

(function( $ ) {
	assistance.CaptionPanelView = assistance.PanelView.extend({
		tagName: "div",
		className: "assistance-comic__caption-panel",
		template: "#panelViewTemplate",

		ui: {
			"caption": ".assistance-comic__panel-caption",
			"wrapper": ".assistance-comic__panel-wrapper",
			"image": ".assistance-comic__panel-image" 
		}
	});
})( jQuery );