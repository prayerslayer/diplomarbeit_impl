var assistance = assistance || {};

( function( $ ) {
	assistance.BaseView = Backbone.Marionette.Layout.extend({
		tagName: "div",
		className: "assistance-base",

		template: "#baseViewTemplate",

		events: {
			"click [data-action='close']": "close"
		},

		regions: {
			"content": "div.assistance-base__content"
		},

		default_content: {
			"howto": {
				"headline": "How to",
				"explanation": "Learn how to accomplish these tasks:"
			}
		},

		onRender: function() {
			// position view
			this.position( this.options.visualization );
			// fill view with content
			this.$el.find( "h2:first" ).text( this.options.headline || this.default_content[ this.options.type ].headline );
			this.$el.find( "p.assistance-base__explanation" ).text( this.options.explanation || this.default_content[ this.options.type ].explanation );
		},

		// positions this view next to the selector
		position: function( selector ) {
			var $bro = $( selector ),
				offset = $bro.offset(),
				position_left = offset.left > $(window).width() - offset.left - $bro.width(),
				left = ( position_left ? offset.left - 20 : offset.left + $bro.width() + 20 );

			this.$el.css( "left", left );
			this.$el.css( "top", offset.top );
			this.$el.css( "height", $bro.height() );
		},
		// animate removal
		remove: function(){
		  this.$el.fadeOut(function(){
		    $(this).remove();
		  }); 
		}
	});
})( jQuery );