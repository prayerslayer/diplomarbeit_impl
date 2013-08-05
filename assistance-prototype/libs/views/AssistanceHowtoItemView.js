var assistance = assistance || {};

( function( $ ) {
	assistance.HowtoItemView = Backbone.View.extend({

		tagName: "li",
		className: "assistance-howto__item-normal",

		initialize: function( ) {
			console.debug( this.options );
			this.render();
		},

		render: function( ) {
			//TODO add handlebars?
			this.$el.append( this.model.get( "action" ) + " " + this.model.get( "variable" ) );
			return this;
		},

		events: {
			"click [data-role = show-howto]": "showAssistance",
			"mouseover [data-role = show-howto]": "highlightElements",
			"mouseout [data-role = show-howto]": "unhighlightElements"
		},

		showAssistance: function() {

		},

		highlightElements: function() {
			$( this ).removeClass( "assistance-howto__item-normal" ).addClass( "assistance-howto__item-highlight" );
		},

		unhighlightElements: function() {
			$( this ).removeClass( "assistance-howto__item-highlight" ).addClass( "assistance-howto__item-normal" );
		}

	});
})(jQuery);