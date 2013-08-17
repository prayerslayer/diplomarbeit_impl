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

		initialize: function() {
			this.render();
		},

		default_content: {
			"howto": {
				"headline": "How to",
				"explanation": "Learn how to accomplish these tasks:"
			},
			"comic": {
				"headline": "Explanation",
				"explanation": "These pictures show you how to achieve this task."
			}
		},

		onRender: function() {
			this.position( this.options.component );
			// fill view with content
			this.$el.find( "h2:first" ).text( this.options.headline || this.default_content[ this.options.type ].headline );
			this.$el.find( "p.assistance-base__explanation" ).text( this.options.explanation || this.default_content[ this.options.type ].explanation );
			// show base view
			$( "body" ).append( this.el );
		},

		// positions this view next to the selector
		position: function( selector ) {
			var $bro = $( selector ),
				offset = $bro.offset(),
				position_left = offset.left > $(window).width() - offset.left - $bro.width(),
				left = ( position_left ? offset.left - 20 : offset.left + $bro.width() + 20 );

			this.$el.css( "left", left );
			this.$el.css( "top", offset.top );
		},

		// centers this view at the center of selector element
		overlay: function( selector ) {
			var $bro = $( selector ),
				offset = $bro.offset(),
				w = $bro.width(),
				h = $bro.height();

			this.$el.css( "top", offset.top + h/2 );
			this.$el.css( "left", offset.left + w/2 );
			this.$el.css( "margin-left", -this.$el.width()/2 );
			this.$el.css( "margin-top", -this.$el.height()/2 );
		},


		// animate removal
		remove: function(){
		  this.$el.fadeOut(function(){
		    $(this).remove();
		  }); 
		}
	});
})( jQuery );