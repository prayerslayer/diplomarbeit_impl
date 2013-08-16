var assistance = assistance || {};

(function( $ ) {
	assistance.PanelView = Backbone.Marionette.ItemView.extend({
		tagName: "div",
		className: "assistance-comic__panel",
		template: "#panelViewTemplate",

		initialize: function() {
			this.render();
		},

		onBeforeRender: function() {
			this.model.set( "caption", "fuck that shit" );
		}
	});
})( jQuery );